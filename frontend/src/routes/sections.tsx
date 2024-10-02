import { lazy, Suspense, useEffect, useState } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { varAlpha } from 'src/theme/styles';
import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';
import ProtectedRoute from 'src/layouts/components/protected-route';
import { useAxiosInterceptors } from '@utils/my-axios';

// ----------------------------------------------------------------------

export const UserPage = lazy(() => import('src/pages/user'));
export const TrashPage = lazy(() => import('src/pages/trash'));
export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const SignUpPage = lazy(() => import('src/pages/sign-up'));
export const DocumentPage = lazy(() => import('src/pages/document'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const Page403 = lazy(() => import('src/pages/permission-denied'));

// ----------------------------------------------------------------------

const renderFallback = (
  <Box display="flex" alignItems="center" justifyContent="center" flex="1 1 auto">
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

export function Router(): React.ReactElement | null {
  useAxiosInterceptors();

  return useRoutes([
    {
      element: (
        <DashboardLayout>
          <ProtectedRoute>
            <Suspense fallback={renderFallback}>
              <Outlet />
            </Suspense>
          </ProtectedRoute>
        </DashboardLayout>
      ),
      children: [
        { index: true, element: <UserPage /> },
        { path: '/trash', element: <TrashPage /> },
      ],
    },
    {
      element: (
        <DashboardLayout>
          <Suspense fallback={renderFallback}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [{ path: 'folders/:folderId', element: <UserPage /> }],
    },
    {
      element: (
        <AuthLayout>
          <Suspense fallback={renderFallback}>
            <Outlet />
          </Suspense>
        </AuthLayout>
      ),
      children: [
        { path: 'signin', element: <SignInPage /> },
        { path: 'signup', element: <SignUpPage /> },
      ],
    },
    {
      path: 'documents/:documentId',
      element: <DocumentPage />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '403',
      element: <Page403 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
}
