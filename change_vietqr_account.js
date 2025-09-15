const fs = require("fs");
const path = require("path");

// Thông tin tài khoản mới (thay đổi ở đây)
const NEW_ACCOUNT_CONFIG = {
  bankId: "83386056", // Mã ngân hàng (VCB = 83386056)
  accountNumber: "1234567890", // Số tài khoản mới
  accountName: "NGUYEN VAN A", // Tên chủ tài khoản mới
};

// Đường dẫn file cấu hình
const configPath = path.join(
  __dirname,
  "Website-b-n-qu-n-o-nam-ZMEN",
  "ZMEN",
  "src",
  "main",
  "resources",
  "application.properties"
);

function updateVietQRAccount() {
  try {
    console.log("🔧 Đang cập nhật thông tin tài khoản VietQR...");

    // Đọc file cấu hình hiện tại
    let configContent = fs.readFileSync(configPath, "utf8");

    // Thay thế thông tin tài khoản
    configContent = configContent.replace(
      /vietqr\.bank\.id=.*/,
      `vietqr.bank.id=${NEW_ACCOUNT_CONFIG.bankId}`
    );

    configContent = configContent.replace(
      /vietqr\.account\.number=.*/,
      `vietqr.account.number=${NEW_ACCOUNT_CONFIG.accountNumber}`
    );

    configContent = configContent.replace(
      /vietqr\.account\.name=.*/,
      `vietqr.account.name=${NEW_ACCOUNT_CONFIG.accountName}`
    );

    // Ghi lại file cấu hình
    fs.writeFileSync(configPath, configContent, "utf8");

    console.log("✅ Cập nhật thành công!");
    console.log("📋 Thông tin tài khoản mới:");
    console.log(`   - Mã ngân hàng: ${NEW_ACCOUNT_CONFIG.bankId}`);
    console.log(`   - Số tài khoản: ${NEW_ACCOUNT_CONFIG.accountNumber}`);
    console.log(`   - Tên chủ tài khoản: ${NEW_ACCOUNT_CONFIG.accountName}`);
    console.log("");
    console.log("🔄 Bạn cần restart ứng dụng để áp dụng thay đổi!");
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật:", error.message);
    console.log("");
    console.log("💡 Hướng dẫn thủ công:");
    console.log(
      "1. Mở file: Website-b-n-qu-n-o-nam-ZMEN/ZMEN/src/main/resources/application.properties"
    );
    console.log("2. Tìm và thay đổi các dòng:");
    console.log(`   vietqr.account.number=${NEW_ACCOUNT_CONFIG.accountNumber}`);
    console.log(`   vietqr.account.name=${NEW_ACCOUNT_CONFIG.accountName}`);
  }
}

// Chạy script
updateVietQRAccount();
