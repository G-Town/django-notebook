import { useState, useEffect } from 'react';
import Folder from './Folder';
import { getFolders, createFolder } from "../services/folderService";
import "../styles/Folders.css";

const FolderTree = () => {
  const [folders, setFolders] = useState([]);
  // const [expandedFolderId, setExpandedFolderId] = useState(null);
  // const [selectedFolderId, setSelectedFolderId] = useState(null);
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
        setNewFolderName(""); // Clear the input
        await loadFolders(); // Reload folders after creation
      } catch (error) {
        console.error("Error creating new folder:", error);
      }
    }
  };

  const toggleFolder = (folderId) => {
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
    console.log("🚀 ~ renderFolder ~ folder:", folder)
    // const children = folders.filter(f => f.parent === folder.id);
    console.log("🚀 ~ renderFolder ~ children:", folder.children)
    return (
      <Folder
        key={folder.id}
        folder={folder}
        isExpanded={expandedFolderIds.has(folder.id)}
        onToggle={() => toggleFolder(folder.id)}
        onUpdate={loadFolders}
      >
        {folder.children && folder.children.map(childId => {
          const childFolder = folders.find(f => f.id === childId);
          console.log("🚀 ~ renderFolder ~ childFolder:", childFolder)
          return childFolder ? renderFolder(childFolder) : null;
        })}
        {/* {folder.children && folder.children.map(renderFolder)} */}
      </Folder>
    );
  };

  if (isLoading) {
    return <div>Loading folders...</div>;
  }

  const rootFolders = folders.filter(folder => !folder.parent);

  return (
    <div className="folder-tree-container">
      {/* <div className={`folder-tree ${selectedFolderId ? "menu-open" : ""}`}> */}
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

export default FolderTree;