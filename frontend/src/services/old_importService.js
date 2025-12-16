// import api from "../api";
// import { getFromLocalStorage, saveToLocalStorage } from "./storageService";

// const handleImportClick = async (source) => {
//   if (source === "Apple Notes") {
//     try {
//       const response = await api.post("/api/import-icloud-notes/");
//       // console.log("🚀 ~ handleImportClick ~ imported notes:", response.data);
//       const cachedFolders = getFromLocalStorage("folders") || [];
//       // console.log("🚀 ~ handleImportClick ~ cachedFolders:", cachedFolders);
//       // const cachedNotes = getFromLocalStorage("notes") || [];
//       const updatedFolders = mergeImportedFolders(
//         cachedFolders,
//         response.data.imported_folders
//       );
//       // const updatedNotes = mergeImportedNotes(cachedNotes, response.data.notes);
//       saveToLocalStorage("folders", updatedFolders);
//       console.log("🚀 ~ handleImportClick ~ updatedFolders:", updatedFolders);
//       // saveToLocalStorage("notes", updatedNotes);

//       return {
//         success: true,
//         message: `Successfully imported ${response.data.imported_notes_count} notes from Apple Notes.`,
//         // updatedFolders: updatedFolders,
//         updatedFolders: response
//       };
//     } catch (err) {
//       console.error("Import failed:", err);
//       return {
//         success: false,
//         message: "Failed to import notes. Please try again.",
//       };
//     }
//   } else {
//     //TODO: add Google Keep import
//     return {
//       success: false,
//       message: `Importing from ${source} is not implemented yet.`,
//     };
//   }
// };

// const mergeImportedFolders = (cachedFolders, importedFolders) => {
//   const updatedFolders = [...cachedFolders];
//   const folderMap = new Map(
//     updatedFolders.map((folder) => [folder.id, folder])
//   );

//   importedFolders.forEach((importedFolder) => {
//     console.log("🚀 ~ importedFolders.forEach ~ importedFolder children:", importedFolder.children)
//     // const existingFolderIndex = updatedFolders.findIndex(
//     //   (folder) => folder.name === importedFolder.name
//     // );
//     const existingFolder = folderMap.get(importedFolder.id);

//     if (existingFolder) {
//       // Update existing folder
//       Object.assign(existingFolder, {
//         ...importedFolder,
//         updatedAt: new Date().toISOString(),
//       });
//     } else {
//       // Add new folder
//       const newFolder = {
//         ...importedFolder,
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//       };
//       updatedFolders.push(newFolder);
//       folderMap.set(newFolder.id, newFolder);
//     }
//   });

//   // Update parent-child relationships
//   updatedFolders.forEach((folder) => {
//     if (folder.children) {
//       folder.children = folder.children.filter((childId) =>
//         folderMap.has(childId)
//       );
//     }
//   });

//   return updatedFolders;
// };

// // const mergeImportedNotes = (cachedNotes, importedNotes) => {
// //   const updatedNotes = [...cachedNotes];

// //   importedNotes.forEach((importedNote) => {
// //     const existingNoteIndex = updatedNotes.findIndex(
// //       (note) => note.id === importedNote.id
// //     );

// //     if (existingNoteIndex !== -1) {
// //       // Update existing note
// //       updatedNotes[existingNoteIndex] = {
// //         ...updatedNotes[existingNoteIndex],
// //         ...importedNote,
// //         updatedAt: new Date().toISOString(),
// //       };
// //     } else {
// //       // Add new note
// //       updatedNotes.push({
// //         ...importedNote,
// //         createdAt: new Date().toISOString(),
// //         updatedAt: new Date().toISOString(),
// //       });
// //     }
// //   });

// //   return updatedNotes;
// // };

// export default {
//   handleImportClick,
// };
