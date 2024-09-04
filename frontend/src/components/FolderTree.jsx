import { useState, useEffect } from 'react';
import Folder from './Folder';
import { getFolders, createFolder } from "../services/folderService";
import PropTypes from 'prop-types';
import "../styles/FolderTree.css";

const FolderTree = ({ selectedFolderId, onSelectFolder }) => {
  const [folders, setFolders] = useState([])
  const [expandedFolderIds, setExpandedFolderIds] = useState(new Set());
  const [newFolderName, setNewFolderName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFolders();
  }, []);

  const loadFolders = async () => {
    setIsLoading(true);
    try {
      const fetchedFolders = await getFolders();
      setFolders(fetchedFolders);
    } catch (error) {
      console.error("Error loading folders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addNewFolder = async () => {
    if (newFolderName.trim()) {
      try {
        await createFolder({ name: newFolderName.trim() });
        setNewFolderName("");
        await loadFolders();
      } catch (error) {
        console.error("Error creating new folder:", error);
      }
    }
  };

  const expandFolder = (folderId) => {
    setExpandedFolderIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  };

  const renderFolder = (folder) => {
    return (
      <Folder
        key={folder.id}
        folder={folder}
        selectedFolderId={selectedFolderId}
        isExpanded={expandedFolderIds.has(folder.id)}
        setSelectedFolder={onSelectFolder}
        onExpand={() => expandFolder(folder.id)}
        onUpdate={loadFolders}
      >
        {folder.children && folder.children.map(childId => {
          const childFolder = folders.find(f => f.id === childId);
          return childFolder ? renderFolder(childFolder) : null;
        })}
      </Folder>
    );
  };

  if (isLoading) {
    return <div>Loading folders...</div>;
  }

  const rootFolders = folders.filter(folder => !folder.parent);

  return (
    <div className="folder-tree-container">
      <div className="folder-tree">
        {rootFolders.map(renderFolder)}
      </div>
      <div className="add-folder">
        <input
          type="text"
          placeholder="New Folder Name"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
        />
        <button onClick={addNewFolder}>Add Folder</button>
      </div>
    </div>
  );
};

FolderTree.propTypes = {
  selectedFolderId: PropTypes.string,
  onSelectFolder: PropTypes.func
};

export default FolderTree;