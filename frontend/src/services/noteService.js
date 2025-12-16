import api from "../api";
import { MultiKeyCacheService, createItemCacheService } from "./baseCacheService";

const noteListCache = new MultiKeyCacheService("note_list", 3 * 60 * 1000);
const NOTE_CACHE_DURATION = 10 * 60 * 1000; // 10 minutes for individual notes

export const getNotesByFolder = async (folderId, options = {}) => {
  const cacheService = noteListCache.getCacheService(folderId);
  
  const fetchFunction = async () => {
    const response = await api.get(`/api/notes/?folder=${folderId}`);
    return response.data;
  };

  try {
    return await cacheService.getData(fetchFunction, options);
  } catch (error) {
    console.error("Error fetching notes:", error);
    return [];
  }
};

// export const getNotesByFolder = async (folderId) => {
//   const cachedNotes = getFromLocalStorage(`note_list_${folderId}`);
//   if (cachedNotes) return cachedNotes;
//   try {
//     const response = await api.get(`/api/notes/?folder=${folderId}`);
//     const fetchedNotes = response.data;
//     saveToLocalStorage(`note_list_${folderId}`, fetchedNotes);
//     return fetchedNotes;
//   } catch (error) {
//     console.error("Error fetching notes:", error);
//     return;
//   }
// };

export const getNote = async (noteId, options = {}) => {
  const cacheService = createItemCacheService("note", noteId, NOTE_CACHE_DURATION);
  
  const fetchFunction = async () => {
    const response = await api.get(`/api/notes/${noteId}/`);
    return response.data;
  };

  try {
    return await cacheService.getData(fetchFunction, options);
  } catch (error) {
    console.error("Error fetching note:", error);
    return null;
  }
};

// export const getNote = async (noteId) => {
//   const cachedNote = getFromLocalStorage(`note_${noteId}`);
//   if (cachedNote) return cachedNote;
//   try {
//     const response = await api.get(`/api/notes/${noteId}/`);
//     const fetchedNote = response.data;
//     saveToLocalStorage(`note_${noteId}`, fetchedNote);
//     return fetchedNote;
//   } catch (error) {
//     console.error("Error fetching note:", error);
//     return;
//   }
// };

export const createNote = async (noteData) => {
  try {
    const response = await api.post("/api/notes/", noteData);
    const newNote = response.data;
    
    // Invalidate folder's note list cache if folder is specified
    if (noteData.folder) {
      const folderCacheService = noteListCache.getCacheService(noteData.folder);
      
      // Optimistically add to cache
      folderCacheService.updateCacheOptimistically(notes => [...notes, newNote]);
    }
    
    return newNote;
  } catch (error) {
    console.error("Error creating note:", error);
    // Invalidate relevant caches on error
    if (noteData.folder) {
      noteListCache.getCacheService(noteData.folder).invalidate();
    }
    throw error;
  }
};

export const updateNote = async (noteId, noteData) => {
  try {
    const response = await api.put(`/api/notes/${noteId}/`, noteData);
    const updatedNote = response.data;
    
    // Update individual note cache
    const noteCacheService = createItemCacheService("note", noteId, NOTE_CACHE_DURATION);
    noteCacheService.setCache(updatedNote);
    
    // Update in folder list cache if folder is known
    if (updatedNote.folder) {
      const folderCacheService = noteListCache.getCacheService(updatedNote.folder);
      folderCacheService.updateCacheOptimistically(notes =>
        notes.map(note => note.id === noteId ? updatedNote : note)
      );
    }
    
    return updatedNote;
  } catch (error) {
    console.error("Error updating note:", error);
    // Clean up caches on error
    createItemCacheService("note", noteId).invalidate();
    if (noteData.folder) {
      noteListCache.getCacheService(noteData.folder).invalidate();
    }
    throw error;
  }
};

export const deleteNote = async (noteId, folderId = null) => {
  try {
    await api.delete(`/api/notes/${noteId}/`);
    
    // Remove from individual cache
    createItemCacheService("note", noteId).invalidate();
    
    // Remove from folder list cache
    if (folderId) {
      const folderCacheService = noteListCache.getCacheService(folderId);
      folderCacheService.updateCacheOptimistically(notes =>
        notes.filter(note => note.id !== noteId)
      );
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting note:", error);
    // Invalidate caches on error
    if (folderId) {
      noteListCache.getCacheService(folderId).invalidate();
    }
    throw error;
  }
};

// Utility functions
export const refreshNotesByFolder = async (folderId) => {
  return await getNotesByFolder(folderId, { forceRefresh: true });
};

export const refreshNote = async (noteId) => {
  return await getNote(noteId, { forceRefresh: true });
};

export const invalidateNoteCaches = (folderId = null) => {
  if (folderId) {
    noteListCache.getCacheService(folderId).invalidate();
  } else {
    noteListCache.invalidateAll();
  }
};