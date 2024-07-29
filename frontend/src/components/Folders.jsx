import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolderOpen,
  faFolderClosed,
} from "@fortawesome/free-solid-svg-icons";
import NoteList from "./NoteList";
// import Note from "./Note";
import api from "../api";
import "../styles/Folders.css";

// Utility functions for local storage
const saveToLocalStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};
const getFromLocalStorage = (key) => {
  const storedData = localStorage.getItem(key);
  return storedData ? JSON.parse(storedData) : null;
}

const Folders = () => {
  const [folders, setFolders] = useState([]);
  const [expandedFolderId, setExpandedFolderId] = useState(null);

  useEffect(() => {
    getFolders();
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

  return (
    <div className="folder-list">
      {folders.map((folder) => (
        <div key={folder.id}>
          <div className="folder-card" onClick={() => toggleExpand(folder.id)}>
            <FontAwesomeIcon
              className="folder-icon"
              icon={
                expandedFolderId === folder.id ? faFolderOpen : faFolderClosed
              }
            />
            <h4>{folder.name}</h4>
          </div>
          {expandedFolderId === folder.id && <NoteList folderId={folder.id} />}
        </div>
      ))}
    </div>
  );
};

export default Folders;
