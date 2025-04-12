import axios from "axios";
import API_URL from "./constants";

const handleResponse = async (response) => {
  return response.data;
};

const authService = {
  async login({ email, password }) {
    try {
      const response = await axios.post(`${API_URL}/users/login`, {
        email,
        password,
      });
      return handleResponse(response);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Something went wrong. Please try again.";
      throw new Error(message);
    }
  },
};
export default authService;
