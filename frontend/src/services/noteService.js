import api from "../api";
import { getFromLocalStorage, saveToLocalStorage } from "./storageService";

export const getNotesByFolder = async (folderId) => {
  const cachedNotes = getFromLocalStorage(`notes_${folderId}`);
  if (cachedNotes) {
    return cachedNotes;
  }
  try {
    const response = await api.post(`/api/notes/?folder=${folderId}`);
    const fetchedNotes = response.data;
    console.log("🚀 ~ getNotesByFolder ~ fetchedNotes:", fetchedNotes);
    saveToLocalStorage(`notes_${folderId}`, fetchedNotes);
    return response.data;
  } catch (error) {
    console.error("Error fetching notes:", error);
    return;
  }
};
