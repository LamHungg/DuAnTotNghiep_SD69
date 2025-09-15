# 🔧 Test Backend QR Fix

## 🎯 **Vấn Đề Đã Sửa**

### **Trước:**

- Backend sử dụng `@RequestParam` để nhận dữ liệu
- Frontend gửi JSON data
- ❌ **Lỗi 500** - Không tương thích format

### **Sau:**

- Backend sử dụng `@RequestBody VietQRRequest` để nhận JSON
- Frontend gửi JSON data
- ✅ **Tương thích** - Cùng format

## 🔄 **Cách Test**

### **Bước 1: Restart Backend**

```bash
# Dừng backend hiện tại (Ctrl+C)
# Chạy lại backend
cd Website-b-n-qu-n-o-nam-ZMEN/ZMEN
./mvnw spring-boot:run
```

### **Bước 2: Test API Trực Tiếp**

```bash
# Test với curl
curl -X POST http://localhost:8080/api/payment/create-vietqr-payment \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 769000,
    "orderCode": "ORDER-123456",
    "description": "Thanh toan ORDER-123456"
  }'
```

### **Bước 3: Test Trong Frontend**

1. Mở POS System: `http://localhost:3000/dashboard/pos`
2. Thêm sản phẩm vào giỏ hàng
3. Chọn "Chuyển khoản"
4. Click "Tạo mã QR thanh toán"
5. Kiểm tra console logs

## 📋 **Kết Quả Mong Đợi**

### **Backend Console:**

```
Creating VietQR payment:
Amount: 769000.0
Order Code: ORDER-123456
Description: Thanh toan ORDER-123456
QR data generated: https://api.vietqr.io/v2/generate?acqId=83386056&accountNo=0567846199999&accountName=DANG LAM HUNG&amount=769000&addInfo=Thanh toan ORDER-123456&format=text&template=print
```

### **Frontend Console:**

```
🔍 QR Debug - Input data: {amount: 769000, orderCode: "ORDER-123456", description: "Thanh toan ORDER-123456"}
🔍 QR Debug - JSON data: {amount: 769000, orderCode: "ORDER-123456", description: "Thanh toan ORDER-123456"}
🔍 QR Debug - Response: https://api.vietqr.io/v2/generate?acqId=83386056&accountNo=0567846199999&accountName=DANG LAM HUNG&amount=769000&addInfo=Thanh toan ORDER-123456&format=text&template=print
```

### **QR Modal:**

- ✅ Hiển thị QR code từ backend API
- ✅ Thông tin ngân hàng: **MB BANK - 0567846199999**
- ✅ Có thể quét được với app ngân hàng

## ⚠️ **Nếu Vẫn Lỗi**

### **Kiểm tra 1: Backend Logs**

```bash
# Xem logs backend có lỗi gì không
tail -f Website-b-n-qu-n-o-nam-ZMEN/ZMEN/logs/application.log
```

### **Kiểm tra 2: Network Tab**

1. Mở Developer Tools (F12)
2. Tab Network
3. Click "Tạo mã QR thanh toán"
4. Xem request/response

### **Kiểm tra 3: API Test**

```bash
# Test endpoint cơ bản
curl http://localhost:8080/api/payment/test
# Kết quả: "Payment endpoint is working"
```

## 🎉 **Thành Công**

Nếu test thành công:

- ✅ Backend nhận được JSON data
- ✅ Trả về QR URL hợp lệ
- ✅ Frontend hiển thị QR code
- ✅ Có thể quét được với app ngân hàng

## 📞 **Hỗ Trợ**

Nếu vẫn có vấn đề, hãy cung cấp:

1. Backend console logs
2. Frontend console logs
3. Network tab request/response
