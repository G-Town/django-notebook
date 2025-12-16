import api from "../api";
import { createCacheService } from "./baseCacheService";

const foldersCache = createCacheService("folders",  5 * 60 * 1000);

export const getFolders = async (options = {}) => {
  const fetchFunction = async () => {
    const response = await api.get("/api/folders/");
    return response.data;
  };

  try {
    return await foldersCache.getData(fetchFunction, options);
  } catch (error) {
    console.error("Error fetching folders:", error);
    return [];
  }
};

export const createFolder = async (folderData) => {
  try {
    const response = await api.post("/api/folders/", folderData);
    const newFolder = response.data;
    foldersCache.optomisticUpdate((folders) => [...folders, newFolder]);
    return newFolder;
  } catch (error) {
    console.error("Error creating folder:", error);
    foldersCache.invalidate();
    throw error;
  }
};

export const updateFolder = async (folderId, folderData) => {
  try {
    const response = await api.put(`/api/folders/${folderId}/`, folderData);
    const updatedFolder = response.data;
    foldersCache.optomisticUpdate(folders => 
      folders.map(folder => 
        folder.id === folderId ? updatedFolder : folder
      )
    );
    return updatedFolder;
  } catch (error) {
    console.error("Error updating folder:", error);
    foldersCache.invalidate();
    throw error;
  }
};

export const deleteFolder = async (folderId) => {
  try {
    await api.delete(`/api/folders/${folderId}/`);
    foldersCache.optomisticUpdate(folders => 
      folders.filter(folder => folder.id !== folderId)
    );
    return true;
  } catch (error) {
    console.error("Error deleting folder:", error);
    throw error;
  }
};

export const refreshFolders = async () => {
  return await getFolders({ forceRefresh: true });
};

export const invalidateFoldersCache = () => {
  foldersCache.invalidate();
};