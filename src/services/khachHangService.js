import axios from "axios";

const API_URL = "http://localhost:8081/zmen/khach-hang";

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      await axios.get("http://localhost:8081/api/auth/check-session", {
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
};

export default khachHangService;
