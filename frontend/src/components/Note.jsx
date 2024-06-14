/* eslint-disable react/prop-types */
// import { useState } from "react";
// import NoteForm from "./NoteForm";
import "../styles/Note.css";

function Note({ note, onEdit, onDelete }) {

  const formattedDate = new Date(note.created_at).toLocaleDateString("en-US")

  return (
    <div className="note-container">
      <p className="note-title">{note.title}</p>
      <p className="note-content">{note.content}</p>
      <p className="note-date">{formattedDate}</p>
      <button className="edit-button" onClick={() => onEdit(note.id)}>Edit</button>
      <button className="delete-button" onClick={() => onDelete(note.id)}>Delete</button>
    </div>
  );
}

export default Note;
