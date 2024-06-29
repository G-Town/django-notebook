import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Note from "./Note";
// import NoteForm from "./NoteForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import "../styles/NoteList.css";

const NoteList = () => {
  const [notes, setNotes] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedNoteId, setExpandedNoteId] = useState(null);
  // const [expandedNoteContent, setExpandedNoteContent] = useState("");
  // const [noteID, setNoteID] = useState(null);
  // const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getNotes();
  }, []);

  const getNotes = () => {
    api
      .get("/api/notes/")
      .then((res) => res.data)
      .then((data) => {
        setNotes(data.reverse());
        console.log(data);
      })
      .catch((err) => alert(err));
  };

  const deleteNote = (id) => {
    api
      .delete(`/api/notes/delete/${id}/`)
      .then((res) => {
        if (res.status === 204) alert("Note deleted!");
        else alert("Failed to delete.");
        getNotes();
      })
      .catch((err) => alert(err));
  };

  const handleEdit = (noteID) => {
    navigate(`/note/${noteID}`);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleNoteClick = (noteID) => {
    if (expandedNoteId === noteID) {
      setExpandedNoteId(null);
    } else {
      setExpandedNoteId(noteID);
    }
  };

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div className="note-list-container">
      <div className="folder-name" onClick={toggleExpand}>
        <h2>{isExpanded ? "Notes" : "Notes"}</h2>
        <FontAwesomeIcon icon={isExpanded ? faChevronUp : faChevronDown} />
      </div>
      {isExpanded && (
        <div className="note-list">
          {notes.map((note) => (
            <Note
              key={note.id}
              note={note}
              onEdit={handleEdit}
              onDelete={deleteNote}
              onClick={() => handleNoteClick(note.id)}
              isExpanded={expandedNoteId === note.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NoteList;
