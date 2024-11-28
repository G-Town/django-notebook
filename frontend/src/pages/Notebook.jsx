import { useState } from "react";
// import { useNavigate } from "react-router-dom";
import FolderList from "../components/FolderList";
import NoteList from "../components/NoteList";
import Note from "../pages/Note";
// import { getNotesByFolder } from "../services/noteService";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faPlus } from "@fortawesome/free-solid-svg-icons";
// import api from "../api";
import "../styles/Notebook.css";

const Notebook = () => {
  // const navigate = useNavigate();
  // const [folders, setFolders] = useState([]);
  // const [notes, setNotes] = useState([]);

  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [selectedNoteId, setSelectedNoteId] = useState(null);

  // const [isLoading, setIsLoading] = useState(false);
  const [isAnyMenuOpen, setIsAnyMenuOpen] = useState(false);
  console.log("🚀 ~ Notebook ~ isAnyMenuOpen:", isAnyMenuOpen);

  // const handleCreate = () => {
  //   navigate(`/note/new`);
  // };

  // const addNewFolder = async () => {
  //   if (newFolderName.trim()) {
  //     try {
  //       await createFolder({ name: newFolderName.trim() });
  //       setNewFolderName("");
  //       await loadFolders();
  //     } catch (error) {
  //       console.error("Error creating new folder:", error);
  //     }
  //   }
  // };

  // useEffect(() => {
  //   loadFolders();
  // }, []);

  // useEffect(() => {
  //   if (selectedFolderId) {
  //     loadNotesByFolder(selectedFolderId);
  //   } else {
  //     setNotes([]);
  //     setSelectedNoteId
  //   }
  // }, [selectedFolderId]);

  // const loadFolders = async () => {
  //   try {
  //     const fetchedFolders = await getFolders();
  //     setFolders(fetchedFolders);
  //   } catch (error) {
  //     console.error("Error loading folders:", error);
  //   }
  // };

  // const loadNotesByFolder = async (folderId) => {
  //   try {
  //     const fetchedNotes = await getNotesByFolder(folderId);
  //     setNotes(fetchedNotes);
  //   } catch (error) {
  //     console.error("Error loading notes:", error);
  //   }
  // };

  // const getDescendantFolders = (rootFolder) => {
  //   const descendants = [];
  //   const stack = [rootFolder];

  //   while (stack.length > 0) {
  //     const currentFolder = stack.pop();
  //     descendants.push(currentFolder);

  //     if (currentFolder.children) {
  //       currentFolder.children.forEach((childId) => {
  //         const childFolder = folders.find((f) => f.id === childId);
  //         if (childFolder) {
  //           stack.push(childFolder);
  //         }
  //       });
  //     }
  //   }
  //   return descendants;
  // };

  const handleNoteSelect = (noteId) => {
    setSelectedNoteId(noteId);
  };

  const handleNoteEdit = (noteId) => {
    // Implement edit functionality
    console.log("Editing note:", noteId);
  };

  const handleNoteDelete = (noteId) => {
    // Implement delete functionality
    console.log("Deleting note:", noteId);
    setSelectedNoteId(null);
  };

  // const toggleNotebookMenuState = (isOpen) => {
  //   setIsAnyMenuOpen(isOpen);
  // };

  // const rootFolders = folders.filter((folder) => !folder.parent);
  // const selectedNote = notes.find(note => note.id === selectedNoteId);

  return (
    // <div className="notebook-container">
    <div className={`notebook-container ${isAnyMenuOpen ? "menu-open" : ""}`}>
      {/* <button className="plus-button" onClick={handleCreate}>
        <FontAwesomeIcon icon={faPlus} />
      </button> */}
      <div className="notebook-nav">
        <div className="folders-container">
          <FolderList
            selectedFolderId={selectedFolderId}
            setSelectedFolderId={setSelectedFolderId}
            setIsAnyMenuOpen={setIsAnyMenuOpen}
          />
          {/* <div className="add-folder">
          <input
            type="text"
            placeholder="New Folder Name"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
          />
          <button onClick={addNewFolder}>+</button>
        </div> */}
        </div>
        <div className="notes-container">
          <NoteList
            folderId={selectedFolderId}
            onNoteSelect={handleNoteSelect}
            // isAnyMenuOpen={isAnyMenuOpen}
          />
        </div>
      </div>
      <div className="note-display">
        {selectedNoteId ? (
          <Note
            key={selectedNoteId} // forces re-render when new note selected?
            noteId={selectedNoteId}
            onEdit={handleNoteEdit}
            onDelete={handleNoteDelete}
          />
        ) : (
          <p>Select a note to view its contents</p>
        )}
      </div>
    </div>
  );
};

export default Notebook;
