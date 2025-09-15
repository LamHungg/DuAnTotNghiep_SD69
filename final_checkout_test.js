// Script test cuối cùng checkout sau khi đã sửa database
// Chạy script này trong browser console

const finalCheckoutTest = async () => {
  try {
    console.log("=== FINAL CHECKOUT TEST ===");
    console.log("Database đã được sửa - test checkout process");

    // 1. Kiểm tra authentication
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("❌ No token found");
      return;
    }

    console.log("✅ Token found:", token);

    // 2. Test checkout với địa chỉ ID 15
    console.log("2. Testing checkout with address ID 15...");
    const processData = {
      cartItems: [
        {
          chiTietSanPhamId: 1,
          soLuong: 1,
          gia: "100000.00",
          thanhTien: "100000.00",
        },
      ],
      diaChiId: 15, // Sử dụng địa chỉ đã tạo thành công
      voucherId: null,
      phuongThucThanhToanId: 1,
      ghiChuKhachHang: "Test order after database fix",
      phiVanChuyen: "30000.00",
      tongTienHang: "100000.00",
      tongThanhToan: "130000.00",
    };

    console.log("Process data:", processData);

    const processResponse = await fetch(
      "http://localhost:8080/api/checkout/process",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(processData),
      }
    );

    console.log("Process response status:", processResponse.status);

    if (processResponse.ok) {
      const processResult = await processResponse.json();
      console.log("🎉 CHECKOUT SUCCESSFUL! 🎉");
      console.log("✅ Order created:", processResult);
      console.log("✅ Order ID:", processResult.id);
      console.log("✅ Order code:", processResult.maDonHang);
      console.log("✅ Status:", processResult.trangThai);
      console.log("✅ Total amount:", processResult.tongThanhToan);
      console.log("✅ Message:", processResult.message);
    } else {
      const errorText = await processResponse.text();
      console.log("❌ Checkout failed:", errorText);

      try {
        const errorJson = JSON.parse(errorText);
        console.log("❌ Error details:", errorJson);
      } catch (e) {
        console.log("❌ Error (text):", errorText);
      }
    }

    console.log("=== FINAL CHECKOUT TEST COMPLETED ===");
  } catch (error) {
    console.error("❌ Error in final checkout test:", error);
  }
};

// Export function
window.finalCheckoutTest = finalCheckoutTest;

// Auto-run
finalCheckoutTest();
