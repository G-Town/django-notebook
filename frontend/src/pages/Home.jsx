import { useState } from "react";
// import api from "../api";
// import Note from "../components/Note";
import NoteList from "../components/NoteList";
import NoteForm from "../components/NoteForm";
import "../styles/Home.css";

function Home() {
  const [isWriting, setIsWriting] = useState(false);

  const handleCreate = () => {
    setIsWriting(true);
  };

  const handleCloseForm = () => {
    setIsWriting(false);
  };

  return (
    <div>
      <div className="container">
        <h2>Create Note</h2>
        <button onClick={handleCreate}>New Note</button>
        {isWriting && <NoteForm closeForm={handleCloseForm} />}
        <NoteList></NoteList>
      </div>
    </div>
  );
}

export default Home;
