import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {} from "@fortawesome/free-solid-svg-icons";
import api from "../api";
import "../styles/Home.css";

const Home = () => {
  const [user, setUser] = useState({});
  const [recentNotes, setRecentNotes] = useState([]);
  const [featuredFolders, setFeaturedFolders] = useState([]);

  useEffect(() => {
    // Fetch user data
    api.get("/api/user/").then((res) => setUser(res.data));
    // Fetch recent notes
    api.get("/api/recent/").then((res) => setRecentNotes(res.data));
    // Fetch featured folders
    api.get("/api/featured/").then((res) => setFeaturedFolders(res.data));
  }, []);

  return (
    <div className="container">
      <h1>Welcome back, {user.name}!</h1>
      <section className="">
        <Link to="/notebook/new/" className="btn">
          Create New Note
        </Link>
        <Link to="/notebook/import/" className="btn">
          Import Notes
        </Link>
      </section>
      <section className="">
        <h2>Recent Notes</h2>
        <ul>
          {recentNotes.map((note) => (
            <li key={note.id}>
              <Link to={`/notebook/note/${note.id}`}>{note.title}</Link>
            </li>
          ))}
        </ul>
      </section>
      <section className="">
        <h2>Featured Folders</h2>
        <ul>
          {featuredFolders.map((folder) => (
            <li key={folder.id}>
              <Link to={`/notebook/folder/${folder.id}`}>{folder.name}</Link>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2>Statistics</h2>
        <p>Notes: {user.noteCount}</p>
        <p>Folders: {user.folderCount}</p>
        <p>Tags: {user.tagCount}</p>
      </section>
      <section className="user-tips">
        <h2>Tips</h2>
        <p>Did you know you can organize your notes with tags?</p>
      </section>
    </div>
  );
};

export default Home;
