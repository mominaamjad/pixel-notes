import axios from "axios";
import API_URL from "./constants";

const handleError = (err) => {
  const message =
    err.response?.data?.message || "Something went wrong. Please try again.";
  throw new Error(message);
};

const authService = {
  async login({ email, password }) {
    try {
      const response = await axios.post(`${API_URL}/users/login`, {
        email,
        password,
      });
      return response.data;
    } catch (err) {
      handleError(err);
    }
  },

  async signup({ name, email, password, confirmPassword }) {
    try {
      const response = await axios.post(`${API_URL}/users/signup`, {
        name,
        email,
        password,
        confirmPassword,
      });
      return response.data;
    } catch (err) {
      handleError(err);
    }
  },

  async forgotPassword({ email }) {
    try {
      const response = await axios.post(`${API_URL}/users/forgotPassword`, {
        email,
      });
      return response.data;
    } catch (err) {
      handleError(err);
    }
  },

  async resetPassword({ password, confirmPassword, token }) {
    try {
      const response = await axios.patch(
        `${API_URL}/users/resetPassword/${token}`,
        { password, confirmPassword }
      );
      return response.data;
    } catch (err) {
      handleError(err);
    }
  },

  async getUserProfile(token) {
    try {
      const response = await axios.get(`${API_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      return response.data.data.user;
    } catch (err) {
      handleError(err);
    }
  },
};
export default authService;
