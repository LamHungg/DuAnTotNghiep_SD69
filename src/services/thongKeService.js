import axios from "axios";
import SERVER_URL from "../configs/server.config";

// Import ExcelJS trực tiếp
import ExcelJS from "exceljs";

// Dynamic import cho jsPDF để tránh lỗi babel runtime
let jsPDF = null;
const loadJsPDF = async () => {
  if (!jsPDF) {
    const jsPDFModule = await import("jspdf");
    jsPDF = jsPDFModule.default || jsPDFModule.jsPDF;
  }
  return jsPDF;
};

const API_URL = `${SERVER_URL}/zmen`;

// Helper function để format currency
const formatCurrency = (value) => {
  if (value == null) return "0 VNĐ";
  if (typeof value === "number") {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  }
  return `${value} VNĐ`;
};

// Helper function để check API có khả dụng không
const isApiAvailable = async () => {
  try {
    await axios.get(`${API_URL}/test`, {
      timeout: 3000,
    });
    return true;
  } catch (error) {
    console.warn("API không khả dụng:", error.message);
    return false;
  }
};

const thongKeService = {
  // ==================== SẢN PHẨM BÁN CHẠY ====================
  getSanPhamBanChayTheoNgay: async (ngay) => {
    try {
      const response = await axios.get(`${API_URL}/san-pham/ngay`, {
        params: { ngay },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching san pham ban chay theo ngay:", error);
      return [];
    }
  },

  getSanPhamBanChayTheoThang: async (thang, nam) => {
    try {
      const response = await axios.get(`${API_URL}/san-pham/thang`, {
        params: { thang, nam },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching san pham ban chay theo thang:", error);
      return [];
    }
  },

  getSanPhamBanChayTheoNam: async (nam) => {
    try {
      const response = await axios.get(`${API_URL}/san-pham/nam`, {
        params: { nam },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching san pham ban chay theo nam:", error);
      return [];
    }
  },

  getSanPhamBanChayKhoangNgay: async (tuNgay, denNgay) => {
    try {
      const response = await axios.get(`${API_URL}/san-pham/khoang-ngay`, {
        params: { tuNgay, denNgay },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching san pham ban chay khoang ngay:", error);
      return [];
    }
  },

  // ==================== DOANH THU ====================
  getDoanhThuTheoNgay: async (ngay) => {
    try {
      const response = await axios.get(`${API_URL}/doanh-thu/ngay`, {
        params: { ngay },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching doanh thu theo ngay:", error);
      return [];
    }
  },

  getDoanhThuTheoThang: async (thang, nam) => {
    try {
      const response = await axios.get(`${API_URL}/doanh-thu/thang`, {
        params: { thang, nam },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching doanh thu theo thang:", error);
      return [];
    }
  },

  getDoanhThuTheoNam: async (nam) => {
    try {
      const response = await axios.get(`${API_URL}/doanh-thu/nam`, {
        params: { nam },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching doanh thu theo nam:", error);
      return [];
    }
  },

  getDoanhThuKhoangNgay: async (tuNgay, denNgay) => {
    try {
      const response = await axios.get(`${API_URL}/doanh-thu/khoang-ngay`, {
        params: { tuNgay, denNgay },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching doanh thu khoang ngay:", error);
      return [];
    }
  },

  // ==================== HIỆU SUẤT NHÂN VIÊN ====================
  getHieuSuatNVTheoNgay: async (ngay) => {
    try {
      const response = await axios.get(`${API_URL}/nhan-vien/ngay`, {
        params: { ngay },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching hieu suat nhan vien theo ngay:", error);
      return [];
    }
  },

  getHieuSuatNVTheoThang: async (thang, nam) => {
    try {
      const response = await axios.get(`${API_URL}/nhan-vien/thang`, {
        params: { thang, nam },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching hieu suat nhan vien theo thang:", error);
      return [];
    }
  },

  getHieuSuatNVTheoNam: async (nam) => {
    try {
      const response = await axios.get(`${API_URL}/nhan-vien/nam`, {
        params: { nam },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching hieu suat nhan vien theo nam:", error);
      return [];
    }
  },

  getHieuSuatNVKhoangNgay: async (tuNgay, denNgay) => {
    try {
      if (await isApiAvailable()) {
        const response = await axios.get(`${API_URL}/nhan-vien/khoang-ngay`, {
          params: { tuNgay, denNgay },
        });
        return response.data;
      } else {
        return null; // Return null if API is not available
      }
    } catch (error) {
      console.error("Error fetching hieu suat nhan vien khoang ngay:", error);
      return null; // Return null if API is not available
    }
  },

  // ==================== KHÁCH HÀNG CHI TIÊU ====================
  getKhachHangChiTieuTheoNgay: async (ngay) => {
    try {
      const response = await axios.get(`${API_URL}/khach-hang/ngay`, {
        params: { ngay },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching khach hang chi tieu theo ngay:", error);
      return [];
    }
  },

  getKhachHangChiTieuTheoThang: async (thang, nam) => {
    try {
      const response = await axios.get(`${API_URL}/khach-hang/thang`, {
        params: { thang, nam },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching khach hang chi tieu theo thang:", error);
      return [];
    }
  },

  getKhachHangChiTieuTheoNam: async (nam) => {
    try {
      const response = await axios.get(`${API_URL}/khach-hang/nam`, {
        params: { nam },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching khach hang chi tieu theo nam:", error);
      return [];
    }
  },

  getKhachHangChiTieuKhoangNgay: async (tuNgay, denNgay) => {
    try {
      const response = await axios.get(`${API_URL}/khach-hang/khoang-ngay`, {
        params: { tuNgay, denNgay },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching khach hang chi tieu khoang ngay:", error);
      return [];
    }
  },

  // ==================== THỐNG KÊ TỔNG QUAN ====================
  getThongKeTongQuan: async () => {
    try {
      const response = await axios.get(`${API_URL}/tong-quan`);
      return response.data;
    } catch (error) {
      console.error("Error fetching thong ke tong quan:", error);
      return null;
    }
  },

  // ==================== BIỂU ĐỒ DOANH THU ====================
  getBieuDoDoanhThu: async (filterType, year, month) => {
    try {
      const response = await axios.get(`${API_URL}/doanh-thu/bieu-do`, {
        params: { filterType, year, month },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching bieu do doanh thu:", error);
      return [];
    }
  },

  // ==================== DOANH THU THEO DANH MỤC ====================
  getDoanhThuTheoDanhMuc: async (year, month) => {
    try {
      const response = await axios.get(`${API_URL}/danh-muc/doanh-thu`, {
        params: { year, month },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching doanh thu theo danh muc:", error);
      return [];
    }
  },

  // ==================== THỐNG KÊ THANH TOÁN ====================
  getThongKeThanhToan: async (nam, thang) => {
    try {
      const response = await axios.get(`${API_URL}/thanh-toan/thong-ke`, {
        params: { nam, thang },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching thong ke thanh toan:", error);
      return [];
    }
  },

  // ==================== DANH SÁCH ĐƠN HÀNG ====================
  getDonHangList: async (
    filterType,
    selectedDate,
    selectedMonth,
    selectedYear,
    dateFrom,
    dateTo
  ) => {
    try {
      const response = await axios.get(`${API_URL}/don-hang/list`, {
        params: {
          filterType,
          selectedDate,
          selectedMonth,
          selectedYear,
          dateFrom,
          dateTo,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching don hang list:", error);
      return [];
    }
  },

  // ==================== EXPORT EXCEL ====================
  exportSanPhamBanChayExcel: async (ngay) => {
    try {
      const response = await axios.get(
        `${API_URL}/san-pham/ngay/export-excel`,
        {
          params: { ngay },
          responseType: "blob",
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error exporting san pham ban chay excel:", error);
      throw error;
    }
  },

  exportDoanhThuExcel: async (loai, ngay, thang, nam) => {
    try {
      const response = await axios.get(`${API_URL}/doanh-thu/export-excel`, {
        params: { loai, ngay, thang, nam },
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      console.error("Error exporting doanh thu excel:", error);
      throw error;
    }
  },

  exportTongQuanExcel: async () => {
    try {
      const response = await axios.get(`${API_URL}/tong-quan/export-excel`, {
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      console.error("Error exporting tong quan excel:", error);
      throw error;
    }
  },

  // ==================== EXPORT THỐNG KÊ MỚI ====================
  // Export Excel với dữ liệu đầy đủ
  exportThongKeExcel: async (data) => {
    try {
      const response = await axios.post(
        `${API_URL}/export/thong-ke-excel`,
        data,
        {
          responseType: "blob",
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error exporting Excel:", error);
      return null;
    }
  },

  // Export PDF với dữ liệu đầy đủ
  exportThongKePDF: async (data) => {
    try {
      const response = await axios.post(
        `${API_URL}/export/thong-ke-pdf`,
        data,
        {
          responseType: "blob",
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error exporting PDF:", error);
      return null;
    }
  },
};

export default thongKeService;
