/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
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
  updateFolder,
  deleteFolder,
  createFolder,
} from "../services/folderService";

const Folder = ({
  folder,
  expandedFolderId,
  setExpandedFolderId,
  selectedFolderId,
  setSelectedFolderId,
  children,
}) => {
  const [editFolderName, setEditFolderName] = useState(folder.name);
  const [isEditing, setIsEditing] = useState(false);
  const menuRef = useRef(null);

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
  }, [setSelectedFolderId]);

  const toggleExpand = () => {
    setExpandedFolderId(expandedFolderId === folder.id ? null : folder.id);
  };

  const toggleOptions = (e) => {
    e.stopPropagation();
    setSelectedFolderId(selectedFolderId === folder.id ? null : folder.id);
  };

  const handleFolderAction = async (action) => {
    if (action === "rename") {
      setIsEditing(true);
    } else if (action === "delete") {
      if (
        window.confirm(
          `Are you sure you want to delete the folder "${folder.name}"?`
        )
      ) {
        try {
          await deleteFolder(folder.id);
          // You might want to trigger a re-fetch of folders here
        } catch (error) {
          console.error("Error deleting folder:", error);
        }
      }
    } else if (action === "createSubfolder") {
      const subfolderName = window.prompt("Enter name for the new subfolder:");
      if (subfolderName) {
        try {
          await createFolder({ name: subfolderName, parent: folder.id });
          // You might want to trigger a re-fetch of folders here
        } catch (error) {
          console.error("Error creating subfolder:", error);
        }
      }
    }
  };

  const handleRenameSubmit = async (e) => {
    e.preventDefault();
    if (editFolderName.trim()) {
      try {
        await updateFolder(folder.id, { name: editFolderName.trim() });
        setIsEditing(false);
        // You might want to trigger a re-fetch of folders here
      } catch (error) {
        console.error("Error renaming folder:", error);
      }
    }
  };

  return (
    <div
      className={`folder-container ${
        selectedFolderId === folder.id ? "active-folder" : ""
      }`}
    >
      <div className="folder-card" onClick={toggleExpand}>
        <FontAwesomeIcon
          className="folder-icon"
          icon={expandedFolderId === folder.id ? faFolderOpen : faFolderClosed}
        />
        {isEditing ? (
          <form onSubmit={handleRenameSubmit}>
            <input
              type="text"
              value={editFolderName}
              onChange={(e) => setEditFolderName(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
            <button type="submit">Save</button>
            <button type="button" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          </form>
        ) : (
          <h4>{folder.name}</h4>
        )}
        <div className="folder-actions">
          <FontAwesomeIcon icon={faEllipsis} onClick={toggleOptions} />
          {selectedFolderId === folder.id && (
            <div className="folder-actions-menu" ref={menuRef}>
              <div
                className="menu-item"
                onClick={() => handleFolderAction("rename")}
              >
                <FontAwesomeIcon icon={faEdit} /> Rename
              </div>
              <div
                className="menu-item"
                onClick={() => handleFolderAction("createSubfolder")}
              >
                <FontAwesomeIcon icon={faPlus} /> Add Subfolder
              </div>
              <div
                className="menu-item"
                onClick={() => handleFolderAction("delete")}
              >
                <FontAwesomeIcon icon={faTrash} /> Delete
              </div>
            </div>
          )}
        </div>
      </div>
      {expandedFolderId === folder.id && (
        <>
          <NoteList folderId={folder.id} />
          {children}
        </>
      )}
    </div>
  );
};

export default Folder;
