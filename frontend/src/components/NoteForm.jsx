/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import api from "../api";
import LoadingIndicator from "./LoadingIndicator";
import "../styles/NoteForm.css";

function NoteForm({ noteID, closeForm }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [folder, setFolder] = useState("");
  const [folders, setFolders] = useState([]);
  const [newFolderName, setNewFolderName] = useState("");
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // fetch the list of folders
    api
      .get("/api/folders/")
      .then((res) => res.data)
      .then((data) => {
        setFolders(data);
        console.log("🚀 ~ useEffect ~ folders:", data);
      })
      .catch((err) => alert(err));

    if (noteID) {
      // add note data to form for editing
      api
        .get(`/api/notes/${noteID}/`)
        .then((res) => res.data)
        .then((data) => {
          setTitle(data.title);
          setContent(data.content);
          setFolder(data.folder || "");
          console.log("🚀 ~ useEffect ~ data:", data);
        })
        .catch((err) => alert(err));
    } else {
      // new empty form
      setTitle("");
      setContent("");
      setFolder("");
    }
  }, [noteID]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = { title, content, folder: folder || null };
    try {
      if (noteID) {
        // note has been selected for editing
        await api.patch(`/api/notes/${noteID}/`, data);
      } else {
        // writing new note
        await api.post("/api/notes/", data);
      }
      closeForm();
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/api/folders/", { name: newFolderName });
      setFolders([...folders, response.data]);
      setNewFolderName("");
      setShowFolderModal(false);
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
        <label htmlFor="folder">Folder:</label>
        <select
          id="folder"
          value={folder}
          onChange={(e) => setFolder(e.target.value)}
        >
          <option value="">Unfiled</option>
          {folders.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => setShowFolderModal(true)}
          className="create-folder-button"
        >
          New Folder
        </button>
        {loading && <LoadingIndicator />}
        <button type="submit">Save</button>
        <button type="button" onClick={closeForm}>
          Cancel
        </button>
      </form>
      {showFolderModal && (
        <div className="folder-modal">
          <form onSubmit={handleCreateFolder}>
            <label htmlFor="new-folder-name">New Folder Name:</label>
            <input
              type="text"
              id="new-folder-name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
            />
            <button type="submit">Create</button>
            <button type="button" onClick={() => setShowFolderModal(false)}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default NoteForm;
