import api from "../api";
import { getFromLocalStorage, saveToLocalStorage } from "./storageService";

export const handleImportClick = async (source) => {
  if (source === "Apple Notes") {
    try {
      const response = await api.post("/api/import-icloud-notes/");

      // Update the local cache with new folders
      const cachedFolders = getFromLocalStorage("folders") || [];
      const updatedFolders = mergeImportedFolders(
        cachedFolders,
        response.data.new_folders
      );
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
    return {
      success: false,
      message: `Importing from ${source} is not implemented yet.`,
    };
  }
};

const mergeImportedFolders = (cachedFolders, newFolders) => {
  // Implement merging logic here
  // This could be as simple as concatenating arrays and removing duplicates,
  // or more complex if you need to handle nested folder structures
  const mergedFolders = [...cachedFolders, ...newFolders];
  return Array.from(new Set(mergedFolders.map(JSON.stringify))).map(JSON.parse);
};
