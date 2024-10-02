import { createContext, useContext, useMemo, useState } from 'react';

interface PreviewContextProps {
  previewDialogOpen: boolean;
  setPreviewDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;

  fileId: string;
  setFileId: React.Dispatch<React.SetStateAction<string>>;
}

const PreviewContext = createContext<PreviewContextProps | undefined>(undefined);

export const usePreview = () => {
  const context = useContext(PreviewContext);

  if (!context) {
    throw new Error('usePreview must be used within a PreviewProvider');
  }

  return context;
};

export const PreviewProvider = ({ children }: { children: React.ReactNode }) => {
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [fileId, setFileId] = useState<string>('');

  const value = useMemo(
    () => ({
      previewDialogOpen,
      setPreviewDialogOpen,
      fileId,
      setFileId,
    }),
    [previewDialogOpen, fileId]
  );

  return <PreviewContext.Provider value={value}>{children}</PreviewContext.Provider>;
};
