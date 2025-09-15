import axios from "axios";
import authService from "./authService";

const API_URL = "http://localhost:8080/api";

// Helper function để tạo mô tả cho phương thức thanh toán
const getPaymentMethodDescription = (tenPhuongThuc) => {
  switch (tenPhuongThuc) {
    case "Tiền mặt":
      return "Thanh toán bằng tiền mặt";
    case "Chuyển khoản":
      return "Chuyển khoản qua tài khoản ngân hàng";
    case "Momo":
      return "Thanh toán qua ví điện tử Momo";
    case "Thẻ tín dụng":
      return "Thanh toán qua thẻ tín dụng";
    case "VNPay":
      return "Thanh toán qua cổng thanh toán VNPay";
    case "ZaloPay":
      return "Thanh toán qua ví điện tử ZaloPay";
    case "ShopeePay":
      return "Thanh toán qua ví điện tử ShopeePay";
    case "COD":
      return "Thanh toán khi nhận hàng (Cash On Delivery)";
    case "Thanh toán khi nhận hàng":
    case "Thanh toán khi nh?n hàng":
      return "Thanh toán bằng tiền mặt khi nhận hàng";
    case "Chuyển khoản ngân hàng":
    case "Chuy?n kho?n ngân hàng":
      return "Chuyển khoản qua tài khoản ngân hàng";
    case "Ví điện tử":
    case "Ví di?n t?":
      return "Thanh toán qua ví điện tử";
    case "Thẻ tín dụng/ghi nợ":
    case "Th? tín d?ng/ghi n?":
      return "Thanh toán qua thẻ tín dụng hoặc thẻ ghi nợ";
    default:
      return `Phương thức thanh toán: ${tenPhuongThuc}`;
  }
};

const checkoutService = {
  // Xử lý checkout
  processCheckout: async (checkoutData) => {
    try {
      console.log("Checkout data:", checkoutData);

      // Đảm bảo cartItems có đúng format
      const fixedCartItems = checkoutData.cartItems.map((item) => ({
        chiTietSanPhamId: item.chiTietSanPhamId || item.id,
        soLuong: item.soLuong || item.quantity,
        gia: item.gia || item.price,
        thanhTien: item.thanhTien || item.gia * item.soLuong,
      }));

      // Lấy khachHangId từ localStorage
      const userStr = localStorage.getItem("user");
      let khachHangId = null;
      if (userStr) {
        try {
          const userData = JSON.parse(userStr);
          khachHangId = userData.id;
          console.log("✅ Found khachHangId from localStorage:", khachHangId);
        } catch (e) {
          console.error("❌ Error parsing user data:", e);
        }
      }

      const fixedCheckoutData = {
        ...checkoutData,
        cartItems: fixedCartItems,
        khachHangId: khachHangId || 7, // Fallback to default ID
      };

      console.log("Fixed checkout data:", fixedCheckoutData);

      const response = await axios.post(
        `${API_URL}/checkout/process`,
        fixedCheckoutData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // Sử dụng session-based authentication
        }
      );

      console.log("Checkout response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Lỗi checkout:", error);
      throw error;
    }
  },

  // Test checkout endpoint
  testCheckout: async () => {
    try {
      const response = await axios.get(`${API_URL}/checkout/test`, {
        headers: authService.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Lỗi test checkout:", error);
      throw error;
    }
  },

  // Test process checkout
  testProcessCheckout: async (checkoutData) => {
    try {
      console.log("Test checkout data:", checkoutData);

      // Đảm bảo cartItems có đúng format
      const fixedCartItems = checkoutData.cartItems.map((item) => ({
        chiTietSanPhamId: item.chiTietSanPhamId || item.id,
        soLuong: item.soLuong || item.quantity,
        gia: item.gia || item.price,
        thanhTien: item.thanhTien || item.gia * item.soLuong,
      }));

      // Lấy khachHangId từ localStorage
      const userStr = localStorage.getItem("user");
      let khachHangId = null;
      if (userStr) {
        try {
          const userData = JSON.parse(userStr);
          khachHangId = userData.id;
        } catch (e) {
          console.error("Error parsing user data:", e);
        }
      }

      const fixedCheckoutData = {
        ...checkoutData,
        cartItems: fixedCartItems,
        khachHangId: khachHangId || 7, // Fallback to default ID
      };

      console.log("Fixed test checkout data:", fixedCheckoutData);

      const response = await axios.post(
        `${API_URL}/checkout/test-process`,
        fixedCheckoutData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // Sử dụng session-based authentication
        }
      );

      console.log("Test checkout response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Lỗi test process checkout:", error);
      throw error;
    }
  },

  // Lấy mã đơn hàng mới
  generateOrderNumber: async () => {
    try {
      const response = await axios.get(
        `${API_URL}/checkout/generate-order-number`,
        {
          headers: authService.getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi generate order number:", error);
      throw error;
    }
  },

  // Lấy danh sách phương thức thanh toán
  getPaymentMethods: async () => {
    try {
      const response = await axios.get(`${API_URL}/payment/methods`, {
        headers: authService.getAuthHeaders(),
      });

      console.log("Payment methods from backend:", response.data);

      // Transform data từ backend format sang frontend format
      const transformedData = response.data.map((item) => ({
        id: item.id,
        ten: item.tenPhuongThuc,
        moTa: getPaymentMethodDescription(item.tenPhuongThuc),
      }));

      console.log("Transformed payment methods:", transformedData);
      return transformedData;
    } catch (error) {
      console.error("Lỗi lấy phương thức thanh toán:", error);
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
      }
      // Fallback data
      return [
        {
          id: 1,
          ten: "Thanh toán khi nhận hàng",
          moTa: "Thanh toán bằng tiền mặt khi nhận hàng",
        },
        {
          id: 2,
          ten: "Chuyển khoản ngân hàng",
          moTa: "Chuyển khoản qua tài khoản ngân hàng",
        },
        {
          id: 3,
          ten: "Ví điện tử",
          moTa: "Thanh toán qua ví điện tử (Momo, ZaloPay, VNPay)",
        },
      ];
    }
  },

  // Tính phí vận chuyển
  calculateShippingFee: async (addressId) => {
    try {
      const response = await axios.post(
        `${API_URL}/shipping/calculate`,
        { addressId },
        {
          headers: authService.getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi tính phí vận chuyển:", error);
      // Fallback: phí vận chuyển cố định
      return { phiVanChuyen: 30000 };
    }
  },
};

export default checkoutService;
