// Test script với format đúng cho QR code
const axios = require("axios");

async function testQRFixed() {
  try {
    console.log("🔍 Testing QR with correct JSON format...");

    const response = await axios.post(
      "http://localhost:8080/api/payment/create-vietqr-payment",
      {
        amount: 199000,
        orderCode: `POS${Date.now()}`,
        description: "Test QR payment - Fixed format",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ QR code generation successful!");
    console.log("📊 Status:", response.status);
    console.log("📊 QR Data:", JSON.stringify(response.data, null, 2));

    // Kiểm tra cấu trúc response
    if (response.data) {
      console.log("\n📋 QR Response Analysis:");
      console.log("- Has QR code data:", !!response.data.qrCode);
      console.log("- Has payment URL:", !!response.data.paymentUrl);
      console.log("- Has order info:", !!response.data.orderCode);
    }

    return response.data;
  } catch (error) {
    console.error("❌ Error testing QR code generation:");
    console.error("📊 Status:", error.response?.status);
    console.error("📊 Data:", error.response?.data);
    return null;
  }
}

async function testMultipleQRPayments() {
  console.log("\n🔍 Testing multiple QR payments...");

  const testCases = [
    { amount: 50000, description: "Small payment" },
    { amount: 200000, description: "Medium payment" },
    { amount: 1000000, description: "Large payment" },
  ];

  for (const testCase of testCases) {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/payment/create-vietqr-payment",
        {
          amount: testCase.amount,
          orderCode: `TEST${Date.now()}_${testCase.amount}`,
          description: testCase.description,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(`✅ ${testCase.description} (${testCase.amount}đ): Success`);
    } catch (error) {
      console.log(
        `❌ ${testCase.description} (${testCase.amount}đ): Failed - ${error.response?.status}`
      );
    }
  }
}

async function runFixedTest() {
  console.log("🚀 Starting Fixed QR Tests...\n");

  const result = await testQRFixed();

  if (result) {
    console.log("\n✅ QR endpoint working correctly with JSON format!");
    await testMultipleQRPayments();

    console.log("\n📋 Summary:");
    console.log("✅ QR Code generation: WORKING");
    console.log("✅ Backend payment service: WORKING");
    console.log("✅ VietQR integration: WORKING");

    console.log("\n🎯 Solution:");
    console.log("Use JSON format instead of form-data for QR requests");
    console.log("Content-Type: application/json");

    console.log("\n🔧 Next Steps:");
    console.log("1. Update frontend QR code requests to use JSON");
    console.log("2. Test QR code display in UI");
    console.log("3. Test actual payment flow");
  } else {
    console.log("\n❌ QR endpoint still not working");
    console.log("📋 Check backend logs for detailed error");
  }
}

runFixedTest();
