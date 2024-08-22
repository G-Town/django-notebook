import api from "../api";
import { getFromLocalStorage, saveToLocalStorage } from "./storageService";

const handleImportClick = async (source) => {
  if (source === "Apple Notes") {
    try {
      const response = await api.post("/api/import-icloud-notes/");
      console.log(
        "🚀 ~ handleImportClick ~ imported notes:",
        response.data.imported_folder
      );

      // Update cache with new folders
      const cachedFolders = getFromLocalStorage("folders") || [];
      const updatedFolders = mergeImportedFolder(
        cachedFolders,
        response.data.imported_folder,
        source
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
    //TODO: add Google Keep import
    return {
      success: false,
      message: `Importing from ${source} is not implemented yet.`,
    };
  }
};

const mergeImportedFolder = (cachedFolders, importedFolder, source) => {
  const updatedFolders = [...cachedFolders];
  const existingFolderIndex = updatedFolders.findIndex(
    (folder) => folder.name === `${source} Import`
  );

  if (existingFolderIndex !== -1) {
    // Update existing folder
    updatedFolders[existingFolderIndex] = {
      ...updatedFolders[existingFolderIndex],
      ...importedFolder,
      updatedAt: new Date().toISOString(),
    };
  } else {
    // Add new folder
    updatedFolders.push({
      ...importedFolder,
      name: "Apple Notes Import",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  return updatedFolders;
};

// TODO: consider service workers to handle caching and merging
// const mergeImportedFolders = (cachedFolders, newFolder) => {
//   const mergedFolders = [...cachedFolders, newFolder];
//   return Array.from(new Set(mergedFolders.map(JSON.stringify))).map(JSON.parse);
//   return mergedFolders;
// };

export default {
  handleImportClick,
};
