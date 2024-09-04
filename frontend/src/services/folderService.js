import api from "../api";
import { getFromLocalStorage, saveToLocalStorage } from "./storageService";

export const getFolders = async () => {
  const cachedFolders = getFromLocalStorage("folders");
  if (cachedFolders) {
    return cachedFolders;
  }
  try {
    const response = await api.get("/api/folders/");
    const fetchedFolders = response.data;
    console.log("🚀 ~ getFolders ~ fetchedFolders:", fetchedFolders)
    saveToLocalStorage("folders", fetchedFolders);
    return fetchedFolders;
  } catch (error) {
    console.error("Error fetching folders:", error);
    return [];
  }
};

export const createFolder = async (folderData) => {
  try {
    const response = await api.post("/api/folders/", folderData);
    const updatedFolders = await getFolders();
    saveToLocalStorage("folders", updatedFolders);
    return response.data;
  } catch (error) {
    console.error("Error creating folder:", error);
    throw error;
  }
};

export const updateFolder = async (folderId, folderData) => {
  try {
    const response = await api.put(`/api/folders/${folderId}/`, folderData);
    const updatedFolders = await getFolders();
    saveToLocalStorage("folders", updatedFolders);
    return response.data;
  } catch (error) {
    console.error("Error updating folder:", error);
    throw error;
  }
};

export const deleteFolder = async (folderId) => {
  try {
    await api.delete(`/api/folders/${folderId}/`);
    const updatedFolders = await getFolders();
    saveToLocalStorage("folders", updatedFolders);
    return true;
  } catch (error) {
    console.error("Error deleting folder:", error);
    throw error;
  }
};

// export const handleRenameSubmit = async (e) => {
//   e.preventDefault();
//   if (editFolderName.trim()) {
//     try {
//       await updateFolder(folder.id, { name: editFolderName.trim() });
//       setIsEditing(false);
//       // You might want to trigger a re-fetch of folders here
//     } catch (error) {
//       console.error("Error renaming folder:", error);
//     }
//   }
// };