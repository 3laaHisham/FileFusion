import { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';

import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Popover from '@mui/material/Popover';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

import { Iconify, iconForType } from 'src/components/iconify';
import { searchFiles } from '@services/files';
import { fData } from '@utils/format-number';
import { usePreview } from 'src/contexts/preview-context';
import { useRouter } from 'src/routes/hooks';

interface SearchResult {
  id: string;
  name: string;
  type: keyof typeof iconForType;
  size: string;
  path: string;
  pathNames: string;
  uploadDate: string;
}

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [fileType, setFileType] = useState<string>('All');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const router = useRouter();
  const { setPreviewDialogOpen, setFileId } = usePreview();

  const handleSearch = (q: string, type: string, start: Date | null, end: Date | null) => {
    setSearchQuery(q);
    setFileType(type);
    setStartDate(start);
    setEndDate(end);

    if (q === '') {
      setResults([]);
      return;
    }

    searchFiles({ q, fileType: type, startDate: start, endDate: end }).then((response) => {
      const filteredResults: SearchResult[] = response.data;
      setResults(filteredResults);
    });
  };

  const handlePopoverOpen = () => {
    setOpenPopover(searchInputRef.current);
  };

  const handlePopoverClose = (event: MouseEvent | TouchEvent) => {
    const mouseEvent = event as MouseEvent | TouchEvent;
    if (
      searchInputRef.current?.contains(mouseEvent?.target as Node) ||
      (mouseEvent && (mouseEvent.target as HTMLElement).closest('.popover-input'))
    )
      return;
    setOpenPopover(null);
  };

  const handleFilterChange = (newFileType: string) => {
    handleSearch(searchQuery, newFileType, startDate, endDate);
    setOpenPopover(null);
    setTimeout(() => searchInputRef.current?.focus(), 0);
  };

  const handleItemClick = (result: SearchResult): void => {
    if (result.type === 'Folder') {
      setOpenPopover(null);
      router.push(`/folders/${result.id}`);
    } else {
      setOpenPopover(null);
      setFileId(result.id);
      setPreviewDialogOpen(true);
    }
  };

  function highlightText(text: string, query: string) {
    if (!query) return text;
  
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} style={{ backgroundColor: 'yellow' }}>{part}</span>
      ) : (
        part
      )
    );
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center" sx={{ width: '100%', mt: 2 }}>
      <Box display="flex" alignItems="center" width="100%">
        <OutlinedInput
          inputRef={searchInputRef}
          fullWidth
          id="search-input"
          size="medium"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value, fileType, startDate, endDate)}
          onFocus={handlePopoverOpen}
          placeholder="Search all files..."
          sx={(theme) => ({ backgroundColor: theme.palette.FilledInput.bg, minWidth: '25vw'})}
          startAdornment={
            <InputAdornment position="start">
              <Iconify width={20} icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          }
          autoComplete="off"
        />
      </Box>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handlePopoverClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        sx={{ mt: 1, maxHeight: '60vh' }}
        disableAutoFocus
        disableRestoreFocus
      >
        <Box
          display="flex"
          p={2}
          gap={2}
          sx={{
            bgcolor: 'background.default',
            borderRadius: 1,
            minWidth: '35vw',
          }}
        >
          <Select
            value={fileType}
            onChange={(e) => handleFilterChange(e.target.value)} // Use the new function
            variant="outlined"
            size="small"
            placeholder="File Type"
            sx={{
              backgroundColor: 'white',
              minWidth: '30%',
              borderColor: 'text.disabled',
              '&:focus': { borderColor: 'primary.main' },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'text.disabled' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
            }}
            className="popover-input"
          >
            <MenuItem key="All" value="All">
              <Typography variant="body1">All</Typography>
            </MenuItem>
            {Object.keys(iconForType).map((type) => (
              <MenuItem key={type} value={type}>
                <Iconify
                  width={23}
                  icon={iconForType[type].url}
                  mr={1}
                  color={iconForType[type].color}
                />
                {type}
              </MenuItem>
            ))}
          </Select>

          <TextField
            type="date"
            value={startDate ? dayjs(startDate).format('YYYY-MM-DD') : ''}
            onChange={(e) => {
              handleSearch(searchQuery, fileType, new Date(e.target.value), endDate);
              setOpenPopover(null);
              setTimeout(() => searchInputRef.current?.focus(), 0);
            }}
            size="small"
            label="Uploaded after"
            sx={{ minWidth: '30%' }}
            InputLabelProps={{ shrink: true }}
            className="popover-input"
          />

          <TextField
            type="date"
            value={endDate ? dayjs(endDate).format('YYYY-MM-DD') : ''}
            onChange={(e) => {
              handleSearch(searchQuery, fileType, startDate, new Date(e.target.value));
              setOpenPopover(null);
              setTimeout(() => searchInputRef.current?.focus(), 0);
            }}
            size="small"
            label="Uploaded before"
            sx={{ minWidth: '30%' }}
            InputLabelProps={{ shrink: true }}
            className="popover-input"
          />
        </Box>

        <Divider />

        <List>
          {results.length > 0 ? (
            results.map((result) => (
              <ListItemButton
                key={result.id}
                onClick={() => handleItemClick(result)}
                sx={{ display: 'flex', justifyContent: 'space-between' }}
              >
                <ListItemText
                  primary={highlightText(result.name, searchQuery)}
                  secondary={`Type: ${result.type} | Size: ${fData(result.size)} | Path: ${result.pathNames || '/'}`}
                  primaryTypographyProps={{
                    sx: { color: 'black', fontWeight: 'bold', wordWrap: 'break-word' },
                  }}
                  secondaryTypographyProps={{ sx: { color: 'gray' } }}
                />
                <IconButton edge="end">
                  <Iconify
                    width={23}
                    icon={iconForType[result.type].url}
                    mr={1}
                    color={iconForType[result.type].color}
                  />
                </IconButton>
              </ListItemButton>
            ))
          ) : (
            <ListItemText
              primary="No files match your search"
              primaryTypographyProps={{
                sx: { ml: 2, color: 'black', fontWeight: 'bold', wordWrap: 'break-word' },
              }}
            />
          )}
        </List>
      </Popover>
    </Box>
  );
}
