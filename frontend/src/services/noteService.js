import api from "../api";
import { getFromLocalStorage, saveToLocalStorage } from "./storageService";

export const getNotesByFolder = async (folderId) => {
  // console.log("🚀 ~ getNotesByFolder ~ folderId:", folderId)
  const cachedNotes = getFromLocalStorage(`note_list_${folderId}`);
  if (cachedNotes) return cachedNotes;
  try {
    const response = await api.get(`/api/notes/?folder=${folderId}`);
    const fetchedNotes = response.data;
    // console.log("🚀 ~ getNotesByFolder ~ fetchedNotes:", fetchedNotes);
    saveToLocalStorage(`note_list_${folderId}`, fetchedNotes);
    return fetchedNotes;
  } catch (error) {
    console.error("Error fetching notes:", error);
    return;
  }
};

export const getNote = async (noteId) => {
  const cachedNote = getFromLocalStorage(`note_${noteId}`);
  if (cachedNote) return cachedNote;
  try {
    const response = await api.get(`/api/notes/${noteId}/`);
    const fetchedNote = response.data;
    // console.log("🚀 ~ getNote ~ fetchedNote:", fetchedNote)
    saveToLocalStorage(`note_${noteId}`, fetchedNote);
    return fetchedNote;
  } catch (error) {
    console.error("Error fetching note:", error);
    return;
  }
};
