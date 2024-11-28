import api from "../api";

export const handleImport = async (source) => {
  if (source === "iCloud") {
    try {
      const response = await api.post("/api/import-icloud-notes/");

      return {
        success: true,
        message: `Import completed successfully. ${response.data.summary.newNotes} new notes imported across ${response.data.summary.newFolders} new folders.`,
        importDetails: {
          ...response.data.summary,
          importId: response.data.importId,
          timestamp: response.data.timestamp,
        },
      };
    } catch (err) {
      console.error("Import failed:", err);
      return {
        success: false,
        message:
          err.response?.data?.message ||
          "Failed to import notes. Please try again.",
        error: err.response?.data?.debug_info || err.message,
      };
    }
  } else {
    return {
      success: false,
      message: `Importing from ${source} is not implemented yet.`,
    };
  }
};

// export default {
//   handleImportClick,
// };
