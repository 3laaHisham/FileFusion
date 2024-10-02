import React, { useState } from 'react';
import { toast } from 'react-toastify';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Chip,
  Box,
  IconButton,
  Typography,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CloseIcon from '@mui/icons-material/Close';

import { updateTags } from '@services/files';

interface TagsDialogProps {
  open: boolean;
  onClose: () => void;
  refetch: () => void;
  fileId: string;
  file: {
    tags: string[];
    fileName: string;
  };
}

const TagsDialog = ({ open, onClose, refetch, fileId, file }: TagsDialogProps) => {
  const [tagsList, setTagsList] = useState<string[]>(file.tags);
  const [emailInput, setEmailInput] = useState('');
  const [error, setError] = useState('');

  const handleAddTag = () => {
    setError('');
    setEmailInput('');

    if (!tagsList.includes(emailInput)) {
      setTagsList(tagsList.concat(emailInput));
    }
  };

    const handleDeleteEmail = (emailToDelete: string) => {
      setTagsList(tagsList.filter((email) => email !== emailToDelete));
    };

    const handleTags = () => {
      updateTags(fileId, tagsList)
        .then(() => {
          refetch();
          toast.info('Tags updated', { position: 'bottom-center' });
          onClose();
        })
        .catch((err: Error) => {
          console.error('Failed to update tags', err);
          toast.error('Failed to update tags');
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
          Update Tags {file.fileName}
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
              label="Add tags..."
              InputLabelProps={{ shrink: emailInput.length > 0 }}
              autoFocus
              autoComplete="off"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              error={!!error}
              helperText={error || ' '}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={handleAddTag} disabled={!emailInput}>
                    <AddCircleIcon color={!emailInput ? 'disabled' : 'primary'} />
                  </IconButton>
                ),
              }}
              FormHelperTextProps={{ sx: { minHeight: '1.5em' } }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
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
            {tagsList.map((email) => (
              <Chip
                key={email}
                label={email}
                onDelete={() => handleDeleteEmail(email)}
                color="primary"
                sx={{ mb: 1 }}
              />
            ))}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <div style={{ flexGrow: 1 }} /> {/* Spacer to push buttons apart */}
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleTags} variant="contained" color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    );
};

export default TagsDialog;
