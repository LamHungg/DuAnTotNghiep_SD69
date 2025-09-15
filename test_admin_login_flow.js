// Script test toàn bộ luồng login Admin từ backend đến frontend
// Chạy script này trong browser console

const testAdminLoginFlow = async () => {
  try {
    console.log("🔍 === TESTING ADMIN LOGIN FLOW ===");
    
    // 1. Kiểm tra backend connectivity
    console.log("1. Testing backend connectivity...");
    
    const healthResponse = await fetch("http://localhost:8080/actuator/health", {
      method: "GET"
    });
    
    if (healthResponse.ok) {
      console.log("✅ Backend is running");
    } else {
      console.log("❌ Backend not responding");
      return;
    }
    
    // 2. Test auth endpoint
    console.log("2. Testing auth endpoint...");
    
    const authTestResponse = await fetch("http://localhost:8080/api/auth/test", {
      method: "GET"
    });
    
    if (authTestResponse.ok) {
      const authTestResult = await authTestResponse.text();
      console.log("✅ Auth endpoint working:", authTestResult);
    } else {
      console.log("❌ Auth endpoint not working");
      return;
    }
    
    // 3. Test admin login với tài khoản demo
    console.log("3. Testing admin login...");
    
    const loginData = {
      email: "admin",
      matKhau: "123456"
    };
    
    const loginResponse = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(loginData),
      credentials: "include"
    });
    
    console.log(`Login response status: ${loginResponse.status}`);
    
    if (loginResponse.ok) {
      const loginResult = await loginResponse.json();
      console.log("✅ Login successful:", loginResult);
      
      // 4. Kiểm tra token và role
      if (loginResult.token) {
        console.log("✅ Token received:", loginResult.token);
        
        // 5. Test Admin endpoint với token
        console.log("4. Testing Admin endpoint with token...");
        
        const adminResponse = await fetch("http://localhost:8080/ZMEN/Admin/DonHang", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${loginResult.token}`
          }
        });
        
        console.log(`Admin endpoint status: ${adminResponse.status}`);
        
        if (adminResponse.ok) {
          const adminResult = await adminResponse.json();
          console.log("✅ Admin endpoint accessible");
          console.log(`Found ${adminResult.length} orders`);
        } else {
          console.log("❌ Admin endpoint not accessible");
        }
        
        // 6. Test session check
        console.log("5. Testing session check...");
        
        const sessionResponse = await fetch("http://localhost:8080/api/auth/check-session", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${loginResult.token}`
          },
          credentials: "include"
        });
        
        if (sessionResponse.ok) {
          const sessionResult = await sessionResponse.json();
          console.log("✅ Session check successful:", sessionResult);
        } else {
          console.log("❌ Session check failed");
        }
        
      } else {
        console.log("❌ No token received");
      }
      
    } else {
      const errorText = await loginResponse.text();
      console.log("❌ Login failed:", errorText);
      
      // 7. Test với tài khoản khác
      console.log("6. Testing with different credentials...");
      
      const testCredentials = [
        { email: "admin@zmen.com", matKhau: "123456" },
        { email: "admin", matKhau: "admin123" },
        { email: "admin@example.com", matKhau: "password" }
      ];
      
      for (const cred of testCredentials) {
        console.log(`Trying: ${cred.email}`);
        
        const testResponse = await fetch("http://localhost:8080/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(cred),
          credentials: "include"
        });
        
        if (testResponse.ok) {
          const testResult = await testResponse.json();
          console.log(`✅ Login successful with ${cred.email}:`, testResult);
          break;
        } else {
          console.log(`❌ Failed with ${cred.email}`);
        }
      }
    }
    
    // 8. Kiểm tra localStorage
    console.log("7. Checking localStorage...");
    
    const currentUser = localStorage.getItem("currentUser");
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    
    console.log("Current user in localStorage:", currentUser);
    console.log("Is logged in:", isLoggedIn);
    
    if (currentUser) {
      try {
        const userData = JSON.parse(currentUser);
        console.log("Parsed user data:", userData);
      } catch (e) {
        console.log("❌ Invalid user data in localStorage");
      }
    }
    
    // 9. Test frontend auth service
    console.log("8. Testing frontend auth service...");
    
    if (typeof authService !== 'undefined') {
      console.log("✅ authService available");
      
      const currentUserFromService = authService.getCurrentUser();
      const isLoggedInFromService = authService.isLoggedIn();
      
      console.log("Current user from service:", currentUserFromService);
      console.log("Is logged in from service:", isLoggedInFromService);
    } else {
      console.log("❌ authService not available");
    }
    
    console.log("🔍 === ADMIN LOGIN FLOW TEST COMPLETED ===");
    
  } catch (error) {
    console.error("❌ Error in admin login flow test:", error);
  }
};

// Export function
window.testAdminLoginFlow = testAdminLoginFlow;

// Auto-run
testAdminLoginFlow();
