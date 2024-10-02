import React, { useEffect, useRef, useState } from 'react';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import { getSignedPutUrl, createDocument } from '@services/storage';

interface NameDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string, workspaceId?: string) => Promise<void>;
  title: string;
  defaultName: string;
  setDefaultName: React.Dispatch<React.SetStateAction<string>>;
}

export default function NameDialog({
  open,
  onClose,
  onSubmit,
  title,
  defaultName,
  setDefaultName,
}: NameDialogProps) {
  const handleSubmit = () => {
    onSubmit(defaultName).then(onClose);
  };

  const handleClose = () => {
    onClose();
    setDefaultName('');
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth disableRestoreFocus>
      <DialogTitle>
        {title}
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
        <TextField
          autoFocus
          margin="dense"
          label="Name"
          InputLabelProps={{
            shrink: defaultName.length > 0
          }}
          type="text"
          fullWidth
          variant="outlined"
          value={defaultName}
          onChange={(e) => setDefaultName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {title === 'Rename File' ? 'Rename' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
