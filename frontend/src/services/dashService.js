import api from "../api";

// Handle quick note creation
export const addQuickNote = async (content) => {
  try {
    const response = await api.post("/api/notes/", { content });
    return response.data;
  } catch (error) {
    console.error("Error adding quick note:", error);
    throw error;
  }
};

// Pin/unpin functionality (also in homeService, but might make sense to consolidate here)
export const pinItem = async (itemId, itemType) => {
  try {
    const response = await api.post("/api/pinned/", {
      item_id: itemId,
      item_type: itemType,
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

// Utility functions for the Dashboard
export const getActivityIcon = (type) => {
  switch (type) {
    case "note_created":
      return "📝";
    case "note_edited":
      return "✏️";
    case "import_completed":
      return "📥";
    default:
      return "🔔";
  }
};

// Additional dashboard-specific API calls could be added here
export const fetchUserStatistics = async () => {
  try {
    const response = await api.get("/api/user/statistics/");
    return response.data;
  } catch (error) {
    console.error("Error fetching user statistics:", error);
    throw error;
  }
};

export const fetchTips = async () => {
  try {
    const response = await api.get("/api/tips/");
    return response.data;
  } catch (error) {
    console.error("Error fetching tips:", error);
    throw error;
  }
};
