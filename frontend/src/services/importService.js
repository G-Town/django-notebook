import api from "../api";
import { getFromLocalStorage, saveToLocalStorage } from "./storageService";

export const handleImportClick = async (source) => {
  if (source === "Apple Notes") {
    try {
      const response = await api.post("/api/import-icloud-notes/");
      console.log(
        "🚀 ~ handleImportClick ~ imported notes:",
        response.data.imported_notes
      );

      // Update the local cache with new folders
      const cachedFolders = getFromLocalStorage("folders") || [];
      const updatedFolders = mergeImportedNotes(
        cachedFolders,
        response.data.imported_notes
      );
      console.log("Imported folder id: ", response.data.folder_id);
      saveToLocalStorage("folders", updatedFolders);

      return {
        success: true,
        message: `Successfully imported ${response.data.imported_notes_count} notes from Apple Notes.`,
        updatedFolders: updatedFolders,
      };
    } catch (err) {
      console.error("Import failed:", err);
      return {
        success: false,
        message: "Failed to import notes. Please try again.",
      };
    }
  } else {
    //TODO: add Google Keep import
    return {
      success: false,
      message: `Importing from ${source} is not implemented yet.`,
    };
  }
};

// TODO:: consider service workers to handle caching and merging
// const mergeImportedFolders = (cachedFolders, newFolders) => {
//   // Implement merging logic here
//   // This could be as simple as concatenating arrays and removing duplicates,
//   // or more complex if you need to handle nested folder structures
//   // const mergedFolders = [...cachedFolders, ...newFolders];
//   // return Array.from(new Set(mergedFolders.map(JSON.stringify))).map(JSON.parse);

//   const mergedFolders = [...cachedFolders];

//   newFolders.forEach((newFolder) => {
//     const existingFolderIndex = mergedFolders.findIndex(
//       (folder) => folder.id === newFolder.id
//     );

//     if (existingFolderIndex !== -1) {
//       // Update existing folder
//       mergedFolders[existingFolderIndex] = {
//         ...mergedFolders[existingFolderIndex],
//         ...newFolder,
//         updatedAt: new Date().toISOString(),
//       };
//     } else {
//       // Add new folder
//       mergedFolders.push({
//         ...newFolder,
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//       });
//     }
//   });

//   return mergedFolders;
// };

const mergeImportedNotes = (cachedNotes, newNotes) => {
  const mergedNotes = [...cachedNotes, ...newNotes];
  console.log("🚀 ~ mergeImportedNotes ~ mergedNotes:", mergedNotes);
  // return Array.from(new Set(mergedNotes.map(JSON.stringify))).map(JSON.parse);
  return mergedNotes;

  // const mergedNotes = [...cachedNotes];

  // newNotes.forEach((newNote) => {
  //   const existingNoteIndex = mergedNotes.findIndex(
  //     (note) => note.id === newNote.id
  //   );

  //   if (existingNoteIndex !== -1) {
  //     // Update existing note
  //     console.log("existing note found")
  //     mergedNotes[existingNoteIndex] = {
  //       ...mergedNotes[existingNoteIndex],
  //       ...newNote,
  //       updatedAt: new Date().toISOString(),
  //     };
  //   } else {
  //     // Add new note
  //     console.log("adding saving new note")
  //     mergedNotes.push({
  //       ...newNote,
  //       createdAt: new Date().toISOString(),
  //       updatedAt: new Date().toISOString(),
  //     });
  //   }
  // });

  // return mergedNotes;
};

export default {
  handleImportClick,
};
