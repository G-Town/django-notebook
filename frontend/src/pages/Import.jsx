import { useNavigate } from "react-router-dom";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import appleLogo from '../assets/apple-14.svg';
import googleLogo from "../assets/google-g-2015.svg"
import "../styles/Import.css";

function Import() {
  const navigate = useNavigate();

  const handleImportClick = (source) => {
    // Placeholder for actual import logic
    alert(`Importing from ${source} is not implemented yet.`);
    // You can navigate to a different route if needed
    // navigate("/path-to-import-flow");
  };

  return (
    <div className="import-container">
      <h1>Import Notes</h1>
      <p>Select a source to import your notes from:</p>
      <div className="import-options">
        <div className="import-option" onClick={() => handleImportClick("Apple Notes")}>
          <img src={appleLogo} alt="Apple Notes" />
          <span>Apple Notes</span>
        </div>
        <div className="import-option" onClick={() => handleImportClick("Google Keep")}>
          <img src={googleLogo} alt="Google Keep" />
          <span>Google Keep</span>
        </div>
        {/* Add more options as needed */}
      </div>
      <button className="import-cancel" onClick={() => navigate("/notebook")}>
        Cancel
      </button>
    </div>
  );
}

export default Import;
