import axios from "axios";
import SERVER_URL from "../configs/server.config";

const API_URL = `${SERVER_URL}/api/khach-hang`;

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      await axios.get(`${SERVER_URL}/api/auth/check-session`, {
        withCredentials: true,
      });
    } catch (error) {
      localStorage.removeItem("currentUser");
      localStorage.removeItem("isLoggedIn");
      window.location.href = "/login";
      return Promise.reject(error);
    }
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user && user.token) {
      config.headers["Authorization"] = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const khachHangService = {
  getAllKhachHang: async () => {
    try {
      const response = await axiosInstance.get("");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  searchKhachHang: async (keyword) => {
    try {
      const response = await axiosInstance.get(
        `/search?keyword=${encodeURIComponent(keyword)}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  addKhachHang: async (data) => {
    try {
      const response = await axiosInstance.post('', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  updateTrangThaiKhachHang: async (id, trangThai) => {
    try {
      const response = await axiosInstance.put(`/${id}/trang-thai?trangThai=${trangThai}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getChiTietDonHangKhachHang: async (id) => {
    try {
      const response = await axiosInstance.get(`/${id}/chi-tiet-don-hang`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default khachHangService;
