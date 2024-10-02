import DocViewer, { IHeaderOverride } from '@cyntler/react-doc-viewer';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ShareIcon from '@mui/icons-material/Share';
import DownloadIcon from '@mui/icons-material/Download';

const MyHeader: IHeaderOverride = (state, previousDocument, nextDocument) => {
  const { currentDocument, config } = state;
  if (!currentDocument || config?.header?.disableFileName) {
    return null;
  }

  const { fileName, fileType, fileData, id, uri } = currentDocument as any;

  const handleShare = () => {
    console.log('Share functionality not implemented yet');
  };

  const handleDownload = () => {
    const link = document.createElement('a');

    if (fileData) {
      if (typeof fileData === 'string') {
        link.href = fileData;
      } else if (fileData instanceof ArrayBuffer) {
        const blob = new Blob([fileData], { type: fileType });
        link.href = URL.createObjectURL(blob);
      }
    } else {
      link.href = uri;
    }

    link.download = fileName || 'document';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      py={0}
      px={7}
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
      }}
    >
      <Typography variant="h6" sx={{ color: 'white' }}>
        {fileName || uri || ''}
      </Typography>
      <Box sx={{ pt: 1 }}>
        <IconButton onClick={handleDownload} color="primary"  sx={{ mx: 1 }}>
          <DownloadIcon fontSize='large' />
        </IconButton>
        <IconButton onClick={handleShare} color="primary"  sx={{ mx: 1 }}>
          <ShareIcon fontSize='large' />
        </IconButton>
      </Box>
    </Box>
  );
};

export default MyHeader;
