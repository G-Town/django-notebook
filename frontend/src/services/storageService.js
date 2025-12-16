// import api from "../api";

// TODO:: consider service workers to handle caching and merging
// export const getFromLocalStorage = (key) => {
//   const storedData = localStorage.getItem(key);
//   return storedData ? JSON.parse(storedData) : null;
// };

// export const saveToLocalStorage = (key, data) => {
//   localStorage.setItem(key, JSON.stringify(data));
// };


// export const removeFromLocalStorage = (key) => {
//   localStorage.removeItem(key);
// }

// Enhanced storage service with error handling and utilities

export const getFromLocalStorage = (key) => {
  try {
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : null;
  } catch (error) {
    console.error(`Error reading from localStorage (key: ${key}):`, error);
    // Clean up corrupted data
    removeFromLocalStorage(key);
    return null;
  }
};

export const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error saving to localStorage (key: ${key}):`, error);
    
    // Handle quota exceeded error
    if (error.name === 'QuotaExceededError') {
      console.warn('localStorage quota exceeded, clearing old data');
      clearOldCacheData();
      
      // Try again after clearing
      try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
      } catch (retryError) {
        console.error('Failed to save even after clearing cache:', retryError);
      }
    }
    return false;
  }
};

export const removeFromLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing from localStorage (key: ${key}):`, error);
    return false;
  }
};

// Utility to clear all app cache data
export const clearAllCache = () => {
  const keysToRemove = [];
  
  // Find all keys that look like our app's cache keys
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    // Adjust this pattern based on your app's cache key naming
    if (key && (key.includes('folders') || key.includes('notes') || key.includes('cache'))) {
      keysToRemove.push(key);
    }
  }
  
  keysToRemove.forEach(key => removeFromLocalStorage(key));
  console.log(`Cleared ${keysToRemove.length} cache entries`);
};

// Clear old cache data based on timestamps
export const clearOldCacheData = () => {
  const maxAge = 24 * 60 * 60 * 1000; // 24 hours
  const now = Date.now();
  const keysToRemove = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      const data = getFromLocalStorage(key);
      
      // If data has timestamp and is old, mark for removal
      if (data?.timestamp && (now - data.timestamp) > maxAge) {
        keysToRemove.push(key);
      }
    }
  }
  
  keysToRemove.forEach(key => removeFromLocalStorage(key));
  if (keysToRemove.length > 0) {
    console.log(`Cleared ${keysToRemove.length} old cache entries`);
  }
};

// Check localStorage availability
export const isLocalStorageAvailable = () => {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, 'test');
    localStorage.removeItem(test);
    return true;
  } catch (error) {
    return false;
  }
};

// Get storage usage info (useful for debugging)
export const getStorageInfo = () => {
  if (!isLocalStorageAvailable()) {
    return { available: false };
  }
  
  let totalSize = 0;
  let itemCount = 0;
  
  for (let key in localStorage) {
    if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
      totalSize += localStorage[key].length;
      itemCount++;
    }
  }
  
  return {
    available: true,
    itemCount,
    totalSize,
    totalSizeKB: Math.round(totalSize / 1024 * 100) / 100
  };
};