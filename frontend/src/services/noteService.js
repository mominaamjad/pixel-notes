import axios from "axios";
import API_URL from "./constants";

const handleError = (err) => {
  const message =
    err.response?.data?.message || "Something went wrong. Please try again.";
  throw new Error(message);
};

const noteService = {
  async getNotes(token) {
    try {
      const res = await axios.get(`${API_URL}/notes`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
        },
        validateStatus: (status) => status < 500,
      });

      return res.status === 204 ? [] : res.data?.data?.notes || [];
    } catch (err) {
      handleError(err);
      return [];
    }
  },

  async getNoteById(noteId, token) {
    try {
      const res = await axios.get(`${API_URL}/notes/${noteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data?.data?.note || null;
    } catch (err) {
      console.error("Fetch note error:", err);
      return null;
    }
  },

  async createNote(noteData, token) {
    try {
      const res = await axios.post(`${API_URL}/notes`, noteData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data?.data?.note || null;
    } catch (err) {
      console.error("Create note error:", err);
      return null;
    }
  },

  async deleteNote(noteId, token) {
    try {
      const res = await axios.delete(`${API_URL}/notes/${noteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.status === 204;
    } catch (err) {
      console.error("Delete note error:", err);
      return false;
    }
  },
};

export default noteService;
