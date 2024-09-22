import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolderOpen,
  faFolderClosed,
  faChevronCircleRight,
  faChevronCircleDown,
} from "@fortawesome/free-solid-svg-icons";
import FolderActions from "./FolderActions";
import PropTypes from "prop-types";
import "../styles/Folder.css";

const Folder = ({
  folder,
  selectedFolderId,
  setSelectedFolderId,
  isMenuOpen,
  setIsMenuOpen,
  loadFolders,
  depth,
  children,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isSelected = selectedFolderId === folder.id;

  const indentStyle = {
    paddingLeft: `${depth * 15}px`,
  };

  return (
    <div className={`folder-container ${isSelected ? "active-folder" : ""}`}>
      <div
        className="folder-card"
        style={indentStyle}
        onClick={() => {
          setSelectedFolderId(folder.id);
        }}
      >
        <div className="folder-card-items">
          <FontAwesomeIcon
            className="expand-icon"
            icon={isExpanded ? faChevronCircleDown : faChevronCircleRight}
            size="xs"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          />
          <FontAwesomeIcon
            className="folder-icon"
            icon={isExpanded ? faFolderOpen : faFolderClosed}
            size="sm"
          />
          <h6>{folder.name}</h6>
        </div>
        <FolderActions
          folder={folder}
          loadFolders={loadFolders}
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
        />
      </div>
      {isExpanded && children && (
        <div className="folder-children">{children}</div>
      )}
    </div>
  );
};

Folder.propTypes = {
  folder: PropTypes.object,
  selectedFolderId: PropTypes.number,
  setSelectedFolderId: PropTypes.func,
  isMenuOpen: PropTypes.bool,
  setIsMenuOpen: PropTypes.func,
  isExpanded: PropTypes.bool,
  expand: PropTypes.func,
  loadFolders: PropTypes.func,
  depth: PropTypes.number,
  children: PropTypes.array,
};

export default Folder;
