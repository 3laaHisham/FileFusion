import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { SimpleLayout } from 'src/layouts/simple';

// ----------------------------------------------------------------------

export function PermissonDeniedView() {
  return (
    <SimpleLayout content={{ compact: true }}>
      <Container>
        <Typography variant="h3" sx={{ mb: 2 }}>
          Permission denied!
        </Typography>

        <Typography sx={{ color: 'text.secondary' }}>
          You do not have permission to access this page.
        </Typography>

        <Box
          component="img"
          src="/assets/illustrations/illustration-403.png"
          sx={{
            width: 400,
            height: 'auto',
            my: { xs: 4, sm: 7 },
          }}
        />

        <Button component={RouterLink} href="/" size="large" variant="contained" color="inherit">
          Go home
        </Button>
      </Container>
    </SimpleLayout>
  );
}
