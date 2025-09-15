// Script kiểm tra backend status cuối cùng
// Chạy script này trong browser console

const checkBackendStatusFinal = async () => {
  try {
    console.log("🔍 === CHECKING BACKEND STATUS FINAL ===");

    // 1. Test basic connectivity
    console.log("1. Testing basic connectivity...");

    const basicResponse = await fetch("http://localhost:8080/api/auth/test", {
      method: "GET",
    });

    console.log(`Basic endpoint status: ${basicResponse.status}`);

    if (basicResponse.ok) {
      const result = await basicResponse.text();
      console.log("✅ Backend is running:", result);
    } else {
      console.log("❌ Backend not responding");
      return;
    }

    // 2. Test login endpoint
    console.log("2. Testing login endpoint...");

    const loginData = {
      email: "admin",
      matKhau: "123456",
    };

    const loginResponse = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });

    console.log(`Login endpoint status: ${loginResponse.status}`);

    if (loginResponse.ok) {
      const loginResult = await loginResponse.json();
      console.log("✅ Login endpoint working:", loginResult);

      // 3. Test Admin endpoint với token
      if (loginResult.token) {
        console.log("3. Testing Admin endpoint...");

        const adminResponse = await fetch(
          "http://localhost:8080/ZMEN/Admin/DonHang",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${loginResult.token}`,
            },
          }
        );

        console.log(`Admin endpoint status: ${adminResponse.status}`);

        if (adminResponse.ok) {
          const adminResult = await adminResponse.json();
          console.log("✅ Admin endpoint working");
          console.log(`Found ${adminResult.length} orders`);

          // 4. Test status update
          if (adminResult.length > 0) {
            console.log("4. Testing status update...");

            const testOrder = adminResult.find(
              (order) =>
                (order.trangThai || order.tenTrangThai) === "Chờ xác nhận"
            );

            if (testOrder) {
              const confirmResponse = await fetch(
                `http://localhost:8080/ZMEN/Admin/DonHang/${testOrder.id}/confirm`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${loginResult.token}`,
                  },
                }
              );

              console.log(`Status update status: ${confirmResponse.status}`);

              if (confirmResponse.ok) {
                const confirmResult = await confirmResponse.json();
                console.log("✅ Status update working:", confirmResult);
              } else {
                const errorText = await confirmResponse.text();
                console.log("❌ Status update failed:", errorText);
              }
            } else {
              console.log("⚠️ No order with 'Chờ xác nhận' status found");
            }
          }
        } else {
          console.log("❌ Admin endpoint not working");
        }
      } else {
        console.log("❌ No token received");
      }
    } else {
      const errorText = await loginResponse.text();
      console.log("❌ Login endpoint failed:", errorText);
    }

    console.log("🔍 === BACKEND STATUS CHECK COMPLETED ===");
  } catch (error) {
    console.error("❌ Error:", error);
  }
};

// Export function
window.checkBackendStatusFinal = checkBackendStatusFinal;

// Auto-run
checkBackendStatusFinal();
