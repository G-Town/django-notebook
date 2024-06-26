import { useEffect, useState } from "react";
import api from "../api";
import Note from "./Note";
import NoteForm from "./NoteForm";
// import "../styles/NoteList.css";

const NoteList = () => {
  
  const [notes, setNotes] = useState([]);
  const [noteID, setNoteID] = useState(null);
  // const [loading, setLoading] = useState(true);

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
    setNoteID(noteID);
    console.log("🚀 ~ handleEdit ~ noteID:", noteID);
  };

  const handleCloseForm = () => {
    setNoteID(null);
    getNotes();
  };

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div className="note-list">
        <h2>Notes</h2>
        {notes.map((note) => (
          noteID === note.id ? (
            <NoteForm
              key={note.id}
              noteID={note.id}
              closeForm={handleCloseForm}
            />
          ) : (
            <Note
              key={note.id}
              note={note}
              onEdit={handleEdit}
              onDelete={deleteNote}
            />
          )
        ))}
    </div>
  );
};

export default NoteList;
