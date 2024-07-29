/* eslint-disable react/prop-types */
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
// import Note from "./Note";
// import NoteForm from "./NoteForm";
// import LoadingIndicator from "./LoadingIndicator";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import "../styles/NoteList.css";

const saveToLocalStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};
const getFromLocalStorage = (key) => {
  const storedData = localStorage.getItem(key);
  return storedData ? JSON.parse(storedData) : null;
};

const NoteList = ({ folderId }) => {
  const [notes, setNotes] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  // const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // useCallback to ensure that getNotes only changes when dependancies change
  const getNotes = useCallback(() => {
    const cachedNotes = getFromLocalStorage(`notes_${folderId}`);
    if (cachedNotes) {
      setNotes(cachedNotes);
      console.log("retrieved cached notes");
    } else {
      api
        .get(`/api/notes/?folder=${folderId}`)
        .then((res) => res.data)
        .then((data) => {
          const reversedData = data.reverse();
          setNotes(reversedData);
          saveToLocalStorage(`notes_${folderId}`, reversedData);
          console.log("fetched notes from API");
        })
        .catch((err) => alert(err));
    }
  }, [folderId]);

  useEffect(() => {
    getNotes();
  }, [getNotes]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleEdit = (id) => {
    navigate(`/note/${id}`);
  };

  const handleDelete = (id) => {
    api
      .delete(`/api/notes/${id}/`)
      .then((res) => {
        if (res.status === 204) {
          const updatedNotes = notes.filter((note) => note.id !== id);
          setNotes(updatedNotes);
          saveToLocalStorage(`notes_${folderId}`, updatedNotes);
        } else {
          alert("Failed to delete.");
        }
      })
      .catch((err) => alert(err));
  };

  // if (loading) {
  //   return <LoadingIndicator />;
  // }

  return (
    <div className="note-list">
      {notes.map((note) => {
        const date = new Date(note.created_at).toLocaleDateString("en-US");
        return (
          // <Note key={note.id} note={note} onDelete={handleDelete} />
          <div key={note.id} className="note-container" onClick={toggleExpand}>
            <div className="note-header">
              <p className="note-title">{note.title}</p>
              <p className="note-date">{date}</p>
            </div>
            <p className="note-content">
              {isExpanded ? note.content : note.snippet}
            </p>
            <div className="note-actions">
              <button onClick={() => handleEdit(note.id)}>
                <FontAwesomeIcon icon={faEdit} />
              </button>
              <button onClick={handleDelete}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NoteList;
