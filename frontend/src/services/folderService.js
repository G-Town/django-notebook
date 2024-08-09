import api from "../api";

export const getFolders = async () => {
  const cachedData = getFromLocalStorage("folders");
  const currentTime = new Date().getTime();

  if (cachedData) {
    // Use cached data if it's less than 5 minutes old
    return cachedData;
  } else {
    try {
      // Fetch from server if cache is old or doesn't exist
      const response = await api.get("/api/folders/");
      const folders = response.data;

      // Update cache
      saveToLocalStorage("folders", folders);
      saveToLocalStorage("folders_timestamp", currentTime);

      return folders;
    } catch (err) {
      console.error("Error fetching folders:", err);
      // If there's an error and we have cached data, return it as a fallback
      if (cachedData) {
        return cachedData;
      }
      // If there's no cached data, throw the error to be handled by the component
      throw err;
    }
  }
};

const getFromLocalStorage = (key) => {
  const storedData = localStorage.getItem(key);
  return storedData ? JSON.parse(storedData) : null;
};

const saveToLocalStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};
