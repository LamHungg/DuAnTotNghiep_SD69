// Script debug token - chạy trong browser console
console.log("=== DEBUG TOKEN ===");

// Kiểm tra token trong localStorage
const token = localStorage.getItem("token");
const user = localStorage.getItem("user");

console.log("Token:", token);
console.log("User:", user ? JSON.parse(user) : null);

// Kiểm tra format token
if (token) {
  console.log("Token format check:");
  console.log(
    "- Starts with 'customer-token-':",
    token.startsWith("customer-token-")
  );
  console.log("- Length:", token.length);

  if (token.startsWith("customer-token-")) {
    const id = token.substring("customer-token-".length());
    console.log("- Customer ID:", id);
    console.log("- Is valid number:", !isNaN(id));
  }
} else {
  console.log("❌ No token found in localStorage");
}

// Test API call với token hiện tại
if (token) {
  fetch("http://localhost:8080/api/checkout/test", {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      console.log("API Test Response Status:", response.status);
      return response.json();
    })
    .then((data) => {
      console.log("API Test Response Data:", data);
    })
    .catch((error) => {
      console.error("API Test Error:", error);
    });
}
