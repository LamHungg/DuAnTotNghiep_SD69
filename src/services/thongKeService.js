import axios from "axios";
import {
  demoDoanhThu,
  demoSanPhamBanChay,
  demoHieuSuatNV,
  demoKhachHangChiTieu,
} from "../data/demoStatistics";

const API_URL = "http://localhost:8081/zmen";

// Helper function để check API có khả dụng không
const isApiAvailable = async () => {
  try {
    await axios.get(`${API_URL}/san-pham/ngay?ngay=2024-01-20`, {
      timeout: 3000,
    });
    return true;
  } catch (error) {
    console.warn("API không khả dụng, sử dụng demo data:", error.message);
    return false;
  }
};

const thongKeService = {
  // API Sản phẩm bán chạy
  getSanPhamBanChayTheoNgay: async (ngay) => {
    try {
      if (await isApiAvailable()) {
        const response = await axios.get(`${API_URL}/san-pham/ngay`, {
          params: { ngay },
        });
        return response.data;
      } else {
        // Fallback to demo data
        return demoSanPhamBanChay;
      }
    } catch (error) {
      console.error("Error fetching san pham ban chay theo ngay:", error);
      return demoSanPhamBanChay;
    }
  },

  getSanPhamBanChayTheoThang: async (thang, nam) => {
    try {
      if (await isApiAvailable()) {
        const response = await axios.get(`${API_URL}/san-pham/thang`, {
          params: { thang, nam },
        });
        return response.data;
      } else {
        return demoSanPhamBanChay;
      }
    } catch (error) {
      console.error("Error fetching san pham ban chay theo thang:", error);
      return demoSanPhamBanChay;
    }
  },

  getSanPhamBanChayTheoNam: async (nam) => {
    try {
      if (await isApiAvailable()) {
        const response = await axios.get(`${API_URL}/san-pham/nam`, {
          params: { nam },
        });
        return response.data;
      } else {
        return demoSanPhamBanChay;
      }
    } catch (error) {
      console.error("Error fetching san pham ban chay theo nam:", error);
      return demoSanPhamBanChay;
    }
  },

  getSanPhamBanChayKhoangNgay: async (tuNgay, denNgay) => {
    try {
      if (await isApiAvailable()) {
        const response = await axios.get(`${API_URL}/san-pham/khoang-ngay`, {
          params: { tuNgay, denNgay },
        });
        return response.data;
      } else {
        return demoSanPhamBanChay;
      }
    } catch (error) {
      console.error("Error fetching san pham ban chay khoang ngay:", error);
      return demoSanPhamBanChay;
    }
  },

  // API Doanh thu
  getDoanhThuTheoNgay: async (ngay) => {
    try {
      if (await isApiAvailable()) {
        const response = await axios.get(`${API_URL}/doanh-thu/ngay`, {
          params: { ngay },
        });
        return response.data;
      } else {
        return { ...demoDoanhThu, moTa: ngay };
      }
    } catch (error) {
      console.error("Error fetching doanh thu theo ngay:", error);
      return { ...demoDoanhThu, moTa: ngay };
    }
  },

  getDoanhThuTheoThang: async (thang, nam) => {
    try {
      if (await isApiAvailable()) {
        const response = await axios.get(`${API_URL}/doanh-thu/thang`, {
          params: { thang, nam },
        });
        return response.data;
      } else {
        return { ...demoDoanhThu, moTa: `Tháng ${thang}/${nam}` };
      }
    } catch (error) {
      console.error("Error fetching doanh thu theo thang:", error);
      return { ...demoDoanhThu, moTa: `Tháng ${thang}/${nam}` };
    }
  },

  getDoanhThuTheoNam: async (nam) => {
    try {
      if (await isApiAvailable()) {
        const response = await axios.get(`${API_URL}/doanh-thu/nam`, {
          params: { nam },
        });
        return response.data;
      } else {
        return { ...demoDoanhThu, moTa: `Năm ${nam}` };
      }
    } catch (error) {
      console.error("Error fetching doanh thu theo nam:", error);
      return { ...demoDoanhThu, moTa: `Năm ${nam}` };
    }
  },

  getDoanhThuKhoangNgay: async (tuNgay, denNgay) => {
    try {
      if (await isApiAvailable()) {
        const response = await axios.get(`${API_URL}/doanh-thu/khoang-ngay`, {
          params: { tuNgay, denNgay },
        });
        return response.data;
      } else {
        return { ...demoDoanhThu, moTa: `${tuNgay} - ${denNgay}` };
      }
    } catch (error) {
      console.error("Error fetching doanh thu khoang ngay:", error);
      return { ...demoDoanhThu, moTa: `${tuNgay} - ${denNgay}` };
    }
  },

  // API Hiệu suất nhân viên
  getHieuSuatNVTheoNgay: async (ngay) => {
    try {
      if (await isApiAvailable()) {
        const response = await axios.get(`${API_URL}/nhan-vien/ngay`, {
          params: { ngay },
        });
        return response.data;
      } else {
        return demoHieuSuatNV;
      }
    } catch (error) {
      console.error("Error fetching hieu suat nhan vien theo ngay:", error);
      return demoHieuSuatNV;
    }
  },

  getHieuSuatNVTheoThang: async (thang, nam) => {
    try {
      if (await isApiAvailable()) {
        const response = await axios.get(`${API_URL}/nhan-vien/thang`, {
          params: { thang, nam },
        });
        return response.data;
      } else {
        return demoHieuSuatNV;
      }
    } catch (error) {
      console.error("Error fetching hieu suat nhan vien theo thang:", error);
      return demoHieuSuatNV;
    }
  },

  getHieuSuatNVTheoNam: async (nam) => {
    try {
      if (await isApiAvailable()) {
        const response = await axios.get(`${API_URL}/nhan-vien/nam`, {
          params: { nam },
        });
        return response.data;
      } else {
        return demoHieuSuatNV;
      }
    } catch (error) {
      console.error("Error fetching hieu suat nhan vien theo nam:", error);
      return demoHieuSuatNV;
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
        return demoHieuSuatNV;
      }
    } catch (error) {
      console.error("Error fetching hieu suat nhan vien khoang ngay:", error);
      return demoHieuSuatNV;
    }
  },

  // API Khách hàng chi tiêu
  getKhachHangChiTieuTheoNgay: async (ngay) => {
    try {
      if (await isApiAvailable()) {
        const response = await axios.get(`${API_URL}/khach-hang/ngay`, {
          params: { ngay },
        });
        return response.data;
      } else {
        return demoKhachHangChiTieu;
      }
    } catch (error) {
      console.error("Error fetching khach hang chi tieu theo ngay:", error);
      return demoKhachHangChiTieu;
    }
  },

  getKhachHangChiTieuTheoThang: async (thang, nam) => {
    try {
      if (await isApiAvailable()) {
        const response = await axios.get(`${API_URL}/khach-hang/thang`, {
          params: { thang, nam },
        });
        return response.data;
      } else {
        return demoKhachHangChiTieu;
      }
    } catch (error) {
      console.error("Error fetching khach hang chi tieu theo thang:", error);
      return demoKhachHangChiTieu;
    }
  },

  getKhachHangChiTieuTheoNam: async (nam) => {
    try {
      if (await isApiAvailable()) {
        const response = await axios.get(`${API_URL}/khach-hang/nam`, {
          params: { nam },
        });
        return response.data;
      } else {
        return demoKhachHangChiTieu;
      }
    } catch (error) {
      console.error("Error fetching khach hang chi tieu theo nam:", error);
      return demoKhachHangChiTieu;
    }
  },

  getKhachHangChiTieuKhoangNgay: async (tuNgay, denNgay) => {
    try {
      if (await isApiAvailable()) {
        const response = await axios.get(`${API_URL}/khach-hang/khoang-ngay`, {
          params: { tuNgay, denNgay },
        });
        return response.data;
      } else {
        return demoKhachHangChiTieu;
      }
    } catch (error) {
      console.error("Error fetching khach hang chi tieu khoang ngay:", error);
      return demoKhachHangChiTieu;
    }
  },

  // Export Excel functions
  exportSanPhamBanChayExcel: async (type, params) => {
    try {
      if (!(await isApiAvailable())) {
        throw new Error("API không khả dụng");
      }

      let url = "";
      switch (type) {
        case "ngay":
          url = `${API_URL}/san-pham/ngay/export-excel?ngay=${params.ngay}`;
          break;
        case "thang":
          url = `${API_URL}/san-pham/thang/export-excel?thang=${params.thang}&nam=${params.nam}`;
          break;
        case "nam":
          url = `${API_URL}/san-pham/nam/export-excel?nam=${params.nam}`;
          break;
        case "khoang-ngay":
          url = `${API_URL}/san-pham/khoang-ngay/export-excel?tuNgay=${params.tuNgay}&denNgay=${params.denNgay}`;
          break;
        default:
          throw new Error("Invalid export type");
      }

      const response = await axios.get(url, {
        responseType: "blob",
      });

      const url2 = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url2;
      link.setAttribute("download", `san-pham-ban-chay-${type}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error exporting excel:", error);
      throw error;
    }
  },

  exportDoanhThuExcel: async (type, params) => {
    try {
      if (!(await isApiAvailable())) {
        throw new Error("API không khả dụng");
      }

      let url = "";
      switch (type) {
        case "ngay":
          url = `${API_URL}/doanh-thu/ngay/export-excel?ngay=${params.ngay}`;
          break;
        case "thang":
          url = `${API_URL}/doanh-thu/thang/export-excel?thang=${params.thang}&nam=${params.nam}`;
          break;
        case "nam":
          url = `${API_URL}/doanh-thu/nam/export-excel?nam=${params.nam}`;
          break;
        case "khoang-ngay":
          url = `${API_URL}/doanh-thu/khoang-ngay/export-excel?tuNgay=${params.tuNgay}&denNgay=${params.denNgay}`;
          break;
        default:
          throw new Error("Invalid export type");
      }

      const response = await axios.get(url, {
        responseType: "blob",
      });

      const url2 = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url2;
      link.setAttribute("download", `doanh-thu-${type}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error exporting excel:", error);
      throw error;
    }
  },

  exportHieuSuatNVExcel: async (type, params) => {
    try {
      if (!(await isApiAvailable())) {
        throw new Error("API không khả dụng");
      }

      let url = "";
      switch (type) {
        case "ngay":
          url = `${API_URL}/nhan-vien/ngay/export-excel?ngay=${params.ngay}`;
          break;
        case "thang":
          url = `${API_URL}/nhan-vien/thang/export-excel?thang=${params.thang}&nam=${params.nam}`;
          break;
        case "nam":
          url = `${API_URL}/nhan-vien/nam/export-excel?nam=${params.nam}`;
          break;
        case "khoang-ngay":
          url = `${API_URL}/nhan-vien/khoang-ngay/export-excel?tuNgay=${params.tuNgay}&denNgay=${params.denNgay}`;
          break;
        default:
          throw new Error("Invalid export type");
      }

      const response = await axios.get(url, {
        responseType: "blob",
      });

      const url2 = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url2;
      link.setAttribute("download", `hieu-suat-nhan-vien-${type}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error exporting excel:", error);
      throw error;
    }
  },

  exportKhachHangChiTieuExcel: async (type, params) => {
    try {
      if (!(await isApiAvailable())) {
        throw new Error("API không khả dụng");
      }

      let url = "";
      switch (type) {
        case "ngay":
          url = `${API_URL}/khach-hang/ngay/export-excel?ngay=${params.ngay}`;
          break;
        case "thang":
          url = `${API_URL}/khach-hang/thang/export-excel?thang=${params.thang}&nam=${params.nam}`;
          break;
        case "nam":
          url = `${API_URL}/khach-hang/nam/export-excel?nam=${params.nam}`;
          break;
        case "khoang-ngay":
          url = `${API_URL}/khach-hang/khoang-ngay/export-excel?tuNgay=${params.tuNgay}&denNgay=${params.denNgay}`;
          break;
        default:
          throw new Error("Invalid export type");
      }

      const response = await axios.get(url, {
        responseType: "blob",
      });

      const url2 = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url2;
      link.setAttribute("download", `khach-hang-chi-tieu-${type}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error exporting excel:", error);
      throw error;
    }
  },
};

export default thongKeService;
