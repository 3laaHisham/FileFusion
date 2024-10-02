import myAxios from "@utils/my-axios";
import type { AxiosResponse } from "axios";

const FILES_PATH: string = import.meta.env.VITE_FILES_API_PATH;

// export const uploadFile = async (file: File): Promise<AxiosResponse> => {
//     const formData = new FormData();
//     formData.append('file', file);
//     return myAxios.post(`${FILES_PATH}/`, formData);
// };


export const getDownloadData = async (id: string): Promise<AxiosResponse> =>
    myAxios.get(`${FILES_PATH}/documents/${id}`);


export const getSignedPutUrl = async (contentType: string): Promise<AxiosResponse> =>
    myAxios.post(`${FILES_PATH}/signed-put-url`, { contentType });

interface DocumentData {
    id: string
    name: string;
    url: string;
    size: number;
    extension: string;
}

export const createDocument = async (workspaceId: string, document: DocumentData): Promise<AxiosResponse> =>
    myAxios.post(`${FILES_PATH}/${workspaceId}/documents`, document);

