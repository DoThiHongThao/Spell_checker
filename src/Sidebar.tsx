import React from "react";
import type { IHighlight } from "./react-pdf-highlighter";

interface Props {
  highlights: Array<IHighlight>;
  fileName: string,
  tile: number
}

const updateHash = (highlight: IHighlight) => {
  document.location.hash = `highlight-${highlight.id}`;
};

export function Sidebar({
  highlights,
  fileName,
  tile
}: Props) {
  console.log('aaaaa', highlights)
  return (
    <div className="sidebar" style={{ width: "25vw" }}>
      <div className="description flex justify-between" style={{ padding: "1rem" }}>
        <div className="text-2xl">{fileName}</div>
        <div className="text-2xl">{tile.toFixed(2)}%</div>
      </div>

      <ul className="sidebar__highlights">
        {highlights?.map((highlight, index) => (
          <li
            key={index}
            className="sidebar__highlight"
            onClick={() => {
              updateHash(highlight);
            }}
          >
            <div className="flex justify-between">
              <div className="flex">
                <div className="mr-2">{index}</div>
                <strong className={`${highlight.comment.emoji && 'line-through'}`}>{highlight.content.text}</strong>
              </div>
              <p>{highlight.comment.emoji}</p>
            </div>
            <div className="highlight__location">
              Page {highlight.position.pageNumber}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
