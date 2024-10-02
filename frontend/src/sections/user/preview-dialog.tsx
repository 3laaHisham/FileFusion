import { memo, useState } from 'react';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';

import { FilePreview } from '../document/view';

interface FilePreviewDialogProps {
  open: boolean;
  onClose: () => void;
  fileId: string;
}

const FilePreviewDialog = ({ open, onClose, fileId }: FilePreviewDialogProps) => (
  <Dialog
    open={open}
    onClose={onClose}
    maxWidth="md"
    fullWidth
    PaperProps={{
      sx: {
        backgroundColor: 'transparent',
        boxShadow: 'none',
        maxHeight: '100vh',
      },
    }}
    slotProps={{
      backdrop: {
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.88)',
          zIndex: -1,
        },
      },
    }}
  >
    <Box
      sx={{
        position: 'fixed',
        top: 9,
        left: 0,
        zIndex: 10,
      }}
    >
      <IconButton onClick={onClose} color="primary">
        <CloseIcon fontSize="medium" />
      </IconButton>
    </Box>

    <DialogContent
      sx={{
        backgroundColor: 'transparent',
        border: 'none',
        padding: 0,
        '&::-webkit-scrollbar': { display: 'none' },
        height: '100%',
      }}
    >
      <FilePreview fileId={fileId} />
    </DialogContent>
  </Dialog>
);

export default memo(FilePreviewDialog);
