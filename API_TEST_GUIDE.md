# 🔧 Hướng Dẫn Test API Backend

## 🎯 Mục Đích

Kiểm tra xem backend có hoạt động đúng không và API endpoints có trả về dữ liệu không.

## 📋 Các Bước Test

### 1. **Kiểm Tra Backend Server**

```bash
# Kiểm tra server có chạy không
curl http://localhost:8080/actuator/health

# Hoặc test endpoint đơn giản
curl http://localhost:8080/api/auth/test
```

### 2. **Test API Endpoints POS**

#### **Test Products API**

```bash
# Lấy tất cả sản phẩm
curl -X GET http://localhost:8080/api/pos/products \
  -H "Content-Type: application/json"

# Test với authentication (nếu cần)
curl -X GET http://localhost:8080/api/pos/products \
  -H "Content-Type: application/json" \
  -H "Cookie: JSESSIONID=your-session-id"
```

#### **Test Customers API**

```bash
# Lấy tất cả khách hàng
curl -X GET http://localhost:8080/api/pos/customers \
  -H "Content-Type: application/json"
```

#### **Test Vouchers API**

```bash
# Lấy voucher active
curl -X GET http://localhost:8080/api/pos/vouchers/active \
  -H "Content-Type: application/json"
```

### 3. **Test Database Connection**

```sql
-- Kiểm tra kết nối database
SELECT @@VERSION;

-- Kiểm tra dữ liệu sản phẩm
SELECT COUNT(*) as total_products FROM san_pham;
SELECT TOP 5 * FROM san_pham;

-- Kiểm tra dữ liệu khách hàng
SELECT COUNT(*) as total_customers FROM khach_hang;
SELECT TOP 5 * FROM khach_hang;

-- Kiểm tra dữ liệu voucher
SELECT COUNT(*) as total_vouchers FROM voucher;
SELECT TOP 5 * FROM voucher WHERE trangThai = 1;
```

### 4. **Test CORS Configuration**

```bash
# Test CORS preflight request
curl -X OPTIONS http://localhost:8080/api/pos/products \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v
```

## 🚨 Các Lỗi Thường Gặp

### **Lỗi 1: Connection Refused**

```
curl: (7) Failed to connect to localhost port 8080: Connection refused
```

**Giải pháp:**

- Kiểm tra backend có chạy không
- Kiểm tra port 8080 có đúng không
- Kiểm tra firewall

### **Lỗi 2: 404 Not Found**

```
HTTP/1.1 404 Not Found
```

**Giải pháp:**

- Kiểm tra URL endpoint có đúng không
- Kiểm tra controller mapping
- Kiểm tra request mapping

### **Lỗi 3: 500 Internal Server Error**

```
HTTP/1.1 500 Internal Server Error
```

**Giải pháp:**

- Kiểm tra backend logs
- Kiểm tra database connection
- Kiểm tra exception handling

### **Lỗi 4: CORS Error**

```
Access to fetch at 'http://localhost:8080/api/pos/products' from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Giải pháp:**

- Kiểm tra CORS configuration trong backend
- Đảm bảo `@CrossOrigin` được cấu hình đúng

## 🔧 Cấu Hình Backend

### **CORS Configuration**

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

### **Controller Example**

```java
@RestController
@RequestMapping("/api/pos")
@CrossOrigin(origins = "http://localhost:3000")
public class POSController {

    @GetMapping("/products")
    public ResponseEntity<List<SanPham>> getAllProducts() {
        try {
            List<SanPham> products = sanPhamService.getAllProducts();
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}
```

## 📊 Kết Quả Mong Đợi

### **Success Response**

```json
[
  {
    "id": 1,
    "maSanPham": "SP001",
    "tenSanPham": "Áo thun nam",
    "gia": 150000,
    "soLuong": 50,
    "trangThai": 1
  },
  {
    "id": 2,
    "maSanPham": "SP002",
    "tenSanPham": "Quần jean nam",
    "gia": 300000,
    "soLuong": 30,
    "trangThai": 1
  }
]
```

### **Error Response**

```json
{
  "timestamp": "2024-01-01T12:00:00.000+00:00",
  "status": 500,
  "error": "Internal Server Error",
  "message": "Database connection failed",
  "path": "/api/pos/products"
}
```

## 🛠️ Debug Tools

### **1. Browser Developer Tools**

- Network tab để xem API calls
- Console tab để xem errors
- Application tab để xem cookies/session

### **2. Postman/Insomnia**

- Test API endpoints
- Set headers và authentication
- View response details

### **3. Backend Logs**

```bash
# Xem Spring Boot logs
tail -f logs/application.log

# Hoặc console output khi chạy application
```

## 📞 Hỗ Trợ

Nếu gặp vấn đề:

1. **Chụp màn hình** error message
2. **Copy** curl command và response
3. **Kiểm tra** backend logs
4. **Liên hệ** developer với thông tin trên

## ✅ Checklist

- [ ] Backend server đang chạy
- [ ] Database connection OK
- [ ] API endpoints trả về dữ liệu
- [ ] CORS được cấu hình đúng
- [ ] Authentication (nếu cần) hoạt động
- [ ] Error handling hoạt động
- [ ] Frontend có thể gọi API thành công
