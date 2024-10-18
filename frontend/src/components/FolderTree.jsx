import { useState } from "react";
import Folder from "./Folder";
import PropTypes from "prop-types";

const FolderTree = ({
  rootFolder,
  folders,
  selectedFolderId,
  setSelectedFolderId,
  // isAnyMenuOpen,
  setIsAnyMenuOpen,
  loadFolders,
}) => {
  // tracking expanded folders at  tree level for centralized control,
  // consider implementing "expand all" and "collapse all"
  const [expandedFolders, setExpandedFolders] = useState(new Set());

  const toggleFolder = (folderId) => {
    // function notation of setter to properly handle current state of
    // expanded folders id as "prevExpanded"
    setExpandedFolders((prevExpanded) => {
      const newExpanded = new Set(prevExpanded);
      if (newExpanded.has(folderId)) {
        newExpanded.delete(folderId);
      } else {
        newExpanded.add(folderId);
      }
      return newExpanded;
    });
  };

  const renderFolder = (folder, depth) => {
    const isExpanded = expandedFolders.has(folder.id);
    // console.log("🚀 ~ renderFolder ~ isExpanded:", isExpanded);
    // console.log("🚀 ~ renderFolder ~ children:", folder.children);

    return (
      <Folder
        key={folder.id}
        folder={folder}
        selectedFolderId={selectedFolderId}
        setSelectedFolderId={setSelectedFolderId}
        isExpanded={isExpanded}
        onToggle={() => toggleFolder(folder.id)}
        // isMenuOpen={isAnyMenuOpen}
        setIsAnyMenuOpen={setIsAnyMenuOpen}
        loadFolders={loadFolders}
        depth={depth}
      >
        {
          folder.children &&
            folder.children.map((childId) => {
              const childFolder = folders.find((f) => f.id === childId);
              return childFolder ? renderFolder(childFolder, depth + 1) : null;
            })
        }
      </Folder>
    );
  };

  // without directly returning JSX eslint does not recognize as react,won't raise prop validation warning
  return renderFolder(rootFolder, 0);
};

FolderTree.propTypes = {
  rootFolder: PropTypes.object,
  folders: PropTypes.array,
  selectedFolderId: PropTypes.number,
  setSelectedFolderId: PropTypes.func,
  isAnyMenuOpen: PropTypes.bool,
  setIsAnyMenuOpen: PropTypes.func,
  loadFolders: PropTypes.func,
};

export default FolderTree;
