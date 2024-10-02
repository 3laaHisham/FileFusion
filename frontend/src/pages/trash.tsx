import { Helmet } from 'react-helmet-async';

import { TrashView } from 'src/sections/trash/view';

// ----------------------------------------------------------------------

export default function Page() {
  
  return (
    <>
      <Helmet>
        <title>Trash</title>
      </Helmet>

      <TrashView />
    </>
  );
}
