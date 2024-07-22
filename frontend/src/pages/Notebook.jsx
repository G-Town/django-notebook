import { useState } from "react";
import Folders from "../components/Folders";
// import NoteList from "../components/NoteList";
import NoteForm from "../components/NoteForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  // faChevronDown,
  // faChevronUp,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
// import api from "../api";
import "../styles/Notebook.css";

const Notebook = () => {
  const [isWriting, setIsWriting] = useState(false);
  // const [folders, setFolders] = useState([]);
  // const [expandedFolderId, setExpandedFolderId] = useState(null);

  // useEffect(() => {
  //   getFolders();
  // }, []);

  const handleCreate = () => {
    setIsWriting(true);
  };

  const handleCloseForm = () => {
    setIsWriting(false);
  };

  // const toggleExpand = (folderId) => {
  //   setExpandedFolderId(expandedFolderId === folderId ? null : folderId);
  // };

  return (
    <div className="container">
      <button className="plus-button" onClick={handleCreate}>
        <FontAwesomeIcon icon={faPlus} />
      </button>
      {isWriting && <NoteForm closeForm={handleCloseForm} />}
      <Folders />
    </div>
  );
}

export default Notebook;
