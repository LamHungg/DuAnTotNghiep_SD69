// Script test endpoint /process trực tiếp
// Chạy script này trong browser console

const testProcessEndpoint = async () => {
  try {
    console.log("=== TESTING PROCESS ENDPOINT ===");

    // 1. Kiểm tra authentication
    console.log("1. Checking authentication...");
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token) {
      console.log("❌ No token found - please login first");
      return;
    }

    console.log("✅ Token found:", token);
    console.log("✅ User:", user ? JSON.parse(user) : null);

    // 2. Test process endpoint với dữ liệu đơn giản
    console.log("2. Testing process endpoint...");
    const processData = {
      cartItems: [
        {
          chiTietSanPhamId: 1,
          soLuong: 1,
          gia: "100000.00",
          thanhTien: "100000.00",
        },
      ],
      diaChiId: 1,
      voucherId: null,
      phuongThucThanhToanId: 1,
      ghiChuKhachHang: "Test order from browser",
      phiVanChuyen: "30000.00",
      tongTienHang: "100000.00",
      tongThanhToan: "130000.00",
    };

    try {
      const processResponse = await fetch(
        "http://localhost:8080/api/checkout/process",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(processData),
        }
      );

      console.log("Process response status:", processResponse.status);

      if (processResponse.ok) {
        const processResult = await processResponse.json();
        console.log("✅ Process successful:", processResult);
      } else {
        const errorText = await processResponse.text();
        console.log("❌ Process failed:", errorText);

        // Thử parse JSON nếu có thể
        try {
          const errorJson = JSON.parse(errorText);
          console.log("❌ Process error details:", errorJson);
        } catch (e) {
          console.log("❌ Process error (text):", errorText);
        }
      }
    } catch (error) {
      console.log("❌ Process request error:", error);
    }

    // 3. Test với dữ liệu khác nhau
    console.log("3. Testing with different data...");

    // Test 1: Không có cart items
    console.log("Test 1: Empty cart items");
    const testData1 = {
      ...processData,
      cartItems: [],
    };

    try {
      const response1 = await fetch(
        "http://localhost:8080/api/checkout/process",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(testData1),
        }
      );

      console.log("Test 1 status:", response1.status);
      if (!response1.ok) {
        const error1 = await response1.text();
        console.log("Test 1 error:", error1);
      }
    } catch (error) {
      console.log("Test 1 error:", error);
    }

    // Test 2: Không có diaChiId
    console.log("Test 2: No diaChiId");
    const testData2 = {
      ...processData,
      diaChiId: null,
    };

    try {
      const response2 = await fetch(
        "http://localhost:8080/api/checkout/process",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(testData2),
        }
      );

      console.log("Test 2 status:", response2.status);
      if (!response2.ok) {
        const error2 = await response2.text();
        console.log("Test 2 error:", error2);
      }
    } catch (error) {
      console.log("Test 2 error:", error);
    }

    // Test 3: Không có phuongThucThanhToanId
    console.log("Test 3: No phuongThucThanhToanId");
    const testData3 = {
      ...processData,
      phuongThucThanhToanId: null,
    };

    try {
      const response3 = await fetch(
        "http://localhost:8080/api/checkout/process",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(testData3),
        }
      );

      console.log("Test 3 status:", response3.status);
      if (!response3.ok) {
        const error3 = await response3.text();
        console.log("Test 3 error:", error3);
      }
    } catch (error) {
      console.log("Test 3 error:", error);
    }

    console.log("=== PROCESS ENDPOINT TEST COMPLETED ===");
  } catch (error) {
    console.error("❌ Error in process endpoint test:", error);
  }
};

// Export function
window.testProcessEndpoint = testProcessEndpoint;

// Auto-run
testProcessEndpoint();
