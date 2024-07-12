import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import NoteList from "./NoteList";
import api from "../api";
import "../styles/Folders.css";

const Folders = () => {
  const [folders, setFolders] = useState([]);
  const [expandedFolderId, setExpandedFolderId] = useState(null);
  // TODO: try caching notes

  useEffect(() => {
    getFolders();
  }, []);

  const getFolders = () => {
    api
      .get("/api/folders/")
      .then((res) => res.data)
      .then((data) => {
        setFolders(data);
        console.log(data);
      })
      .catch((err) => alert(err));
  };

  const toggleExpand = (folderId) => {
    setExpandedFolderId(expandedFolderId === folderId ? null : folderId);
  };

  return (
    <div>
      {folders.map((folder) => (
        <div key={folder.id} className="container">
          <div className="folder-name" onClick={() => toggleExpand(folder.id)}>
            <h3>{folder.name}</h3>
            <FontAwesomeIcon icon={expandedFolderId === folder.id ? faChevronUp : faChevronDown} />
          </div>
          {expandedFolderId === folder.id && <NoteList folderId={folder.id} />}
        </div>
      ))}
    </div>
  );
};

export default Folders;