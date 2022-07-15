import React from 'react';
import { PdfApi } from 'asposepdfcloud';

function DownloadFile() {
  const handleDownload = () => {
    const pdfApi = new PdfApi(
      '6dda0656-214b-451c-8443-db7b09565a78',
      'bd4b574a70a98b27163a435a8c4e98da',
      'https://api.aspose.cloud/v3.0'
    );

    pdfApi
      .downloadFile('test_pdf_3.pdf', 'dropbox')
      .then((result) => {
        console.log(result);
      })
      .catch((err) => console.log(err));
  };
  return (
    <div>
      <button onClick={handleDownload} style={{ color: 'black', backgroundColor: 'lightyellow' }}>
        Download
      </button>
    </div>
  );
}

export default DownloadFile;
