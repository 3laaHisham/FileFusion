import { QueryClient, QueryClientProvider } from 'react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Router } from 'src/routes/sections';

import { useAxiosInterceptors } from '@utils/my-axios';
import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import { ThemeProvider } from 'src/theme/theme-provider';
import { PreviewProvider } from './contexts/preview-context';

import 'src/global.css';

// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <PreviewProvider>
          <Router />
          <ToastContainer />
        </PreviewProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
