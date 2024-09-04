// import { createContext, useState, useCallback } from "react";
// import PropTypes from "prop-types";

// export const NotebookContext = createContext();

// export const NotebookProvider = ({ children }) => {
//   const [folders, setFolders] = useState([]);
//   const [selectedFolderId, setSelectedFolderId] = useState(null);
//   const [expandedFolderIds, setExpandedFolderIds] = useState(new Set());

//   const toggleFolder = useCallback((folderId) => {
//     setExpandedFolderIds((prev) => {
//       const newSet = new Set(prev);
//       if (newSet.has(folderId)) {
//         newSet.delete(folderId);
//       } else {
//         newSet.add(folderId);
//       }
//       return newSet;
//     });
//   }, []);

//   const selectFolder = useCallback((folderId) => {
//     setSelectedFolderId(folderId);
//   }, []);

//   const contextValue = {
//     folders,
//     setFolders,
//     selectedFolderId,
//     selectFolder,
//     expandedFolderIds,
//     toggleFolder,
//   };

//   return (
//     <NotebookContext.Provider value={contextValue}>
//       {children}
//     </NotebookContext.Provider>
//   );
// };

// NotebookProvider.propTypes = {
//   children: PropTypes.element,
// };

// // export const useNotebook = () => {
// //   const context = useContext(NotebookContext);
// //   if (context === undefined) {
// //     throw new Error('useNotebook must be used within a NotebookProvider');
// //   }
// //   return context;
// // };
