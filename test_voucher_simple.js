// Script test tạo voucher đơn giản
// Chạy script này trong browser console

const testCreateVoucherSimple = async () => {
  try {
    console.log("=== TESTING CREATE VOUCHER SIMPLE ===");

    const voucherData = {
      maVoucher: "", // Để backend tự động generate
      tenVoucher: "Test Voucher Simple",
      loaiGiamGia: "GIA_TIEN",
      giaTriGiam: 10000,
      giaTriToiThieu: 50000,
      giamToiDa: 5000,
      soLuong: 100,
      trangThai: 1,
      ngayBatDau: "2024-01-01",
      ngayKetThuc: "2024-12-31",
      moTa: "Test voucher",
    };

    console.log("Sending data:", voucherData);

    const response = await fetch("http://localhost:8080/api/voucher", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(voucherData),
    });

    console.log("Response status:", response.status);

    if (response.ok) {
      const result = await response.json();
      console.log("✅ SUCCESS!");
      console.log("Created voucher:", result);
      console.log("Generated code:", result.maVoucher);
    } else {
      const errorData = await response.json();
      console.log("❌ ERROR:", errorData);
    }
  } catch (error) {
    console.error("Test error:", error);
  }
};

// Chạy test
testCreateVoucherSimple();
