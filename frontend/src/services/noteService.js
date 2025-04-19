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
      handleError(err);
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
      handleError(err);
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
      handleError(err);
      return false;
    }
  },

  async updateNote(noteId, noteData, token) {
    try {
      const res = await axios.patch(`${API_URL}/notes/${noteId}`, noteData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data?.data?.note || null;
    } catch (err) {
      handleError(err);
      return null;
    }
  },

  async downloadNote(noteId, format = "txt", token) {
    try {
      const res = await axios.get(`${API_URL}/notes/download/${noteId}`, {
        params: { format },
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      });
      return res;
    } catch (err) {
      handleError(err);
      return null;
    }
  },

  async toggleArchive(noteId, token) {
    try {
      const res = await axios.patch(
        `${API_URL}/notes/${noteId}/archive`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data.data.note;
    } catch (err) {
      handleError(err);
      return null;
    }
  },

  async toggleFavorite(noteId, token) {
    try {
      const res = await axios.patch(
        `${API_URL}/notes/${noteId}/favorite`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data.data.note;
    } catch (err) {
      handleError(err);
      return null;
    }
  },

  async getUserTags(token) {
    try {
      const res = await axios.get(`${API_URL}/notes/tags`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
        },
        validateStatus: (status) => status < 500,
      });

      return res.status === 204 ? [] : res.data?.data?.tags || [];
    } catch (err) {
      handleError(err);
      return [];
    }
  },
};

export default noteService;
