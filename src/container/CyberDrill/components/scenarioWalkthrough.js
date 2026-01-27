import React, { useRef } from 'react';
import { Stack, Typography } from '@mui/material';
import { toast } from 'react-toastify';

import uploadImage from '../../../assests/icons/upload.svg'
import pdfImage from '../../../assests/icons/pdf.svg'
import { Icons } from '../../../components/icons';
import truncateString from '../../../utilities/truncateString';
import formatFileSize from '../../../utilities/formatFileSize';

const MAX_FILES = 4;
const MAX_TOTAL_SIZE = 1000 * 1024; // 1000 KB total for all files

const ScenarioWalkthrough = ({ walkthrough, onFileUpload, deleteFileHandler }) => {
  const fileInputRef = useRef(null);

  const handleFileInputChange = (e) => {
    const files = e.target.files;

    if (walkthrough.length + files.length > MAX_FILES) {
      toast.error(`You can upload only ${MAX_FILES - walkthrough.length} more file(s).`);
      e.target.value = null;
      return;
    }

    // Calculate current total size
    const currentTotalSize = walkthrough.reduce((total, file) => total + file.size, 0);

    // Calculate new files total size
    let newFilesTotalSize = 0;
    for (let i = 0; i < files.length; i++) {
      if (files[i].type !== 'application/pdf') {
        toast.error('Only PDF files are allowed.');
        e.target.value = null;
        return;
      }
      newFilesTotalSize += files[i].size;
    }

    // Check if total size exceeds limit
    if (currentTotalSize + newFilesTotalSize > MAX_TOTAL_SIZE) {
      toast.error('Total size of all PDFs should not exceed 1000 KB.');
      e.target.value = null;
      return;
    }

    onFileUpload(files);
    e.target.value = null;
  };


  const handleStackClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const renderEmptyState = () => (
    <Stack
      onClick={handleStackClick}
      justifyContent="center"
      alignItems="center"
      sx={{
        width: '336px',
        height: '132px',
        borderRadius: '16px',
        border: '1px dashed #535660',
        cursor: 'pointer',
      }}
    >
      <img src={uploadImage} alt="upload" style={{ width: '40px', height: '40px' }} />
      <input
        ref={fileInputRef}
        id="file-upload"
        type="file"
        accept="application/pdf"
        style={{ display: 'none' }}
        onChange={handleFileInputChange}
        multiple
      />
      <Stack justifyContent="center" alignItems="center">
        <Typography variant="body1" sx={{ textDecoration: 'underline', color: '#00FFFF !important' }}>
          Click to Upload
        </Typography>
        <Typography variant="body2" sx={{ color: '#6F727A !important' }}>
          Maximum total size 1000 KB
        </Typography>
      </Stack>
    </Stack>
  );

  const renderFileStack = () => (
    <Stack direction="row" justifyContent="start" alignItems="center" gap={1.5}>
      <Stack direction="row" justifyContent="start" alignItems="center" spacing={1}>
        {walkthrough.map((file, index) => (
          <Stack
            key={index}
            justifyContent="center"
            alignItems="center"
            gap={1}
            sx={{
              width: '132px',
              height: '132px',
              borderRadius: '16px',
              border: '1px solid #242833',
              position: 'relative',
            }}
          >
            <Icons.crossCircle
              style={{ position: 'absolute', top: '8px', right: '8px', cursor: 'pointer', color: '#535660' }}
              onClick={() => deleteFileHandler(index)}
            />
            <img src={pdfImage} alt="upload" style={{ width: '40px', height: '40px' }} />
            <Typography variant="body2" sx={{ color: '#9C9EA3 !important' }}>
              {truncateString(file.name, 15)}
            </Typography>
            <Typography variant="body2" sx={{ color: '#9C9EA3 !important', fontSize: '10px !important' }}>
              Size - {formatFileSize(file.size)}
            </Typography>
          </Stack>
        ))}
      </Stack>
      {walkthrough.length < MAX_FILES && renderUploadMoreStack()}
    </Stack>
  );

  const renderUploadMoreStack = () => (
    <Stack
      onClick={handleStackClick}
      justifyContent="center"
      alignItems="center"
      gap={1}
      sx={{
        width: '132px',
        height: '132px',
        borderRadius: '16px',
        border: '1px dashed #535660',
        cursor: 'pointer',
      }}
    >
      <img src={uploadImage} alt="upload" style={{ width: '40px', height: '40px' }} />
      <input
        ref={fileInputRef}
        id="file-upload"
        type="file"
        accept="application/pdf"
        style={{ display: 'none' }}
        multiple
        onChange={handleFileInputChange}
      />
      <Stack justifyContent="center" alignItems="center" gap={0.5}>
        <Typography variant="body1" sx={{ textDecoration: 'underline', color: '#00FFFF !important' }}>
          Upload more
        </Typography>
        <Typography variant="body2" sx={{ color: '#6F727A !important' }}>
          Max total size 1000 KB
        </Typography>
      </Stack>
    </Stack>
  );

  return <>{walkthrough.length === 0 ? renderEmptyState() : renderFileStack()}</>;
};

export default ScenarioWalkthrough;

