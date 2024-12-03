import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Link } from "react-router-dom";
import { getNotesByFolder } from "../services/noteService";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
// import api from "../api";
import PropTypes from "prop-types";
import "../styles/NoteList.css";

const NoteList = ({ folderId, handleNoteSelect, selectedNoteId }) => {
  const [notes, setNotes] = useState([]);
  // const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  // const navigate = useNavigate();

  useEffect(() => {
    // defined inside hook to minimize re-rendering
    const loadNotes = async () => {
      if (folderId) {
        setIsLoading(true);
        try {
          const fetchedNotes = await getNotesByFolder(folderId);
          setNotes(fetchedNotes);
        } catch (error) {
          console.error("Error loading notes:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadNotes();
  }, [folderId]);

  // const handleEdit = (id) => {
  //   navigate(`/note/${id}`);
  // };

  // const handleDelete = (id) => {
  //   api
  //     .delete(`/api/notes/${id}/`)
  //     .then((res) => {
  //       if (res.status === 204) {
  //         const updatedNotes = notes.filter((note) => note.id !== id);
  //         setNotes(updatedNotes);
  //         // saveToLocalStorage(`notes_${folderId}`, updatedNotes);
  //       } else {
  //         alert("Failed to delete.");
  //       }
  //     })
  //     .catch((err) => alert(err));
  // };

  // const handleNoteClick = (note) => {
  //   // setSelectedNoteId(note.id);
  //   onNoteSelect(note);
  // };

  if (!folderId) {
    return <div>Select a folder to view notes</div>;
  }

  if (notes.length === 0) {
    return <p>Empty</p>;
  }

  if (isLoading) {
    return <div>Loading notes...</div>;
  }

  return (
    <div className="note-list">
      {notes.map((note) => (
        // TODO: sort notes by most recent edit and add line dividing notes
        // const date = new Date(note.created_at).toLocaleDateString("en-US");
        // <Note key={note.id} note={note} onDelete={handleDelete} />
        <div
          key={note.id}
          className={`note-container ${
            selectedNoteId === note.id ? "selected" : ""
          }`}
          onClick={() => handleNoteSelect(note.id)}
        >
          <div className="note-header">
            <p>{note.title}</p>
            {/* <p className="note-date">{date}</p> */}
          </div>
          <p className="note-snippet">{note.snippet}</p>
        </div>
      ))}
    </div>
  );
};

NoteList.propTypes = {
  folderId: PropTypes.number,
  handleNoteSelect: PropTypes.func,
  selectedNoteId: PropTypes.number,
};

export default NoteList;
