# Backend Authentication Setup

## Tổng quan

Đã thêm các endpoint authentication cần thiết vào backend để hỗ trợ frontend authentication system.

## Các thay đổi đã thực hiện

### 1. AuthController.java

**File:** `DATN-FRONTEND/Website-b-n-qu-n-o-nam-ZMEN/ZMEN/src/main/java/com/example/ZMEN/controller/AuthController.java`

**Thêm các endpoint:**

- `POST /api/auth/register` - Đăng ký tài khoản khách hàng
- `POST /api/auth/forgot-password` - Quên mật khẩu
- Cập nhật `POST /api/auth/login` - Hỗ trợ đăng nhập cả khách hàng và admin

**CORS Configuration:**

- Thêm `http://localhost:3001` vào danh sách allowed origins

### 2. DTO Classes

**RegisterRequest.java:**

- `firstName` - Họ
- `lastName` - Tên
- `email` - Email (validation)
- `password` - Mật khẩu (6-100 ký tự)
- `confirmPassword` - Xác nhận mật khẩu
- `phone` - Số điện thoại (optional)

**ForgotPasswordRequest.java:**

- `email` - Email để gửi link reset password

### 3. Frontend authService.js

**Cập nhật:**

- Sửa field `password` thành `matKhau` trong login request để tương thích với backend

## API Endpoints

### Register

```
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "Nguyen",
  "lastName": "Van A",
  "email": "nguyenvana@example.com",
  "password": "123456",
  "confirmPassword": "123456",
  "phone": "0123456789"
}
```

### Login

```
POST /api/auth/login
Content-Type: application/json

{
  "email": "nguyenvana@example.com",
  "matKhau": "123456"
}
```

### Forgot Password

```
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "nguyenvana@example.com"
}
```

## Cách hoạt động

### 1. Register Flow

1. Frontend gửi request đăng ký với thông tin user
2. Backend kiểm tra email và tên đăng nhập đã tồn tại chưa
3. Tạo `DangKyDto` và gọi `TaiKhoanKHService.dangKy()`
4. Trả về thông báo thành công và thông tin user

### 2. Login Flow

1. Frontend gửi email và password
2. Backend thử đăng nhập với khách hàng trước
3. Nếu không phải khách hàng, thử đăng nhập với admin/staff
4. Trả về thông tin user và token
5. Lưu session cho user

### 3. Forgot Password Flow

1. Frontend gửi email
2. Backend kiểm tra email có tồn tại không
3. Trả về thông báo đã gửi email (cần implement email service)

## Lưu ý quan trọng

### 1. Email Service

Endpoint `/api/auth/forgot-password` hiện tại chỉ trả về thông báo thành công. Cần implement email service để gửi email thực tế.

### 2. Password Hashing

Backend đã sử dụng `BCryptPasswordEncoder` để hash password.

### 3. Session Management

Backend sử dụng session-based authentication với các attribute:

- `user` - Thông tin user
- `isLoggedIn` - Trạng thái đăng nhập
- `userRole` - Role của user (CUSTOMER/ADMIN)

### 4. CORS Configuration

Đã cấu hình CORS để cho phép frontend từ:

- `http://localhost:3000`
- `http://localhost:3001`
- `http://localhost:3002`

## Testing

### 1. Test Register

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "password": "123456789",
    "confirmPassword": "123456789",
    "phone": "0123456789"
  }'
```

### 2. Test Login

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "matKhau": "123456789"
  }'
```

### 3. Test Forgot Password

```bash
curl -X POST http://localhost:8080/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'
```

### 4. Test với Node.js Script

Chạy test script để kiểm tra tất cả API:

```bash
cd DATN-FRONTEND
node test_auth_api.js
```

## Troubleshooting

### Lỗi 400 Bad Request

1. **Kiểm tra dữ liệu gửi từ frontend:**

   - Đảm bảo có đầy đủ các field required: `firstName`, `lastName`, `email`, `password`, `confirmPassword`
   - Field `phone` là optional
   - Email phải đúng format
   - Password phải có ít nhất 6 ký tự

2. **Kiểm tra validation errors:**
   - Xem response body để biết lỗi cụ thể
   - Kiểm tra logs backend

### Lỗi 500 Internal Server Error

1. Kiểm tra backend có đang chạy không
2. Kiểm tra database connection
3. Kiểm tra logs trong console

### Lỗi CORS

1. Đảm bảo CORS configuration đúng
2. Kiểm tra port frontend có trong allowed origins không

### Lỗi Validation

1. Kiểm tra format email
2. Kiểm tra độ dài password (tối thiểu 6 ký tự)
3. Kiểm tra các field required
4. Kiểm tra format phone number (10-11 số)

## Next Steps

1. **Implement Email Service** cho forgot password
2. **Add JWT Token** thay vì session-based
3. **Add Password Reset** endpoint
4. **Add Profile Management** endpoints
5. **Add Role-based Authorization**
