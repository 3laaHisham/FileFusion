import { useEffect, useState, ReactNode } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRouter } from 'src/routes/hooks';

function getCsrfToken() {
  const csrfToken = document.cookie
    .split('; ')
    .find((row) => row.startsWith('XSRF-TOKEN='))
    ?.split('=')[1];

  return csrfToken;
}

const myAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

myAxios.interceptors.request.use((config) => {
  const csrfToken = getCsrfToken();
  if (csrfToken) 
    config.headers['X-XSRF-TOKEN'] = csrfToken;
  
  console.log('Request: ', config);
  return config;
});

export const useAxiosInterceptors = function () {
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {

    const responseInterceptor = myAxios.interceptors.response.use(
      (response) => response,
      (error) => {
        console.log('Error: ', error);

        if (
          error.response?.status === 401 &&
          router.location.pathname !== '/signup' &&
          router.location.pathname !== '/signin'
        ) {
          router.push('/signin', { from: router.location.pathname });
          toast.error('You are not authenticated');
        }

        if (error.response?.status === 403) {
          router.push('/403');
          toast.error('You are not authorized');
        }

        if (error.response?.status === 404) {
          router.push('/404');
          toast.error('Resource not found');
        }

        throw error;
      }
    );

    setIsInitialized(true);

    return () => {
      myAxios.interceptors.response.eject(responseInterceptor);
    };
  }, [router]);

  return isInitialized;
};

export default myAxios;
