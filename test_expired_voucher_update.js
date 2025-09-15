// Script test cập nhật voucher đã hết hạn
// Chạy script này trong browser console

const testExpiredVoucherUpdate = async () => {
  try {
    console.log("=== TESTING EXPIRED VOUCHER UPDATE ===");

    // Test 1: Lấy danh sách voucher để tìm voucher đã hết hạn
    console.log("1. Fetching vouchers to find expired ones...");

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

        // Test 2: Cập nhật voucher đã hết hạn với ngày mới
        console.log("\n2. Testing update expired voucher with new dates...");

        const updateData = {
          ...expiredVoucher,
          tenVoucher: expiredVoucher.tenVoucher + " (Updated)",
          loaiGiamGia:
            expiredVoucher.loaiGiamGia === "TIEN_MAT"
              ? "GIA_TIEN"
              : expiredVoucher.loaiGiamGia,
          ngayBatDau: "2024-12-01T00:00:00",
          ngayKetThuc: "2024-12-31T23:59:59",
          trangThai: 1,
        };

        const updateResponse = await fetch(
          `http://localhost:8080/api/voucher/${expiredVoucher.id}`,
          {
            method: "PUT",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updateData),
          }
        );

        console.log("Update expired voucher status:", updateResponse.status);
        if (updateResponse.ok) {
          const result = await updateResponse.json();
          console.log("✅ Successfully updated expired voucher:", result);
        } else {
          const errorData = await updateResponse.json();
          console.log("❌ Failed to update expired voucher:", errorData);
        }

        // Test 3: Cập nhật voucher đã hết hạn với thông tin khác
        console.log("\n3. Testing update expired voucher with other info...");

        const updateData2 = {
          ...expiredVoucher,
          loaiGiamGia:
            expiredVoucher.loaiGiamGia === "TIEN_MAT"
              ? "GIA_TIEN"
              : expiredVoucher.loaiGiamGia,
          moTa: "Voucher đã được cập nhật sau khi hết hạn",
          giaTriGiam: expiredVoucher.giaTriGiam + 1000,
          trangThai: 0,
        };

        const updateResponse2 = await fetch(
          `http://localhost:8080/api/voucher/${expiredVoucher.id}`,
          {
            method: "PUT",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updateData2),
          }
        );

        console.log(
          "Update expired voucher (other info) status:",
          updateResponse2.status
        );
        if (updateResponse2.ok) {
          const result2 = await updateResponse2.json();
          console.log("✅ Successfully updated expired voucher info:", result2);
        } else {
          const errorData2 = await updateResponse2.json();
          console.log("❌ Failed to update expired voucher info:", errorData2);
        }
      } else {
        console.log("⚠️ No expired vouchers found for testing");

        // Test với voucher có ngày hết hạn gần đây
        const recentVouchers = vouchers.filter((voucher) => {
          const endDate = new Date(voucher.ngayKetThuc);
          const today = new Date();
          const diffDays = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
          return diffDays <= 7; // Voucher hết hạn trong 7 ngày tới
        });

        if (recentVouchers.length > 0) {
          console.log(
            "\nTesting with voucher expiring soon:",
            recentVouchers[0].tenVoucher
          );

          const recentVoucher = recentVouchers[0];
          const updateData = {
            ...recentVoucher,
            loaiGiamGia:
              recentVoucher.loaiGiamGia === "TIEN_MAT"
                ? "GIA_TIEN"
                : recentVoucher.loaiGiamGia,
            ngayKetThuc: "2024-01-01T23:59:59", // Đặt ngày hết hạn trong quá khứ
            trangThai: 1,
          };

          const updateResponse = await fetch(
            `http://localhost:8080/api/voucher/${recentVoucher.id}`,
            {
              method: "PUT",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(updateData),
            }
          );

          console.log("Update to expired status:", updateResponse.status);
          if (updateResponse.ok) {
            console.log("✅ Successfully updated voucher to expired status");
          } else {
            const errorData = await updateResponse.json();
            console.log(
              "❌ Failed to update voucher to expired status:",
              errorData
            );
          }
        }
      }
    } else {
      console.log("❌ Failed to fetch vouchers");
    }

    console.log("\n=== EXPIRED VOUCHER UPDATE TESTS COMPLETED ===");
    console.log("📝 Summary:");
    console.log("- Check if expired vouchers can be updated");
    console.log("- Check if date validation works correctly");
    console.log("- Check if status updates work for expired vouchers");
    console.log("- Verify frontend validation allows expired voucher updates");
  } catch (error) {
    console.error("Test error:", error);
  }
};

// Chạy test
testExpiredVoucherUpdate();
