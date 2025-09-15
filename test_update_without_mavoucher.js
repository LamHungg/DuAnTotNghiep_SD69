// Script test cập nhật voucher mà không gửi maVoucher
// Chạy script này trong browser console

const testUpdateWithoutMaVoucher = async () => {
  try {
    console.log("=== TESTING UPDATE WITHOUT MAVOUCHER ===");

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

      if (vouchers.length > 0) {
        const testVoucher = vouchers[0];
        console.log("Testing with voucher:", testVoucher.tenVoucher);
        console.log("Current maVoucher:", testVoucher.maVoucher);

        // Test 2: Cập nhật voucher mà không gửi maVoucher
        console.log("\n2. Testing update without maVoucher...");

        const updateData = {
          tenVoucher: testVoucher.tenVoucher + " (Updated)",
          loaiGiamGia:
            testVoucher.loaiGiamGia === "TIEN_MAT"
              ? "GIA_TIEN"
              : testVoucher.loaiGiamGia,
          giaTriGiam: testVoucher.giaTriGiam,
          giaTriToiThieu: testVoucher.giaTriToiThieu,
          giamToiDa: testVoucher.giamToiDa,
          soLuong: testVoucher.soLuong,
          trangThai: testVoucher.trangThai,
          ngayBatDau: testVoucher.ngayBatDau,
          ngayKetThuc: testVoucher.ngayKetThuc,
          moTa: "Updated without maVoucher - " + new Date().toLocaleString(),
        };

        console.log("Sending data (without maVoucher):", updateData);

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
          console.log(
            "✅ Successfully updated voucher without maVoucher:",
            result
          );
        } else {
          const errorData = await updateResponse.json();
          console.log("❌ Failed to update voucher:", errorData);
        }

        // Test 3: Cập nhật voucher với maVoucher rỗng
        console.log("\n3. Testing update with empty maVoucher...");

        const updateDataWithEmptyMaVoucher = {
          ...updateData,
          maVoucher: "",
        };

        console.log(
          "Sending data (with empty maVoucher):",
          updateDataWithEmptyMaVoucher
        );

        const updateResponse2 = await fetch(
          `http://localhost:8080/api/voucher/${testVoucher.id}`,
          {
            method: "PUT",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updateDataWithEmptyMaVoucher),
          }
        );

        console.log(
          "Update status (with empty maVoucher):",
          updateResponse2.status
        );
        if (updateResponse2.ok) {
          const result2 = await updateResponse2.json();
          console.log(
            "✅ Successfully updated voucher with empty maVoucher:",
            result2
          );
        } else {
          const errorData2 = await updateResponse2.json();
          console.log(
            "❌ Failed to update voucher with empty maVoucher:",
            errorData2
          );
        }
      } else {
        console.log("⚠️ No vouchers found for testing");
      }
    } else {
      console.log("❌ Failed to fetch vouchers");
    }

    console.log("\n=== UPDATE WITHOUT MAVOUCHER TEST COMPLETED ===");
  } catch (error) {
    console.error("Test error:", error);
  }
};

// Chạy test
testUpdateWithoutMaVoucher();
