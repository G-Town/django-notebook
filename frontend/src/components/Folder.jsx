// import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolderOpen,
  faFolderClosed,
  faChevronRight,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";
import FolderActions from "./FolderActions";
import PropTypes from "prop-types";
import "../styles/Folder.css";

const Folder = ({
  folder,
  isExpanded,
  setSelectedFolder,
  onExpand,
  onUpdate,
  children,
}) => {
  const selectFolder = (folderId) => {
    console.log("🚀 ~ selectFolder ~ folderId:", folderId);
    setSelectedFolder(folderId);
  };

  return (
    <div className="folder-container">
      <div className="folder-card" onClick={() => selectFolder(folder.id)}>
        <FontAwesomeIcon
          className="folder-icon"
          icon={isExpanded ? faChevronUp : faChevronRight}
          onClick={onExpand}
        />
        <FontAwesomeIcon
          className="folder-icon"
          icon={isExpanded ? faFolderOpen : faFolderClosed}
        />
        <h4>{folder.name}</h4>
        <FolderActions folder={folder} onUpdate={onUpdate} />
      </div>
      {isExpanded && children && (
        <div className="folder-children">{children}</div>
      )}
    </div>
  );
};

Folder.propTypes = {
  folder: PropTypes.object,
  isExpanded: PropTypes.bool,
  setSelectedFolder: PropTypes.func,
  onExpand: PropTypes.func,
  onUpdate: PropTypes.func,
  children: PropTypes.array,
};

export default Folder;
