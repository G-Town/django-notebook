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
import api from "../api";
// import { getFolders } from "../services/folderService";
import "../styles/Folders.css";

// Utility functions for local storage
const saveToLocalStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};
const getFromLocalStorage = (key) => {
  const storedData = localStorage.getItem(key);
  return storedData ? JSON.parse(storedData) : null;
};

const Folders = () => {
  const [folders, setFolders] = useState([]);
  const [expandedFolderId, setExpandedFolderId] = useState(null);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [editFolderId, setEditFolderId] = useState(null);
  const [editFolderName, setEditFolderName] = useState("");
  const menuRef = useRef(null);

  useEffect(() => {
    getFolders(setFolders);
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

  const getFolders = () => {
    const cachedFolders = getFromLocalStorage("folders");
    if (cachedFolders) {
      setFolders(cachedFolders);
      console.log(cachedFolders);
    } else {
      api
        .get("/api/folders/")
        .then((res) => res.data)
        .then((data) => {
          setFolders(data);
          saveToLocalStorage("folders", data);
          console.log(data);
        })
        .catch((err) => alert(err));
    }
  };

  const toggleExpand = (folderId) => {
    setExpandedFolderId(expandedFolderId === folderId ? null : folderId);
  };

  const toggleOptions = (folderId) => {
    setSelectedFolderId(selectedFolderId === folderId ? null : folderId);
  };

  const handleFolderAction = (action, folder) => {
    if (action === "rename") {
      setEditFolderId(folder.id);
      setEditFolderName(folder.name);
    } else if (action === "delete") {
      if (
        window.confirm(
          `Are you sure you want to delete the folder "${folder.name}"?`
        )
      ) {
        api
          .delete(`/api/folders/${folder.id}/`)
          .then(() => {
            const updatedFolders = folders.filter((f) => f.id !== folder.id);
            setFolders(updatedFolders);
            saveToLocalStorage("folders", updatedFolders);
          })
          .catch((err) => alert(err));
      }
    } else if (action === "createSubfolder") {
      const subfolderName = window.prompt("Enter name for the new subfolder:");
      if (subfolderName) {
        api
          .post("/api/folders/", { name: subfolderName, parent: folder.id })
          .then((res) => {
            setFolders([...folders, res.data]);
            saveToLocalStorage("folders", [...folders, res.data]);
          })
          .catch((err) => alert(err));
      }
    }
  };

  const addNewFolder = () => {
    if (newFolderName.trim()) {
      // Call the API to create a new folder
      api
        .post("/api/folders/", { name: newFolderName.trim() })
        .then((res) => {
          setFolders([...folders, res.data]);
          setNewFolderName(""); // Clear the input
        })
        .catch((err) => alert(err));
    }
  };

  const handleRenameSubmit = (e) => {
    e.preventDefault();
    if (editFolderName.trim()) {
      api
        .put(`/api/folders/${editFolderId}/`, { name: editFolderName.trim() })
        .then((res) => {
          const updatedFolders = folders.map((folder) =>
            folder.id === editFolderId ? res.data : folder
          );
          setFolders(updatedFolders);
          saveToLocalStorage("folders", updatedFolders);
          setEditFolderId(null); // Clear the edit mode
          setEditFolderName("");
        })
        .catch((err) => alert(err));
    }
  };

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
