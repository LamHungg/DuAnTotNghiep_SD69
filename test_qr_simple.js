// Test script đơn giản để kiểm tra QR endpoint
const axios = require("axios");

async function testQREndpoint() {
  try {
    console.log("🔍 Testing QR endpoint...");

    const params = new URLSearchParams();
    params.append("amount", "100000");
    params.append("orderCode", "TEST123");
    params.append("description", "Test payment");

    const response = await axios.post(
      "http://localhost:8080/api/payment/create-vietqr-payment",
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    console.log("✅ QR endpoint working!");
    console.log("📊 Response:", response.data);
    console.log("📊 Status:", response.status);

    return response.data;
  } catch (error) {
    console.error(
      "❌ Error testing QR endpoint:",
      error.response?.data || error.message
    );
    console.error("❌ Status:", error.response?.status);
    return null;
  }
}

async function runTest() {
  console.log("🚀 Starting QR Test...\n");

  const result = await testQREndpoint();

  if (result) {
    console.log("\n✅ QR endpoint working correctly!");
    console.log("📋 Next steps:");
    console.log("1. Test POS payment with QR");
    console.log("2. Check if QR code displays correctly");
  } else {
    console.log("\n❌ QR endpoint not working");
    console.log("📋 Check backend server and logs");
  }
}

runTest();
