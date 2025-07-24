import axios from "axios";

export const getAllMauSac = async () => {
  try {
    const response = await axios.get("http://localhost:8080/api/mausac");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateMauSacStatus = async (id, mauSacObj) => {
  try {
    const response = await axios.put(
      `http://localhost:8080/api/mausac/${id}`,
      mauSacObj
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createMauSac = async (mauSacObj) => {
  try {
    const response = await axios.post(
      "http://localhost:8080/api/mausac",
      mauSacObj
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
