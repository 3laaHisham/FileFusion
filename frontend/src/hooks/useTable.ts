import { useState, useCallback } from 'react';
import { useMutation } from 'react-query';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { getDownloadData } from '@services/storage';
import { deleteFile, deletePermanent, restoreFile, updateStarred } from '@services/files';
import { useRouter } from 'src/routes/hooks';

export function useTable(refetch?: () => void) {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const location = useLocation();
  const router = useRouter();

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }, []);

  const onSelectRow = useCallback(
    (inputValue: string) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue];

      setSelected(newSelected);
    },
    [selected]
  );

  const onResetPage = useCallback(() => {
    setPage(0);

    const searchParams = new URLSearchParams(location.search);
    searchParams.set('page', '0');

    router.replace(`${location.pathname}?${searchParams.toString()}`);
  }, [location, router]);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);

    const searchParams = new URLSearchParams(location.search);
    searchParams.set('page', String(newPage));

    router.replace(`${location.pathname}?${searchParams.toString()}`);
  }, [location, router]);

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();

      const searchParams = new URLSearchParams(location.search);
      searchParams.set('page', String(0));
      searchParams.set('rowsPerPage', String(event.target.value || 10));

      router.replace(`${location.pathname}?${searchParams.toString()}`);
    },
    [onResetPage, location, router]
  );

  const { mutate: download } = useMutation(async (data: { id: string; name: string }) => {
    const toastId = toast.info('Download is in progress', {
      autoClose: false,
      position: 'bottom-right',
    });
    const res = await getDownloadData(data.id);

    const fileResponse = await fetch(res.data.url);
    const blob = await fileResponse.blob();

    const extension = res.data.extension;

    toast.done(toastId);

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob); // Create a blob URL
    link.download = data.name.endsWith(`.${extension}`) ? data.name : `${data.name}.${extension}`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  const onStarred = useCallback(
    async (id: string, starred: boolean): Promise<any> => updateStarred(id, starred),
    []
  );

  return {
    page,
    setPage,
    order,
    onSort,
    orderBy,
    selected,
    rowsPerPage,
    setRowsPerPage,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
    download,
    onStarred,
  };
}
