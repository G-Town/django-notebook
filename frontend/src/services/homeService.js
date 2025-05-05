import api from "../api";
// import { getFromLocalStorage, saveToLocalStorage } from "./storageService";

// Function to fetch all home page data in parallel
export const fetchHomeData = async () => {
  try {
    const [
      userRes,
      recentRes, 
      foldersRes, 
      pinnedRes, 
      activityRes, 
      tagsRes
    ] = await Promise.all([
      api.get("/api/user/"),
      api.get("/api/recent/"),
      api.get("/api/featured/"),
      // api.get("/api/pinned/"),
      // api.get("/api/activity/"),
      api.get("/api/tags/")
    ]);
    
    return {
      user: userRes.data,
      recentNotes: recentRes.data,
      featuredFolders: foldersRes.data,
      pinnedItems: pinnedRes.data,
      activityFeed: activityRes.data,
      tags: tagsRes.data
    };
  } catch (error) {
    console.error("Error fetching home data:", error);
    throw error;
  }
};

// Function to handle search functionality
export const searchItems = async (query) => {
  try {
    const response = await api.get(`/api/search?q=${query}`);
    return response.data;
  } catch (error) {
    console.error("Error searching:", error);
    throw error;
  }
};

// Additional home-related functions could be added here
export const pinItem = async (itemId, itemType) => {
  try {
    const response = await api.post("/api/pinned/", {
      item_id: itemId,
      item_type: itemType
    });
    return response.data;
  } catch (error) {
    console.error("Error pinning item:", error);
    throw error;
  }
};

export const unpinItem = async (pinId) => {
  try {
    await api.delete(`/api/pinned/${pinId}/`);
    return true;
  } catch (error) {
    console.error("Error unpinning item:", error);
    throw error;
  }
};