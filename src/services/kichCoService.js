import axios from "axios";

export const getAllKichCo = async () => {
  try {
    const response = await axios.get("http://localhost:8080/api/kichco");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateKichCoStatus = async (id, kichCoObj) => {
  try {
    const response = await axios.put(
      `http://localhost:8080/api/kichco/${id}`,
      kichCoObj
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createKichCo = async (kichCoObj) => {
  try {
    const response = await axios.post(
      "http://localhost:8080/api/kichco",
      kichCoObj
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
