# Cập nhật CORS - Hướng dẫn bổ sung

## Vấn đề phát hiện thêm

Từ kết quả test ban đầu, chúng ta thấy:

- Backend trả về status 200 (OK)
- Nhưng CORS headers trả về `null`
- Điều này có nghĩa là cấu hình CORS chưa hoạt động đúng

## Các thay đổi bổ sung đã thực hiện

### 1. Cập nhật tất cả Controllers

Đã cập nhật tất cả controllers để có cấu hình CORS nhất quán:

```java
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"}, allowCredentials = "true")
```

**Controllers đã cập nhật:**

- `InvoiceController.java`
- `ThongKeControllor.java`
- `DonHangAddController.java`
- `DonHangContro.java`
- `PaymentController.java`
- `CustomerController.java`

### 2. Scripts test mới

**a) `check_backend_status.js`**

- Kiểm tra trạng thái backend
- Hiển thị tất cả response headers
- Kiểm tra CORS headers cụ thể

**b) `test_cors_simple.js`**

- Test đơn giản và chính xác hơn
- Hiển thị chi tiết tất cả headers
- Test POST request thực tế

## Cách test sau khi cập nhật

### 1. Khởi động lại backend

```bash
cd Website-b-n-qu-n-o-nam-ZMEN/ZMEN
mvn spring-boot:run
```

### 2. Chạy script kiểm tra backend

Mở browser console và chạy:

```javascript
// Copy nội dung từ file check_backend_status.js
```

### 3. Chạy script test CORS

```javascript
// Copy nội dung từ file test_cors_simple.js
```

## Kết quả mong đợi

Sau khi cập nhật, bạn sẽ thấy:

**Trong `check_backend_status.js`:**

```
✅ Backend is running!

Response Headers:
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS
Access-Control-Allow-Headers: *
```

**Trong `test_cors_simple.js`:**

- Tất cả requests trả về status 200
- CORS headers được set đúng
- POST request thành công

## Troubleshooting

### Nếu vẫn không thấy CORS headers:

1. **Kiểm tra backend logs:**

   - Xem có lỗi gì khi khởi động không
   - Kiểm tra có conflict giữa các cấu hình không

2. **Kiểm tra Spring Security:**

   - Đảm bảo CORS được enable trong Security config
   - Kiểm tra không có filter nào block CORS

3. **Kiểm tra browser:**
   - Xóa cache browser
   - Thử incognito mode
   - Kiểm tra Network tab trong DevTools

### Nếu backend không khởi động:

1. **Kiểm tra port 8080:**

   ```bash
   netstat -ano | findstr :8080
   ```

2. **Kiểm tra Java version:**

   ```bash
   java -version
   ```

3. **Kiểm tra Maven:**
   ```bash
   mvn -version
   ```

## Lưu ý quan trọng

1. **Backend phải restart** sau mỗi thay đổi cấu hình
2. **Kiểm tra logs** để xem có lỗi gì không
3. **Test từng bước** để xác định vấn đề cụ thể
4. **Sử dụng DevTools** để xem chi tiết network requests
