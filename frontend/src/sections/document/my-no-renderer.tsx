import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const MyNoRenderer = ({ document, fileName }: { document?: any; fileName?: string }) => {
    const fileText = fileName || document?.fileType || "";
  
    return (
      <Box textAlign="center" p={2}>
        <Typography variant="h6" color="error">
          No preview available for this file type: {fileText}
        </Typography>
        <Button
          href={document?.uri}
          download={fileName}
          variant="contained"
          color="primary"
          sx={{ marginTop: 2 }}
        >
          Download {fileName || "File"}
        </Button>
      </Box>
    );
  };

  export default MyNoRenderer;