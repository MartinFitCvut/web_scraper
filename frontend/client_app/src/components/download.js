import React from 'react';
import exportFromJSON from 'export-from-json'

function DownloadButton({ data, format, filename }) {
  const downloadData = () => {
    let fileName;
    let exportType;
    switch(format){
      case 'json':
        fileName = filename;
        exportType =  exportFromJSON.types.json
        exportFromJSON({ data, fileName, exportType });
        break;
      case 'csv':
        fileName = filename;
        exportType =  exportFromJSON.types.csv
        exportFromJSON({ data, fileName, exportType })
        break;
      case 'xml':
        fileName = filename;
        exportType =  exportFromJSON.types.xml
        exportFromJSON({ data, fileName, exportType });
        break;
      default:
        throw new Error(`Neznámy formát: ${format}`);
    }
  };

  return (
    

    <button className='downloadButton' onClick={downloadData}>
        {format.toUpperCase()}
    </button>
    
  );
}

export default DownloadButton;
