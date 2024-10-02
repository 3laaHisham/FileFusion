import { useState, useCallback, useEffect } from 'react';
import { useMutation, useQuery } from 'react-query';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Box from '@mui/material/Box';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { deletePermanent, getTrash, restoreFile } from '@services/files';
import { useTable } from '@hooks/useTable';
import { useRouter } from 'src/routes/hooks';
import { emptyRows, applyFilter, getComparator } from '../utils';

import { TableNoData } from '../table-no-data';
import { UserTableRow } from '../user-table-row';
import { UserTableHead } from '../user-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { UserTableToolbar } from '../user-table-toolbar';
import type { UserProps as FileProps } from '../user-table-row';

// ----------------------------------------------------------------------

export function TrashView() {
  const router = useRouter();

  const [filterName, setFilterName] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const { data: users, refetch } = useQuery(
    'trash',
    async (): Promise<FileProps[]> => {
      await new Promise(resolve => setTimeout(resolve, 0)); // For axios interceptors to finish register 

      const res = await getTrash();

      return res.data;
    },
    { refetchOnWindowFocus: false }
  );

  const _users = users || [];

  const table = useTable();

  const dataFiltered: FileProps[] = applyFilter({
    inputData: _users,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = dataFiltered.length === 0;

  const onRestore = useCallback(async (id: string) => {
    restoreFile(id).then((res) => {
      refetch();
      toast.success(res.data.message);
    });
  }, [refetch]);

  const onDeletePermanent = useCallback(async (id: string) => {
    deletePermanent(id)
      .then((res) => {
        toast.success(res.data.message);
      })
      .catch((err) => {
        toast.error(err.response?.data.message ?? err.response.statusText ?? err.message);
      });
  }, []);

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" sx={{ my: 2, px: 0 }}>
        <Typography variant="h4" sx={{ ml: 1 }}>
          Trash
        </Typography>
      </Box>

      <Card>
        <UserTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
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
                  { id: 'deletedAt', label: 'Deletion Date' },
                  { id: 'pathNames', label: 'Path' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <UserTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      onRestore={() => onRestore(row.id)}
                      onDelete={() => onDeletePermanent(row.id)}
                    />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, _users.length)}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={_users.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}
