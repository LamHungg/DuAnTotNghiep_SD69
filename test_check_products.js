const axios = require("axios");

const BASE_URL = "http://localhost:8080";

async function checkProducts() {
  try {
    console.log("🔍 Kiểm tra danh sách sản phẩm trong database...\n");

    // 1. Lấy danh sách chi tiết sản phẩm
    console.log("1️⃣ Lấy danh sách chi tiết sản phẩm...");
    const chiTietResponse = await axios.get(
      `${BASE_URL}/api/chi-tiet-san-pham`,
      {
        withCredentials: true,
      }
    );

    console.log("✅ Danh sách chi tiết sản phẩm:");
    chiTietResponse.data.forEach((item, index) => {
      console.log(
        `   ${index + 1}. ID: ${item.id}, Tên: ${
          item.sanPham?.tenSanPham || "N/A"
        }, Màu: ${item.mauSac}, Size: ${item.kichCo}, SL: ${item.soLuong}`
      );
    });

    // 2. Kiểm tra sản phẩm ID 15 cụ thể
    console.log("\n2️⃣ Kiểm tra sản phẩm ID 15...");
    try {
      const product15Response = await axios.get(
        `${BASE_URL}/api/chi-tiet-san-pham/15`,
        {
          withCredentials: true,
        }
      );
      console.log("✅ Sản phẩm ID 15 tồn tại:", product15Response.data);
    } catch (error) {
      console.log("❌ Sản phẩm ID 15 KHÔNG tồn tại!");
      console.log("   Lỗi:", error.response?.data || error.message);
    }

    // 3. Kiểm tra sản phẩm ID 1 (đã test thành công)
    console.log("\n3️⃣ Kiểm tra sản phẩm ID 1...");
    try {
      const product1Response = await axios.get(
        `${BASE_URL}/api/chi-tiet-san-pham/1`,
        {
          withCredentials: true,
        }
      );
      console.log("✅ Sản phẩm ID 1 tồn tại:", product1Response.data);
    } catch (error) {
      console.log("❌ Sản phẩm ID 1 KHÔNG tồn tại!");
      console.log("   Lỗi:", error.response?.data || error.message);
    }
  } catch (error) {
    console.error("❌ Lỗi khi kiểm tra sản phẩm!");
    console.error("Lỗi:", error.response?.data || error.message);
  }
}

// Chạy kiểm tra
checkProducts();
