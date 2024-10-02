import { useState, useCallback } from 'react';

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

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

import { Iconify, iconForType } from 'src/components/iconify';
import { fData } from '@utils/format-number';
import { fDate, fDateTime } from '@utils/format-time';
import { useRouter } from 'src/routes/hooks';
import { toast } from 'react-toastify';

// ----------------------------------------------------------------------

export type UserProps = {
  id: string;
  deletedAt: Date;
  file: {
    type: string;
    name: string;
    size: number;
    pathNames: string;
  };
};

type UserTableRowProps = {
  row: UserProps;
  selected: boolean;
  onSelectRow: () => void;
  onRestore: () => Promise<void>;
  onDelete: () => void;
};

export function UserTableRow({
  row,
  selected,
  onSelectRow,
  onRestore,
  onDelete,
}: UserTableRowProps) {
  const router = useRouter();

  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleDoubleClick = useCallback(() => {
    handleClosePopover();

    confirmAlert({
      title: 'Restore From Trash',
      message: 'To view this, you need to restore it from the trash. Do you want to restore it?',
      buttons: [
        {
          label: 'No',
        },
        {
          label: 'Restore',
          onClick: onRestore,
        },
      ],
    });
  }, [handleClosePopover, onRestore]);

  const handleDelete = () => {
    handleClosePopover();

    confirmAlert({
      title: 'Confirm to delete permanently',
      message: 'Are you sure you want to delete this file permanently?',
      buttons: [
        {
          label: 'No',
        },
        {
          label: 'Delete',
          onClick: onDelete,
        },
      ],
    });
  };

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
          <Box gap={2} display="flex" alignItems="center" sx={{ maxWidth: 300 }}>
            <Iconify
              width={23}
              icon={iconForType[row.file.type].url}
              mr={1}
              color={iconForType[row.file.type].color}
            />

            <Box
              sx={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {row.file.name}
            </Box>
          </Box>
        </TableCell>

        <TableCell>{row.file.type}</TableCell>

        <TableCell>{fData(row.file.size)}</TableCell>

        <TableCell>{fDateTime(row.deletedAt)}</TableCell>

        <TableCell>{row.file.pathNames}</TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.25,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 1,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
            },
          }}
        >
          <MenuItem
            onClick={() => {
              onRestore().then(() => {
                toast.success(`Restored ${row.file.name} successfully`);
                handleClosePopover();
              })
              .catch(() => {
                toast.error(`Failed to restore ${row.file.name}`);
                handleClosePopover();
              });
            }}
          >
            <Iconify icon="material-symbols:download" />
            Restore
          </MenuItem>

          <Divider />

          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete Permanently
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}
