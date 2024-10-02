import { useState, useCallback } from 'react';

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import { toast } from 'react-toastify';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Rating from '@mui/material/Rating';
import ClickAwayListener from '@mui/material/ClickAwayListener';

import { Iconify, iconForType } from 'src/components/iconify';
import { fData } from '@utils/format-number';
import { fDateTime } from '@utils/format-time';
import { useRouter } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export type UserProps = {
  id: string;
  type: string;
  name: string;
  size: number;
  uploadDate: Date;
  isPublic: boolean;
  allowedUsers: string[];
  allowedUsersEmails: string[];
  tags: string[];
  isStarred: boolean;
};

type UserTableRowProps = {
  row: UserProps;
  selected: boolean;
  onSelectRow: () => void;
  onDownload: () => void;
  onShare: () => void;
  onRename: () => void;
  onPreview: () => void;
  onMove: () => void;
  onDelete: () => void;
  onTags: () => void;
  onStarred: (isStarred: boolean) => Promise<any>;
  isUserOwner: boolean;
};

export function UserTableRow({
  row,
  selected,
  onSelectRow,
  onDownload: handleDownload,
  onShare,
  onMove,
  onRename,
  onTags,
  onStarred,
  onPreview,
  onDelete: handleDelete,
  isUserOwner,
}: UserTableRowProps) {
  const router = useRouter();

  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const [isStarred, setStarred] = useState<number | null>(row.isStarred ? 1 : 0);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleDoubleClick = useCallback(() => {
    if (row.type === 'Folder') router.push(`/folders/${row.id}`);
    else onPreview();
  }, [router, row, onPreview]);

  return (
    <>
      <TableRow
        hover
        tabIndex={-1}
        role="checkbox"
        selected={selected}
        onDoubleClick={handleDoubleClick}
      >
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell component="th" scope="row">
          <Box gap={2} display="flex" alignItems="center" sx={{ width: '18rem' }}>
            <Iconify
              width={23}
              icon={iconForType[row.type].url}
              mr={1}
              color={iconForType[row.type].color}
            />
            <Box
              sx={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {row.name}
            </Box>
          </Box>
        </TableCell>

        <TableCell component="th" scope="row">
          <Box
            sx={{
              width: '7rem',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {row.type}
          </Box>
        </TableCell>

        <TableCell component="th" scope="row">
          <Box
            sx={{
              width: '3rem',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {fData(row.size)}
          </Box>
        </TableCell>

        <TableCell component="th" scope="row">
          <Box
            sx={{
              width: '10rem',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {fDateTime(row.uploadDate)}
          </Box>
        </TableCell>

        <TableCell component="th" scope="row">
          <Box
            sx={{
              width: '7rem',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {row.tags.map((tag, index) => (
              <Box
                key={index}
                sx={{
                  backgroundColor: 'rgba(0, 0, 250, 0.6)', 
                  color: 'white',
                  borderRadius: '4px',
                  padding: '0.2rem 0.5rem',
                  fontSize: '0.75rem',
                  // width: '100%',
                  marginRight: '0.2rem',
                  whiteSpace: 'nowrap',
                  // overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {tag}
              </Box>
            ))}
          </Box>
        </TableCell>

        <TableCell component="th" scope="row">
          <Box
            sx={{
              width: '2rem',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            <Rating
              name="customized-10"
              value={isStarred}
              onChange={(event, newValue) => {
                setStarred(newValue ? 1 : 0);
                onStarred(!!newValue).then((res) => {
                  console.log('res', res);
                  toast.success(`${row.name} ${newValue ? 'starred' : 'unstarred'}!`);
                });
              }}
              max={1}
            />
          </Box>
        </TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <ClickAwayListener
        onClickAway={(event) => {
          // Make sure we're not clicking on the button itself
          if (openPopover && openPopover.contains(event.target as Node)) {
            return;
          }
          handleClosePopover();
        }}
      >
        <Popover
          open={!!openPopover}
          anchorEl={openPopover}
          onClose={handleClosePopover}
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          disableEnforceFocus
          disableAutoFocus
          disableRestoreFocus
          sx={{ pointerEvents: 'none' }} // Allows clicks in the background
          slotProps={{ paper: { style: { pointerEvents: 'auto' } } }} // Keeps popover clickable
        >
          <MenuList
            disablePadding
            sx={{
              py: 0.5,
              pr: 0.5,
              gap: 0.3,
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <MenuItem
              onClick={() => {
                handleClosePopover();
                handleDownload();
              }}
            >
              <Iconify icon="material-symbols:download" />
              Download
            </MenuItem>
            {isUserOwner && (
              <Box display="flex" flexDirection="column">
                <MenuItem
                  onClick={() => {
                    handleClosePopover();
                    onShare();
                  }}
                >
                  <Iconify icon="material-symbols:share" />
                  Share
                </MenuItem>

                <Divider />

                <MenuItem onClick={onMove}>
                  <Iconify icon="rivet-icons:transfer" />
                  Move
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleClosePopover();
                    onRename();
                  }}
                >
                  <Iconify icon="solar:pen-2-bold-duotone" />
                  Rename
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    onTags();
                    handleClosePopover();
                  }}
                >
                  <Iconify icon="tabler:tag-filled" />
                  Update Tags
                </MenuItem>

                <Divider />

                <MenuItem
                  onClick={() => {
                    handleDelete();
                    handleClosePopover();
                  }}
                  sx={{ color: 'error.main' }}
                >
                  <Iconify icon="solar:trash-bin-trash-bold" />
                  Move To Trash
                </MenuItem>
              </Box>
            )}
          </MenuList>
        </Popover>
      </ClickAwayListener>
    </>
  );
}
