// Test API cho trang chủ
console.log("Testing homepage APIs...");

// Test featured products API
fetch("http://localhost:8080/api/customer/products/featured")
  .then((response) => response.json())
  .then((data) => {
    console.log("Featured Products API Response:", data);
    if (data.success) {
      console.log("Found", data.data.length, "featured products");
      if (data.data.length > 0) {
        const firstProduct = data.data[0];
        console.log("First featured product:", {
          id: firstProduct.id,
          name: firstProduct.tenSanPham,
          variants: firstProduct.variants?.length || 0,
          colors: firstProduct.colors?.length || 0,
          sizes: firstProduct.sizes?.length || 0,
        });
      }
    }
  })
  .catch((error) => {
    console.error("Error testing featured products:", error);
  });

// Test category products API
fetch("http://localhost:8080/api/customer/products/category/Áo%20thun")
  .then((response) => response.json())
  .then((data) => {
    console.log("Category Products API Response:", data);
    if (data.success) {
      console.log("Found", data.data.length, "products in category");
      if (data.data.length > 0) {
        const firstProduct = data.data[0];
        console.log("First category product:", {
          id: firstProduct.id,
          name: firstProduct.tenSanPham,
          variants: firstProduct.variants?.length || 0,
          colors: firstProduct.colors?.length || 0,
          sizes: firstProduct.sizes?.length || 0,
        });
      }
    }
  })
  .catch((error) => {
    console.error("Error testing category products:", error);
  });
