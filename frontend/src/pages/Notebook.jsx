// import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import Folders from "../components/Folders";
import FolderTree from "../components/FolderTree";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  // faChevronDown,
  // faChevronUp,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
// import api from "../api";
import "../styles/Notebook.css";

const Notebook = () => {
  const navigate = useNavigate();

  const handleCreate = () => {
    navigate(`/note/new`);
    // setIsWriting(true);
  };

  // const handleCloseForm = () => {
  //   setIsWriting(false);
  // };

  // const toggleExpand = (folderId) => {
  //   setExpandedFolderId(expandedFolderId === folderId ? null : folderId);
  // };

  return (
    <div className="container">
      <button className="plus-button" onClick={handleCreate}>
        <FontAwesomeIcon icon={faPlus} />
      </button>
      <FolderTree />
    </div>
  );
}

export default Notebook;
