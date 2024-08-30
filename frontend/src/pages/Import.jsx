import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import api from "../api";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import appleLogo from "../assets/apple-14.svg";
import googleLogo from "../assets/google-g-2015.svg";
import importService from "../services/importService";
import "../styles/Import.css";

function Import() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImportClick = async (source) => {
    setIsLoading(true);
    setError(null);

    const result = await importService.handleImportClick(source);

    if (result.success) {
      alert(result.message);
      navigate("/notebook");
    } else {
      setError(result.message);
    }

    setIsLoading(false);
  };

  return (
    <div className="import-container">
      <h1>Import Notes</h1>
      <p>Select a source to import your notes from:</p>
      <div className="import-options">
        <div
          className={`import-option ${isLoading ? "disabled" : ""}`}
          onClick={() => !isLoading && handleImportClick("Apple Notes")}
        >
          <img src={appleLogo} alt="Apple Notes" />
          <span>Apple Notes</span>
        </div>
        <div
          className="import-option"
          onClick={() => handleImportClick("Google Keep")}
        >
          <img src={googleLogo} alt="Google Keep" />
          <span>Google Keep</span>
        </div>
        {/* Add more options as needed */}
      </div>
      {isLoading && <p>Importing notes... This may take a few moments.</p>}
      {error && <p className="error-message">{error}</p>}
      <button
        className="import-cancel"
        onClick={() => navigate("/notebook")}
        disabled={isLoading}
      >
        Cancel
      </button>
    </div>
  );
}

export default Import;
