// Test script để kiểm tra endpoint VietQR
const axios = require("axios");

async function testVietQREndpoint() {
  try {
    console.log("🔍 Testing VietQR endpoint...");

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

    console.log("✅ VietQR endpoint working!");
    console.log("📊 Response:", response.data);
    console.log("📊 Status:", response.status);

    return response.data;
  } catch (error) {
    console.error(
      "❌ Error testing VietQR endpoint:",
      error.response?.data || error.message
    );
    console.error("❌ Status:", error.response?.status);
    return null;
  }
}

async function testPaymentMethods() {
  try {
    console.log("\n🔍 Testing payment methods endpoint...");

    const response = await axios.get(
      "http://localhost:8080/api/payment/methods"
    );

    console.log("✅ Payment methods endpoint working!");
    console.log("📊 Response:", response.data);
    console.log("📊 Status:", response.status);

    return response.data;
  } catch (error) {
    console.error(
      "❌ Error testing payment methods:",
      error.response?.data || error.message
    );
    return null;
  }
}

async function runTests() {
  console.log("🚀 Starting VietQR Tests...\n");

  await testPaymentMethods();
  await testVietQREndpoint();

  console.log("\n✅ Tests completed!");
  console.log("\n📋 Next steps:");
  console.log("1. Restart backend server if needed");
  console.log("2. Test POS payment with VietQR");
  console.log("3. Check if QR code displays correctly");
}

runTests();
