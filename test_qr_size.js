// Test QR code với kích thước mới (400px)
console.log("🧪 Testing QR code with new size (400px)...");

async function testQRCodeSize() {
  try {
    console.log("📡 Testing QR code generation with larger size...");

    const response = await fetch(
      "http://localhost:8080/api/payment/create-vietqr-payment",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: 150000, // 150,000 VND
          orderCode: "TEST_QR_SIZE_" + Date.now(),
          description: "Test QR code size for ZMEN",
        }),
      }
    );

    console.log("📊 Response status:", response.status);

    if (response.ok) {
      const data = await response.json();
      console.log("✅ QR code generated successfully!");
      console.log("📱 QR Data URL:", data.qrDataURL);

      // Tạo element để hiển thị QR code
      const qrContainer = document.createElement("div");
      qrContainer.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                z-index: 10000;
                text-align: center;
            `;

      const qrImage = document.createElement("img");
      qrImage.src = data.qrDataURL;
      qrImage.style.cssText = `
                width: 400px;
                height: 400px;
                max-width: 100%;
                border: 2px solid #e9ecef;
                border-radius: 8px;
                margin-bottom: 15px;
            `;

      const closeButton = document.createElement("button");
      closeButton.textContent = "Đóng";
      closeButton.style.cssText = `
                background: #dc3545;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 14px;
            `;
      closeButton.onclick = () => document.body.removeChild(qrContainer);

      const infoText = document.createElement("p");
      infoText.textContent = `QR Code Size: 400x400px | Amount: 150,000 VND`;
      infoText.style.cssText = `
                margin: 10px 0;
                font-size: 14px;
                color: #666;
            `;

      qrContainer.appendChild(qrImage);
      qrContainer.appendChild(infoText);
      qrContainer.appendChild(closeButton);

      document.body.appendChild(qrContainer);

      console.log("🖼️ QR code displayed with size 400x400px");
      console.log("📋 QR code should be larger and easier to scan");
    } else {
      const errorText = await response.text();
      console.error("❌ Error generating QR code:");
      console.error("Status:", response.status);
      console.error("Response:", errorText);
    }
  } catch (error) {
    console.error("❌ Network error:", error.message);
  }
}

// Test fallback QR code
async function testFallbackQR() {
  try {
    console.log("📡 Testing fallback QR code generation...");

    // Tạo QR code offline với kích thước lớn
    const qrString = `MBBank\nSố TK: 0567846199999\nChủ TK: DANG LAM HUNG\nSố tiền: 200,000 VND\nNội dung: Test fallback QR`;

    const qrDataURL = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(
      qrString
    )}`;

    console.log("✅ Fallback QR code generated!");
    console.log("📱 Fallback QR URL:", qrDataURL);

    // Hiển thị fallback QR code
    const qrContainer = document.createElement("div");
    qrContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 10000;
            text-align: center;
            max-width: 450px;
        `;

    const qrImage = document.createElement("img");
    qrImage.src = qrDataURL;
    qrImage.style.cssText = `
            width: 400px;
            height: 400px;
            max-width: 100%;
            border: 1px solid #ddd;
            border-radius: 4px;
            margin-bottom: 10px;
        `;

    const closeButton = document.createElement("button");
    closeButton.textContent = "X";
    closeButton.style.cssText = `
            position: absolute;
            top: 5px;
            right: 5px;
            background: #dc3545;
            color: white;
            border: none;
            width: 25px;
            height: 25px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 12px;
        `;
    closeButton.onclick = () => document.body.removeChild(qrContainer);

    const infoText = document.createElement("p");
    infoText.textContent = "Fallback QR Code (400x400px)";
    infoText.style.cssText = `
            margin: 5px 0;
            font-size: 12px;
            color: #666;
        `;

    qrContainer.appendChild(closeButton);
    qrContainer.appendChild(qrImage);
    qrContainer.appendChild(infoText);

    document.body.appendChild(qrContainer);
  } catch (error) {
    console.error("❌ Error generating fallback QR:", error.message);
  }
}

// Chạy tests
async function runQRTests() {
  console.log("🚀 Starting QR code size tests...\n");

  await testQRCodeSize();
  console.log("");

  await testFallbackQR();
  console.log("");

  console.log("🏁 QR code size tests completed!");
  console.log(
    "📱 Both VietQR API and fallback QR codes should now display at 400x400px"
  );
}

// Chạy test
runQRTests();
