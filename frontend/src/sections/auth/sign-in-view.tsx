import { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import { useMutation } from 'react-query';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import { useTheme } from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';

import { login, validateToken } from '@services/users';
import { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';

// ----------------------------------------------------------------------

export function SignInView() {
  const router = useRouter();

  const destination = router.location.state?.from || '/';

  useEffect(() => {
    validateToken()
      .then((res: any) => {
        if (res.status === 200) router.push(destination);
      })
  }, [router, destination]);

  const [showPassword, setShowPassword] = useState(false);

  const {
    isLoading,
    mutate: handleSignIn,
    isError,
    error,
  } = useMutation((data: { username: string; password: string }) => login(data), {
    onSuccess: (res) => router.push(destination),
    onError: (err) => console.error(err)
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const renderForm = (
    <form onSubmit={handleSubmit((body: any) => handleSignIn(body))}>
      <Box sx={{ mb: 4 }}>
        {isError && (
          <Typography variant="body1" color="error">
            {(error as any).response?.data.detail ?? (error as any).message}
          </Typography>
        )}
      </Box>

      <Box display="flex" flexDirection="column" alignItems="flex-end">
        <TextField
          fullWidth
          label="Username"
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 3 }}
          {...register('username', {
            required: true,
          })}
          error={!!errors?.username}
          helperText={errors?.username ? 'Required' : null}
        />

        <Link variant="body2" color="inherit" sx={{ mb: 1.5 }}>
          Forgot password?
        </Link>

        <TextField
          fullWidth
          label="Password"
          InputLabelProps={{ shrink: true }}
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
          {...register('password', {
            required: true,
          })}
          error={!!errors?.password}
          helperText={errors?.password ? 'Required' : null}
        />

        <LoadingButton
          loading={isLoading}
          loadingIndicator="Loading..."
          fullWidth
          size="large"
          type="submit"
          color="inherit"
          variant="contained"
        >
          Sign in
        </LoadingButton>
      </Box>
    </form>
  );

  return (
    <>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h5">Sign in</Typography>
        <Typography variant="body2" color="text.secondary">
          Don’t have an account?
          <Link href="/signup" variant="subtitle2" sx={{ ml: 0.5 }}>
            Get started
          </Link>
        </Typography>
      </Box>

      {renderForm}

      <Divider sx={{ my: 2, '&::before, &::after': { borderTopStyle: 'dashed' } }}>
        <Typography
          variant="overline"
          sx={{ color: 'text.secondary', fontWeight: 'fontWeightMedium' }}
        >
          OR (I will implement it later, I hope :) )
        </Typography>
      </Divider>

      <Box gap={1} display="flex" justifyContent="center">
        <IconButton color="inherit">
          <Iconify icon="logos:google-icon" />
        </IconButton>
        <IconButton color="inherit">
          <Iconify icon="eva:github-fill" />
        </IconButton>
        <IconButton color="inherit">
          <Iconify icon="ri:twitter-x-fill" />
        </IconButton>
      </Box>
    </>
  );
}
