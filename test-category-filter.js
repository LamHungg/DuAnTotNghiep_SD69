// Test API lọc danh mục
console.log("Testing category filter APIs...");

// Test categories API
fetch("http://localhost:8080/api/customer/categories")
  .then((response) => response.json())
  .then((data) => {
    console.log("Categories API Response:", data);
    if (data.success) {
      console.log("Found", data.data.length, "categories");
      data.data.forEach((category) => {
        console.log(`- ${category.name}: ${category.count} products`);
      });
    }
  })
  .catch((error) => {
    console.error("Error testing categories:", error);
  });

// Test products by category API
const testCategories = ["Áo thun", "Quần", "Áo khoác"];
testCategories.forEach((category) => {
  fetch(
    `http://localhost:8080/api/customer/products/category/${encodeURIComponent(
      category
    )}`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(`Products in category "${category}":`, data);
      if (data.success) {
        console.log(`Found ${data.data.length} products in "${category}"`);
        if (data.data.length > 0) {
          const firstProduct = data.data[0];
          console.log(`First product in "${category}":`, {
            id: firstProduct.id,
            name: firstProduct.tenSanPham,
            category: firstProduct.tenDanhMuc,
            variants: firstProduct.variants?.length || 0,
          });
        }
      }
    })
    .catch((error) => {
      console.error(`Error testing category "${category}":`, error);
    });
});

// Test all products API to see category distribution
fetch("http://localhost:8080/api/customer/products")
  .then((response) => response.json())
  .then((data) => {
    console.log("All Products API Response:", data);
    if (data.success) {
      console.log("Found", data.data.length, "total products");

      // Analyze category distribution
      const categoryCounts = {};
      data.data.forEach((product) => {
        const category = product.tenDanhMuc || product.category || "Khác";
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      });

      console.log("Category distribution:");
      Object.entries(categoryCounts).forEach(([category, count]) => {
        console.log(`- ${category}: ${count} products`);
      });
    }
  })
  .catch((error) => {
    console.error("Error testing all products:", error);
  });
