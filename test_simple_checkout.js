// Script test đơn giản checkout
// Chạy script này trong browser console

const testSimpleCheckout = async () => {
  try {
    console.log("=== TESTING SIMPLE CHECKOUT ===");

    // 1. Kiểm tra authentication
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("❌ No token found");
      return;
    }

    console.log("✅ Token found:", token);

    // 2. Test với địa chỉ ID 15 (đã tạo thành công)
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
      diaChiId: 15, // Sử dụng địa chỉ mới tạo
      voucherId: null,
      phuongThucThanhToanId: 1,
      ghiChuKhachHang: "Test order with new address",
      phiVanChuyen: "30000.00",
      tongTienHang: "100000.00",
      tongThanhToan: "130000.00",
    };

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
      console.log("✅ Checkout successful:", processResult);
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

    console.log("=== SIMPLE CHECKOUT TEST COMPLETED ===");
  } catch (error) {
    console.error("❌ Error in simple checkout test:", error);
  }
};

// Export function
window.testSimpleCheckout = testSimpleCheckout;

// Auto-run
testSimpleCheckout();
