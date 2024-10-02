import React, { memo, useMemo, useState } from 'react';
import Dropzone, { useDropzone, FileWithPath } from 'react-dropzone';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import { fileTypeFromBuffer } from 'file-type';

import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import { getSignedPutUrl, createDocument } from '@services/storage';
import { fData } from '@utils/format-number';

interface FileUploadDialogProps {
  open: boolean;
  onClose: () => void;
  workspaceId: string;
  refetch: () => void;
}

const FileUploadDialog = ({ open, onClose, workspaceId, refetch }: FileUploadDialogProps) => {
  const [file, setFile] = useState<FileWithPath | null>(null);

  const handleDrop = (acceptedFiles: FileWithPath[]) => {
    if (acceptedFiles[0].size > 1024 * 1024 * 10) {
      toast.warning('File size should not exceed 10MB', { position: 'bottom-right' });
      return;
    }

    setFile(acceptedFiles[0]);
  };

  const { isLoading: uploading, mutate: handleUpload } = useMutation(async () => {
    if (!file) return;

    onClose();
    setFile(null);

    let toastId;

    try {
      const blobSlice = file.slice(0, 1024 * 5); // To avoid consuming too much memory
      const arrayBuffer = await blobSlice.arrayBuffer();
      const extension =
        (await fileTypeFromBuffer(arrayBuffer))?.ext || file.name.split('.').pop() || '';

      const res = await getSignedPutUrl(extension);

      toastId = toast.info(`Uploading ${file.name}...`, {
        autoClose: false,
        position: 'bottom-right',
      });

      const awsRes = await fetch(res.data.url, {
        method: 'PUT',
        body: file,
      });

      if (!awsRes.ok) throw new Error('Failed to upload file');

      const documentData = {
        id: res.data.objectKey,
        name: file.name,
        url: res.data.url,
        size: file.size,
        extension,
      };

      await createDocument(workspaceId, documentData);

      refetch();
      toast.success(`${file.name} uploaded successfully!`, { position: 'bottom-right' });
    } catch (error) {
      toast.error(error.response?.data?.detail ?? error.message ?? 'Failed to upload file', {
        position: 'bottom-right',
      });
    } finally {
      if (toastId) 
        toast.done(toastId);
    }
  });

  return (
    <Dialog
      open={open}
      onClose={() => {
        onClose();
        setFile(null);
      }}
      maxWidth="md" // Ensure it doesn't get larger than medium size
      fullWidth // Makes the dialog take up the full width allowed by `maxWidth`
      sx={{
        '& .MuiDialog-paper': {
          width: {
            xs: '90%', // 90% of the screen width on extra-small screens
            sm: '80%', // 80% on small screens
            md: '600px', // 600px width for medium screens and up
          },
          maxWidth: '100%', // Ensure it doesn't overflow the screen
        },
      }}
    >
      <DialogTitle sx={{ mb: 2 }}>
        Upload File
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Dropzone onDrop={handleDrop} multiple={false}>
          {({ getRootProps, getInputProps }) => (
            <Box
              {...getRootProps()}
              sx={(theme) => ({
                bgcolor: theme.palette.action.hover,
                border: `2px dashed ${theme.palette.primary.main}`,
                borderRadius: theme.shape.borderRadius,
                padding: theme.spacing(8, 5),
                textAlign: 'center',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: theme.vars.palette.grey[300],
                },
              })}
            >
              <Box
                component="img"
                src="/assets/images/upload_png.png"
                alt="Drop file here"
                sx={{ maxWidth: '15%', marginBottom: 3 }}
              />

              <Typography
                variant="h6"
                sx={{
                  wordWrap: 'break-word',
                  maxWidth: '100%',
                  overflowWrap: 'anywhere',
                }}
              >
                {file ? (
                  file.name
                ) : (
                  <>
                    Drag and drop here, or{' '}
                    <Box
                      component="span"
                      sx={{ color: 'primary.main', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      click
                    </Box>{' '}
                    to select
                  </>
                )}
              </Typography>

              {/* Display file size if file is selected */}
              {file && (
                <Typography variant="body2" color="text.secondary">
                  {`File size: ${fData(file.size)}`}
                </Typography>
              )}
            </Box>
          )}
        </Dropzone>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            onClose();
            setFile(null);
          }}
          color="secondary"
        >
          Cancel
        </Button>
        <Button onClick={() => handleUpload()} disabled={!file} variant="contained" color="primary">
          {false ? <CircularProgress size={24} /> : 'Upload'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default memo(FileUploadDialog);
