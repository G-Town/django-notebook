/* eslint-disable react/prop-types */
import { useCallback, useEffect, useState } from "react";
import api from "../api";
import Note from "./Note";
// import NoteForm from "./NoteForm";
// import LoadingIndicator from "./LoadingIndicator";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import "../styles/NoteList.css";

const NoteList = ({ folderId }) => {
  const [notes, setNotes] = useState([]);
  // const [isExpanded, setIsExpanded] = useState(false);
  // const [loading, setLoading] = useState(true);

  // useCallback to ensure that getNotes only changes when dependancies change
  const getNotes = useCallback(() => {
    // setLoading(true);
    api
      .get(`/api/notes/?folder=${folderId}`)
      .then((res) => res.data)
      .then((data) => {
        setNotes(data.reverse());
        console.log(data);
        // setLoading(false);
      })
      .catch((err) => {
        alert(err);
        // setLoading(false);
      });
  }, [folderId]);

  useEffect(() => {
    getNotes();
  }, [getNotes]);

  // const toggleExpand = () => {
  //   setIsExpanded(!isExpanded);
  // };

  const handleDelete = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
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
