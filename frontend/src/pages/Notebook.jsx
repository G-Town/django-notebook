import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import FolderTree from "../components/FolderTree";
import NoteList from "../components/NoteList";
import { getFolders } from "../services/folderService";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faPlus } from "@fortawesome/free-solid-svg-icons";
// import api from "../api";
import "../styles/Notebook.css";

const Notebook = () => {
  // const navigate = useNavigate();
  const [folders, setFolders] = useState([]);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [isAnyMenuOpen, setIsAnyMenuOpen] = useState(false);

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

  useEffect(() => {
    loadFolders();
  }, []);

  const loadFolders = async () => {
    try {
      const fetchedFolders = await getFolders();
      setFolders(fetchedFolders);
    } catch (error) {
      console.error("Error loading folders:", error);
    }
  };

  const getDescendantFolders = (rootFolder) => {
    const descendants = [];
    const stack = [rootFolder];

    while (stack.length > 0) {
      const currentFolder = stack.pop();
      descendants.push(currentFolder);

      if (currentFolder.children) {
        currentFolder.children.forEach((childId) => {
          const childFolder = folders.find((f) => f.id === childId);
          if (childFolder) {
            stack.push(childFolder);
          }
        });
      }
    }

    return descendants;
  };

  const rootFolders = folders.filter((folder) => !folder.parent);

  return (
    <div className="notebook-container">
      {/* <button className="plus-button" onClick={handleCreate}>
        <FontAwesomeIcon icon={faPlus} />
      </button> */}
      <div className="notebook-nav">
        <div className="folder-tree-container">
        {rootFolders.map((rootFolder) => {
          // console.log("🚀 ~ {rootFolders.map ~ rootFolder:", rootFolder);
          const descendantFolders = getDescendantFolders(rootFolder);
          return (
            <FolderTree
              key={rootFolder.id}
              rootFolder={rootFolder}
              folders={descendantFolders}
              selectedFolderId={selectedFolderId}
              setSelectedFolderId={setSelectedFolderId}
              isAnyMenuOpen={isAnyMenuOpen}
              setIsAnyMenuOpen={setIsAnyMenuOpen}
              loadFolders={loadFolders}
            />
          );
        })}
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
        <NoteList folderId={selectedFolderId} isAnyMenuOpen={isAnyMenuOpen} />
      </div>
    </div>
  );
};

export default Notebook;
