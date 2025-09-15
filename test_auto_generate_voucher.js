// Script test auto-generate mã voucher
// Chạy script này trong browser console

const testAutoGenerateVoucher = async () => {
  try {
    console.log("=== TESTING AUTO-GENERATE VOUCHER CODE ===");

    // Test 1: Tạo voucher với mã rỗng (sẽ được auto-generate)
    console.log("1. Testing create voucher with empty code...");

    const voucherData = {
      maVoucher: "", // Để backend tự động generate
      tenVoucher: "Test Auto Generate Voucher",
      loaiGiamGia: "GIA_TIEN",
      giaTriGiam: 10000,
      giaTriToiThieu: 50000,
      giamToiDa: 5000,
      soLuong: 100,
      trangThai: 1,
      ngayBatDau: "2024-01-01",
      ngayKetThuc: "2024-12-31",
      moTa: "Voucher test auto generate",
    };

    const createResponse = await fetch("http://localhost:8080/api/voucher", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(voucherData),
    });

    console.log("Create status:", createResponse.status);

    if (createResponse.ok) {
      const createdVoucher = await createResponse.json();
      console.log("✅ Voucher created successfully!");
      console.log("Generated code:", createdVoucher.maVoucher);
      console.log("Voucher details:", createdVoucher);

      // Test 2: Kiểm tra mã voucher có format đúng không
      console.log("\n2. Checking voucher code format...");
      const code = createdVoucher.maVoucher;

      if (code && code.length >= 10) {
        console.log("✅ Code length is valid:", code.length);

        // Kiểm tra format: VC + YYYYMMDD + 4 ký tự
        const datePattern = /^\d{8}$/;
        const datePart = code.substring(2, 10);

        if (datePattern.test(datePart)) {
          console.log("✅ Date format is valid:", datePart);
        } else {
          console.log("⚠️ Date format might be invalid:", datePart);
        }

        // Kiểm tra prefix
        if (
          code.startsWith("VC") ||
          code.startsWith("GT") ||
          code.startsWith("PT")
        ) {
          console.log("✅ Prefix is valid:", code.substring(0, 2));
        } else {
          console.log("⚠️ Prefix might be invalid:", code.substring(0, 2));
        }
      } else {
        console.log("❌ Code length is invalid:", code);
      }

      // Test 3: Tạo voucher với loại khác
      console.log("\n3. Testing different voucher types...");

      const voucherTypes = ["GIA_TIEN", "PHAN_TRAM"];

      for (const type of voucherTypes) {
        const typeVoucherData = {
          ...voucherData,
          tenVoucher: `Test ${type} Voucher`,
          loaiGiamGia: type,
        };

        const typeResponse = await fetch("http://localhost:8080/api/voucher", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(typeVoucherData),
        });

        if (typeResponse.ok) {
          const typeVoucher = await typeResponse.json();
          console.log(`✅ ${type} voucher created:`, typeVoucher.maVoucher);
        } else {
          console.log(
            `❌ Failed to create ${type} voucher:`,
            typeResponse.status
          );
        }
      }
    } else {
      const errorData = await createResponse.json();
      console.log("❌ Failed to create voucher:", errorData);
    }

    console.log("\n=== AUTO-GENERATE TEST COMPLETED ===");
    console.log("📝 Summary:");
    console.log("- If you see ✅ above, auto-generate is working!");
    console.log("- Check the generated codes follow the expected format");
    console.log("- Try creating vouchers in the actual application now");
  } catch (error) {
    console.error("Test error:", error);
  }
};

// Chạy test
testAutoGenerateVoucher();
