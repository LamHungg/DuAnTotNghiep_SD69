import axios from "axios";

export const getAllChatLieu = async () => {
  try {
    const response = await axios.get("http://localhost:8080/api/chatlieu");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateChatLieuStatus = async (id, chatLieuObj) => {
  try {
    const response = await axios.put(
      `http://localhost:8080/api/chatlieu/${id}`,
      chatLieuObj
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
