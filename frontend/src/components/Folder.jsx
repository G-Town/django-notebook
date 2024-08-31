// import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolderOpen,
  faFolderClosed,
} from "@fortawesome/free-solid-svg-icons";
import FolderActions from "./FolderActions";
import PropTypes from "prop-types";

const Folder = ({
  folder,
  isExpanded,
  onToggle,
  onUpdate,
  children,
}) => {

  return (
    <div className="folder-container">
      <div className="folder-card" onClick={onToggle}>
        <FontAwesomeIcon
          className="folder-icon"
          icon={isExpanded ? faFolderOpen : faFolderClosed}
        />
        <h4>{folder.name}</h4>
        <FolderActions folder={folder} onUpdate={onUpdate} />
      </div>
      {isExpanded && children && (
        <div className="folder-children">
          {children}
        </div>
      )}
    </div>
  );
};

Folder.propTypes = {
  folder: PropTypes.object,
  isExpanded: PropTypes.bool,
  onToggle: PropTypes.func,
  onUpdate: PropTypes.func,
  children: PropTypes.array,
};

export default Folder;
