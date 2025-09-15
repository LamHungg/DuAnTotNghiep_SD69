// Script test Admin login với ten_dang_nhap
// Chạy script này trong browser console

const testAdminUsername = async () => {
  try {
    console.log("🔍 === TESTING ADMIN LOGIN WITH USERNAME ===");

    // Danh sách tài khoản Admin để test
    const adminAccounts = [
      { username: "admin", matKhau: "123456", name: "Admin 1" },
      { username: "admin2", matKhau: "123456", name: "Admin 2" },
      { username: "nv001", matKhau: "123456", name: "Nhân viên" },
    ];

    let successfulLogin = null;

    // Test từng tài khoản
    for (const account of adminAccounts) {
      console.log(`\n--- Testing ${account.name}: ${account.username} ---`);

      try {
        // Test với email = username
        const loginResponse = await fetch(
          "http://localhost:8080/api/auth/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: account.username, // Sử dụng username làm email
              matKhau: account.matKhau,
            }),
            credentials: "include",
          }
        );

        console.log(`Status: ${loginResponse.status}`);

        if (loginResponse.ok) {
          const loginResult = await loginResponse.json();
          console.log("✅ Login successful:", loginResult);

          // Kiểm tra role
          if (loginResult.role === "ADMIN" || loginResult.chucVu === "ADMIN") {
            console.log("✅ Admin role confirmed");
            successfulLogin = { account, result: loginResult };
            break;
          } else {
            console.log(
              "⚠️ Not admin role:",
              loginResult.role || loginResult.chucVu
            );
          }
        } else {
          const errorText = await loginResponse.text();
          console.log("❌ Login failed:", errorText);
        }
      } catch (error) {
        console.log("❌ Error:", error.message);
      }
    }

    // Nếu có tài khoản đăng nhập thành công, test Admin endpoint
    if (successfulLogin) {
      console.log("\n--- Testing Admin Endpoint ---");

      const { result } = successfulLogin;

      if (result.token) {
        // Test Admin orders endpoint
        const adminResponse = await fetch(
          "http://localhost:8080/ZMEN/Admin/DonHang",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${result.token}`,
            },
          }
        );

        console.log(`Admin endpoint status: ${adminResponse.status}`);

        if (adminResponse.ok) {
          const adminResult = await adminResponse.json();
          console.log("✅ Admin endpoint accessible");
          console.log(`Found ${adminResult.length} orders`);

          // Test cập nhật trạng thái
          if (adminResult.length > 0) {
            const testOrder = adminResult.find(
              (order) =>
                (order.trangThai || order.tenTrangThai) === "Chờ xác nhận"
            );

            if (testOrder) {
              console.log(
                `\n--- Testing Status Update for Order ${testOrder.id} ---`
              );

              const confirmResponse = await fetch(
                `http://localhost:8080/ZMEN/Admin/DonHang/${testOrder.id}/confirm`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${result.token}`,
                  },
                }
              );

              console.log(`Confirm status: ${confirmResponse.status}`);

              if (confirmResponse.ok) {
                const confirmResult = await confirmResponse.json();
                console.log("✅ Status update successful:", confirmResult);
              } else {
                const errorText = await confirmResponse.text();
                console.log("❌ Status update failed:", errorText);
              }
            } else {
              console.log("⚠️ No order with 'Chờ xác nhận' status found");
            }
          }
        } else {
          console.log("❌ Admin endpoint not accessible");
        }
      } else {
        console.log("❌ No token received");
      }
    } else {
      console.log("\n❌ No successful admin login found");
      console.log("💡 Please check the database for admin accounts");
    }

    console.log("\n🔍 === ADMIN USERNAME TEST COMPLETED ===");
  } catch (error) {
    console.error("❌ Error in admin username test:", error);
  }
};

// Export function
window.testAdminUsername = testAdminUsername;

// Auto-run
testAdminUsername();
