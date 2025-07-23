import axios from "axios";

export const getAllDanhMuc = async () => {
  try {
    const response = await axios.get("http://localhost:8080/api/danhmuc");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateDanhMucStatus = async (id, danhMucObj) => {
  try {
    const response = await axios.put(
      `http://localhost:8080/api/danhmuc/${id}`,
      danhMucObj
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
