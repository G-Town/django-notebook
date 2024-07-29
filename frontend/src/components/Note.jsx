/* eslint-disable react/prop-types */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import api from "../api";
import "../styles/Note.css";

function Note({ note, onDelete }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const formattedDate = new Date(note.created_at).toLocaleDateString("en-US");

  const handleEdit = () => {
    navigate(`/note/${note.id}`);
  };

  const handleDelete = () => {
    onDelete(note.id);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="note-container" onClick={toggleExpand}>
      <div className="note-header">
        <p className="note-title">{note.title}</p>
        <p className="note-date">{formattedDate}</p>
      </div>
      <p className="note-content">{isExpanded ? note.content : note.snippet}</p>
      <div className="note-actions">
        <button onClick={handleEdit}>
          <FontAwesomeIcon icon={faEdit} />
        </button>
        <button onClick={handleDelete}>
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    </div>
  );
}

export default Note;
