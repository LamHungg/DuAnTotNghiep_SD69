// Script test cho API payment methods
const axios = require("axios");

const API_URL = "http://localhost:8080/api";

async function testPaymentMethods() {
  try {
    console.log("Testing payment methods API...");

    // Test 1: Kiểm tra endpoint có hoạt động không
    const response = await axios.get(`${API_URL}/payment/test`);
    console.log("✅ Test endpoint response:", response.data);

    // Test 2: Lấy danh sách payment methods
    const methodsResponse = await axios.get(`${API_URL}/payment/methods`);
    console.log("✅ Payment methods response:", methodsResponse.data);

    // Test 3: Kiểm tra format dữ liệu
    if (Array.isArray(methodsResponse.data)) {
      console.log(`✅ Found ${methodsResponse.data.length} payment methods`);
      methodsResponse.data.forEach((method, index) => {
        console.log(
          `  ${index + 1}. ID: ${method.id}, Name: ${method.tenPhuongThuc}`
        );
      });
    } else {
      console.log("❌ Response is not an array");
    }
  } catch (error) {
    console.error("❌ Error testing payment methods API:", error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
  }
}

// Chạy test
testPaymentMethods();
