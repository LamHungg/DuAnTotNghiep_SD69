// Script test các tình huống lỗi khi cập nhật voucher
// Chạy script này trong browser console

const testVoucherUpdateErrors = async () => {
  try {
    console.log("=== TESTING VOUCHER UPDATE ERRORS ===");

    // Test 1: Cập nhật voucher với ID không tồn tại
    console.log("1. Testing update with non-existent ID...");

    const nonExistentResponse = await fetch(
      "http://localhost:8080/api/voucher/999999",
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tenVoucher: "Test Voucher",
          loaiGiamGia: "GIA_TIEN",
          giaTriGiam: 10000,
          trangThai: 1,
          ngayBatDau: "2024-01-01T00:00:00",
          ngayKetThuc: "2024-12-31T23:59:59",
        }),
      }
    );

    console.log("Non-existent ID status:", nonExistentResponse.status);
    if (!nonExistentResponse.ok) {
      const errorData = await nonExistentResponse.json();
      console.log("❌ Expected error:", errorData);
    } else {
      console.log("✅ Unexpected success");
    }

    // Test 2: Cập nhật voucher với dữ liệu không hợp lệ
    console.log("\n2. Testing update with invalid data...");

    const invalidDataResponse = await fetch(
      "http://localhost:8080/api/voucher/1",
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tenVoucher: "", // Tên rỗng
          loaiGiamGia: "INVALID_TYPE",
          giaTriGiam: -100, // Giá trị âm
          trangThai: 999, // Trạng thái không hợp lệ
          ngayBatDau: "2024-12-31T23:59:59",
          ngayKetThuc: "2024-01-01T00:00:00", // Ngày kết thúc trước ngày bắt đầu
        }),
      }
    );

    console.log("Invalid data status:", invalidDataResponse.status);
    if (!invalidDataResponse.ok) {
      const errorData = await invalidDataResponse.json();
      console.log("❌ Expected error:", errorData);
    } else {
      console.log("✅ Unexpected success");
    }

    // Test 3: Cập nhật voucher với mã trùng lặp
    console.log("\n3. Testing update with duplicate code...");

    // Trước tiên, lấy danh sách voucher để có mã voucher thực tế
    const vouchersResponse = await fetch("http://localhost:8080/api/voucher", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (vouchersResponse.ok) {
      const vouchers = await vouchersResponse.json();
      if (vouchers.length >= 2) {
        const firstVoucher = vouchers[0];
        const secondVoucher = vouchers[1];

        // Thử cập nhật voucher thứ 2 với mã của voucher thứ 1
        const duplicateCodeResponse = await fetch(
          `http://localhost:8080/api/voucher/${secondVoucher.id}`,
          {
            method: "PUT",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...secondVoucher,
              maVoucher: firstVoucher.maVoucher, // Sử dụng mã của voucher khác
            }),
          }
        );

        console.log("Duplicate code status:", duplicateCodeResponse.status);
        if (!duplicateCodeResponse.ok) {
          const errorData = await duplicateCodeResponse.json();
          console.log("❌ Expected UNIQUE constraint error:", errorData);
        } else {
          console.log("✅ Unexpected success");
        }
      } else {
        console.log("⚠️ Need at least 2 vouchers to test duplicate code");
      }
    }

    // Test 4: Cập nhật voucher với dữ liệu null/undefined
    console.log("\n4. Testing update with null/undefined data...");

    const nullDataResponse = await fetch(
      "http://localhost:8080/api/voucher/1",
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tenVoucher: null,
          loaiGiamGia: null,
          giaTriGiam: null,
          trangThai: null,
          ngayBatDau: null,
          ngayKetThuc: null,
        }),
      }
    );

    console.log("Null data status:", nullDataResponse.status);
    if (!nullDataResponse.ok) {
      const errorData = await nullDataResponse.json();
      console.log("❌ Expected validation error:", errorData);
    } else {
      console.log("✅ Unexpected success");
    }

    // Test 5: Cập nhật voucher với dữ liệu quá lớn
    console.log("\n5. Testing update with oversized data...");

    const oversizedDataResponse = await fetch(
      "http://localhost:8080/api/voucher/1",
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tenVoucher: "A".repeat(1000), // Tên quá dài
          loaiGiamGia: "GIA_TIEN",
          giaTriGiam: 999999999999, // Giá trị quá lớn
          trangThai: 1,
          ngayBatDau: "2024-01-01T00:00:00",
          ngayKetThuc: "2024-12-31T23:59:59",
          moTa: "B".repeat(10000), // Mô tả quá dài
        }),
      }
    );

    console.log("Oversized data status:", oversizedDataResponse.status);
    if (!oversizedDataResponse.ok) {
      const errorData = await oversizedDataResponse.json();
      console.log("❌ Expected size limit error:", errorData);
    } else {
      console.log("✅ Unexpected success");
    }

    // Test 6: Cập nhật voucher với Content-Type sai
    console.log("\n6. Testing update with wrong Content-Type...");

    const wrongContentTypeResponse = await fetch(
      "http://localhost:8080/api/voucher/1",
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "text/plain", // Sai Content-Type
        },
        body: "This is not JSON",
      }
    );

    console.log("Wrong Content-Type status:", wrongContentTypeResponse.status);
    if (!wrongContentTypeResponse.ok) {
      const errorData = await wrongContentTypeResponse.text();
      console.log("❌ Expected Content-Type error:", errorData);
    } else {
      console.log("✅ Unexpected success");
    }

    console.log("\n=== VOUCHER UPDATE ERROR TESTS COMPLETED ===");
    console.log("📝 Summary:");
    console.log("- Check 404 for non-existent vouchers");
    console.log("- Check 400 for validation errors");
    console.log("- Check UNIQUE constraint violations");
    console.log("- Check null/undefined handling");
    console.log("- Check data size limits");
    console.log("- Check Content-Type validation");
  } catch (error) {
    console.error("Test error:", error);
  }
};

// Chạy test
testVoucherUpdateErrors();
