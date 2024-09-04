import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import Folders from "../components/Folders";
import FolderTree from "../components/FolderTree";
import NoteList from "../components/NoteList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
// import api from "../api";
import "../styles/Notebook.css";

const Notebook = () => {
  const navigate = useNavigate();
  const [selectedFolderId, setSelectedFolderId] = useState(null);

  const handleCreate = () => {
    navigate(`/note/new`);
  };

  return (
    <div className="container">
      <button className="plus-button" onClick={handleCreate}>
        <FontAwesomeIcon icon={faPlus} />
      </button>
      <FolderTree
        selectedFolderId={selectedFolderId}
        onSelectFolder={setSelectedFolderId}
      />
      <NoteList folderId={selectedFolderId} />
    </div>
  );
};

export default Notebook;
