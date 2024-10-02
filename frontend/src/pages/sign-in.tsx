import { Helmet } from 'react-helmet-async';

import { SignInView } from 'src/sections/auth';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Sign in</title>
      </Helmet>

      <SignInView />
    </>
  );
}
