// Simple test để kiểm tra API
console.log("Testing API...");

// Test với fetch thay vì axios
fetch("http://localhost:8080/api/customer/products")
  .then((response) => response.json())
  .then((data) => {
    console.log("API Response:", data);
    if (data.success) {
      console.log("Found", data.data.length, "products");
      if (data.data.length > 0) {
        const firstProduct = data.data[0];
        console.log("First product:", {
          id: firstProduct.id,
          name: firstProduct.tenSanPham,
          variants: firstProduct.variants?.length || 0,
        });
      }
    }
  })
  .catch((error) => {
    console.error("Error:", error);
  });
