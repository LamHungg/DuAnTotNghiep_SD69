import axios from "axios";

const API_URL = "http://localhost:8080/api/sanpham";

// Lấy danh sách sản phẩm
export const getAllSanPham = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Lấy danh sách chi tiết sản phẩm
export const getAllChiTietSanPham = async () => {
  try {
    const response = await axios.get(
      "http://localhost:8080/api/chi-tiet-san-pham"
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Thêm sản phẩm mới
export const createSanPham = async (sanPham) => {
  try {
    const response = await axios.post(
      "http://localhost:8080/api/sanpham",
      sanPham
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Cập nhật sản phẩm
export const updateSanPham = async (id, sanPham) => {
  try {
    const response = await axios.put(
      `http://localhost:8080/api/sanpham/${id}`,
      sanPham
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Cập nhật trạng thái sản phẩm
export const updateSanPhamStatus = async (id, sanPhamObj) => {
  try {
    const response = await axios.put(
      `http://localhost:8080/api/sanpham/${id}`,
      sanPhamObj
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Xóa sản phẩm
export const deleteSanPham = async (id) => {
  try {
    const response = await axios.delete(
      `http://localhost:8080/api/sanpham/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Tìm kiếm sản phẩm
export const searchSanPham = async (params) => {
  try {
    const response = await axios.get(
      "http://localhost:8080/api/sanpham/search",
      { params }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Cập nhật chi tiết sản phẩm
export const updateChiTietSanPham = async (id, chiTietSanPhamObj) => {
  try {
    console.log("Updating with data:", chiTietSanPhamObj);
    const response = await axios.put(
      `http://localhost:8080/api/chi-tiet-san-pham/${id}`,
      chiTietSanPhamObj
    );
    return response.data;
  } catch (error) {
    console.error("Error in updateChiTietSanPham:", error.response || error);
    throw error;
  }
};

// Upload hình ảnh sản phẩm
export const uploadHinhAnh = async (id, formData) => {
  try {
    const response = await axios.post(
      `http://localhost:8080/api/hinh-anh-san-pham/upload/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error in uploadHinhAnh:", error.response || error);
    throw error;
  }
};

export const createChiTietSanPham = async (chiTietSanPhamObj) => {
  try {
    const response = await axios.post(
      "http://localhost:8080/api/chi-tiet-san-pham",
      chiTietSanPhamObj
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
