import React, { useState } from 'react';
import { toast } from 'react-toastify';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Chip,
  Box,
  IconButton,
  Typography,
  Divider,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopy from '@mui/icons-material/ContentCopy';

import { shareFile } from '@services/files';
import { set } from 'react-hook-form';

interface ShareDialogProps {
  open: boolean;
  onClose: () => void;
  refetch: () => void;
  fileId: string;
  fileShared: {
    isPublic: boolean;
    allowedUsers: string[];
    fileName: string;
    fileType: 'Folder' | 'Document';
  };
}

const ShareDialog = ({ open, onClose, refetch, fileId, fileShared }: ShareDialogProps) => {
  const [isPublic, setIsPublic] = useState<boolean>(fileShared.isPublic);
  const [emailList, setEmailList] = useState<string[]>(fileShared.allowedUsers);
  const [emailInput, setEmailInput] = useState('');
  const [error, setError] = useState('');

  const handlePublicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsPublic(event.target.checked);
  };

  const validateEmail = (email: string) =>
    /^[\w-\.]+@([\w-]+\.)+[a-z]{2,4}$/.test(email.toLowerCase());

  const handleAddEmail = () => {
    if (!validateEmail(emailInput)) setError('Email is not valid');
    else {
      setError('');
      setEmailInput('');

      if (!emailList.includes(emailInput)) {
        setEmailList([...emailList, emailInput]);
      }
    }
  };

  const handleDeleteEmail = (emailToDelete: string) => {
    setEmailList(emailList.filter((email) => email !== emailToDelete));
  };

  const handleShare = () => {
    shareFile(fileId, isPublic, emailList)
      .then(() => {
        toast.info('Access updated', { position: 'bottom-center' });
      })
      .catch((error: Error) => {
        console.error('Failed to update access', error);
        toast.error('Failed to update access');
      });
  };

  const handleCopyLink = () => {
    const link = `http://localhost:3039/${fileShared.fileType}s/${fileId}`;
    navigator.clipboard
      .writeText(link)
      .then(() => {
        toast.success('Link copied to clipboard!', { position: 'bottom-center' });
      })
      .catch(() => {
        toast.error('Failed to copy link');
      });
  };

  const handleClose = () => {
    refetch();
    setError('');
    setEmailInput('');

    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth disableRestoreFocus>
      <DialogTitle>
        Share {fileShared.fileName}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box my={1}>
          <TextField
            fullWidth
            label="Add users by email..."
            InputLabelProps={{ shrink: emailInput.length > 0 }}
            autoFocus
            autoComplete='off'
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            error={!!error}
            helperText={error || ' '}
            InputProps={{
              endAdornment: (
                <IconButton onClick={handleAddEmail} disabled={!emailInput}>
                  <AddCircleIcon color={!emailInput ? 'disabled' : 'primary'} />
                </IconButton>
              ),
            }}
            FormHelperTextProps={{ sx: { minHeight: '1.5em' } }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddEmail();
              }
            }}
          />
        </Box>

        <Box
          sx={{
            height: '15vh',
            overflowY: 'auto',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
            border: '1px solid #ddd',
            padding: 1,
          }}
        >
          {emailList.map((email) => (
            <Chip
              key={email}
              label={email}
              onDelete={() => handleDeleteEmail(email)}
              color={isPublic ? 'default' : 'primary'}
              sx={{ mb: 1 }}
            />
          ))}
        </Box>

        <Divider sx={{ my: 3, color: 'primary.main', fontWeight: 'bold' }}>OR</Divider>

        <Box
          mb={0}
          sx={{
            padding: 1,
            backgroundColor: 'rgba(0, 123, 255, 0.03)',
            borderRadius: '8px',
          }}
        >
          <FormControlLabel
            control={<Switch checked={isPublic} onChange={handlePublicChange} />}
            label={
              <Typography variant="body1" fontWeight="bold">
                Make Public
              </Typography>
            }
          />
          <Typography
            variant="caption"
            sx={{ color: isPublic ? 'text.primary' : 'text.secondary' }}
          >
            {isPublic
              ? 'Allowed users will be saved but ignored.'
              : 'Anyone on the internet with the link can view.'}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleCopyLink} variant="outlined" color="primary">
          <ContentCopy sx={{ pr: 1 }} />
          Copy Link
        </Button>
        <div style={{ flexGrow: 1 }} /> {/* Spacer to push buttons apart */}
        <Button onClick={handleShare} variant="contained" color="primary">
          Update Access
        </Button>
        <Button onClick={handleClose}>Done</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShareDialog;
