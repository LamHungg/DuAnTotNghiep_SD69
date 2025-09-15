const axios = require("axios");

const API_URL = "http://localhost:8080/api";

async function testCartFlow() {
  try {
    console.log("🔍 Testing complete cart flow...");

    // Step 1: Login
    console.log("\n1. Testing login...");
    const loginData = {
      email: "test2@example.com",
      matKhau: "123456",
    };

    const loginResponse = await axios.post(`${API_URL}/auth/login`, loginData, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    console.log("✅ Login response:", loginResponse.data);
    const userData = loginResponse.data;

    if (!userData.token) {
      console.log("❌ No token in login response!");
      return;
    }

    // Step 2: Add to cart
    console.log("\n2. Testing add to cart...");
    const cartData = {
      chiTietSanPhamId: 1,
      soLuong: 1,
    };

    try {
      const cartResponse = await axios.post(`${API_URL}/cart/add`, cartData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.token}`,
        },
        withCredentials: true,
      });
      console.log("✅ Add to cart successful:", cartResponse.data);
    } catch (error) {
      console.log("❌ Add to cart failed:");
      console.log("   Status:", error.response?.status);
      console.log("   Data:", error.response?.data);
      return;
    }

    // Step 3: Get cart
    console.log("\n3. Testing get cart...");
    try {
      const getCartResponse = await axios.get(`${API_URL}/cart`, {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
        withCredentials: true,
      });
      console.log("✅ Get cart successful:");
      console.log("   Response type:", typeof getCartResponse.data);
      console.log("   Is array:", Array.isArray(getCartResponse.data));
      console.log("   Length:", getCartResponse.data?.length || 0);
      console.log("   Data:", JSON.stringify(getCartResponse.data, null, 2));

      if (
        Array.isArray(getCartResponse.data) &&
        getCartResponse.data.length > 0
      ) {
        const firstItem = getCartResponse.data[0];
        console.log("\n   First item structure:");
        console.log("   - id:", firstItem.id);
        console.log("   - tenSanPham:", firstItem.tenSanPham);
        console.log("   - hinhAnh:", firstItem.hinhAnh);
        console.log("   - kichCo:", firstItem.kichCo);
        console.log("   - mauSac:", firstItem.mauSac);
        console.log("   - chatLieu:", firstItem.chatLieu);
        console.log("   - soLuong:", firstItem.soLuong);
        console.log("   - gia:", firstItem.gia);
        console.log("   - thanhTien:", firstItem.thanhTien);
        console.log("   - soLuongTonKho:", firstItem.soLuongTonKho);
      }
    } catch (error) {
      console.log("❌ Get cart failed:");
      console.log("   Status:", error.response?.status);
      console.log("   Data:", error.response?.data);
    }
  } catch (error) {
    console.error("❌ Test failed:", error.response?.data || error.message);
  }
}

testCartFlow();
