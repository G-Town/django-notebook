import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  // faHome,
  faBook,
  faUpload,
  faPlus,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import "../styles/Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">{"logo"}</div>
      <nav className="sidebar-nav">
        {/* <Link to="/" className="sidebar-nav-item">
          <FontAwesomeIcon icon={faHome} /> Home
        </Link> */}
        <Link to="/notebook" className="sidebar-nav-item">
          <FontAwesomeIcon icon={faBook} /> Notebook
        </Link>
        <Link to="/create" className="sidebar-nav-item">
          <FontAwesomeIcon icon={faPlus} /> Write
        </Link>
        <Link to="/import" className="sidebar-nav-item">
          <FontAwesomeIcon icon={faUpload} /> Import
        </Link>
        
      </nav>
      <div className="sidebar-footer">
        <button className="logout-button">
          <FontAwesomeIcon icon={faSignOutAlt} /> Logout
        </button>
      </div>
      {/* TODO: 
        Search Notes: A search bar to quickly find notes.
        Tags: Filter notes by tags.
        Archived Notes: A section for notes that are archived but not deleted.
        Settings: A link to a settings page where users can customize their experience.
        Profile: A link to a user profile page.
      */}
    </div>
  );
};

export default Sidebar;
