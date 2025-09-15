// Script monitor network requests
// Copy và paste script này vào browser console để theo dõi API calls

console.log("=== NETWORK MONITOR STARTED ===");

// Tạo observer để theo dõi network requests
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.name.includes("localhost:8080")) {
      console.log(`🌐 API Request: ${entry.name}`);
      console.log(`   Duration: ${entry.duration}ms`);
      console.log(`   Type: ${entry.entryType}`);
      console.log(`   Size: ${entry.transferSize || "N/A"} bytes`);
      console.log("---");
    }
  }
});

// Bắt đầu observe
try {
  observer.observe({ entryTypes: ["resource"] });
  console.log("✅ Network monitor started successfully");
} catch (error) {
  console.log("❌ Failed to start network monitor:", error.message);
}

// Hàm để test API calls
const testAPICalls = async () => {
  console.log("=== TESTING API CALLS ===");

  const token = localStorage.getItem("token");
  if (!token) {
    console.log("❌ No token found");
    return;
  }

  // Test 1: Payment methods
  console.log("Testing payment methods...");
  try {
    const response = await fetch("http://localhost:8080/api/payment/methods", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log(`Payment methods status: ${response.status}`);
  } catch (error) {
    console.log("Payment methods error:", error.message);
  }

  // Test 2: Checkout test
  console.log("Testing checkout test...");
  try {
    const response = await fetch("http://localhost:8080/api/checkout/test", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log(`Checkout test status: ${response.status}`);
  } catch (error) {
    console.log("Checkout test error:", error.message);
  }
};

// Export function để có thể gọi từ console
window.testAPICalls = testAPICalls;
window.stopNetworkMonitor = () => {
  observer.disconnect();
  console.log("🛑 Network monitor stopped");
};

console.log("Available functions:");
console.log("- testAPICalls() - Test API calls");
console.log("- stopNetworkMonitor() - Stop monitoring");
