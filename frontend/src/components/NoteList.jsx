/* eslint-disable react/prop-types */
import { useCallback, useEffect, useState } from "react";
import api from "../api";
import Note from "./Note";
// import NoteForm from "./NoteForm";
// import LoadingIndicator from "./LoadingIndicator";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import "../styles/NoteList.css";

const NoteList = ({ folderID }) => {
  const [notes, setNotes] = useState([]);
  const [notesCache, setNotesCache] = useState({});
  // const [isExpanded, setIsExpanded] = useState(false);
  // const [loading, setLoading] = useState(true);

  // useCallback to ensure that getNotes only changes when dependancies change
  const getNotes = useCallback(() => {
    if (notesCache[folderID]) {
      setNotes(notesCache[folderID]);
      console.log("retrieved cached notes")
    } else {
      // setLoading(true);
      api
        .get(`/api/notes/?folder=${folderID}`)
        .then((res) => res.data)
        .then((data) => {
          const reversedData = data.reverse();
          setNotes(reversedData);
          console.log(data);
          // update cache
          setNotesCache((prevCache) => ({
            ...prevCache,
            [folderID]: reversedData,
          }));
          // setLoading(false);
        })
        .catch((err) => {
          alert(err);
          // setLoading(false);
        });
    }
  }, [folderID, notesCache]);

  useEffect(() => {
    getNotes();
  }, [getNotes]);

  // const toggleExpand = () => {
  //   setIsExpanded(!isExpanded);
  // };

  const handleDelete = (id) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
    // update cache after deletion
    setNotesCache((prevCache) => ({
      ...prevCache,
      [folderID]: updatedNotes,
    }));
  };

  // if (loading) {
  //   return <LoadingIndicator />;
  // }

  return (
    <div className="note-list">
      {notes.map((note) => (
        <Note key={note.id} note={note} onDelete={handleDelete} />
      ))}
    </div>
  );
};

export default NoteList;
