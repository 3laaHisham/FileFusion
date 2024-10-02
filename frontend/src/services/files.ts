import type { AxiosResponse } from 'axios';
import myAxios from '@utils/my-axios';

import dayjs from 'dayjs';

const FILES_PATH: string = import.meta.env.VITE_FILES_API_PATH;

interface SearchParams {
  q?: string;
  fileType?: string;
  startDate?: Date | null;
  endDate?: Date | null;
  isStarred?: boolean | null;
  page?: number;
  size?: number;
}

const searchParams = (params: SearchParams) => ({
    params: {
      q: params.q || null,
      fileType: params.fileType !== 'All' ? params.fileType : null,
      startDate: params.startDate ? dayjs(params.startDate) : null,
      endDate: params.endDate ? dayjs(params.endDate) : null,
      isStarred: params.isStarred,
      page: params.page,
      size: params.size
    },
  });
  

export const getWorkspaces = async (params: SearchParams = {}): Promise<AxiosResponse> =>
  myAxios.get(`${FILES_PATH}/`, searchParams(params));

export const getTrash = async (): Promise<AxiosResponse> => myAxios.get(`${FILES_PATH}/trash`);

export const getFolderContents = async (
  parentId: string,
  params: SearchParams = {}
): Promise<AxiosResponse> => myAxios.get(`${FILES_PATH}/${parentId}`, searchParams(params));

export const createWorkspace = async (name: string): Promise<AxiosResponse> =>
  myAxios.post(`${FILES_PATH}/`, { name });

export const createDirectory = async (name: string, workspaceId: string): Promise<AxiosResponse> =>
  myAxios.post(`${FILES_PATH}/${workspaceId}/directories`, { name });

export const updateTags = async (id: string, tags: string[]): Promise<AxiosResponse> =>
  myAxios.put(`${FILES_PATH}/${id}/tags`, { tags });

export const updateStarred = async (id: string, starred: boolean): Promise<AxiosResponse> =>
  myAxios.put(`${FILES_PATH}/${id}/star`, { isStarred: starred });

export const renameFile = async (id: string, name: string): Promise<AxiosResponse> =>
  myAxios.put(`${FILES_PATH}/${id}/name`, { name });

export const moveFile = async (id: string, parentId: string): Promise<AxiosResponse> =>
  myAxios.put(`${FILES_PATH}/${id}/move`, { newParentFileId: parentId });

export const isOwner = async (id: string): Promise<AxiosResponse> =>
  myAxios.get(`${FILES_PATH}/${id}/isOwner`);

export const deleteFile = async (id: string): Promise<AxiosResponse> =>
  myAxios.delete(`${FILES_PATH}/${id}`);

export const deletePermanent = async (id: string): Promise<AxiosResponse> =>
  myAxios.delete(`${FILES_PATH}/${id}/permanent`);

export const restoreFile = async (id: string): Promise<AxiosResponse> =>
  myAxios.put(`${FILES_PATH}/${id}/restore`);

export const searchFiles = async (params: SearchParams): Promise<AxiosResponse> =>
  myAxios.get(`${FILES_PATH}/search`, searchParams(params));

export const shareFile = async (
  id: string,
  isPublic: boolean,
  emails: string[]
): Promise<AxiosResponse> =>
  myAxios.put(`${FILES_PATH}/${id}/share`, { isPublic, allowedUsers: emails });
