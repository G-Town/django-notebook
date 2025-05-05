// import { useState } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faFolderOpen,
//   faFolderClosed,
//   faChevronCircleRight,
//   faChevronCircleDown,
// } from "@fortawesome/free-solid-svg-icons";
import FolderActions from "../FolderActions";
// import { FolderClosed, FolderOpen, ChevronRight, ChevronDown } from "../../icons";
import "./Folder.css";
import PropTypes from "prop-types";

const Folder = ({
  folder,
  selectedFolderId,
  setSelectedFolderId,
  isExpanded,
  onToggle,
  // isMenuOpen,
  setIsAnyMenuOpen,
  loadFolders,
  depth,
  children,
}) => {
  // const [isExpanded, setIsExpanded] = useState(false);
  const isSelected = selectedFolderId === folder.id;

  const indentStyle = {
    paddingLeft: `${depth * 12}px`,
  };

  return (
    <div className="folder-tree-container">
      <div
        className={`folder-card ${isSelected ? "active-folder" : ""}`}
        style={indentStyle}
        onClick={() => {
          setSelectedFolderId(folder.id);
        }}
      >
        <div className="folder-card-items">
          <div
            className="expand-icon"
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
          >
            {isExpanded ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 24 24"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m6 9l6 6l6-6"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 24 24"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m9 18l6-6l-6-6"
                />
              </svg>
            )}
          </div>
          {/* <FontAwesomeIcon
            className="expand-icon"
            icon={isExpanded ? faChevronCircleDown : faChevronCircleRight}
            size="xs"
            onClick={(e) => {
              e.stopPropagation();
              // setIsExpanded(!isExpanded);
              onToggle();
            }}
          /> */}
          {isSelected ? (
            // <FolderOpen className="folder-icon" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2ZM2 10h20"
              />
            </svg>
          ) : (
            // <FolderClosed className="folder-icon" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.75"
                d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2ZM2 10h20"
              />
            </svg>
          )}
          {/* <FontAwesomeIcon
            className="folder-icon"
            icon={isExpanded ? faFolderOpen : faFolderClosed}
            size="sm"
          /> */}
          <h6>{folder.name}</h6>
        </div>
        <FolderActions
          folder={folder}
          loadFolders={loadFolders}
          // isMenuOpen={isMenuOpen}
          setIsAnyMenuOpen={setIsAnyMenuOpen}
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
  onToggle: PropTypes.func,
  loadFolders: PropTypes.func,
  // isMenuOpen: PropTypes.bool,
  setIsAnyMenuOpen: PropTypes.func,
  isExpanded: PropTypes.bool,
  depth: PropTypes.number,
  children: PropTypes.node,
};

export default Folder;
