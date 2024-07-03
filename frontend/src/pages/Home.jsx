import { useState, useEffect } from "react";
import NoteList from "../components/NoteList";
import NoteForm from "../components/NoteForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import api from "../api";
import "../styles/Home.css";

function Home() {
  const [isWriting, setIsWriting] = useState(false);
  const [folders, setFolders] = useState([]);

  useEffect(() => {
    getFolders();
  }, []);

  const getFolders = () => {
    api
      .get("/api/folders/")
      .then((res) => res.data)
      .then((data) => {
        setFolders(data);
        console.log(data);
      })
      .catch((err) => alert(err));
  };

  const handleCreate = () => {
    setIsWriting(true);
  };

  const handleCloseForm = () => {
    setIsWriting(false);
  };

  return (
    <div>
      <div className="container">
        <button className="plus-button" onClick={handleCreate}>
          <FontAwesomeIcon icon={faPlus} />
        </button>
        {isWriting && <NoteForm closeForm={handleCloseForm} />}
        {folders.map((folder) => (
          <NoteList key={folder.id} folder={folder} />
        ))}
      </div>
    </div>
  );
}

export default Home;
