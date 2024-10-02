import dayjs from 'dayjs';

import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { iconForType, Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------
export type FiltersProps = {
  q: string;
  fileType: string;
  startDate: Date | null;
  endDate: Date | null;
  isStarred: boolean | null;
};

type UserTableToolbarProps = {
  numSelected: number;
  filters: FiltersProps;
  onSetFilters: (updateState: Partial<FiltersProps>) => void;
};

export function UserTableToolbar({ numSelected, filters, onSetFilters }: UserTableToolbarProps) {
  return (
    <Toolbar
      sx={{
        height: 96,
        display: 'flex',
        justifyContent: 'space-between',
        p: (theme) => theme.spacing(0, 1, 0, 3),
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <OutlinedInput
          fullWidth
          size="small"
          value={filters.q}
          onChange={(e) => onSetFilters({ q: e.target.value })}
          placeholder="Search in this folder..."
          startAdornment={
            <InputAdornment position="start">
              <Iconify width={20} icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          }
          sx={{ maxWidth: 250 }}
        />
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <Iconify icon="solar:trash-bin-trash-bold" />
          </IconButton>
        </Tooltip>
      ) : (
        <Box
          display="flex"
          p={2}
          gap={2}
          sx={{
            borderRadius: 1,
            minWidth: '43vw',
            width: '43vw',
          }}
        >
          <Select
            value={filters.fileType}
            onChange={(e) => onSetFilters({ fileType: e.target.value })}
            variant="outlined"
            size="small"
            placeholder="File Type"
            sx={{
              backgroundColor: 'white',
              width: '15rem',
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
            }}
            className="popover-input"
          >
            <MenuItem key="All" value="All">
              <Box display="flex" alignItems="center">
                <Typography variant="body2">Type</Typography>
              </Box>
            </MenuItem>
            {Object.keys(iconForType).map((type) => (
              <MenuItem key={type} value={type}>
                <Box display="flex" alignItems="center">
                  <Iconify
                    width={23}
                    icon={iconForType[type].url}
                    mr={1}
                    color={iconForType[type].color}
                  />
                  <Typography variant="body2">{type}</Typography>
                </Box>
              </MenuItem>
            ))}
          </Select>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Uploaded after"
              value={filters.startDate ? dayjs(filters.startDate) : null}
              onChange={(newValue) =>
                onSetFilters({ startDate: newValue ? newValue.toDate() : null })
              }
              maxDate={dayjs()}
              slotProps={{
                textField: { InputLabelProps: { shrink: true }, placeholder: '', size: 'small' },
                field: { clearable: true, onClear: () => onSetFilters({ ...filters, startDate: null }) },
              }}
              sx={{ width: '15rem' }}
            />
          </LocalizationProvider>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Uploaded before"
              value={filters.endDate ? dayjs(filters.endDate) : null}
              onChange={(newValue) =>
                onSetFilters({ endDate: newValue ? newValue.toDate() : null })
              }
              maxDate={dayjs().add(1, 'day')}
              slotProps={{
                textField: { InputLabelProps: { shrink: true }, placeholder: '', size: 'small' },
                field: { clearable: true, onClear: () => onSetFilters({ ...filters, endDate: null }) },
              }}
              sx={{ width: '15rem' }}
            />
          </LocalizationProvider>
        </Box>
      )}
    </Toolbar>
  );
}
