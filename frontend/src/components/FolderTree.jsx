import Folder from "./Folder";
import PropTypes from "prop-types";

const FolderTree = ({
  rootFolder,
  folders,
  selectedFolderId,
  setSelectedFolderId,
  isAnyMenuOpen,
  setIsAnyMenuOpen,
  loadFolders,
}) => {
  // TODO: consider handling folder expansions here w/ a set of every expanded folder id
  // also consider refactoring folder component into this one
  const renderFolder = (folder, depth) => {
    return (
      <Folder
        key={folder.id}
        folder={folder}
        selectedFolderId={selectedFolderId}
        setSelectedFolderId={setSelectedFolderId}
        isMenuOpen={isAnyMenuOpen}
        setIsMenuOpen={setIsAnyMenuOpen}
        loadFolders={loadFolders}
        depth={depth}
      >
        {folder.children &&
          folder.children.map((childId) => {
            const childFolder = folders.find((f) => f.id === childId);
            return childFolder ? renderFolder(childFolder, depth + 1) : null;
          })}
      </Folder>
    );
  };

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
