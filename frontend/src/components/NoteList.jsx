import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Link } from "react-router-dom";
import { getNotesByFolder } from "../services/noteService";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
// import api from "../api";
import PropTypes from "prop-types";
import "../styles/NoteList.css";

const NoteList = ({ folderId, onNoteSelect, selectedNoteId }) => {
  const [notes, setNotes] = useState([]);
  // const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  // const navigate = useNavigate();

  useEffect(() => {
    const loadNotes = async () => {
      if (folderId) {
        // console.log("🚀 ~ loadNotes ~ folderId:", folderId);
        setIsLoading(true);
        try {
          const fetchedNotes = await getNotesByFolder(folderId);
          // console.log("🚀 ~ loadNotes ~ fetchedNotes:", fetchedNotes);
          setNotes(fetchedNotes);
        } catch (error) {
          console.error("Error loading notes:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setNotes([]);
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

  const handleNoteClick = (note) => {
    // setSelectedNoteId(note.id);
    onNoteSelect(note);
  };

  if (isLoading) {
    return <div>Loading notes...</div>;
  }

  return (
    <div className="note-list-container">
      {!folderId ? (
        <div>Select a folder to view notes</div>
      ) : notes.length === 0 ? (
        <p>Empty</p>
      ) : (
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
              onClick={() => handleNoteClick(note)}
            >
              <div className="note-header">
                <p>{note.title}</p>
                {/* <p className="note-date">{date}</p> */}
              </div>
              <p className="note-snippet">{note.snippet}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

NoteList.propTypes = {
  folderId: PropTypes.number,
  onNoteSelect: PropTypes.func.isRequired,
  selectedNoteId: PropTypes.number
};

export default NoteList;
