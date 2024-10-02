import { useState, useCallback, useEffect } from 'react';
import { useQuery } from 'react-query';
import { useLocation, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dayjs from 'dayjs';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import {
  getWorkspaces,
  createWorkspace,
  createDirectory,
  renameFile,
  isOwner,
  getFolderContents,
  deleteFile,
} from '@services/files';
import { useTable } from '@hooks/useTable';
import { useAxiosInterceptors } from '@utils/my-axios';
import { useRouter } from 'src/routes/hooks';
import { usePreview } from 'src/contexts/preview-context';
import { emptyRows, applySort, getComparator } from '../utils';

import { TableNoData } from '../table-no-data';
import { UserTableRow } from '../user-table-row';
import { UserTableHead } from '../user-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { FiltersProps, UserTableToolbar } from '../user-table-toolbar';
import type { UserProps as FileProps } from '../user-table-row';
import FileUploadDialog from '../file-upload-dialog';
import NameDialog from '../name-dialog';
import FilePreviewDialog from '../preview-dialog';
import ShareDialog from '../share-dialog';
import TagsDialog from '../tags-dialog';
import MoveDialog from '../move-dialog';

interface RowShared {
  isPublic: boolean;
  allowedUsers: string[];
  fileName: string;
  fileType: 'Document' | 'Folder';
  tags: string[];
}

// ----------------------------------------------------------------------

export function UserView() {
  const router = useRouter();
  const location = useLocation();
  const { folderId } = useParams();

  const [isUserOwner, setIsUserOwner] = useState<boolean>(false);

  const [path, setPath] = useState({ ids: '', names: '' });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [filters, setFilters] = useState<FiltersProps>({
    q: '',
    fileType: 'All',
    startDate: null,
    endDate: null,
    isStarred: null,
  });

  const [uploadDialogOpen, setUploadDialogOpen] = useState<boolean>(false);

  const [nameDialogOpen, setNameDialogOpen] = useState<boolean>(false);
  const [actionType, setActionType] = useState<'Workspace' | 'Directory' | 'Rename' | null>(null);
  const [dialogTitle, setDialogTitle] = useState<string>('');
  const [defaultName, setDefaultName] = useState<string>('');

  const {
    fileId: rowIdForAction,
    setFileId: setRowIdForAction,

    previewDialogOpen,
    setPreviewDialogOpen,
  } = usePreview(); // I use context here because I need to open the preview dialog from the searchbar component too

  const [shareDialogOpen, setShareDialogOpen] = useState<boolean>(false);
  const [rowShared, setRowShared] = useState<RowShared>({
    isPublic: false,
    allowedUsers: [],
    fileName: '',
    fileType: 'Document',
    tags: [],
  });

  const [moveDialogOpen, setMoveDialogOpen] = useState<boolean>(false);

  const [tagsDialogOpen, setTagsDialogOpen] = useState<boolean>(false);

  const [hasNext, setHasNext] = useState<boolean>(false);

  const table = useTable();

  const open = Boolean(anchorEl);

  const updateSearchParamsFromUrl = () => {
    const searchParams = new URLSearchParams(location.search);

    const q = searchParams.get('q') || '';
    const fileType = searchParams.get('fileType') || 'All';
    const startDate = dayjs(searchParams.get('startDate')).isValid()
      ? new Date(searchParams.get('startDate')!)
      : null;
    const endDate = dayjs(searchParams.get('endDate')).isValid()
      ? new Date(searchParams.get('endDate')!)
      : null;
    const isStarred = searchParams.get('isStarred') === 'true' ? true : null;

    setFilters({
      q,
      fileType,
      startDate,
      endDate,
      isStarred,
    });

    const page = Number(searchParams.get('page')) || 0;
    const rowsPerPage = Number(searchParams.get('rowsPerPage')) || 5;

    table.setPage(page);
    table.setRowsPerPage(rowsPerPage);
  };

  const {
    data: users,
    refetch,
    isLoading,
  } = useQuery(
    ['files', filters, table.page, table.rowsPerPage],
    async ({ queryKey: [_, queryFilters, page, size] }): Promise<FileProps[]> => {
      updateSearchParamsFromUrl();

      const searchParams = {
        ...(queryFilters as object),
        page: Number(page),
        size: Number(size),
      };

      await new Promise((resolve) => setTimeout(resolve, 0)); // For axios interceptors to finish register

      const resPromise = folderId
        ? getFolderContents(folderId, searchParams)
        : getWorkspaces(searchParams);

      const result = resPromise.then((res) => {
        setPath({
          ids: res.data.path.concat(folderId ? `/${folderId}` : []),
          names: res.data.pathNames.concat(folderId ? `/${res.data.name}` : []),
        });

        setIsUserOwner(res.data.isOwner);
        setHasNext(res.data.hasNext);

        return res.data.files;
      });

      return result;
    },
    { refetchOnWindowFocus: false }
  );

  const _users = users || [];

  const dataFiltered: FileProps[] = applySort({
    inputData: _users,
    comparator: getComparator(table.order, table.orderBy),
  });

  const notFound = dataFiltered.length === 0;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSetFilters =
    (updateState: Partial<FiltersProps>) => {
      const newFilters = { ...filters, ...updateState };
      setFilters(newFilters);

      table.onResetPage();

      const searchParams = new URLSearchParams();
      Object.keys(newFilters).forEach((key) => {
        if (newFilters[key as keyof FiltersProps]) {
          searchParams.set(key, newFilters[key as keyof FiltersProps] as string);
        }
      });

      searchParams.set('page', String(table.page));
      searchParams.set('rowsPerPage', String(table.rowsPerPage));

      router.replace(`${location.pathname}?${searchParams.toString()}`);
    }

  const onSubmitNameDialog = async (name: string): Promise<void> => {
    try {
      if (actionType === 'Workspace') await createWorkspace(name);
      else if (actionType === 'Directory') await createDirectory(name, folderId!);
      else if (actionType === 'Rename') await renameFile(rowIdForAction, name);

      await refetch();
      toast.success(`${actionType} is successful`);
    } catch (err) {
      toast.error(err.response.data.message ?? err.response.statusText ?? err.message);
    } finally {
      setActionType(null);
    }
  };

  const handleNameDialog = (
    action: 'Workspace' | 'Directory' | 'Rename',
    id?: string,
    name?: string
  ): void => {
    if (action === 'Rename') {
      setRowIdForAction((prevStat) => id ?? prevStat);
      setDefaultName((prevState) => name ?? prevState);
    }

    setAnchorEl(null);

    setActionType(action);
    setDialogTitle(action === 'Rename' ? 'Rename File' : `Create ${action}`);

    setNameDialogOpen(true);
  };

  const handleTagsDialog = (file: FileProps) => {
    setRowIdForAction(file.id);
    setRowShared({
      isPublic: file.isPublic,
      allowedUsers: file.allowedUsersEmails,
      fileName: file.name,
      fileType: file.type === 'Folder' ? 'Folder' : 'Document',
      tags: file.tags,
    });

    setTagsDialogOpen(true);
  };

  const onPreview = (id: string): void => {
    setRowIdForAction(id);
    setPreviewDialogOpen(true);
  };

  const onShare = (file: FileProps): void => {
    setRowIdForAction(file.id);

    setRowShared({
      isPublic: file.isPublic,
      allowedUsers: file.allowedUsersEmails,
      fileName: file.name,
      fileType: file.type === 'Folder' ? 'Folder' : 'Document',
      tags: file.tags,
    });

    setShareDialogOpen(true);
  };

  const onMove = (file: FileProps): void => {
    setRowIdForAction(file.id);

    setMoveDialogOpen(true);
  };

  const onDelete = (id: string) =>
    deleteFile(id)
      .then((res: any) => {
        console.log('onDelete then');
        refetch();
        toast.success(res.data.message);
      })
      .catch((err) => {
        console.log('onDelete catch');
        toast.error(err.response.data.message ?? err.response.statusText ?? err.message);
      });

  const renderPath = () => {
    const pathIdsArray = path.ids.split('/');
    const pathNamesArray = path.names.split('/');
    console.log('isWorkspace');

    return pathIdsArray.map((id, index) => {
      const isWorkspace = id === '~';

      const handleClickPath = () => router.push(isWorkspace ? '/' : `/folders/${id}`);
      const label = isWorkspace ? 'My Workspaces' : pathNamesArray[index];

      return (
        <Box key={index} display="flex">
          <Button key={index} onClick={handleClickPath} size="large">
            <Typography
              variant="body1"
              color={index === pathIdsArray.length - 1 ? 'black' : 'grey'}
              sx={{ fontWeight: 'bold', fontSize: '1.25rem' }}
            >
              {label}
            </Typography>
          </Button>
          {index < pathIdsArray.length - 1 && (
            <Typography sx={{ mx: 1, mt: 1, fontWeight: 'bold', fontSize: '1.25rem' }}>
              {'>'}
            </Typography>
          )}
        </Box>
      );
    });
  };

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={1}>
        <Box display="flex" alignItems="center" sx={{ flexGrow: 1, my: 1, px: 0 }}>
          {renderPath()}
        </Box>
        {isUserOwner && (
          <>
            <Button
              variant="contained"
              color="inherit"
              startIcon={<Iconify icon="mingcute:add-line" />}
              size="large"
              onClick={handleClick}
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <Typography variant="h6">New</Typography>
            </Button>

            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={() => setAnchorEl(null)}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
              sx={{
                '& .MuiPaper-root': {
                  width: '20ch',
                },
              }}
            >
              {folderId ? (
                <Box display="flex" flexDirection="column">
                  <MenuItem onClick={() => handleNameDialog('Directory')}>
                    <ListItemIcon>
                      <DriveFolderUploadIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>New Directory</ListItemText>
                  </MenuItem>

                  <Divider />

                  <MenuItem
                    onClick={() => {
                      setAnchorEl(null);
                      setUploadDialogOpen(true);
                    }}
                  >
                    <ListItemIcon>
                      <UploadFileIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>File Upload</ListItemText>
                  </MenuItem>
                </Box>
              ) : (
                <MenuItem onClick={() => handleNameDialog('Workspace')}>
                  <ListItemIcon>
                    <DriveFolderUploadIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>New Workspace</ListItemText>
                </MenuItem>
              )}
            </Menu>
          </>
        )}
      </Box>

      <Card>
        <UserTableToolbar
          numSelected={table.selected.length}
          filters={filters}
          onSetFilters={handleSetFilters}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={_users?.length ?? 0}
                numSelected={table.selected.length}
                onSort={table.onSort}
                headLabel={[
                  { id: 'name', label: 'Name' },
                  { id: 'type', label: 'Type' },
                  { id: 'size', label: 'Size' },
                  { id: 'uploadDate', label: 'Upload Date' },
                  { id: 'tags', label: 'Tags' },
                  { id: 'isStarred', label: 'Favorite' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered.map((row) => (
                  <UserTableRow
                    key={row.id}
                    row={row}
                    selected={table.selected.includes(row.id)}
                    onSelectRow={() => table.onSelectRow(row.id)}
                    onDownload={() => table.download({ id: row.id, name: row.name })}
                    onShare={() => onShare(row)}
                    onMove={() => onMove(row)}
                    onRename={() => handleNameDialog('Rename', row.id, row.name)}
                    onPreview={() => onPreview(row.id)}
                    onTags={() => handleTagsDialog(row)}
                    onStarred={(starred: boolean) => table.onStarred(row.id, starred)}
                    onDelete={() => onDelete(row.id)}
                    isUserOwner={isUserOwner}
                  />
                ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                />

                {notFound && <TableNoData searchQuery={filters.q} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
        <TablePagination
          component="div"
          page={table.page}
          count={_users.length + table.page * table.rowsPerPage + (hasNext ? 1 : 0)}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />

        {isLoading && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.8)', // Optional: Light background
              zIndex: 1000, // Ensure it's above other content
            }}
          >
            <CircularProgress />
          </Box>
        )}

        <FileUploadDialog
          open={uploadDialogOpen}
          onClose={() => setUploadDialogOpen(false)}
          workspaceId={folderId!}
          refetch={refetch}
        />

        <FilePreviewDialog
          key={`${rowIdForAction} preview`}
          open={previewDialogOpen}
          // onClose={useCallback(() => setPreviewDialogOpen(false), [setPreviewDialogOpen])}
          onClose={() => setPreviewDialogOpen(false)}
          fileId={rowIdForAction}
        />

        <ShareDialog
          key={`${rowIdForAction} share`}
          open={shareDialogOpen}
          onClose={() => setShareDialogOpen(false)}
          refetch={refetch}
          fileId={rowIdForAction}
          fileShared={rowShared}
        />

        <NameDialog
          open={nameDialogOpen}
          onClose={() => setNameDialogOpen(false)}
          onSubmit={onSubmitNameDialog}
          title={dialogTitle}
          defaultName={defaultName}
          setDefaultName={setDefaultName}
        />

        <MoveDialog
          key={`${rowIdForAction} move`}
          open={moveDialogOpen}
          onClose={() => setMoveDialogOpen(false)}
          refetch={refetch}
          fileId={rowIdForAction}
        />

        <TagsDialog
          key={`${rowIdForAction} tags`}
          open={tagsDialogOpen}
          onClose={() => setTagsDialogOpen(false)}
          refetch={refetch}
          fileId={rowIdForAction}
          file={rowShared}
        />
      </Card>
    </DashboardContent>
  );
}
