// Script test hoàn chỉnh cho hệ thống thêm và cập nhật hình ảnh sản phẩm
// Chạy script này trong browser console sau khi backend restart

const testCompleteSystem = async () => {
  try {
    console.log("=== TESTING COMPLETE SYSTEM ===");

    // Test 1: Kiểm tra backend có hoạt động không
    console.log("1. Testing backend connection...");
    const healthResponse = await fetch("http://localhost:8080/actuator/health");
    console.log("Backend health status:", healthResponse.status);

    // Test 2: Lấy tất cả chi tiết sản phẩm
    console.log("2. Testing GET all chi tiet san pham...");
    const allResponse = await fetch(
      "http://localhost:8080/api/chi-tiet-san-pham"
    );
    console.log("All chi tiet san pham status:", allResponse.status);

    if (allResponse.ok) {
      const allData = await allResponse.json();
      console.log("Total chi tiet san pham:", allData.length);
      console.log("Sample item:", allData[0]);
    }

    // Test 3: Lấy chi tiết sản phẩm ID 27
    console.log("3. Testing GET chi tiet san pham ID 27...");
    const id27Response = await fetch(
      "http://localhost:8080/api/chi-tiet-san-pham/27"
    );
    console.log("ID 27 status:", id27Response.status);

    if (id27Response.ok) {
      const id27Data = await id27Response.json();
      console.log("✅ ID 27 data:", id27Data);
      console.log(
        "Images count:",
        id27Data.hinhAnh ? id27Data.hinhAnh.length : 0
      );
    } else {
      const error = await id27Response.text();
      console.log("❌ ID 27 error:", error);
    }

    // Test 4: Lấy chi tiết sản phẩm ID 6 (có ảnh)
    console.log("4. Testing GET chi tiet san pham ID 6...");
    const id6Response = await fetch(
      "http://localhost:8080/api/chi-tiet-san-pham/6"
    );
    console.log("ID 6 status:", id6Response.status);

    if (id6Response.ok) {
      const id6Data = await id6Response.json();
      console.log("✅ ID 6 data:", id6Data);
      console.log(
        "Images count:",
        id6Data.hinhAnh ? id6Data.hinhAnh.length : 0
      );
    } else {
      const error = await id6Response.text();
      console.log("❌ ID 6 error:", error);
    }

    // Test 5: Test upload ảnh (nếu có endpoint)
    console.log("5. Testing image upload endpoint...");
    try {
      const uploadResponse = await fetch(
        "http://localhost:8080/api/hinhanhsanpham/upload",
        {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: new FormData(), // Empty form data for testing
        }
      );
      console.log("Upload endpoint status:", uploadResponse.status);
    } catch (error) {
      console.log("Upload endpoint not available or error:", error.message);
    }

    console.log("=== TEST COMPLETED ===");
  } catch (error) {
    console.error("Test error:", error);
  }
};

// Chạy test
testCompleteSystem();
