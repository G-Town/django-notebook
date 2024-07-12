/* eslint-disable react/prop-types */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/Note.css";

function Note({ note, onDelete }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const formattedDate = new Date(note.created_at).toLocaleDateString("en-US");

  const handleEdit = () => {
    navigate(`/note/${note.id}`);
  };

  const handleDelete = () => {
    api
      .delete(`/api/notes/${note.id}/`)
      .then((res) => {
        if (res.status === 204) {
          alert("Note deleted!");
          onDelete(note.id);
        } else {
          alert("Failed to delete.");
        }
      })
      .catch((err) => alert(err));
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="note-container" onClick={toggleExpand}>
      <p className="note-title">{note.title}</p>
      <p>{isExpanded ? note.content : note.snippet}</p>
      <p className="note-date">{formattedDate}</p>
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
