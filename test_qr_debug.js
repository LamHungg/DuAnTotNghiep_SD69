// Debug script để test QR với nhiều cách khác nhau
const axios = require("axios");

async function testQRWithDifferentMethods() {
  console.log("🔍 Testing QR with different methods...\n");

  // Method 1: POST with form data
  try {
    console.log("📋 Method 1: POST with form data");
    const formData = new URLSearchParams();
    formData.append("amount", "100000");
    formData.append("orderCode", "TEST123");
    formData.append("description", "Test payment");

    const response1 = await axios.post(
      "http://localhost:8080/api/payment/create-vietqr-payment",
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    console.log("✅ Method 1 Success:", response1.status);
  } catch (error) {
    console.log(
      "❌ Method 1 Error:",
      error.response?.status,
      error.response?.data
    );
  }

  // Method 2: POST with JSON
  try {
    console.log("\n📋 Method 2: POST with JSON");
    const response2 = await axios.post(
      "http://localhost:8080/api/payment/create-vietqr-payment",
      {
        amount: 100000,
        orderCode: "TEST123",
        description: "Test payment",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("✅ Method 2 Success:", response2.status);
  } catch (error) {
    console.log(
      "❌ Method 2 Error:",
      error.response?.status,
      error.response?.data
    );
  }

  // Method 3: GET with query params
  try {
    console.log("\n📋 Method 3: GET with query params");
    const response3 = await axios.get(
      "http://localhost:8080/api/payment/create-vietqr-payment",
      {
        params: {
          amount: 100000,
          orderCode: "TEST123",
          description: "Test payment",
        },
      }
    );
    console.log("✅ Method 3 Success:", response3.status);
  } catch (error) {
    console.log(
      "❌ Method 3 Error:",
      error.response?.status,
      error.response?.data
    );
  }

  // Method 4: Check if endpoint exists
  try {
    console.log("\n📋 Method 4: Check endpoint existence");
    const response4 = await axios.get("http://localhost:8080/api/payment/");
    console.log("✅ Payment endpoint exists:", response4.status);
  } catch (error) {
    console.log(
      "❌ Payment endpoint Error:",
      error.response?.status,
      error.response?.data
    );
  }
}

async function checkBackendHealth() {
  console.log("\n🏥 Checking backend health...");

  const endpoints = [
    "/api/customer/products",
    "/api/customer/categories",
    "/api/cart",
    "/api/auth/login",
    "/api/payment",
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await axios.get(`http://localhost:8080${endpoint}`);
      console.log(`✅ ${endpoint}: ${response.status}`);
    } catch (error) {
      console.log(`❌ ${endpoint}: ${error.response?.status || "No response"}`);
    }
  }
}

async function runDebug() {
  console.log("🚀 Starting QR Debug Tests...\n");

  await checkBackendHealth();
  await testQRWithDifferentMethods();

  console.log("\n📋 Summary:");
  console.log("- If all methods fail with 500: Backend payment service issue");
  console.log("- If some methods work: Request format issue");
  console.log("- If payment endpoint fails: Missing payment controller");
  console.log("\n🔧 Next steps:");
  console.log("1. Check backend logs for detailed error");
  console.log("2. Verify VietQR API configuration");
  console.log("3. Check database connection");
  console.log("4. Verify payment service implementation");
}

runDebug();
