// Test VietQR API sau khi sửa lỗi URL
console.log("🧪 Testing VietQR API after URL fix...");

async function testVietQRPayment() {
    try {
        console.log("📡 Testing VietQR payment creation...");
        
        const response = await fetch('http://localhost:8080/api/payment/create-vietqr-payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: 100000, // 100,000 VND
                orderCode: 'TEST_ORDER_' + Date.now(),
                description: 'Test payment for ZMEN'
            })
        });

        console.log("📊 Response status:", response.status);
        console.log("📊 Response headers:", Object.fromEntries(response.headers.entries()));

        if (response.ok) {
            const data = await response.json();
            console.log("✅ VietQR payment created successfully!");
            console.log("📱 QR Data URL:", data.qrDataURL);
            
            // Test hiển thị QR code
            if (data.qrDataURL) {
                console.log("🖼️ QR Image URL:", data.qrDataURL);
                console.log("📋 Copy this URL to browser to view QR code");
            }
        } else {
            const errorText = await response.text();
            console.error("❌ Error creating VietQR payment:");
            console.error("Status:", response.status);
            console.error("Response:", errorText);
        }
    } catch (error) {
        console.error("❌ Network error:", error.message);
    }
}

async function testPaymentMethods() {
    try {
        console.log("📡 Testing payment methods endpoint...");
        
        const response = await fetch('http://localhost:8080/api/payment/methods');
        
        if (response.ok) {
            const methods = await response.json();
            console.log("✅ Payment methods retrieved:");
            methods.forEach(method => {
                console.log(`  - ${method.tenPhuongThuc} (ID: ${method.id})`);
            });
        } else {
            console.error("❌ Error getting payment methods:", response.status);
        }
    } catch (error) {
        console.error("❌ Network error:", error.message);
    }
}

async function testPaymentEndpoint() {
    try {
        console.log("📡 Testing payment endpoint...");
        
        const response = await fetch('http://localhost:8080/api/payment/test');
        
        if (response.ok) {
            const result = await response.text();
            console.log("✅ Payment endpoint test:", result);
        } else {
            console.error("❌ Payment endpoint test failed:", response.status);
        }
    } catch (error) {
        console.error("❌ Network error:", error.message);
    }
}

// Chạy các test
async function runAllTests() {
    console.log("🚀 Starting VietQR API tests...\n");
    
    await testPaymentEndpoint();
    console.log("");
    
    await testPaymentMethods();
    console.log("");
    
    await testVietQRPayment();
    console.log("");
    
    console.log("🏁 All tests completed!");
}

// Chạy test
runAllTests();
