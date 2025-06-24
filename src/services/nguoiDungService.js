import axios from "axios";

const API_URL = "http://localhost:8081/api/nguoi-dung";

// Tạo axios instance với cấu hình mặc định
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Cho phép gửi cookies
});

// Thêm interceptor để xử lý token trong header
axiosInstance.interceptors.request.use(
  async (config) => {
    // Kiểm tra session trước khi gửi request
    try {
      await axios.get("http://localhost:8081/api/auth/check-session", {
        withCredentials: true,
      });
    } catch (error) {
      // Nếu session không hợp lệ, chuyển về trang login
      localStorage.removeItem("currentUser");
      localStorage.removeItem("isLoggedIn");
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // Thêm token vào header nếu có
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user && user.token) {
      config.headers["Authorization"] = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const nguoiDungService = {
  // Lấy danh sách tất cả người dùng
  getAllNguoiDung: async () => {
    try {
      const response = await axiosInstance.get("");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy thông tin người dùng theo ID
  getNguoiDungById: async (id) => {
    try {
      const response = await axiosInstance.get(`/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Tạo người dùng mới
  createNguoiDung: async (nguoiDungData) => {
    try {
      const response = await axiosInstance.post("", nguoiDungData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        // Nếu unauthorized, xóa thông tin đăng nhập và chuyển về trang login
        localStorage.removeItem("currentUser");
        localStorage.removeItem("isLoggedIn");
        window.location.href = "/login";
      }
      throw error;
    }
  },

  // Cập nhật thông tin người dùng
  updateNguoiDung: async (id, nguoiDungData) => {
    try {
      const response = await axiosInstance.put(`/${id}`, nguoiDungData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Cập nhật trạng thái người dùng
  updateStatus: async (id, status) => {
    try {
      const response = await axiosInstance.put(
        `/${id}/status?status=${status}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Xóa người dùng
  deleteNguoiDung: async (id) => {
    try {
      await axiosInstance.delete(`/${id}`);
    } catch (error) {
      throw error;
    }
  },

  // Tìm kiếm người dùng theo tên
  searchNguoiDung: async (hoTen) => {
    try {
      const response = await axiosInstance.get(
        `/search?hoTen=${encodeURIComponent(hoTen)}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default nguoiDungService;
