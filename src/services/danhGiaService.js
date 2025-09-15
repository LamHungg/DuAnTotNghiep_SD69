import axios from "axios";
import SERVER_URL from "../configs/server.config";

const API_URL = `${SERVER_URL}/api/danhgia`;

const danhGiaService = {
  // Lấy tất cả đánh giá của sản phẩm
  getDanhGiaBySanPham: async (idSanPham) => {
    try {
      const response = await axios.get(`${API_URL}/sanpham/${idSanPham}`);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy đánh giá sản phẩm:", error);
      throw error;
    }
  },

  // Lấy thống kê đánh giá của sản phẩm
  getThongKeDanhGia: async (idSanPham) => {
    try {
      const response = await axios.get(`${API_URL}/thongke/${idSanPham}`);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy thống kê đánh giá:", error);
      throw error;
    }
  },

  // Tạo đánh giá mới
  createDanhGia: async (danhGiaData) => {
    try {
      const response = await axios.post(`${API_URL}`, danhGiaData);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi tạo đánh giá:", error);
      throw error;
    }
  },

  // Cập nhật đánh giá
  updateDanhGia: async (id, danhGiaData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, danhGiaData);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi cập nhật đánh giá:", error);
      throw error;
    }
  },

  // Xóa đánh giá
  deleteDanhGia: async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
      console.error("Lỗi khi xóa đánh giá:", error);
      throw error;
    }
  },

  // Kiểm tra khách hàng đã đánh giá sản phẩm chưa
  hasKhachHangReviewed: async (idKhachHang, idSanPham) => {
    try {
      const response = await axios.get(
        `${API_URL}/check/${idKhachHang}/${idSanPham}`
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi khi kiểm tra đánh giá:", error);
      return false;
    }
  },

  // Lấy đánh giá của khách hàng cho sản phẩm
  getDanhGiaByKhachHangAndSanPham: async (idKhachHang, idSanPham) => {
    try {
      const response = await axios.get(
        `${API_URL}/khachhang/${idKhachHang}/sanpham/${idSanPham}`
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy đánh giá khách hàng:", error);
      return null;
    }
  },
};

export default danhGiaService;
