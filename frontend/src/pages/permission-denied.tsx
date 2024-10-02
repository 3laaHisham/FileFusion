import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { PermissonDeniedView } from 'src/sections/error';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>403 permission denied!</title>
      </Helmet>

      <PermissonDeniedView />
    </>
  );
}
