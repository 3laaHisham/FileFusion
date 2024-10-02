import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

import { UserView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function Page() {
  const { folderId } = useParams();
  
  return (
    <>
      <Helmet>
        <title>Files</title>
      </Helmet>

      <UserView key={folderId}/>
    </>
  );
}
