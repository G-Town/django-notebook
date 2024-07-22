import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronUp,
  faChevronDown,
  faFolder,
  faFolderBlank,
  faFolderOpen,
  faFolderClosed,
} from "@fortawesome/free-solid-svg-icons";
// import NoteList from "./NoteList";
import Note from "./Note";
import api from "../api";
import "../styles/Folders.css";

const Folders = () => {
  const [folders, setFolders] = useState([]);
  // const [notes, setNotes] = useState([]);
  const [expandedFolderId, setExpandedFolderId] = useState(null);
  // TODO: try caching notes
  const [folderNotes, setFolderNotes] = useState([]);

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

  const getNotes = (folderId) => {
    api
      .get(`/api/notes/?folder=${folderId}`)
      .then((res) => res.data)
      .then((data) => {
        // setFolderNotes((prevNotes) => ({ ...prevNotes, [folderId]: data.reverse() }));
        const reversedData = data.reverse();
        setFolderNotes(reversedData);
        console.log(data);
      })
      .catch((err) => alert(err));
  };

  const toggleExpand = (folderId) => {
    // setExpandedFolderId(expandedFolderId === folderId ? null : folderId);
    if (expandedFolderId === folderId) {
      setExpandedFolderId(null);
    } else {
      if (!folderNotes[folderId]) {
        getNotes(folderId);
      }
      setExpandedFolderId(folderId);
    }
  };

  return (
    <div className="container">
      {folders.map((folder) => (
        <div key={folder.id}>
          <div className="folder-card" onClick={() => toggleExpand(folder.id)}>
            <FontAwesomeIcon icon={faFolderClosed} />
            <h3>{folder.name}</h3>
            <FontAwesomeIcon
              icon={
                expandedFolderId === folder.id ? faChevronUp : faChevronDown
              }
            />
          </div>
          {/* {expandedFolderId === folder.id && <NoteList folderID={folder.id} />} */}
          {expandedFolderId === folder.id && (
            <div className="note-list">
              {folderNotes.map((note) => (
                <Note key={note.id} note={note} />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Folders;
