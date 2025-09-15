const axios = require("axios");

const API_URL = "http://localhost:8080/api";

async function testFrontendAuth() {
  try {
    console.log("🔍 Testing frontend authentication flow...");

    // Simulate frontend login flow
    console.log("\n1. Simulating frontend login...");
    const loginData = {
      email: "test2@example.com",
      matKhau: "123456",
    };

    let userData = null;
    try {
      const loginResponse = await axios.post(
        `${API_URL}/auth/login`,
        loginData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      console.log("✅ Login response:", loginResponse.data);
      userData = loginResponse.data;

      // Simulate saving to localStorage (like frontend does)
      console.log("💾 Simulating localStorage save...");
      console.log("   user:", JSON.stringify(userData));
      console.log("   isLoggedIn:", "true");
    } catch (error) {
      console.log("❌ Login failed:", error.response?.data || error.message);
      return;
    }

    // Simulate getAuthHeaders function
    console.log("\n2. Simulating getAuthHeaders...");
    const getAuthHeaders = () => {
      console.log(
        "Debug - Simulated localStorage user:",
        JSON.stringify(userData)
      );

      if (userData) {
        try {
          console.log("Debug - parsed userData:", userData);

          if (userData.token) {
            console.log("Debug - Found token:", userData.token);
            return { Authorization: `Bearer ${userData.token}` };
          } else {
            console.log("Debug - No token in userData");
          }
        } catch (e) {
          console.error("Error parsing user data:", e);
        }
      } else {
        console.log("Debug - No user in localStorage");
      }

      console.log("Debug - Falling back to session-based auth");
      return {};
    };

    const headers = getAuthHeaders();
    console.log("✅ Generated headers:", headers);

    // Test add to cart with generated headers
    console.log("\n3. Testing add to cart with generated headers...");
    const cartData = {
      chiTietSanPhamId: 1,
      soLuong: 1,
    };

    try {
      const cartResponse = await axios.post(`${API_URL}/cart/add`, cartData, {
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      console.log("✅ Add to cart successful:", cartResponse.data);
    } catch (error) {
      console.log("❌ Add to cart failed:");
      console.log("   Status:", error.response?.status);
      console.log("   Data:", error.response?.data);
      console.log("   Message:", error.message);
    }
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

testFrontendAuth();
