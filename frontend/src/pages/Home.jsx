import { useState } from "react";
import NoteList from "../components/NoteList";
import NoteForm from "../components/NoteForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
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
        {/* <h2>Write Note</h2> */}
        <button className="plus-button" onClick={handleCreate}>
          <FontAwesomeIcon icon={faPlus} />
        </button>
        {isWriting && <NoteForm closeForm={handleCloseForm} />}
        <NoteList></NoteList>
      </div>
    </div>
  );
}

export default Home;
