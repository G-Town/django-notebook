import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolderOpen,
  faFolderClosed,
  faPlus,
  faEdit,
  faTrash,
  faEllipsis,
} from "@fortawesome/free-solid-svg-icons";
import NoteList from "./NoteList";
import {
  getFolders,
  createFolder,
  updateFolder,
  deleteFolder,
} from "../services/folderService";
import "../styles/Folders.css";

const Folders = () => {
  const [folders, setFolders] = useState([]);
  const [expandedFolderId, setExpandedFolderId] = useState(null);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [editFolderId, setEditFolderId] = useState(null);
  const [editFolderName, setEditFolderName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const menuRef = useRef(null);

  useEffect(() => {
    loadFolders();
  }, []);

  useEffect(() => {
    const handleClickOut = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setSelectedFolderId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOut);
    return () => {
      document.removeEventListener("mousedown", handleClickOut);
    };
  }, []);

  const toggleExpand = (folderId) => {
    setExpandedFolderId(expandedFolderId === folderId ? null : folderId);
  };

  const toggleOptions = (folderId) => {
    setSelectedFolderId(selectedFolderId === folderId ? null : folderId);
  };

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

  const handleFolderAction = async (action, folder) => {
    if (action === "rename") {
      setEditFolderId(folder.id);
      setEditFolderName(folder.name);
    } else if (action === "delete") {
      if (
        window.confirm(
          `Are you sure you want to delete the folder "${folder.name}"?`
        )
      ) {
        try {
          await deleteFolder(folder.id);
          await loadFolders(); // Reload folders after deletion
        } catch (error) {
          console.error("Error deleting folder:", error);
        }
      }
    } else if (action === "createSubfolder") {
      const subfolderName = window.prompt("Enter name for the new subfolder:");
      if (subfolderName) {
        try {
          await createFolder({ name: subfolderName, parent: folder.id });
          await loadFolders(); // Reload folders after creation
        } catch (error) {
          console.error("Error creating subfolder:", error);
        }
      }
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
        // Handle error (e.g., show an error message to the user)
      }
    }
  };

  const handleRenameSubmit = async (e) => {
    e.preventDefault();
    if (editFolderName.trim()) {
      try {
        await updateFolder(editFolderId, { name: editFolderName.trim() });
        setEditFolderId(null); // Clear the edit mode
        setEditFolderName("");
        await loadFolders(); // Reload folders after renaming
      } catch (error) {
        console.error("Error renaming folder:", error);
        // Handle error (e.g., show an error message to the user)
      }
    }
  };

  if (isLoading) {
    return <div>Loading folders...</div>;
  }

  return (
    // conditionally set open menu class for whole folder list
    <div className={`folder-list ${selectedFolderId ? "menu-open" : ""}`}>
      {folders.map((folder) => (
        <div
          key={folder.id}
          // conditionally set active folder class when this folder's menu is open
          className={`folder-container ${
            selectedFolderId === folder.id ? "active-folder" : ""
          }`}
        >
          <div className="folder-card" onClick={() => toggleExpand(folder.id)}>
            <FontAwesomeIcon
              className="folder-icon"
              icon={
                expandedFolderId === folder.id ? faFolderOpen : faFolderClosed
              }
            />
            {editFolderId === folder.id ? (
              <form onSubmit={handleRenameSubmit}>
                <input
                  type="text"
                  value={editFolderName}
                  onChange={(e) => setEditFolderName(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
                <button type="submit">Save</button>
                <button type="button" onClick={() => setEditFolderId(null)}>
                  Cancel
                </button>
              </form>
            ) : (
              <h4>{folder.name}</h4>
            )}
            <div className="folder-actions">
              <FontAwesomeIcon
                icon={faEllipsis}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleOptions(folder.id);
                }}
              />
              {selectedFolderId === folder.id && (
                <div className="folder-actions-menu" ref={menuRef}>
                  <div
                    className="menu-item"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering folder expansion
                      handleFolderAction("rename", folder);
                    }}
                  >
                    <FontAwesomeIcon icon={faEdit} /> Rename
                  </div>
                  <div
                    className="menu-item"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFolderAction("createSubfolder", folder);
                    }}
                  >
                    <FontAwesomeIcon icon={faPlus} /> Add Subfolder
                  </div>
                  <div
                    className="menu-item"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFolderAction("delete", folder);
                    }}
                  >
                    <FontAwesomeIcon icon={faTrash} /> Delete
                  </div>
                </div>
              )}
            </div>
          </div>
          {expandedFolderId === folder.id && <NoteList folderId={folder.id} />}
        </div>
      ))}
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

export default Folders;
