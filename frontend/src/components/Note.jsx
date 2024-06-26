/* eslint-disable react/prop-types */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import "../styles/Note.css";

function Note({ note, onEdit, onDelete, onClick, isExpanded }) {
  const formattedDate = new Date(note.created_at).toLocaleDateString("en-US");

  return (
    <div className="note-container" onClick={onClick}>
      <p className="note-title">{note.title}</p>
      <p>{isExpanded ? note.content : note.snippet}</p>
      <p className="note-date">{formattedDate}</p>
      <div className="note-actions">
        <button onClick={() => onEdit(note.id)}>
          <FontAwesomeIcon icon={faEdit} />
        </button>
        <button onClick={() => onDelete(note.id)}>
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    </div>
  );
}

export default Note;
