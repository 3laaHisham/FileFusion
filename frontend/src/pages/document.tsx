import Box from '@mui/material/Box';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

import { FilePreview } from 'src/sections/document/view';

// ----------------------------------------------------------------------

export default function Page() {
  const { documentId } = useParams();

  return (
    <>
      <Helmet>
        <title>Documents</title>
      </Helmet>

      <Box
        sx={{
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          '&::-webkit-scrollbar': { display: 'none' },
          minHeight: '100vh',
          width: '100%',
          display: 'flex',
          justifyContent: 'center', // Center horizontally
          alignItems: 'center', // Center vertically
        }}
      >
        <Box
          maxWidth="md"
          sx={{
            padding: 2,
            '&::-webkit-scrollbar': { display: 'none' },
            // position: 'relative',
            width: '100%', // Optional: make it responsive
          }}
        >
          <FilePreview fileId={documentId || ''} />
        </Box>
      </Box>
    </>
  );
}
