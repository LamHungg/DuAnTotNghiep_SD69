// Script test update voucher
// Copy và paste vào Console của browser khi đang ở trang Voucher Management

const testVoucherUpdate = () => {
  console.log("🔧 Test Update Voucher...\n");

  // Test update voucher
  const testUpdateVoucher = async () => {
    try {
      console.log("1️⃣ Test update voucher...");
      
      // Dữ liệu voucher test
      const voucherData = {
        maVoucher: "VC100K",
        tenVoucher: "Giảm 100K",
        loaiGiamGia: "GIA_TIEN",
        giaTriGiam: 100000,
        giaTriToiThieu: 500000,
        giamToiDa: null,
        soLuong: 10,
        trangThai: 1,
        moTa: "Áp dụng cho đơn từ 500K",
        ngayBatDau: "2025-08-29",
        ngayKetThuc: "2025-08-31"
      };

      console.log("📋 Dữ liệu voucher:", voucherData);
      
      // Gọi API update voucher (thay đổi ID theo voucher thực tế)
      const voucherId = 1; // Thay đổi ID này theo voucher bạn muốn update
      
      const response = await fetch(`http://localhost:8080/api/voucher/${voucherId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(voucherData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("✅ Update voucher thành công:", result);
        return true;
      } else {
        const error = await response.text();
        console.log("❌ Lỗi update voucher:", error);
        return false;
      }
    } catch (error) {
      console.log("❌ Lỗi update voucher:", error.message);
      return false;
    }
  };

  // Test tạo voucher mới
  const testCreateVoucher = async () => {
    try {
      console.log("2️⃣ Test tạo voucher mới...");
      
      // Dữ liệu voucher mới
      const voucherData = {
        maVoucher: "VC200K",
        tenVoucher: "Giảm 200K",
        loaiGiamGia: "GIA_TIEN",
        giaTriGiam: 200000,
        giaTriToiThieu: 1000000,
        giamToiDa: null,
        soLuong: 5,
        trangThai: 1,
        moTa: "Áp dụng cho đơn từ 1M",
        ngayBatDau: "2025-08-29",
        ngayKetThuc: "2025-09-30"
      };

      console.log("📋 Dữ liệu voucher mới:", voucherData);
      
      const response = await fetch("http://localhost:8080/api/voucher", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(voucherData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("✅ Tạo voucher thành công:", result);
        return result.id;
      } else {
        const error = await response.text();
        console.log("❌ Lỗi tạo voucher:", error);
        return null;
      }
    } catch (error) {
      console.log("❌ Lỗi tạo voucher:", error.message);
      return null;
    }
  };

  // Test lấy danh sách voucher
  const testGetVouchers = async () => {
    try {
      console.log("3️⃣ Test lấy danh sách voucher...");
      
      const response = await fetch("http://localhost:8080/api/voucher");
      
      if (response.ok) {
        const vouchers = await response.json();
        console.log("✅ Danh sách voucher:", vouchers);
        console.log(`   Tổng số voucher: ${vouchers.length}`);
        
        if (vouchers.length > 0) {
          console.log("📋 Voucher đầu tiên:", vouchers[0]);
          return vouchers[0].id;
        }
        return null;
      } else {
        console.log("❌ Lỗi lấy danh sách voucher");
        return null;
      }
    } catch (error) {
      console.log("❌ Lỗi lấy danh sách voucher:", error.message);
      return null;
    }
  };

  // Chạy toàn bộ test
  const runAllTests = async () => {
    console.log("🚀 Bắt đầu test voucher...\n");
    
    // Test lấy danh sách voucher
    const voucherId = await testGetVouchers();
    
    if (voucherId) {
      console.log(`📋 Sử dụng voucher ID: ${voucherId} để test update`);
      
      // Test update voucher
      const updateSuccess = await testUpdateVoucher();
      
      if (updateSuccess) {
        console.log("🎉 Test update voucher thành công!");
      } else {
        console.log("⚠️ Test update voucher thất bại");
      }
    } else {
      console.log("⚠️ Không có voucher nào để test update");
      console.log("💡 Tạo voucher mới để test...");
      
      const newVoucherId = await testCreateVoucher();
      if (newVoucherId) {
        console.log(`✅ Đã tạo voucher mới với ID: ${newVoucherId}`);
      }
    }
  };

  runAllTests();
};

// Chạy test
testVoucherUpdate();
