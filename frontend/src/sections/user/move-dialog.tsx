import React, { useState, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view';
import { ExpandMore, ChevronRight } from '@mui/icons-material';
import { getFolderContents, getWorkspaces, moveFile } from '@services/files';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';

interface FileNode {
  id: string;
  name: string;
}

interface FileTreeDialogProps {
  open: boolean;
  onClose: () => void;
  refetch: () => void;
  fileId: string;
}

const MoveDialog = ({ open, onClose, refetch, fileId }: FileTreeDialogProps) => {
  const [expanded, setExpanded] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<string | null>(null); // Initialize to null
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [childrenData, setChildrenData] = useState<Record<string, FileNode[]>>({});

  const { data: rootNodes } = useQuery('move', async (): Promise<FileNode[]> => {
    await new Promise((resolve) => setTimeout(resolve, 0)); // For axios interceptors to finish register
    return getWorkspaces({ size: 10 }).then((res) => res.data.files);
  });

  const handleExpandedItemsChange = (event: React.SyntheticEvent, itemIds: string[]) => {
    setExpanded(itemIds);
  };

  const handleSelectedItemsChange = (event: React.SyntheticEvent, id: string | null) => {
    setSelectedItems(id); // Accept null as a valid state
  };

  const fetchChildren = useCallback(
    async (parentId: string): Promise<FileNode[]> => {
      if (fileId === parentId) {
        toast.warning('Not allowed to move folder to its children');
        return Promise.resolve([]);
      }

      const res = await getFolderContents(parentId, { fileType: 'Folder' });
      return res.data.files;
    },
    [fileId]
  );

  const handleSubmit = useCallback(() => {
    if (fileId === selectedItems) {
      toast.error('Cannot move folder to itself');
      return;
    }

    if (selectedItems) {
      moveFile(fileId, selectedItems).then(() => {
        refetch();
        onClose();
      });
    }
  }, [fileId, selectedItems, refetch, onClose]);

  const handleLoadChildren = useCallback(
    async (itemId: string) => {
      if (!childrenData[itemId]) {
        setLoading((prev) => ({ ...prev, [itemId]: true }));
        const children = await fetchChildren(itemId);
        setChildrenData((prev) => ({ ...prev, [itemId]: children }));
        setLoading((prev) => ({ ...prev, [itemId]: false }));
      }
    },
    [childrenData, fetchChildren]
  );

  const renderTreeItems = (nodes: FileNode[]): React.ReactNode =>
    nodes.map((node) => (
      <TreeItem
        key={node.id}
        itemId={node.id}
        label={node.name}
        onClick={() => handleLoadChildren(node.id)}
      >
        {loading[node.id] ? (
          <CircularProgress sx={{ ml: 5, mt: 1 }} size={24} />
        ) : (
          childrenData[node.id] && renderTreeItems(childrenData[node.id])
        )}
      </TreeItem>
    ));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth disableRestoreFocus>
      <DialogTitle>
        Move to another location
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={(theme) => ({
          backgroundColor: theme.palette.grey[200],
          height: '50vh',
          flexGrow: 1,
          mx: 5,
          my: 1,
        })}
      >
        <SimpleTreeView
          expandedItems={expanded}
          onExpandedItemsChange={handleExpandedItemsChange}
          // expansionTrigger="iconContainer"
          selectedItems={selectedItems}
          onSelectedItemsChange={handleSelectedItemsChange}
          slots={{
            expandIcon: ExpandMore,
            collapseIcon: ChevronRight,
          }}
        >
          {rootNodes && renderTreeItems(rootNodes)}
        </SimpleTreeView>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button
          disabled={selectedItems === null} // Disable if nothing is selected
          onClick={handleSubmit}
          variant="contained"
          color="primary"
        >
          Move
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MoveDialog;
