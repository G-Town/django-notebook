import { useState, useEffect, useMemo } from "react";
import { getFolders } from "../services/folderService";
import Folder from "./Folder";
import PropTypes from "prop-types";
import "../styles/Folder.css";

const FolderList = ({
  selectedFolderId,
  setSelectedFolderId,
  setIsAnyMenuOpen,
}) => {
  const [folders, setFolders] = useState([]);
  // tracking expanded folders at tree level for centralized control,
  // consider implementing "expand all" and "collapse all"
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);

  const loadFolders = async () => {
    setIsLoading(true);
    try {
      const fetchedFolders = await getFolders();
      setFolders(fetchedFolders);
    } catch (error) {
      console.error("Error loading folders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFolders();
  }, []);

  // Memoized mapping of folder IDs to their children
  const folderChildrenMap = useMemo(() => {
    const childMap = new Map();

    folders.forEach((folder) => {
      if (folder.children && folder.children.length > 0) {
        childMap.set(
          folder.id,
          folder.children
            .map((childId) => folders.find((f) => f.id === childId))
            .filter(Boolean) // Remove any null/undefined children
        );
      } else {
        childMap.set(folder.id, []);
      }
    });
    console.log("🚀 ~ folderChildrenMap ~ childMap:", childMap);

    return childMap;
  }, [folders]);

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

  const folderTree = (folder, depth) => {
    console.log("🚀 ~ folderTree ~ folder:", folder.id);
    const isExpanded = expandedFolders.has(folder.id);
    // Efficiently get children using the pre-computed map
    const childFolders = folderChildrenMap.get(folder.id) || [];
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
        {/* {childFolders.map((childId) => {
          const childFolder = folders.find((f) => f.id === childId);
          return childFolder ? folderTree(childFolder, depth + 1) : null;
        })} */}
        {childFolders.map(childFolder => 
          folderTree(childFolder, depth + 1)
        )}
      </Folder>
    );
  };

  if (isLoading) {
    return <div>Loading folders...</div>;
  }

  const rootFolders = folders.filter((folder) => !folder.parent);
  // Directly filter root folders without repeated searching
  // const rootFolders = useMemo(() =>
  //   folders.filter(folder => !folder.parent),
  //   [folders]
  // );

  return rootFolders.map((rootFolder) => {
    return folderTree(rootFolder, 0);
  });
};

FolderList.propTypes = {
  selectedFolderId: PropTypes.number,
  setSelectedFolderId: PropTypes.func,
  setIsAnyMenuOpen: PropTypes.func,
};

export default FolderList;
