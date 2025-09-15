# Hướng dẫn sửa lỗi CORS

## Vấn đề gặp phải

Lỗi CORS khi thêm voucher và truy cập API người dùng:

```
Access to XMLHttpRequest at 'http://localhost:8080/api/nguoi-dung' from origin 'http://localhost:3000' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: The value of the 'Access-Control-Allow-Credentials' header in the response is '' which must be 'true' when the request's credentials mode is 'include'.
```

## Nguyên nhân

1. **Xung đột cấu hình CORS**: Có 2 file cấu hình CORS khác nhau (`CorsConfig.java` và `WebConfig.java`)
2. **Thiếu `allowCredentials`**: Một số controller không có `allowCredentials = "true"`
3. **Frontend không gửi credentials**: Các service không sử dụng `withCredentials: true`

## Các thay đổi đã thực hiện

### 1. Backend - Cấu hình CORS

#### a) Cập nhật `WebConfig.java`

```java
@Override
public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/**")
            .allowedOrigins("http://localhost:3000", "http://localhost:3001")
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true)  // ← Thêm dòng này
            .maxAge(3600);
}
```

#### b) Cập nhật `WebSecurityConfig.java`

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000", "http://localhost:3001"));
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setAllowCredentials(true);  // ← Quan trọng
    configuration.setMaxAge(3600L);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}
```

#### c) Cập nhật Controllers

Thêm `allowCredentials = "true"` vào các controller:

```java
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"}, allowCredentials = "true")
```

#### d) Xóa file `CorsConfig.java`

Để tránh xung đột với `WebConfig.java`

### 2. Frontend - Cập nhật Services

#### a) Tạo axios instance với credentials

```javascript
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // ← Thêm dòng này
});
```

#### b) Cập nhật tất cả API calls

Thay thế `axios` bằng `axiosInstance` trong tất cả các service:

- `voucherService.js`
- `nguoiDungService.js` (đã có sẵn)

## Cách test

### 1. Khởi động lại backend

```bash
cd Website-b-n-qu-n-o-nam-ZMEN/ZMEN
mvn spring-boot:run
```

### 2. Chạy script test

Mở browser console và chạy:

```javascript
// Copy nội dung từ file test_cors_fix.js
```

### 3. Kiểm tra trong ứng dụng

- Đăng nhập vào hệ thống
- Thử thêm voucher mới
- Kiểm tra không còn lỗi CORS

## Lưu ý quan trọng

1. **Backend phải khởi động lại** sau khi thay đổi cấu hình CORS
2. **Frontend không cần restart** nếu chỉ thay đổi service
3. **Đảm bảo session hợp lệ** khi test các API cần authentication
4. **Kiểm tra browser console** để xem các lỗi CORS còn lại

## Troubleshooting

### Nếu vẫn còn lỗi CORS:

1. Kiểm tra backend có chạy trên port 8080 không
2. Kiểm tra frontend có chạy trên port 3000 không
3. Xóa cache browser và thử lại
4. Kiểm tra console backend có lỗi gì không

### Nếu lỗi authentication:

1. Đảm bảo đã đăng nhập thành công
2. Kiểm tra session có hợp lệ không
3. Thử logout và login lại
