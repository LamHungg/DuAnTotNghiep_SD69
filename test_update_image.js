// Script test cập nhật ảnh chi tiết sản phẩm
// Chạy script này trong browser console

const testUpdateImage = async () => {
  try {
    console.log("=== TESTING UPDATE IMAGE ===");

    // Test 1: Lấy chi tiết sản phẩm ID 29 trước khi cập nhật
    console.log("1. Getting chi tiet san pham ID 29 before update...");
    const beforeResponse = await fetch(
      "http://localhost:8080/api/chi-tiet-san-pham/29"
    );
    console.log("Before update status:", beforeResponse.status);

    if (beforeResponse.ok) {
      const beforeData = await beforeResponse.json();
      console.log("✅ Before update data:", beforeData);
      console.log(
        "Images before:",
        beforeData.hinhAnh ? beforeData.hinhAnh.length : 0
      );
    }

    // Test 2: Cập nhật chi tiết sản phẩm với ảnh mới
    console.log("2. Testing UPDATE chi tiet san pham ID 29...");

    const updateData = {
      idSanPham: 27,
      idMauSac: 2,
      idKichCo: 1,
      idChatLieu: 2,
      soLuong: 100,
      giaNhap: 500000,
      gia: 800000,
      trangThai: 1,
      hinhAnh: [
        "http://localhost:8080/uploads/test-image-1.jpg",
        "http://localhost:8080/uploads/test-image-2.jpg",
      ],
    };

    console.log("Update data being sent:", updateData);

    const updateResponse = await fetch(
      "http://localhost:8080/api/chi-tiet-san-pham/29",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      }
    );

    console.log("Update status:", updateResponse.status);

    if (updateResponse.ok) {
      const updateResult = await updateResponse.json();
      console.log("✅ Update successful:", updateResult);
      console.log(
        "Images after update:",
        updateResult.hinhAnh ? updateResult.hinhAnh.length : 0
      );
    } else {
      const error = await updateResponse.text();
      console.log("❌ Update failed:", error);
    }

    // Test 3: Lấy lại chi tiết sản phẩm sau khi cập nhật
    console.log("3. Getting chi tiet san pham ID 29 after update...");
    const afterResponse = await fetch(
      "http://localhost:8080/api/chi-tiet-san-pham/29"
    );
    console.log("After update status:", afterResponse.status);

    if (afterResponse.ok) {
      const afterData = await afterResponse.json();
      console.log("✅ After update data:", afterData);
      console.log(
        "Images after:",
        afterData.hinhAnh ? afterData.hinhAnh.length : 0
      );
    }

    console.log("=== TEST COMPLETED ===");
  } catch (error) {
    console.error("Test error:", error);
  }
};

// Chạy test
testUpdateImage();
