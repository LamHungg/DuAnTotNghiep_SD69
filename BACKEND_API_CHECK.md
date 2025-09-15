# 🔧 Kiểm Tra API Backend - Debug Sản Phẩm

## 🎯 Vấn Đề Hiện Tại

Sản phẩm chỉ hiển thị hình ảnh mà không có thông tin tên, giá, mã sản phẩm.

## 📋 Các Bước Kiểm Tra

### 1. **Kiểm Tra Backend Server**

```bash
# Kiểm tra server có chạy không
curl http://localhost:8080/actuator/health

# Hoặc test endpoint đơn giản
curl http://localhost:8080/api/auth/test
```

### 2. **Test API Products Endpoint**

```bash
# Test API lấy sản phẩm
curl -X GET http://localhost:8080/api/pos/products \
  -H "Content-Type: application/json" \
  -v

# Test với authentication (nếu cần)
curl -X GET http://localhost:8080/api/pos/products \
  -H "Content-Type: application/json" \
  -H "Cookie: JSESSIONID=your-session-id" \
  -v
```

### 3. **Kiểm Tra Response Format**

API response nên có format như sau:

```json
[
  {
    "id": 1,
    "maSanPham": "SP001",
    "tenSanPham": "Áo thun nam",
    "gia": 150000,
    "soLuong": 50,
    "trangThai": 1,
    "hinhAnh": [
      {
        "id": 1,
        "duongDan": "path/to/image.jpg"
      }
    ],
    "variants": [
      {
        "id": 1,
        "kichCo": "M",
        "mauSac": "Đen",
        "chatLieu": "Cotton",
        "gia": 150000,
        "soLuong": 20
      }
    ]
  }
]
```

### 4. **Kiểm Tra Database**

```sql
-- Kiểm tra dữ liệu sản phẩm
SELECT TOP 5
  id,
  maSanPham,
  tenSanPham,
  gia,
  soLuong,
  trangThai
FROM san_pham
WHERE trangThai = 1;

-- Kiểm tra chi tiết sản phẩm
SELECT TOP 5
  c.id,
  c.sanPhamId,
  c.kichCo,
  c.mauSac,
  c.chatLieu,
  c.gia,
  c.soLuong
FROM chi_tiet_san_pham c
INNER JOIN san_pham s ON c.sanPhamId = s.id
WHERE s.trangThai = 1;

-- Kiểm tra hình ảnh sản phẩm
SELECT TOP 5
  h.id,
  h.sanPhamId,
  h.duongDan,
  h.tenFile
FROM hinh_anh h
INNER JOIN san_pham s ON h.sanPhamId = s.id
WHERE s.trangThai = 1;
```

## 🚨 Các Lỗi Thường Gặp

### **Lỗi 1: API trả về mảng rỗng**

```json
[]
```

**Nguyên nhân:**

- Database không có dữ liệu
- Query filter sai
- Trạng thái sản phẩm không đúng

**Giải pháp:**

1. Kiểm tra database có dữ liệu không
2. Kiểm tra query trong backend
3. Kiểm tra trạng thái sản phẩm

### **Lỗi 2: API trả về null hoặc undefined**

```json
null
```

**Nguyên nhân:**

- Exception trong backend
- Database connection issue
- Service method lỗi

**Giải pháp:**

1. Kiểm tra backend logs
2. Kiểm tra database connection
3. Kiểm tra service implementation

### **Lỗi 3: API trả về format sai**

```json
{
  "message": "Error message",
  "status": 500
}
```

**Nguyên nhân:**

- Exception trong controller
- Service method throw error
- Database query lỗi

**Giải pháp:**

1. Kiểm tra backend logs
2. Kiểm tra exception handling
3. Kiểm tra database query

## 🔧 Kiểm Tra Backend Controller

### **Controller Example**

```java
@RestController
@RequestMapping("/api/pos")
@CrossOrigin(origins = "http://localhost:3000")
public class POSController {

    @Autowired
    private SanPhamService sanPhamService;

    @GetMapping("/products")
    public ResponseEntity<List<SanPham>> getAllProducts() {
        try {
            List<SanPham> products = sanPhamService.getAllActiveProducts();
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
}
```

### **Service Example**

```java
@Service
public class SanPhamService {

    @Autowired
    private SanPhamRepository sanPhamRepository;

    public List<SanPham> getAllActiveProducts() {
        try {
            return sanPhamRepository.findByTrangThai(1);
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }
}
```

## 🛠️ Debug Tools

### **1. Browser Developer Tools**

- Network tab: Xem API response
- Console tab: Xem JavaScript errors
- Application tab: Xem cookies/session

### **2. Backend Logs**

```bash
# Xem Spring Boot logs
tail -f logs/application.log

# Hoặc console output khi chạy application
```

### **3. Database Tools**

- SQL Server Management Studio
- Azure Data Studio
- DBeaver

## 📊 Kết Quả Mong Đợi

### **Success Case**

```json
[
  {
    "id": 1,
    "maSanPham": "SP001",
    "tenSanPham": "Áo thun nam Nike",
    "gia": 150000,
    "soLuong": 50,
    "trangThai": 1,
    "hinhAnh": [
      {
        "id": 1,
        "duongDan": "/images/products/nike-tshirt.jpg"
      }
    ]
  }
]
```

### **Error Case**

```json
{
  "timestamp": "2024-01-01T12:00:00.000+00:00",
  "status": 500,
  "error": "Internal Server Error",
  "message": "Database connection failed",
  "path": "/api/pos/products"
}
```

## ✅ Checklist Debug

- [ ] Backend server đang chạy
- [ ] Database có dữ liệu sản phẩm
- [ ] API endpoint `/api/pos/products` hoạt động
- [ ] API trả về dữ liệu đúng format
- [ ] CORS được cấu hình đúng
- [ ] Frontend có thể gọi API thành công
- [ ] Console không có lỗi JavaScript
- [ ] Network tab hiển thị response đúng

## 📞 Hỗ Trợ

Nếu vẫn gặp vấn đề:

1. **Chụp màn hình** API response
2. **Copy** curl command và response
3. **Kiểm tra** backend logs
4. **Kiểm tra** database dữ liệu
5. **Liên hệ** developer với thông tin trên
