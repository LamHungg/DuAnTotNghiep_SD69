import axios from "axios";
import SERVER_URL from "../configs/server.config";

const API_URL = `${SERVER_URL}/api`;

// Tạo axios instance với cấu hình mặc định
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Cho phép gửi cookies
});

// Lấy danh sách voucher có hiệu lực cho customer
export const getActiveVouchers = async () => {
  try {
    const response = await axiosInstance.get(`/customer/vouchers`);
    return response.data.success ? response.data.data : [];
  } catch (error) {
    console.error("Error fetching active vouchers:", error);
    return [];
  }
};

// Kiểm tra voucher có hợp lệ không
export const validateVoucher = async (maVoucher, tongTienHang = 0) => {
  try {
    const response = await axiosInstance.post(
      `/customer/vouchers/validate`,
      null,
      {
        params: {
          maVoucher,
          tongTienHang,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error validating voucher:", error);
    return {
      success: false,
      message: "Lỗi khi kiểm tra voucher",
    };
  }
};

// Lấy danh sách khuyến mãi có hiệu lực
export const getActivePromotions = async () => {
  try {
    const response = await axiosInstance.get(`/customer/promotions`);
    return response.data.success ? response.data.data : [];
  } catch (error) {
    console.error("Error fetching active promotions:", error);
    return [];
  }
};

// Admin APIs
export const getAllVouchers = async () => {
  try {
    const response = await axiosInstance.get(`/voucher`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all vouchers:", error);
    return [];
  }
};

export const createVoucher = async (voucherData) => {
  try {
    // Format dữ liệu trước khi gửi
    const formattedData = {
      ...voucherData,
      loaiGiamGia:
        voucherData.loaiGiamGia === "TIEN_MAT" ||
        voucherData.loaiGiamGia === "TIEN"
          ? "GIA_TIEN"
          : voucherData.loaiGiamGia,
      giaTriGiam: parseFloat(voucherData.giaTriGiam),
      giaTriToiThieu: voucherData.giaTriToiThieu
        ? parseFloat(voucherData.giaTriToiThieu)
        : null,
      giamToiDa: voucherData.giamToiDa
        ? parseFloat(voucherData.giamToiDa)
        : null,
      soLuong: voucherData.soLuong ? parseInt(voucherData.soLuong) : null,
      trangThai: parseInt(voucherData.trangThai),
      moTa: voucherData.moTa?.trim() || null,
      ngayBatDau: voucherData.ngayBatDau + "T00:00:00",
      ngayKetThuc: voucherData.ngayKetThuc + "T23:59:59",
    };

    console.log("Sending voucher data:", formattedData);
    const response = await axiosInstance.post(`/voucher`, formattedData);
    return response.data;
  } catch (error) {
    console.error("Error creating voucher:", error);
    if (error.response) {
      console.error("Server response:", error.response.data);
    }
    throw error;
  }
};

export const updateVoucher = async (id, voucherData) => {
  try {
    // Xử lý loaiGiamGia - chuyển đổi tất cả các giá trị không hợp lệ thành GIA_TIEN
    let formattedLoaiGiamGia = voucherData.loaiGiamGia;
    if (
      voucherData.loaiGiamGia === "TIEN_MAT" ||
      voucherData.loaiGiamGia === "TIEN"
    ) {
      formattedLoaiGiamGia = "GIA_TIEN";
    }

    const formattedData = {
      maVoucher: voucherData.maVoucher, // Giữ lại maVoucher khi update
      tenVoucher: voucherData.tenVoucher,
      loaiGiamGia: formattedLoaiGiamGia,
      giaTriGiam: parseFloat(voucherData.giaTriGiam),
      giaTriToiThieu:
        voucherData.giaTriToiThieu && voucherData.giaTriToiThieu.trim() !== ""
          ? parseFloat(voucherData.giaTriToiThieu)
          : null,
      giamToiDa:
        voucherData.giamToiDa && voucherData.giamToiDa.trim() !== ""
          ? parseFloat(voucherData.giamToiDa)
          : null,
      soLuong:
        voucherData.soLuong && voucherData.soLuong.trim() !== ""
          ? parseInt(voucherData.soLuong)
          : null,
      trangThai: parseInt(voucherData.trangThai),
      moTa:
        voucherData.moTa && voucherData.moTa.trim() !== ""
          ? voucherData.moTa.trim()
          : null,
      ngayBatDau: voucherData.ngayBatDau + "T00:00:00",
      ngayKetThuc: voucherData.ngayKetThuc + "T23:59:59",
    };

    console.log("Updating voucher data (with maVoucher):", formattedData);
    const response = await axiosInstance.put(`/voucher/${id}`, formattedData);
    return response.data;
  } catch (error) {
    console.error("Error updating voucher:", error);

    // Cải thiện thông tin lỗi
    if (error.response) {
      console.error("Server response:", error.response.data);
      console.error("Status code:", error.response.status);

      // Thêm thông tin chi tiết vào error object
      error.details = {
        status: error.response.status,
        message: error.response.data?.message || "Unknown error",
        data: error.response.data,
      };
    } else if (error.request) {
      console.error("Network error - no response received");
      error.details = {
        type: "network",
        message: "Không thể kết nối đến server",
      };
    } else {
      console.error("Request setup error:", error.message);
      error.details = {
        type: "request",
        message: error.message,
      };
    }

    throw error;
  }
};

export const deleteVoucher = async (id) => {
  try {
    await axiosInstance.delete(`/voucher/${id}`);
    return true;
  } catch (error) {
    console.error("Error deleting voucher:", error);
    throw error;
  }
};

export const searchVouchers = async (params) => {
  try {
    console.log("Searching vouchers with params:", params);
    const response = await axiosInstance.get(`/voucher/search`, { params });
    console.log("Search response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error searching vouchers:", error);
    if (error.response) {
      console.error("Server response:", error.response.data);
    }
    return [];
  }
};

// Kiểm tra mã voucher có tồn tại không
export const checkVoucherExists = async (maVoucher, excludeId = null) => {
  try {
    const params = { maVoucher };
    const vouchers = await searchVouchers(params);

    if (excludeId) {
      // Loại trừ voucher hiện tại khi đang edit
      return vouchers.some((voucher) => voucher.id !== excludeId);
    }

    return vouchers.length > 0;
  } catch (error) {
    console.error("Error checking voucher existence:", error);
    return false;
  }
};

// Khuyến mãi APIs
export const getAllPromotions = async () => {
  try {
    const response = await axiosInstance.get(`/khuyen-mai`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all promotions:", error);
    return [];
  }
};

export const createPromotion = async (promotionData) => {
  try {
    // Format dữ liệu trước khi gửi
    const formattedData = {
      ...promotionData,
      phanTramGiam: parseFloat(promotionData.phanTramGiam),
      trangThai: parseInt(promotionData.trangThai),
      ngayBatDau: promotionData.ngayBatDau + "T00:00:00",
      ngayKetThuc: promotionData.ngayKetThuc + "T23:59:59",
    };

    console.log("Sending promotion data:", formattedData);
    const response = await axiosInstance.post(`/khuyen-mai`, formattedData);
    return response.data;
  } catch (error) {
    console.error("Error creating promotion:", error);
    if (error.response) {
      console.error("Server response:", error.response.data);
    }
    throw error;
  }
};

export const updatePromotion = async (id, promotionData) => {
  try {
    // Format dữ liệu trước khi gửi
    const formattedData = {
      ...promotionData,
      phanTramGiam: parseFloat(promotionData.phanTramGiam),
      trangThai: parseInt(promotionData.trangThai),
      ngayBatDau: promotionData.ngayBatDau + "T00:00:00",
      ngayKetThuc: promotionData.ngayKetThuc + "T23:59:59",
    };

    console.log("Updating promotion data:", formattedData);
    const response = await axiosInstance.put(
      `/khuyen-mai/${id}`,
      formattedData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating promotion:", error);
    if (error.response) {
      console.error("Server response:", error.response.data);
    }
    throw error;
  }
};

export const deletePromotion = async (id) => {
  try {
    await axiosInstance.delete(`/khuyen-mai/${id}`);
    return true;
  } catch (error) {
    console.error("Error deleting promotion:", error);
    throw error;
  }
};

export const searchPromotions = async (params) => {
  try {
    const response = await axiosInstance.get(`/khuyen-mai/search`, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Error searching promotions:", error);
    return [];
  }
};
