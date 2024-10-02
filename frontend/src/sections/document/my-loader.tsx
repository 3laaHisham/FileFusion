import { useEffect } from 'react';

const MyLoadingRenderer = ({
  document,
  fileName,
}: {
  document?: any;
  fileName?: string;
}) => {
  const fileText = fileName || document?.fileType || '';

  if (fileText) {
    return <div>Loading Renderer ({fileText})...</div>;
  }

  return <div>Loading Renderer...</div>;
};

export default MyLoadingRenderer;
