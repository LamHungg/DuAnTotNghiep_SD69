const axios = require("axios");

const BASE_URL = "http://localhost:8080";

async function debugVariantData() {
  try {
    console.log("🔍 Debug dữ liệu variant từ API...\n");

    // 1. Lấy danh sách sản phẩm chính
    console.log("1️⃣ Lấy danh sách sản phẩm chính...");
    const mainProductsResponse = await axios.get(`${BASE_URL}/api/sanpham`, {
      withCredentials: true,
    });

    console.log("✅ Danh sách sản phẩm chính:");
    mainProductsResponse.data.forEach((item, index) => {
      console.log(`   ${index + 1}. ID: ${item.id}, Tên: ${item.tenSanPham}`);
    });

    // 2. Lấy chi tiết sản phẩm đầu tiên
    console.log("\n2️⃣ Lấy chi tiết sản phẩm đầu tiên...");
    const firstProductId = mainProductsResponse.data[0]?.id;
    if (firstProductId) {
      try {
        const productDetailResponse = await axios.get(
          `${BASE_URL}/api/customer/products/${firstProductId}`,
          {
            withCredentials: true,
          }
        );

        console.log("✅ Chi tiết sản phẩm ID", firstProductId, ":");
        console.log(
          "   Dữ liệu:",
          JSON.stringify(productDetailResponse.data, null, 2)
        );

        if (productDetailResponse.data.variants) {
          console.log("\n   Variants:");
          productDetailResponse.data.variants.forEach((variant, index) => {
            console.log(
              `   ${index + 1}. ID: ${variant.id}, Màu: ${
                variant.tenMauSac || variant.color
              }, Size: ${variant.tenKichCo || variant.size}, Giá: ${
                variant.gia || variant.price
              }, SL: ${variant.soLuong || variant.stock}`
            );
          });
        }
      } catch (error) {
        console.log(
          "❌ Không thể lấy chi tiết sản phẩm:",
          error.response?.data || error.message
        );
      }
    }

    // 3. Lấy chi tiết sản phẩm thứ 2 (nếu có)
    console.log("\n3️⃣ Lấy chi tiết sản phẩm thứ 2...");
    const secondProductId = mainProductsResponse.data[1]?.id;
    if (secondProductId) {
      try {
        const productDetailResponse = await axios.get(
          `${BASE_URL}/api/customer/products/${secondProductId}`,
          {
            withCredentials: true,
          }
        );

        console.log("✅ Chi tiết sản phẩm ID", secondProductId, ":");
        console.log(
          "   Dữ liệu:",
          JSON.stringify(productDetailResponse.data, null, 2)
        );

        if (productDetailResponse.data.variants) {
          console.log("\n   Variants:");
          productDetailResponse.data.variants.forEach((variant, index) => {
            console.log(
              `   ${index + 1}. ID: ${variant.id}, Màu: ${
                variant.tenMauSac || variant.color
              }, Size: ${variant.tenKichCo || variant.size}, Giá: ${
                variant.gia || variant.price
              }, SL: ${variant.soLuong || variant.stock}`
            );
          });
        }
      } catch (error) {
        console.log(
          "❌ Không thể lấy chi tiết sản phẩm:",
          error.response?.data || error.message
        );
      }
    }

    // 4. Kiểm tra API chi tiết sản phẩm trực tiếp
    console.log("\n4️⃣ Kiểm tra API chi tiết sản phẩm trực tiếp...");
    try {
      const directResponse = await axios.get(
        `${BASE_URL}/api/chi-tiet-san-pham`,
        {
          withCredentials: true,
        }
      );

      console.log("✅ Dữ liệu chi tiết sản phẩm trực tiếp:");
      directResponse.data.forEach((item, index) => {
        console.log(
          `   ${index + 1}. ID: ${item.id}, Tên: ${
            item.sanPham?.tenSanPham || "N/A"
          }, Màu: ${item.mauSac}, Size: ${item.kichCo}, Giá: ${item.gia}, SL: ${
            item.soLuong
          }`
        );
      });
    } catch (error) {
      console.log(
        "❌ Không thể lấy dữ liệu chi tiết sản phẩm:",
        error.response?.data || error.message
      );
    }
  } catch (error) {
    console.error("❌ Lỗi khi debug dữ liệu variant!");
    console.error("Lỗi:", error.response?.data || error.message);
  }
}

// Chạy debug
debugVariantData();
