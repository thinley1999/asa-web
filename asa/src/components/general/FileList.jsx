import React from 'react';
import { FaFileAlt, FaEye, FaDownload } from 'react-icons/fa'; // Importing icons

const FileList = () => {
  const files = [
    {
      name: 'document1.pdf',
      size: '500 KB',
      preview: () => console.log('Preview document1'),
      download: () => console.log('Download document1')
    },
    {
      name: 'image1.jpg',
      size: '300 KB',
      preview: () => console.log('Preview image1'),
      download: () => console.log('Download image1')
    },
  ];

  return (<div>
    here...
  </div>
  );
};

export default FileList;
