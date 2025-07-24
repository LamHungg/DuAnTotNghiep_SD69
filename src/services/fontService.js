import axios from "axios";

export const getAllFont = async () => {
  try {
    const response = await axios.get("http://localhost:8080/api/font");
    return response.data;
  } catch (error) {
    throw error;
  }
};
