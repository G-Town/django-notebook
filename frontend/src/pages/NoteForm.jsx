/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import LoadingIndicator from "../components/LoadingIndicator";
import "../styles/NoteForm.css";

function NoteForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const { noteID } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (noteID) {
      api
        .get(`/api/notes/${noteID}/`)
        .then((res) => res.data)
        .then((data) => {
          setTitle(data.title);
          setContent(data.content);
          // console.log("🚀 ~ useEffect ~ data:", data);
        })
        .catch((err) => alert(err));
    } else {
      setTitle("");
      setContent("");
    }
  }, [noteID]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = { title, content };
    try {
      if (noteID) {
        await api.patch(`/api/notes/${noteID}/`, data);
      } else {
        await api.post("/api/notes/", data);
      }
      navigate("/");
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
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
      {loading && <LoadingIndicator />}
      <button type="submit">Save</button>
      <button type="button" onClick={() => navigate("/")}>
        Cancel
      </button>
    </form>
  );
}

export default NoteForm;
