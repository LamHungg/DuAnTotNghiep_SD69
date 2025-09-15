# 🔧 Cấu Hình Thông Tin Ngân Hàng

## 📍 **Vị Trí Cấu Hình**

File: `DATN-FRONTEND/src/services/posService.js`
Dòng: 106-111

## 🔧 **Cách Thay Đổi Thông Tin**

### **Bước 1: Mở File**

Mở file `posService.js` và tìm đến đoạn code:

```javascript
// 🔧 THÔNG TIN TÀI KHOẢN NGÂN HÀNG - CÓ THỂ THAY ĐỔI Ở ĐÂY
const bankInfo = {
  bankName: "Vietcombank", // Tên ngân hàng
  accountNo: "1234567890", // Số tài khoản
  accountName: "CÔNG TY ABC", // Chủ tài khoản
  branch: "Chi nhánh Hà Nội", // Chi nhánh (tùy chọn)
};
```

### **Bước 2: Thay Đổi Thông Tin**

#### **Ví Dụ 1: Vietcombank**

```javascript
const bankInfo = {
  bankName: "Vietcombank",
  accountNo: "1234567890",
  accountName: "CÔNG TY ABC",
  branch: "Chi nhánh Hà Nội",
};
```

#### **Ví Dụ 2: BIDV**

```javascript
const bankInfo = {
  bankName: "BIDV",
  accountNo: "9876543210",
  accountName: "CÔNG TY XYZ",
  branch: "Chi nhánh TP.HCM",
};
```

#### **Ví Dụ 3: Techcombank**

```javascript
const bankInfo = {
  bankName: "Techcombank",
  accountNo: "1122334455",
  accountName: "DOANH NGHIỆP ABC",
  branch: "Chi nhánh Đà Nẵng",
};
```

## 📋 **Thông Tin Cần Cung Cấp**

### **Bắt Buộc:**

- `bankName`: Tên ngân hàng
- `accountNo`: Số tài khoản
- `accountName`: Tên chủ tài khoản

### **Tùy Chọn:**

- `branch`: Chi nhánh ngân hàng

## 🎯 **Kết Quả Sau Khi Thay Đổi**

### **QR Code sẽ hiển thị:**

```
[BankName]
Số TK: [AccountNo]
Chủ TK: [AccountName]
Số tiền: [Amount] VND
Nội dung: Thanh toan [OrderCode]
```

### **QR Modal sẽ hiển thị:**

- ✅ **QR Code image** với thông tin mới
- ✅ **Thông tin ngân hàng** đã cập nhật
- ✅ **Dễ quét** với app ngân hàng

## 🔄 **Cách Test Sau Khi Thay Đổi**

### **Bước 1: Lưu File**

1. Lưu file `posService.js`
2. Frontend sẽ tự động reload

### **Bước 2: Test QR Code**

1. Mở POS System: `http://localhost:3000/dashboard/pos`
2. Thêm sản phẩm vào giỏ hàng
3. Chọn "Chuyển khoản"
4. Click "Tạo mã QR thanh toán"
5. Kiểm tra thông tin ngân hàng mới

### **Bước 3: Kiểm Tra Console**

```
🔍 QR Debug - Bank Info: {
  bankName: "Tên ngân hàng mới",
  accountNo: "Số TK mới",
  accountName: "Chủ TK mới",
  branch: "Chi nhánh mới"
}
```

## ⚠️ **Lưu Ý Quan Trọng**

1. **Số tài khoản phải chính xác** - Không có khoảng trắng
2. **Tên chủ tài khoản** - Viết hoa, không dấu
3. **Lưu file sau khi thay đổi** - Để frontend reload
4. **Test kỹ** - Đảm bảo QR code hiển thị đúng

## 📞 **Hỗ Trợ**

Nếu cần thay đổi thông tin ngân hàng, chỉ cần sửa 4 dòng trong file `posService.js` và lưu lại!
