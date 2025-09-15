const axios = require("axios");

const BASE_URL = "http://localhost:8080";

async function checkProduct16() {
  try {
    console.log("🔍 Kiểm tra sản phẩm ID 16...\n");

    // 1. Kiểm tra sản phẩm ID 16
    console.log("1️⃣ Kiểm tra sản phẩm ID 16...");
    try {
      const product16Response = await axios.get(
        `${BASE_URL}/api/chi-tiet-san-pham/16`,
        {
          withCredentials: true,
        }
      );
      console.log("✅ Sản phẩm ID 16 tồn tại:", product16Response.data);
    } catch (error) {
      console.log("❌ Sản phẩm ID 16 KHÔNG tồn tại!");
      console.log("   Lỗi:", error.response?.data || error.message);
    }

    // 2. Lấy danh sách tất cả sản phẩm để xem có ID nào
    console.log("\n2️⃣ Lấy danh sách tất cả sản phẩm...");
    try {
      const allProductsResponse = await axios.get(
        `${BASE_URL}/api/chi-tiet-san-pham`,
        {
          withCredentials: true,
        }
      );

      console.log("✅ Danh sách sản phẩm có sẵn:");
      allProductsResponse.data.forEach((item, index) => {
        console.log(
          `   ${index + 1}. ID: ${item.id}, Tên: ${
            item.sanPham?.tenSanPham || "N/A"
          }, Màu: ${item.mauSac}, Size: ${item.kichCo}, SL: ${item.soLuong}`
        );
      });
    } catch (error) {
      console.log(
        "❌ Không thể lấy danh sách sản phẩm:",
        error.response?.data || error.message
      );
    }

    // 3. Kiểm tra sản phẩm chính (không phải chi tiết)
    console.log("\n3️⃣ Lấy danh sách sản phẩm chính...");
    try {
      const mainProductsResponse = await axios.get(`${BASE_URL}/api/sanpham`, {
        withCredentials: true,
      });

      console.log("✅ Danh sách sản phẩm chính:");
      mainProductsResponse.data.forEach((item, index) => {
        console.log(`   ${index + 1}. ID: ${item.id}, Tên: ${item.tenSanPham}`);
      });
    } catch (error) {
      console.log(
        "❌ Không thể lấy danh sách sản phẩm chính:",
        error.response?.data || error.message
      );
    }
  } catch (error) {
    console.error("❌ Lỗi khi kiểm tra sản phẩm!");
    console.error("Lỗi:", error.response?.data || error.message);
  }
}

// Chạy kiểm tra
checkProduct16();
