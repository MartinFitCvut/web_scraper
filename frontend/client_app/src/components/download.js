import React from 'react';
import exportFromJSON from 'export-from-json'

function DownloadButton({ data, format, filename }) {
  const downloadData = () => {
    let blob;
    let fileName = filename;

    if (format === 'json') {
        blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        fileName += '.json';

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
    } else if (format === 'csv') {

    //const data = [{ foo: 'foo'}, { bar: 'bar' }]
    const fileName = filename;
    const exportType =  exportFromJSON.types.csv

    exportFromJSON({ data, fileName, exportType })

      //const csv = convertToCSV(data);
      //blob = new Blob([csv], { type: 'text/csv' });
      //fileName += '.csv';
    }

    
  };

  return (
    <button onClick={downloadData}>
        {format.toUpperCase()}
    </button>
  );
}

export default DownloadButton;
