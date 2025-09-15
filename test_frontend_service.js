// Script test frontend service trực tiếp
// Chạy script này trong browser console

const testFrontendService = async () => {
  try {
    console.log("=== TESTING FRONTEND SERVICE ===");

    // 1. Kiểm tra xem có thể import service không
    console.log("1. Testing service import...");
    try {
      // Thử import checkoutService
      const module = await import("./src/services/checkoutService.js");
      console.log("✅ Service module loaded:", module);

      if (module.default) {
        console.log("✅ Default export found:", module.default);
        const service = module.default;

        // Test getPaymentMethods
        console.log("2. Testing getPaymentMethods...");
        try {
          const paymentMethods = await service.getPaymentMethods();
          console.log("✅ Payment methods from service:", paymentMethods);
        } catch (error) {
          console.log("❌ getPaymentMethods error:", error);
        }

        // Test testCheckout
        console.log("3. Testing testCheckout...");
        try {
          const testResult = await service.testCheckout();
          console.log("✅ Test checkout result:", testResult);
        } catch (error) {
          console.log("❌ testCheckout error:", error);
        }
      } else {
        console.log("❌ No default export found");
      }
    } catch (error) {
      console.log("❌ Import error:", error.message);
    }

    // 2. Kiểm tra xem service có được load trong React app không
    console.log("4. Checking React app for service...");
    const reactRoot = document.querySelector("#root");
    if (reactRoot) {
      console.log("✅ React root found");
      console.log("React root children:", reactRoot.children.length);
    } else {
      console.log("❌ React root not found");
    }

    // 3. Kiểm tra các biến global có thể có
    console.log("5. Checking global variables...");
    const globals = ["checkoutService", "authService", "cartService"];
    globals.forEach((name) => {
      console.log(`- ${name}:`, typeof window[name] !== "undefined");
    });

    // 4. Kiểm tra module cache
    console.log("6. Checking module cache...");
    if (window.__webpack_require__) {
      console.log("✅ Webpack require available");
    } else {
      console.log("❌ Webpack require not available");
    }

    console.log("=== FRONTEND SERVICE TEST COMPLETED ===");
  } catch (error) {
    console.error("❌ Error in frontend service test:", error);
  }
};

// Export function
window.testFrontendService = testFrontendService;

// Auto-run
testFrontendService();
