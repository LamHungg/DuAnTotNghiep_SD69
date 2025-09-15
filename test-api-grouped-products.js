// Test API để kiểm tra sản phẩm đã gộp theo nhóm
const axios = require("axios");

const API_URL = "http://localhost:8080/api/customer";

async function testGroupedProducts() {
  try {
    console.log("🔍 Testing grouped products API...");

    // Test endpoint /products
    const response = await axios.get(`${API_URL}/products`);

    if (response.data.success) {
      const products = response.data.data;
      console.log(`✅ Found ${products.length} grouped products`);

      // Kiểm tra cấu trúc dữ liệu
      products.forEach((product, index) => {
        console.log(`\n📦 Product ${index + 1}:`);
        console.log(`   ID: ${product.id}`);
        console.log(`   Mã SP: ${product.maSanPham}`);
        console.log(`   Tên: ${product.tenSanPham}`);
        console.log(`   Danh mục: ${product.tenDanhMuc}`);
        console.log(`   Số biến thể: ${product.variants?.length || 0}`);
        console.log(`   Màu sắc: ${product.colors?.join(", ") || "N/A"}`);
        console.log(`   Kích thước: ${product.sizes?.join(", ") || "N/A"}`);

        if (product.variants && product.variants.length > 0) {
          console.log(`   Biến thể:`);
          product.variants.forEach((variant, vIndex) => {
            console.log(
              `     ${vIndex + 1}. ${variant.tenMauSac} - ${
                variant.tenKichCo
              } - ${variant.gia}đ - SL: ${variant.soLuong}`
            );
          });
        }
      });

      // Test endpoint /products/{id} cho sản phẩm đầu tiên
      if (products.length > 0) {
        const firstProduct = products[0];
        console.log(`\n🔍 Testing product detail for ID: ${firstProduct.id}`);

        const detailResponse = await axios.get(
          `${API_URL}/products/${firstProduct.id}`
        );

        if (detailResponse.data.success) {
          const productDetail = detailResponse.data;
          console.log(`✅ Product detail loaded successfully`);
          console.log(`   Tên: ${productDetail.name}`);
          console.log(`   Số biến thể: ${productDetail.variants?.length || 0}`);

          if (productDetail.variants && productDetail.variants.length > 0) {
            console.log(`   Biến thể:`);
            productDetail.variants.forEach((variant, vIndex) => {
              console.log(
                `     ${vIndex + 1}. ${variant.color} - ${variant.size} - ${
                  variant.price
                }đ - SL: ${variant.stock}`
              );
            });
          }
        } else {
          console.log(
            `❌ Failed to load product detail: ${detailResponse.data.message}`
          );
        }
      }
    } else {
      console.log(`❌ API failed: ${response.data.message}`);
    }
  } catch (error) {
    console.error("❌ Error testing API:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
    }
  }
}

// Chạy test
testGroupedProducts();
