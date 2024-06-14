/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import api from "../api";

function NoteForm({ noteID, closeForm }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (noteID) {
      // add note data to form for editing
      api.get(`/api/notes/${noteID}/`)
        .then(res => res.data)
        .then(data => {
          setTitle(data.title);
          setContent(data.content);
          console.log("🚀 ~ useEffect ~ data:", data)
        })
        .catch(err => alert(err));
    } else {
      // new empty form
      setTitle("");
      setContent("");
    }
  }, [noteID]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { title, content };
    try {
      if (noteID) {
      // note has been selected for editing
        await api.patch(`/api/notes/update/${noteID}/`, data);
      } else {
      // writing new note
        await api.post("/api/notes/", data);
      }
      closeForm();
    } catch (error) {
      alert(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="note-form">
      <label htmlFor="title">Title:</label>
      <input
        type="text"
        id="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <label htmlFor="content">Content:</label>
      <textarea
        id="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button type="submit">Save</button>
      <button type="button" onClick={closeForm}>
        Cancel
      </button>
    </form>
  );
}

export default NoteForm;