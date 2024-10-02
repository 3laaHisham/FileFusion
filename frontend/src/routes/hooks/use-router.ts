import { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// ----------------------------------------------------------------------

export function useRouter() {
  const navigate = useNavigate();
  const location = useLocation();

  const router = useMemo(
    () => ({
      back: () => navigate(-1),
      forward: () => navigate(1),
      refresh: () => navigate(0),
      push: (href: string, state?: any) => navigate(href, { state }), // Pass state for redirection
      replace: (href: string, state?: any) => navigate(href, { replace: true, state }), // Pass state for replacement
      location, // Access the current location
    }),
    [navigate, location]
  );

  return router;
}
