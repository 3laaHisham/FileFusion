import { useState, useEffect } from 'react';
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
import Grid from '@mui/material/Grid'; // Import Grid for side-by-side layout

import { useRouter } from 'src/routes/hooks';
import { Iconify } from 'src/components/iconify';

import { signup, validateToken } from '@services/users';
import { toast } from 'react-toastify';

// ----------------------------------------------------------------------

export function SignUpView() {
  const router = useRouter();

  useEffect(() => {
    validateToken()
      .then((res: any) => {
        if (res.status === 200) router.push('/');
      })
      .catch((err) => {
        console.log(err);
      });
  }, [router]);

  const location = useLocation();
  const destination = location.state?.from?.pathname || '/';

  const [showPassword, setShowPassword] = useState(false);

  const {
    isLoading,
    mutate: handleSignup,
    isError,
    error,
  } = useMutation(
    (data: { firstName: string; lastName: string; username: string; nationalId: string; email: string; password: string }) =>
      signup(data),
    {
      onSuccess: (res) => {
        toast.success('Signup is successful');
        router.push(destination);
      },
      onError: (err) => {
        console.error(err);
      },
    }
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const renderForm = (
    <form onSubmit={handleSubmit((body: any) => handleSignup(body))}>
      <Box sx={{ mb: 4 }}>
        {isError && (
          <Typography variant="body1" color="error">
            {(error as any).response?.data.detail ?? (error as any).message}
          </Typography>
        )}
      </Box>

      {/* First Name and Last Name Fields Side by Side */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="First Name"
            InputLabelProps={{ shrink: true }}
            {...register('firstName', { required: true })}
            error={!!errors?.firstName}
            helperText={errors?.firstName ? 'Required' : null}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Last Name"
            InputLabelProps={{ shrink: true }}
            {...register('lastName', { required: true })}
            error={!!errors?.lastName}
            helperText={errors?.lastName ? 'Required' : null}
          />
        </Grid>
      </Grid>

      {/* Username, National ID, Email, Password Fields */}
      <Box display="flex" flexDirection="column" alignItems="flex-end">
        <TextField
          fullWidth
          label="Username"
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 3 }}
          {...register('username', { required: true })}
          error={!!errors?.username}
          helperText={errors?.username ? 'Required' : null}
        />

        <TextField
          fullWidth
          label="National ID"
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 3 }}
          {...register('nationalId', { required: true, pattern: /^[0-9]{14}$/ })}
          error={!!errors?.nationalId}
          helperText={errors?.nationalId ? 'Invalid national ID, must be 14 digits' : null}
        />

        <TextField
          fullWidth
          label="Email"
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 3 }}
          {...register('email', { required: true, pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ })}
          error={!!errors?.email}
          helperText={errors?.email ? 'Invalid email address' : null}
        />

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
          {...register('password', { required: true })}
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
          Sign Up
        </LoadingButton>
      </Box>
    </form>
  );

  return (
    <>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h5">Sign Up</Typography>
        <Typography variant="body2" color="text.secondary">
          Already have an account?{' '}
          <Link href="/signin" variant="subtitle2" sx={{ ml: 0.5 }}>
            Login
          </Link>
        </Typography>
      </Box>

      {renderForm}

      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        By signing up, you agree to our <Link href="#">Terms and Conditions</Link>.
      </Typography>
    </>
  );
}
