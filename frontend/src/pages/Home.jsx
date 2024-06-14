import { useEffect, useState } from "react";
import api from "../api";
import Note from "../components/Note";
import NoteForm from "../components/NoteForm";
import "../styles/Home.css";

function Home() {
  const [notes, setNotes] = useState([]);
  const [noteID, setNoteID] = useState(null);
  const [isWriting, setIsWriting] = useState(false);

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
    setIsWriting(true);
  };

  const handleCreate = () => {
    setNoteID(null);
    setIsWriting(true);
  };

  const handleCloseForm = () => {
    setIsWriting(false);
    setNoteID(null);
    getNotes();
  };

  return (
    <div>
      <div>
        <h2>Create a Note</h2>
        <button onClick={handleCreate}>New Note</button>
        {isWriting && <NoteForm noteID={noteID} closeForm={handleCloseForm} />}
        <h2>Notes</h2>
        {notes.map((note) => (
          <Note
            note={note}
            onEdit={handleEdit}
            onDelete={deleteNote}
            key={note.id}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;
