import { useState } from 'react';
import { useQuery } from 'react-query';
import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';
import '@cyntler/react-doc-viewer/dist/index.css';


import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

import { getDownloadData } from '@services/storage';
import { useAxiosInterceptors } from '@utils/my-axios';
import { useRouter } from 'src/routes/hooks';

import MyHeader from '../my-header';
import MyNoRenderer from '../my-no-renderer';
import MSDocRenderer from '../MsDoc-Renderer';

interface FilePreviewProps {
  fileId: string;
}

export const FilePreview = ({ fileId }: FilePreviewProps) => {
  //   const router = useRouter();

  useAxiosInterceptors();

  const { isLoading, data, error } = useQuery(
    ['preview', fileId],
    async () => {
      await new Promise(resolve => setTimeout(resolve, 0)); // For axios interceptors to finish register

      const res = await getDownloadData(fileId);

      const fileUrl = res.data.url;
      const extension = res.data.extension;
      let fileName = res.data.name;
      fileName = fileName.endsWith(`.${extension}`) ? fileName : `${fileName}.${extension}`;

      return { fileUrl, fileName };
    },
    { refetchOnWindowFocus: false }
  );

  const documents = data ? [{ uri: data.fileUrl, fileName: data.fileName, id: fileId }] : [];

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          padding: 0,
          border: 'none',
          borderRadius: 2,
          textAlign: 'center',
        }}
      >
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Loading document...
        </Typography>
      </Box>
    );
  }

  if (error) {
    console.log('error', error);
    return (
      <Box
        sx={{
          padding: 2,
          border: 'none',
          borderRadius: 2,
          textAlign: 'center',
        }}
      >
        <Typography variant="h6" color="error">
          Failed to load the document. Please try again later.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        marginTop: 5,
        padding: 2,
        border: 'none',
        borderRadius: 2,
        textAlign: 'center',
        width: '100%',
        height: '100%',
        wordWrap: 'break-word',
      }}
    >
      <DocViewer
        documents={documents}
        prefetchMethod="GET"
        pluginRenderers={[MSDocRenderer, ...DocViewerRenderers]}
        style={{ width: '100%', height: '100%', margin: '0 auto' }}
        config={{
          pdfVerticalScrollByDefault: true,
          header: {
            overrideComponent: MyHeader,
          },
          noRenderer: {
            overrideComponent: MyNoRenderer,
          },
        }}
      />
    </Box>
  );
};
