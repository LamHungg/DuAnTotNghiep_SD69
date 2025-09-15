const axios = require("axios");

const API_URL = "http://localhost:8080/api";

async function testCustomerLogin() {
  try {
    console.log("🧪 Testing Customer Login API...");

    // Test data từ database thực tế
    const testCustomers = [
      {
        email: "le.b@example.com",
        matKhau: "abc123",
        description: "Khách hàng 1 - Lê Thị B",
      },
      {
        email: "nguyen.x@example.com",
        matKhau: "pass123",
        description: "Khách hàng 2 - Nguyễn Văn X",
      },
      {
        email: "tran.y@example.com",
        matKhau: "pass123",
        description: "Khách hàng 3 - Trần Thị Y",
      },
    ];

    for (const customer of testCustomers) {
      console.log(`\n🔍 Testing: ${customer.description}`);
      console.log("📤 Sending request to:", `${API_URL}/auth/login`);
      console.log("📦 Request data:", {
        email: customer.email,
        matKhau: customer.matKhau,
      });

      try {
        const response = await axios.post(`${API_URL}/auth/login`, {
          email: customer.email,
          matKhau: customer.matKhau,
        });

        console.log("✅ Login successful!");
        console.log("📥 Response:", response.data);
        return response.data; // Return first successful login
      } catch (error) {
        console.error("❌ Login failed for this customer!");
        console.error("🔍 Error details:");
        console.error("Status:", error.response?.status);
        console.error("Status Text:", error.response?.statusText);
        console.error("Response Data:", error.response?.data);
        console.error("Request Data:", error.config?.data);
        console.error("URL:", error.config?.url);
      }
    }

    throw new Error("All customer login attempts failed");
  } catch (error) {
    console.error("❌ All login attempts failed!");
    throw error;
  }
}

async function testBackendStatus() {
  try {
    console.log("🔍 Testing backend status...");
    const response = await axios.get(`${API_URL}/auth/test`);
    console.log("✅ Backend is running:", response.data);
  } catch (error) {
    console.error("❌ Backend not responding:", error.message);
  }
}

async function testRegisterCustomer() {
  try {
    console.log("🧪 Testing Customer Register API...");

    const registerData = {
      firstName: "Test",
      lastName: "Customer",
      email: "testcustomer@example.com",
      password: "123456789",
      confirmPassword: "123456789",
      phone: "0123456789",
    };

    console.log("📤 Sending register request to:", `${API_URL}/auth/register`);
    console.log("📦 Request data:", registerData);

    const response = await axios.post(`${API_URL}/auth/register`, registerData);
    console.log("✅ Register successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Register failed:", error.response?.data || error.message);
    // Don't throw error for register, it might already exist
  }
}

async function runTests() {
  console.log("🚀 Starting Customer Login Tests...\n");

  try {
    // Test 1: Check backend status
    await testBackendStatus();
    console.log("\n");

    // Test 2: Try to register a new customer
    await testRegisterCustomer();
    console.log("\n");

    // Test 3: Test customer login with existing data
    await testCustomerLogin();
    console.log("\n");

    console.log("🎉 All tests completed!");
  } catch (error) {
    console.error("💥 Test suite failed:", error.message);
  }
}

// Chạy tests
runTests();
