import api from "../api";
import { getFromLocalStorage, saveToLocalStorage } from "./storageService";

// Core function to fetch all home page data in parallel
export const fetchHomeData = async () => {
  const cachedData = getFromLocalStorage("home_data");
  if (cachedData && Date.now() - cachedData.timestamp < 300000) { // 5 minute cache
    return cachedData.data;
  }

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
      api.get("/api/pinned/"),
      api.get("/api/activity/"),
      api.get("/api/tags/")
    ]);
    
    const data = {
      user: userRes.data,
      recentNotes: recentRes.data,
      featuredFolders: foldersRes.data,
      pinnedItems: pinnedRes.data,
      activityFeed: activityRes.data,
      tags: tagsRes.data
    };

    // Cache the data with a timestamp
    saveToLocalStorage("home_data", {
      data,
      timestamp: Date.now()
    });
    
    return data;
  } catch (error) {
    console.error("Error fetching home data:", error);
    throw error;
  }
};

// Function to handle search functionality - remains in homeService since it's global
export const searchItems = async (query) => {
  try {
    const response = await api.get(`/api/search?q=${query}`);
    return response.data;
  } catch (error) {
    console.error("Error searching:", error);
    throw error;
  }
};

// Clear home data cache (useful after operations that modify data)
export const clearHomeDataCache = () => {
  localStorage.removeItem("home_data");
};