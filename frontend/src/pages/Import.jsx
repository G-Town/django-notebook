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

  // const handleImportClick = async (source) => {
  //   if (source === "Apple Notes") {
  //     setIsLoading(true);
  //     setError(null);
  //     try {
  //       const response = await api.post("/api/import-icloud-notes/");
  //       console.log("Import successful:", response.data);
  //       // You might want to show a success message here
  //       alert(
  //         `Successfully imported ${response.data.imported_notes_count} notes from Apple Notes.`
  //       );
  //       navigate("/notebook"); // Navigate to notebook after successful import
  //     } catch (err) {
  //       console.error("Import failed:", err);
  //       setError("Failed to import notes. Please try again.");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   } else {
  //     // For other sources, keep the placeholder alert for now
  //     alert(`Importing from ${source} is not implemented yet.`);
  //   }
  // };

  const handleImportClick = async (source) => {
    setIsLoading(true);
    setError(null);

    const result = await importService.handleImportClick(source);

    if (result.success) {
      // Update your state or context with the new folders and notes
      // For example:
      // setFolders(result.updatedFolders);
      // setNotes(result.updatedNotes);
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
