import axios from "axios";

const API_URL = "http://localhost:8080/api";

// Lấy danh sách voucher có hiệu lực cho customer
export const getActiveVouchers = async () => {
  try {
    const response = await axios.get(`${API_URL}/customer/vouchers`);
    return response.data.success ? response.data.data : [];
  } catch (error) {
    console.error("Error fetching active vouchers:", error);
    return [];
  }
};

// Kiểm tra voucher có hợp lệ không
export const validateVoucher = async (maVoucher, tongTienHang = 0) => {
  try {
    const response = await axios.post(
      `${API_URL}/customer/vouchers/validate`,
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
    const response = await axios.get(`${API_URL}/customer/promotions`);
    return response.data.success ? response.data.data : [];
  } catch (error) {
    console.error("Error fetching active promotions:", error);
    return [];
  }
};

// Admin APIs
export const getAllVouchers = async () => {
  try {
    const response = await axios.get(`${API_URL}/voucher`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all vouchers:", error);
    return [];
  }
};

export const createVoucher = async (voucherData) => {
  try {
    const response = await axios.post(`${API_URL}/voucher`, voucherData);
    return response.data;
  } catch (error) {
    console.error("Error creating voucher:", error);
    throw error;
  }
};

export const updateVoucher = async (id, voucherData) => {
  try {
    const response = await axios.put(`${API_URL}/voucher/${id}`, voucherData);
    return response.data;
  } catch (error) {
    console.error("Error updating voucher:", error);
    throw error;
  }
};

export const deleteVoucher = async (id) => {
  try {
    await axios.delete(`${API_URL}/voucher/${id}`);
    return true;
  } catch (error) {
    console.error("Error deleting voucher:", error);
    throw error;
  }
};

export const searchVouchers = async (params) => {
  try {
    const response = await axios.get(`${API_URL}/voucher/search`, { params });
    return response.data;
  } catch (error) {
    console.error("Error searching vouchers:", error);
    return [];
  }
};

// Khuyến mãi APIs
export const getAllPromotions = async () => {
  try {
    const response = await axios.get(`${API_URL}/khuyen-mai`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all promotions:", error);
    return [];
  }
};

export const createPromotion = async (promotionData) => {
  try {
    const response = await axios.post(`${API_URL}/khuyen-mai`, promotionData);
    return response.data;
  } catch (error) {
    console.error("Error creating promotion:", error);
    throw error;
  }
};

export const updatePromotion = async (id, promotionData) => {
  try {
    const response = await axios.put(
      `${API_URL}/khuyen-mai/${id}`,
      promotionData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating promotion:", error);
    throw error;
  }
};

export const deletePromotion = async (id) => {
  try {
    await axios.delete(`${API_URL}/khuyen-mai/${id}`);
    return true;
  } catch (error) {
    console.error("Error deleting promotion:", error);
    throw error;
  }
};

export const searchPromotions = async (params) => {
  try {
    const response = await axios.get(`${API_URL}/khuyen-mai/search`, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Error searching promotions:", error);
    return [];
  }
};
