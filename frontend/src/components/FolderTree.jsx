import { useState, useEffect } from 'react';
import Folder from './Folder';
import { getFolders, createFolder } from "../services/folderService";
import "../styles/Folders.css";

const FolderTree = () => {
  const [folders, setFolders] = useState([]);
  const [expandedFolderId, setExpandedFolderId] = useState(null);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
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
        setNewFolderName(""); // Clear the input
        await loadFolders(); // Reload folders after creation
      } catch (error) {
        console.error("Error creating new folder:", error);
      }
    }
  };

  const renderFolder = (folder) => {
    return (
      <Folder
        key={folder.id}
        folder={folder}
        expandedFolderId={expandedFolderId}
        setExpandedFolderId={setExpandedFolderId}
        selectedFolderId={selectedFolderId}
        setSelectedFolderId={setSelectedFolderId}
        onFolderUpdate={loadFolders}
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
      <div className={`folder-tree ${selectedFolderId ? "menu-open" : ""}`}>
        {rootFolders.map(folder => renderFolder(folder))}
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

export default FolderTree;