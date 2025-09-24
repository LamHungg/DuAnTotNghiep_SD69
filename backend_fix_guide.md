# 🔧 Hướng Dẫn Sửa Backend - Entity Mapping Issue

## 🚨 Vấn Đề Đã Xác Định

**Backend đang sử dụng sai entity**: `KhachHang` thay vì `NguoiDung`
**Lỗi**: `class com.example.ZMEN.entity.KhachHang cannot be cast...`

## 🔍 Các File Backend Cần Kiểm Tra

### 1. **NguoiDungController.java**

```java
@RestController
@RequestMapping("/api/nguoi-dung")
public class NguoiDungController {

    @Autowired
    private NguoiDungService nguoiDungService;

    @PostMapping
    public ResponseEntity<?> createNguoiDung(@RequestBody NguoiDung nguoiDung) {
        try {
            // ✅ Đảm bảo sử dụng NguoiDung entity
            NguoiDung savedNguoiDung = nguoiDungService.createNguoiDung(nguoiDung);
            return ResponseEntity.ok(savedNguoiDung);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
```

### 2. **NguoiDungService.java**

```java
@Service
public class NguoiDungService {

    @Autowired
    private NguoiDungRepository nguoiDungRepository;

    public NguoiDung createNguoiDung(NguoiDung nguoiDung) {
        // ✅ Đảm bảo sử dụng NguoiDung entity
        return nguoiDungRepository.save(nguoiDung);
    }
}
```

### 3. **NguoiDungRepository.java**

```java
@Repository
public interface NguoiDungRepository extends JpaRepository<NguoiDung, Long> {
    // ✅ Đảm bảo sử dụng NguoiDung entity
    Optional<NguoiDung> findByTenDangNhap(String tenDangNhap);
    Optional<NguoiDung> findByEmail(String email);
}
```

### 4. **NguoiDung.java Entity**

```java
@Entity
@Table(name = "nguoi_dung")
public class NguoiDung {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ho_ten", nullable = false)
    private String hoTen;

    @Column(name = "ten_dang_nhap", nullable = false, unique = true)
    private String tenDangNhap;

    @Column(name = "mat_khau", nullable = false)
    private String matKhau;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "so_dien_thoai", nullable = false)
    private String soDienThoai;

    @Enumerated(EnumType.STRING)
    @Column(name = "chuc_vu", nullable = false)
    private ChucVu chucVu;

    @Column(name = "trang_thai", nullable = false)
    private Boolean trangThai = true;

    // Constructors, getters, setters
}
```

### 5. **ChucVu.java Enum**

```java
public enum ChucVu {
    ADMIN,
    QUANLY,
    NHANVIEN
}
```

## 🔧 Các Bước Sửa Lỗi

### Bước 1: Kiểm Tra Controller

- Tìm file `NguoiDungController.java`
- Đảm bảo `@RequestMapping("/api/nguoi-dung")`
- Kiểm tra method `createNguoiDung` sử dụng đúng entity

### Bước 2: Kiểm Tra Service

- Tìm file `NguoiDungService.java`
- Đảm bảo method `createNguoiDung` nhận và trả về `NguoiDung`
- Không sử dụng `KhachHang` entity

### Bước 3: Kiểm Tra Repository

- Tìm file `NguoiDungRepository.java`
- Đảm bảo extends `JpaRepository<NguoiDung, Long>`
- Không sử dụng `KhachHang` entity

### Bước 4: Kiểm Tra Entity

- Tìm file `NguoiDung.java`
- Đảm bảo `@Table(name = "nguoi_dung")`
- Kiểm tra các field mapping đúng

### Bước 5: Kiểm Tra Database

```sql
-- Kiểm tra bảng có tồn tại không
SHOW TABLES LIKE 'nguoi_dung';

-- Kiểm tra cấu trúc bảng
DESCRIBE nguoi_dung;

-- Kiểm tra dữ liệu mẫu
SELECT * FROM nguoi_dung LIMIT 5;
```

## 🚨 Các Lỗi Thường Gặp

### 1. **Wrong Entity Import**

```java
// ❌ SAI
import com.example.ZMEN.entity.KhachHang;

// ✅ ĐÚNG
import com.example.ZMEN.entity.NguoiDung;
```

### 2. **Wrong Repository Type**

```java
// ❌ SAI
@Autowired
private KhachHangRepository khachHangRepository;

// ✅ ĐÚNG
@Autowired
private NguoiDungRepository nguoiDungRepository;
```

### 3. **Wrong Method Parameter**

```java
// ❌ SAI
public ResponseEntity<?> createNguoiDung(@RequestBody KhachHang khachHang) {

// ✅ ĐÚNG
public ResponseEntity<?> createNguoiDung(@RequestBody NguoiDung nguoiDung) {
```

### 4. **Wrong Table Mapping**

```java
// ❌ SAI
@Table(name = "khach_hang")

// ✅ ĐÚNG
@Table(name = "nguoi_dung")
```

## 🔍 Cách Tìm Lỗi

### 1. **Search trong Project**

```bash
# Tìm tất cả file chứa "KhachHang"
grep -r "KhachHang" src/

# Tìm tất cả file chứa "nguoi-dung"
grep -r "nguoi-dung" src/
```

### 2. **Kiểm Tra Logs**

- Xem console logs khi chạy backend
- Tìm error messages liên quan đến entity casting

### 3. **Test API**

```bash
# Test endpoint
curl -X POST http://localhost:8080/api/nguoi-dung \
  -H "Content-Type: application/json" \
  -d '{
    "hoTen": "Test User",
    "tenDangNhap": "testuser",
    "matKhau": "123456",
    "email": "test@example.com",
    "soDienThoai": "0123456789",
    "chucVu": "NHANVIEN",
    "trangThai": true
  }'
```

## ✅ Checklist Sửa Lỗi

- [ ] Kiểm tra NguoiDungController.java
- [ ] Kiểm tra NguoiDungService.java
- [ ] Kiểm tra NguoiDungRepository.java
- [ ] Kiểm tra NguoiDung.java entity
- [ ] Kiểm tra ChucVu.java enum
- [ ] Kiểm tra database table structure
- [ ] Test API endpoint
- [ ] Verify frontend integration

## 🎯 Kết Quả Mong Đợi

Sau khi sửa xong:

- ✅ API `/api/nguoi-dung` POST hoạt động
- ✅ Không còn lỗi entity casting
- ✅ Frontend có thể thêm nhân viên thành công
- ✅ Dữ liệu được lưu vào database đúng

## 📞 Hỗ Trợ

Nếu vẫn gặp lỗi sau khi sửa:

1. Kiểm tra lại tất cả imports
2. Restart backend server
3. Clear browser cache
4. Test lại với frontend
