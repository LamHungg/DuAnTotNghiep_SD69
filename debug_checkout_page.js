// Script debug checkout page
// Chạy script này khi đang ở trang checkout

const debugCheckoutPage = () => {
  console.log("=== DEBUGGING CHECKOUT PAGE ===");

  // 1. Kiểm tra URL hiện tại
  console.log("1. Current URL:", window.location.href);

  // 2. Kiểm tra React components
  console.log("2. Checking React components...");
  const checkoutElements = document.querySelectorAll(
    '[data-testid*="checkout"], [class*="checkout"], [id*="checkout"]'
  );
  console.log("Checkout elements found:", checkoutElements.length);

  // 3. Kiểm tra payment methods elements
  console.log("3. Checking payment methods elements...");
  const paymentElements = document.querySelectorAll(
    '[class*="payment"], [id*="payment"], [data-testid*="payment"]'
  );
  console.log("Payment elements found:", paymentElements.length);

  // 4. Kiểm tra console errors
  console.log("4. Checking for console errors...");
  const originalError = console.error;
  const errors = [];
  console.error = (...args) => {
    errors.push(args);
    originalError.apply(console, args);
  };

  // 5. Kiểm tra network requests
  console.log("5. Checking network requests...");
  const networkRequests = performance
    .getEntriesByType("resource")
    .filter((entry) => entry.name.includes("localhost:8080"))
    .map((entry) => ({
      url: entry.name,
      status: entry.responseStatus,
      duration: entry.duration,
    }));
  console.log("Network requests to backend:", networkRequests);

  // 6. Kiểm tra localStorage
  console.log("6. Checking localStorage...");
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  console.log("Token exists:", !!token);
  console.log("User exists:", !!user);

  // 7. Kiểm tra sessionStorage
  console.log("7. Checking sessionStorage...");
  const sessionKeys = Object.keys(sessionStorage);
  console.log("SessionStorage keys:", sessionKeys);

  // 8. Kiểm tra các biến global
  console.log("8. Checking global variables...");
  console.log("React available:", typeof React !== "undefined");
  console.log("ReactDOM available:", typeof ReactDOM !== "undefined");

  // 9. Kiểm tra các script tags
  console.log("9. Checking script tags...");
  const scripts = document.querySelectorAll("script");
  const scriptSrcs = Array.from(scripts)
    .map((script) => script.src)
    .filter((src) => src);
  console.log("Script sources:", scriptSrcs);

  // 10. Kiểm tra các import/export errors
  console.log("10. Checking for import/export errors...");
  setTimeout(() => {
    console.log("Errors captured:", errors);
    console.log("=== DEBUG COMPLETED ===");
  }, 1000);
};

// Export function
window.debugCheckoutPage = debugCheckoutPage;

// Auto-run nếu đang ở trang checkout
if (window.location.href.includes("checkout")) {
  debugCheckoutPage();
} else {
  console.log(
    "Not on checkout page. Run debugCheckoutPage() when on checkout page."
  );
}
