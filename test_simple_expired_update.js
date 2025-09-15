// Script test đơn giản cập nhật voucher đã hết hạn
// Chạy script này trong browser console

const testSimpleExpiredUpdate = async () => {
  try {
    console.log("=== TESTING SIMPLE EXPIRED VOUCHER UPDATE ===");

    // Test 1: Lấy danh sách voucher
    console.log("1. Fetching vouchers...");

    const vouchersResponse = await fetch("http://localhost:8080/api/voucher", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (vouchersResponse.ok) {
      const vouchers = await vouchersResponse.json();
      console.log("Total vouchers:", vouchers.length);

      // Tìm voucher đã hết hạn
      const expiredVouchers = vouchers.filter((voucher) => {
        const endDate = new Date(voucher.ngayKetThuc);
        const today = new Date();
        return endDate < today;
      });

      console.log("Expired vouchers found:", expiredVouchers.length);

      if (expiredVouchers.length > 0) {
        const expiredVoucher = expiredVouchers[0];
        console.log("Testing with expired voucher:", expiredVoucher.tenVoucher);
        console.log("Current loaiGiamGia:", expiredVoucher.loaiGiamGia);

        // Test 2: Cập nhật đơn giản chỉ thay đổi mô tả
        console.log("\n2. Testing simple update (description only)...");

        const simpleUpdateData = {
          tenVoucher: expiredVoucher.tenVoucher,
          loaiGiamGia:
            expiredVoucher.loaiGiamGia === "TIEN_MAT"
              ? "GIA_TIEN"
              : expiredVoucher.loaiGiamGia,
          giaTriGiam: expiredVoucher.giaTriGiam,
          giaTriToiThieu: expiredVoucher.giaTriToiThieu,
          giamToiDa: expiredVoucher.giamToiDa,
          soLuong: expiredVoucher.soLuong,
          trangThai: expiredVoucher.trangThai,
          ngayBatDau: expiredVoucher.ngayBatDau,
          ngayKetThuc: expiredVoucher.ngayKetThuc,
          moTa: "Voucher đã được cập nhật - " + new Date().toLocaleString(),
        };

        console.log("Sending data:", simpleUpdateData);

        const updateResponse = await fetch(
          `http://localhost:8080/api/voucher/${expiredVoucher.id}`,
          {
            method: "PUT",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(simpleUpdateData),
          }
        );

        console.log("Update status:", updateResponse.status);
        if (updateResponse.ok) {
          const result = await updateResponse.json();
          console.log("✅ Successfully updated expired voucher:", result);
        } else {
          const errorData = await updateResponse.json();
          console.log("❌ Failed to update expired voucher:", errorData);
        }
      } else {
        console.log("⚠️ No expired vouchers found for testing");
      }
    } else {
      console.log("❌ Failed to fetch vouchers");
    }

    console.log("\n=== SIMPLE EXPIRED VOUCHER UPDATE TEST COMPLETED ===");
  } catch (error) {
    console.error("Test error:", error);
  }
};

// Chạy test
testSimpleExpiredUpdate();
