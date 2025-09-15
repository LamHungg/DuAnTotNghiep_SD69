// Script test cập nhật voucher với loaiGiamGia đã được sửa
// Chạy script này trong browser console

const testFixedLoaiGiamGia = async () => {
  try {
    console.log("=== TESTING FIXED LOAI GIAM GIA ===");

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

      // Tìm voucher có loaiGiamGia là TIEN
      const tienVouchers = vouchers.filter((v) => v.loaiGiamGia === "TIEN");
      console.log("Vouchers with loaiGiamGia 'TIEN':", tienVouchers.length);

      if (tienVouchers.length > 0) {
        const testVoucher = tienVouchers[0];
        console.log("Testing with voucher:", testVoucher.tenVoucher);
        console.log("Original loaiGiamGia:", testVoucher.loaiGiamGia);

        // Test 2: Cập nhật voucher với loaiGiamGia được chuyển đổi
        console.log("\n2. Testing update with converted loaiGiamGia...");

        const updateData = {
          tenVoucher: testVoucher.tenVoucher + " (Fixed)",
          loaiGiamGia: "GIA_TIEN", // Chuyển đổi từ TIEN thành GIA_TIEN
          giaTriGiam: testVoucher.giaTriGiam || 1000,
          giaTriToiThieu: testVoucher.giaTriToiThieu || 50000,
          giamToiDa: testVoucher.giamToiDa || 50000,
          soLuong: testVoucher.soLuong || 100,
          trangThai: testVoucher.trangThai || 1,
          ngayBatDau: testVoucher.ngayBatDau,
          ngayKetThuc: testVoucher.ngayKetThuc,
          moTa:
            "Updated with fixed loaiGiamGia - " + new Date().toLocaleString(),
        };

        console.log("Sending data with GIA_TIEN:", updateData);

        const updateResponse = await fetch(
          `http://localhost:8080/api/voucher/${testVoucher.id}`,
          {
            method: "PUT",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updateData),
          }
        );

        console.log("Update status:", updateResponse.status);
        if (updateResponse.ok) {
          const result = await updateResponse.json();
          console.log("✅ Successfully updated voucher with GIA_TIEN:", result);
        } else {
          const errorData = await updateResponse.json();
          console.log("❌ Failed to update voucher:", errorData);
        }

        // Test 3: Cập nhật voucher với PHAN_TRAM
        console.log("\n3. Testing update with PHAN_TRAM...");

        const updateData2 = {
          tenVoucher: testVoucher.tenVoucher + " (Percent)",
          loaiGiamGia: "PHAN_TRAM",
          giaTriGiam: 10, // 10%
          giaTriToiThieu: testVoucher.giaTriToiThieu || 50000,
          giamToiDa: testVoucher.giamToiDa || 50000,
          soLuong: testVoucher.soLuong || 100,
          trangThai: testVoucher.trangThai || 1,
          ngayBatDau: testVoucher.ngayBatDau,
          ngayKetThuc: testVoucher.ngayKetThuc,
          moTa: "Updated with PHAN_TRAM - " + new Date().toLocaleString(),
        };

        console.log("Sending data with PHAN_TRAM:", updateData2);

        const updateResponse2 = await fetch(
          `http://localhost:8080/api/voucher/${testVoucher.id}`,
          {
            method: "PUT",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updateData2),
          }
        );

        console.log("Update status (PHAN_TRAM):", updateResponse2.status);
        if (updateResponse2.ok) {
          const result2 = await updateResponse2.json();
          console.log(
            "✅ Successfully updated voucher with PHAN_TRAM:",
            result2
          );
        } else {
          const errorData2 = await updateResponse2.json();
          console.log(
            "❌ Failed to update voucher with PHAN_TRAM:",
            errorData2
          );
        }
      } else {
        console.log("⚠️ No vouchers with loaiGiamGia 'TIEN' found for testing");

        // Test với voucher đầu tiên
        if (vouchers.length > 0) {
          const testVoucher = vouchers[0];
          console.log("\nTesting with first voucher:", testVoucher.tenVoucher);
          console.log("Original loaiGiamGia:", testVoucher.loaiGiamGia);

          const updateData = {
            tenVoucher: testVoucher.tenVoucher + " (Test)",
            loaiGiamGia: "GIA_TIEN",
            giaTriGiam: testVoucher.giaTriGiam || 1000,
            trangThai: testVoucher.trangThai || 1,
            ngayBatDau: testVoucher.ngayBatDau,
            ngayKetThuc: testVoucher.ngayKetThuc,
          };

          const updateResponse = await fetch(
            `http://localhost:8080/api/voucher/${testVoucher.id}`,
            {
              method: "PUT",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(updateData),
            }
          );

          console.log("Update status:", updateResponse.status);
          if (updateResponse.ok) {
            const result = await updateResponse.json();
            console.log("✅ Successfully updated voucher:", result);
          } else {
            const errorData = await updateResponse.json();
            console.log("❌ Failed to update voucher:", errorData);
          }
        }
      }
    } else {
      console.log("❌ Failed to fetch vouchers");
    }

    console.log("\n=== FIXED LOAI GIAM GIA TEST COMPLETED ===");
  } catch (error) {
    console.error("Test error:", error);
  }
};

// Chạy test
testFixedLoaiGiamGia();
