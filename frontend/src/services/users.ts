import myAxios from "@utils/my-axios";
import { AxiosResponse } from "axios";

interface Signup {
    username: string,
    password: string,
    nationalId: string,
    email: string,
    firstName: string,
    lastName: string,
} 

const USERS_PATH: string = import.meta.env.VITE_USERS_API_PATH;

export const login = async (data: { username: string, password: string }): Promise<AxiosResponse> =>
    myAxios.post(`${USERS_PATH}/login`, data)  

export const signup = async (user: Signup): Promise<AxiosResponse> => 
    myAxios.post(`${USERS_PATH}/signup`, user);;

export const validateToken = async (): Promise<AxiosResponse> =>
    myAxios.get(`${USERS_PATH}/validate-token`);

export const logout = async (): Promise<AxiosResponse> =>
    myAxios.post(`${USERS_PATH}/logout`);
