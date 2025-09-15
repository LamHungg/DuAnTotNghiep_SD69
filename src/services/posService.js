import axios from "axios";

const API_URL = "http://localhost:8080/api";

const posService = {
  getAllProducts: async () => {
    try {
      const response = await axios.get(`${API_URL}/pos/products`);
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  getProductDetails: async (productId) => {
    try {
      const response = await axios.get(
        `${API_URL}/chi-tiet-san-pham/product/${productId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching product details:", error);
      throw error;
    }
  },

  searchProducts: async (keyword) => {
    try {
      const response = await axios.get(
        `${API_URL}/pos/products/search?keyword=${keyword}`
      );
      return response.data;
    } catch (error) {
      console.error("Error searching products:", error);
      throw error;
    }
  },

  getAllCustomers: async () => {
    try {
      const response = await axios.get(`${API_URL}/pos/customers`);
      return response.data;
    } catch (error) {
      console.error("Error fetching customers:", error);
      throw error;
    }
  },

  searchCustomers: async (keyword) => {
    try {
      const response = await axios.get(
        `${API_URL}/pos/customers/search?keyword=${keyword}`
      );
      return response.data;
    } catch (error) {
      console.error("Error searching customers:", error);
      throw error;
    }
  },

  getActiveVouchers: async () => {
    try {
      const response = await axios.get(`${API_URL}/pos/vouchers/active`);
      return response.data;
    } catch (error) {
      console.error("Error fetching vouchers:", error);
      throw error;
    }
  },

  validateVoucher: async (voucherCode, totalAmount) => {
    try {
      const response = await axios.post(`${API_URL}/pos/vouchers/validate`, {
        maVoucher: voucherCode,
        tongTien: totalAmount,
      });
      return response.data;
    } catch (error) {
      console.error("Error validating voucher:", error);
      throw error;
    }
  },

  createPOSOrder: async (orderData) => {
    try {
      const response = await axios.post(`${API_URL}/pos/orders`, orderData);
      return response.data;
    } catch (error) {
      console.error("Error creating POS order:", error);
      throw error;
    }
  },

  generateVietQR: async (amount, orderCode, description) => {
    try {
      console.log("🔍 QR Debug - Input data:", {
        amount,
        orderCode,
        description,
      });

      const jsonData = { amount, orderCode, description };
      console.log("🔍 QR Debug - JSON data:", jsonData);

      const response = await axios.post(
        `${API_URL}/payment/create-vietqr-payment`,
        jsonData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("🔍 QR Debug - Response:", response.data);

      if (typeof response.data === "string") {
        return { qrDataURL: response.data };
      }

      if (!response.data || !response.data.qrDataURL) {
        console.log("🔍 QR Debug - Invalid response:", response.data);
        throw new Error("Không nhận được dữ liệu QR hợp lệ");
      }

      return response.data;
    } catch (error) {
      console.error("🔍 QR Debug - Error details:", error);
      console.error("🔍 QR Debug - Error response:", error.response?.data);

      console.log("🔍 QR Debug - Using fallback QR generation");
      return posService.generateOfflineQR(amount, orderCode, description);
    }
  },

  generateOfflineQR: (amount, orderCode, description) => {
    try {
      const qrString = `MBBank\nSố TK: 0567846199999\nChủ TK: DANG LAM HUNG\nSố tiền: ${amount.toLocaleString(
        "vi-VN"
      )} VND\nNội dung: Thanh toan ${orderCode}`;

      const qrDataURL = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(
        qrString
      )}`;

      console.log("🔍 QR Debug - Fallback QR string:", qrString);
      console.log("🔍 QR Debug - Fallback QR URL:", qrDataURL);

      return {
        qrDataURL: qrDataURL,
        qrString: qrString,
        amount: amount,
        orderCode: orderCode,
        description: description,
        isFallback: true,
        bankInfo: {
          bankName: "MBBank",
          accountNo: "0567846199999",
          accountName: "DANG LAM HUNG",
        },
      };
    } catch (error) {
      console.error("🔍 QR Debug - Fallback error:", error);
      throw new Error("Không thể tạo QR code");
    }
  },

  generateInvoicePDF: async (htmlContent) => {
    try {
      const response = await axios.post(
        `${API_URL}/invoices/generate-from-html`,
        htmlContent,
        {
          headers: {
            "Content-Type": "text/html",
            Accept: "application/pdf",
          },
          responseType: "blob",
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error generating invoice PDF:", error);
      throw error;
    }
  },

  checkStock: async (chiTietSanPhamId) => {
    try {
      const response = await axios.get(
        `${API_URL}/pos/products/${chiTietSanPhamId}/stock`
      );
      return response.data;
    } catch (error) {
      console.error("Error checking stock:", error);
      throw error;
    }
  },

  updateStock: async (chiTietSanPhamId, quantity) => {
    try {
      const response = await axios.put(
        `${API_URL}/pos/products/${chiTietSanPhamId}/stock`,
        {
          soLuong: quantity,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating stock:", error);
      throw error;
    }
  },
};

export default posService;
