import axios from "axios";
import authService from "./authService";

const API_URL = "http://localhost:8080/api";

const stockService = {
  // Kiểm tra tồn kho cho một sản phẩm
  checkStock: async (chiTietSanPhamId) => {
    try {
      console.log("🔍 Checking stock for product ID:", chiTietSanPhamId);

      // Lấy token từ localStorage
      const currentUser = authService.getCurrentUser();
      const headers = {
        "Content-Type": "application/json",
      };

      // Thêm Authorization header nếu có token
      if (currentUser && currentUser.token) {
        headers["Authorization"] = `Bearer ${currentUser.token}`;
        console.log(
          "🔑 Adding Authorization header for stock check:",
          currentUser.token
        );
      }

      const response = await axios.get(
        `${API_URL}/cart/check-stock/${chiTietSanPhamId}`,
        {
          headers: headers,
          withCredentials: true,
        }
      );

      console.log("✅ Stock check result:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error checking stock:", error);
      throw error;
    }
  },

  // Kiểm tra tồn kho cho nhiều sản phẩm
  checkStockBatch: async (chiTietSanPhamIds) => {
    try {
      console.log("🔍 Checking stock for products:", chiTietSanPhamIds);

      // Lấy token từ localStorage
      const currentUser = authService.getCurrentUser();
      const headers = {
        "Content-Type": "application/json",
      };

      // Thêm Authorization header nếu có token
      if (currentUser && currentUser.token) {
        headers["Authorization"] = `Bearer ${currentUser.token}`;
        console.log(
          "🔑 Adding Authorization header for batch stock check:",
          currentUser.token
        );
      }

      const response = await axios.post(
        `${API_URL}/cart/check-stock-batch`,
        chiTietSanPhamIds,
        {
          headers: headers,
          withCredentials: true,
        }
      );

      console.log("✅ Batch stock check result:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error checking stock batch:", error);
      throw error;
    }
  },

  // Kiểm tra xem có thể thêm vào giỏ hàng không
  canAddToCart: async (chiTietSanPhamId, quantity = 1) => {
    try {
      const stockInfo = await stockService.checkStock(chiTietSanPhamId);

      if (!stockInfo.available) {
        return {
          canAdd: false,
          reason: stockInfo.message,
          stock: stockInfo.stock,
          inCart: stockInfo.inCart,
          canAdd: stockInfo.canAdd,
        };
      }

      if (stockInfo.canAdd < quantity) {
        return {
          canAdd: false,
          reason: `Chỉ có thể thêm ${stockInfo.canAdd} sản phẩm (đã có ${stockInfo.inCart} trong giỏ)`,
          stock: stockInfo.stock,
          inCart: stockInfo.inCart,
          canAdd: stockInfo.canAdd,
        };
      }

      return {
        canAdd: true,
        reason: "Có thể thêm vào giỏ hàng",
        stock: stockInfo.stock,
        inCart: stockInfo.inCart,
        canAdd: stockInfo.canAdd,
      };
    } catch (error) {
      console.error("❌ Error checking if can add to cart:", error);
      return {
        canAdd: false,
        reason: "Lỗi kiểm tra tồn kho",
        stock: 0,
        inCart: 0,
        canAdd: 0,
      };
    }
  },

  // Lấy thông tin tồn kho cho danh sách sản phẩm
  getStockInfoForProducts: async (products) => {
    try {
      if (!products || products.length === 0) {
        return [];
      }

      const chiTietSanPhamIds = products.map(
        (product) => product.chiTietSanPhamId || product.id
      );

      const stockData = await stockService.checkStockBatch(chiTietSanPhamIds);

      // Map thông tin tồn kho với sản phẩm
      const productsWithStock = products.map((product) => {
        const productId = product.chiTietSanPhamId || product.id;
        const stockInfo = stockData.stockInfo.find(
          (info) => info.chiTietSanPhamId === productId
        );

        return {
          ...product,
          stockInfo: stockInfo || {
            available: false,
            stock: 0,
            inCart: 0,
            canAdd: 0,
            message: "Không tìm thấy thông tin tồn kho",
          },
        };
      });

      return productsWithStock;
    } catch (error) {
      console.error("❌ Error getting stock info for products:", error);
      return products.map((product) => ({
        ...product,
        stockInfo: {
          available: false,
          stock: 0,
          inCart: 0,
          canAdd: 0,
          message: "Lỗi kiểm tra tồn kho",
        },
      }));
    }
  },

  // Kiểm tra tồn kho trước khi checkout
  validateCheckoutStock: async (cartItems) => {
    try {
      console.log("🔍 Validating checkout stock for items:", cartItems);

      const chiTietSanPhamIds = cartItems.map(
        (item) => item.chiTietSanPhamId || item.id
      );

      const stockData = await stockService.checkStockBatch(chiTietSanPhamIds);
      console.log("🔍 Stock data from backend:", stockData);

      const validationResults = cartItems.map((item) => {
        const productId = item.chiTietSanPhamId || item.id;
        const stockInfo = stockData.stockInfo.find(
          (info) => info.chiTietSanPhamId === productId
        );

        const requestedQuantity = item.soLuong || item.quantity || 1;
        const availableStock = stockInfo ? stockInfo.stock : 0;
        const inCart = stockInfo ? stockInfo.inCart : 0;

        console.log(`🔍 Product ${productId}:`, {
          requestedQuantity,
          availableStock,
          inCart,
          stockInfo,
          available: stockInfo ? stockInfo.available : false,
        });

        // Kiểm tra xem có đủ số lượng không
        const isValid =
          stockInfo &&
          stockInfo.available &&
          availableStock >= requestedQuantity;

        console.log(`🔍 Product ${productId} validation:`, {
          isValid,
          reason: isValid
            ? "OK"
            : stockInfo
            ? stockInfo.message
            : "Không tìm thấy sản phẩm",
        });

        return {
          item,
          isValid,
          stockInfo,
          requestedQuantity,
          availableStock,
          inCart,
          message: isValid
            ? "OK"
            : stockInfo
            ? stockInfo.message
            : "Không tìm thấy sản phẩm",
        };
      });

      const allValid = validationResults.every((result) => result.isValid);
      const invalidItems = validationResults.filter(
        (result) => !result.isValid
      );

      return {
        allValid,
        validationResults,
        invalidItems,
        message: allValid
          ? "Tất cả sản phẩm đều có đủ số lượng"
          : `Có ${invalidItems.length} sản phẩm không đủ số lượng`,
      };
    } catch (error) {
      console.error("❌ Error validating checkout stock:", error);
      return {
        allValid: false,
        validationResults: [],
        invalidItems: cartItems,
        message: "Lỗi kiểm tra tồn kho",
      };
    }
  },
};

export default stockService;
