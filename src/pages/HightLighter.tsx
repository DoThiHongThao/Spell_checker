import React, { useCallback, useEffect, useState } from 'react';

import {
  PdfLoader,
  PdfHighlighter,
  Tip,
  Highlight,
  Popup,
  AreaHighlight,
} from '../react-pdf-highlighter';

import type { IHighlight, NewHighlight } from '../react-pdf-highlighter';

import { testHighlights as _testHighlights } from '../test-highlights';
import { Spinner } from '../Spinner';
import { Sidebar } from '../Sidebar';
import { LTWH } from '../resource';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../firebase/config';

const testHighlights: Record<string, Array<IHighlight>> = _testHighlights;

const getNextId = () => String(Math.random()).slice(2);

const parseIdFromHash = () =>
  document.location.hash.slice('#highlight-'.length);

const resetHash = () => {
  document.location.hash = '';
};

const FILE_URL = localStorage.getItem("file_url") || '';

const httpsReference = ref(
  storage,
  FILE_URL
);

const PRIMARY_PDF_URL =FILE_URL;
const SECONDARY_PDF_URL = FILE_URL;

const searchParams = new URLSearchParams(document.location.search);

const initialUrl = searchParams.get('url') || PRIMARY_PDF_URL;

const HightLighter = () => {
  const [url, setUrl] = useState<string>(initialUrl);
  const [fileName] = useState(localStorage.getItem("file") || '')
  const [highlights, setHighlights] = useState<Array<IHighlight>>(()=> {
    return JSON.parse(localStorage.getItem('highlight')||'[]')
  });
  const [tile] = useState(localStorage.getItem("tile") || '')

  useEffect(() => {
    window.addEventListener('hashchange', scrollToHighlightFromHash, false);
    getDownloadURL(httpsReference)
      .then((url) => {
        // Insert url into an <img> tag to "download"
        setUrl(url);
      })
      .catch((error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/object-not-found':
            // File doesn't exist
            break;
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;
          case 'storage/canceled':
            // User canceled the upload
            break;

          // ...

          case 'storage/unknown':
            // Unknown error occurred, inspect the server response
            break;
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClickSpell = useCallback((item: string, id: string) => {
    let listHighlights = [...highlights];
    console.log('aaaaa', highlights)
    listHighlights = listHighlights.map((test) => {
      if (test.id === id) {
        return {
          ...test,
          comment: {
            ...test.comment,
            emoji: item,
          },
        };
      } else {
        return test;
      }
    });
    setHighlights(listHighlights);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [highlights]);

  const HighlightPopup = ({
    comment,
    id,
  }: {
    comment: { text: string; emoji: string };
    id: string;
  }) => {
    return comment.text ? (
      <div className="Highlight__popup flex">
        {comment.text.split('-').map((item: string, index: number) => {
          return (
            <div className="flex" key={item}>
              <div
                className="mr-2 cursor-pointer"
                onClick={() => handleClickSpell(item, id)}
              >
                {item}
              </div>
              {index + 1 < comment.text.split('-').length && (
                <div className="mr-2">|</div>
              )}
            </div>
          );
        })}
      </div>
    ) : null;
  };

  const resetHighlights = () => {
    setHighlights([]);
  };

  const toggleDocument = () => {
    const newUrl =
      url === PRIMARY_PDF_URL ? SECONDARY_PDF_URL : PRIMARY_PDF_URL;
    setUrl(newUrl);
    setHighlights(testHighlights[newUrl] ? [...testHighlights[newUrl]] : []);
  };

  let scrollViewerTo = (highlight: any) => {};

  const scrollToHighlightFromHash = () => {
    if (parseIdFromHash()) {
      const highlight = getHighlightById(parseIdFromHash());
      if (highlight) {
        scrollViewerTo(highlight);
      }
    }
  };

  const getHighlightById = (id: string) => {
    return highlights.find((highlight: { id: string }) => highlight.id === id);
  };

  const addHighlight = (highlight: NewHighlight) => {
    console.log('Saving highlight', highlight);

    setHighlights([{ ...highlight, id: getNextId() }, ...highlights]);
  };

  const updateHighlight = (
    highlightId: string,
    position: Object,
    content: Object
  ) => {
    console.log('Updating highlight', highlightId, position, content);

    setHighlights(
      highlights.map((h) => {
        const {
          id,
          position: originalPosition,
          content: originalContent,
          ...rest
        } = h;
        return id === highlightId
          ? {
              id,
              position: { ...originalPosition, ...position },
              content: { ...originalContent, ...content },
              ...rest,
            }
          : h;
      })
    );
  };
  console.log('FILE_URL',FILE_URL)

  return (
    <div className="App" style={{ display: 'flex', height: '100vh' }}>
      <div
        style={{
          height: '100vh',
          width: '75vw',
          position: 'relative',
        }}
      >
        <PdfLoader url={url} beforeLoad={<Spinner />}>
          {(pdfDocument) => (
            <PdfHighlighter
              pdfDocument={pdfDocument}
              enableAreaSelection={(event) => event.altKey}
              onScrollChange={resetHash}
              // pdfScaleValue="page-width"
              scrollRef={(scrollTo) => {
                scrollViewerTo = scrollTo;

                scrollToHighlightFromHash();
              }}
              onSelectionFinished={(
                position,
                content,
                hideTipAndSelection,
                transformSelection
              ) => (
                <Tip
                  onOpen={transformSelection}
                  onConfirm={(comment) => {
                    addHighlight({ content, position, comment });

                    hideTipAndSelection();
                  }}
                />
              )}
              highlightTransform={(
                highlight,
                index,
                setTip,
                hideTip,
                viewportToScaled,
                screenshot,
                isScrolledTo
              ) => {
                const isTextHighlight = !Boolean(
                  highlight.content && highlight.content.image
                );

                const component = isTextHighlight ? (
                  <Highlight
                    isScrolledTo={isScrolledTo}
                    position={highlight.position}
                    comment={highlight.comment}
                  />
                ) : (
                  <AreaHighlight
                    isScrolledTo={isScrolledTo}
                    highlight={highlight}
                    onChange={(boundingRect: LTWH) => {
                      updateHighlight(
                        highlight.id,
                        { boundingRect: viewportToScaled(boundingRect) },
                        { image: screenshot(boundingRect) }
                      );
                    }}
                  />
                );

                return (
                  <Popup
                    popupContent={<HighlightPopup {...highlight} />}
                    onMouseOver={(popupContent) =>
                      setTip(highlight, (highlight) => popupContent)
                    }
                    onMouseOut={hideTip}
                    key={index}
                    children={component}
                  />
                );
              }}
              highlights={highlights}
            />
          )}
        </PdfLoader>
      </div>
      <Sidebar
        highlights={highlights}
        fileName={fileName}
        tile={parseFloat(tile)*100}
      />
    </div>
  );
};

export default HightLighter;
