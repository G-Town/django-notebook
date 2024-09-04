import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getNotesByFolder } from "../services/noteService";
// import { useNotebook } from "../context/NotebookContext.js";
import PropTypes from 'prop-types';
import "../styles/NoteList.css";
// import PropTypes from "prop-types";

const NoteList = ({ folderId }) => {
  // const { selectedFolderId } = useNotebook();
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
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
      } else {
        setNotes([]);
      }
    };

    loadNotes();
  }, [folderId]);

  if (isLoading) {
    return <div>Loading notes...</div>;
  }

  if (!folderId) {
    return <div>Select a folder to view notes</div>;
  }

  return (
    <div className="note-list">
      <h2>Notes</h2>
      {notes.length === 0 ? (
        <p>No notes in this folder</p>
      ) : (
        <ul>
          {notes.map((note) => (
            <li key={note.id}>
              <Link to={`/note/${note.id}`}>
                <h3>{note.title}</h3>
                <p>{note.content.substring(0, 100)}...</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

NoteList.propTypes = {
  folderId: PropTypes.string
};

export default NoteList;
