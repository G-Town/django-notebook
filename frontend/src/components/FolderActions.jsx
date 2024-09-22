import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsis,
  faEdit,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import {
  updateFolder,
  deleteFolder,
  createFolder,
} from "../services/folderService";
import PropTypes from "prop-types";
import "../styles/FolderActions.css";

const FolderActions = ({ folder, isMenuOpen, setIsMenuOpen, loadFolders }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editFolderName, setEditFolderName] = useState(folder.name);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOut = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOut);
    return () => {
      document.removeEventListener("mousedown", handleClickOut);
    };
  }, [setIsMenuOpen]);

  const toggleMenu = (e) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const handleFolderAction = async (action) => {
    setIsMenuOpen(false);
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
          loadFolders();
        } catch (error) {
          console.error("Error deleting folder:", error);
        }
      }
    } else if (action === "createSubfolder") {
      const subfolderName = window.prompt("Enter name for the new subfolder:");
      if (subfolderName) {
        try {
          await createFolder({ name: subfolderName, parent: folder.id });
          loadFolders();
        } catch (error) {
          console.error("Error creating subfolder:", error);
        }
      }
    }
  };

  const handleRenameSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (editFolderName.trim()) {
      try {
        await updateFolder(folder.id, { name: editFolderName.trim() });
        setIsEditing(false);
        loadFolders();
      } catch (error) {
        console.error("Error renaming folder:", error);
      }
    }
  };

  return (
    <div
      className={`folder-actions ${isMenuOpen ? "menu-open" : ""}`}
      onClick={(e) => e.stopPropagation()}
    >
      <FontAwesomeIcon
        icon={faEllipsis}
        size="sm"
        onClick={toggleMenu}
        className={isMenuOpen ? "active" : ""}
      />
      {isMenuOpen && (
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
      {isEditing && (
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
      )}
    </div>
  );
};

FolderActions.propTypes = {
  folder: PropTypes.object,
  loadFolders: PropTypes.func,
  isMenuOpen: PropTypes.bool,
  setIsMenuOpen: PropTypes.func,
};

export default FolderActions;
