# 🔧 HƯỚNG DẪN KHẮC PHỤC LỖI CHECKOUT

## 🚨 **VẤN ĐỀ HIỆN TẠI**

Bạn đang gặp lỗi **400 Bad Request** khi gọi API checkout. Nguyên nhân chính là do **không khớp cấu trúc dữ liệu** giữa frontend và backend.

## 🔍 **NGUYÊN NHÂN**

1. **Cấu trúc dữ liệu không khớp**: Frontend gửi `cartItems` với format khác với backend mong đợi
2. **Thiếu dữ liệu cần thiết**: Có thể thiếu các bảng hoặc dữ liệu mẫu trong database
3. **Session authentication**: Có thể có vấn đề với session

## 🛠️ **CÁCH KHẮC PHỤC**

### **Bước 1: Kiểm tra Backend**

Chạy script SQL để kiểm tra backend:

```sql
-- Chạy file: check_backend_checkout_ready.sql
-- Đảm bảo tất cả bảng và dữ liệu cần thiết đều tồn tại
```

### **Bước 2: Sửa Frontend Service**

Đã sửa file `datn_web_fe/src/services/checkoutService.js`:

```javascript
// Đảm bảo cartItems có đúng format
const fixedCartItems = checkoutData.cartItems.map((item) => ({
  chiTietSanPhamId: item.chiTietSanPhamId || item.id,
  soLuong: item.soLuong || item.quantity,
  gia: item.gia || item.price,
  thanhTien: item.thanhTien || item.gia * item.soLuong,
}));
```

### **Bước 3: Debug và Test**

#### **3.1. Chạy Script Debug**

Copy và paste vào Console của browser:

```javascript
// Chạy file: debug_checkout_issue.js
// Để kiểm tra dữ liệu và API endpoints
```

#### **3.2. Chạy Script Fix**

Copy và paste vào Console của browser:

```javascript
// Chạy file: fix_checkout_data_format.js
// Để sửa dữ liệu và test checkout
```

### **Bước 4: Kiểm tra Session**

Đảm bảo user đã đăng nhập và session còn hiệu lực:

```javascript
// Kiểm tra session
fetch("http://localhost:8080/api/auth/test-check-session", {
  method: "GET",
  credentials: "include",
})
  .then((response) => response.json())
  .then((data) => console.log("Session:", data));
```

## 📋 **CẤU TRÚC DỮ LIỆU ĐÚNG**

### **Frontend gửi:**

```javascript
{
  cartItems: [
    {
      chiTietSanPhamId: 1,  // ID của chi tiết sản phẩm
      soLuong: 2,           // Số lượng
      gia: 150000,          // Giá
      thanhTien: 300000     // Thành tiền
    }
  ],
  diaChiId: 16,             // ID địa chỉ
  voucherId: null,          // ID voucher (nếu có)
  phuongThucThanhToanId: 1, // ID phương thức thanh toán
  ghiChuKhachHang: "Ghi chú",
  phiVanChuyen: 30000,      // Phí vận chuyển
  tongTienHang: 300000,     // Tổng tiền hàng
  tongThanhToan: 330000     // Tổng thanh toán
}
```

### **Backend mong đợi:**

```java
public class CheckoutRequest {
    private List<CartItemRequest> cartItems;
    private Integer diaChiId;
    private Integer voucherId;
    private Integer phuongThucThanhToanId;
    private String ghiChuKhachHang;
    private BigDecimal phiVanChuyen;
    private BigDecimal tongTienHang;
    private BigDecimal tongThanhToan;
}

public class CartItemRequest {
    private Integer chiTietSanPhamId;
    private Integer soLuong;
    private BigDecimal gia;
    private BigDecimal thanhTien;
}
```

## 🔄 **QUY TRÌNH TEST**

### **1. Test Backend**

```bash
# Kiểm tra backend có hoạt động không
curl http://localhost:8080/api/checkout/test
```

### **2. Test Session**

```bash
# Kiểm tra session authentication
curl http://localhost:8080/api/auth/test-check-session
```

### **3. Test Checkout Process**

```bash
# Test với dữ liệu mẫu
curl -X POST http://localhost:8080/api/checkout/test-process \
  -H "Content-Type: application/json" \
  -d '{
    "cartItems": [{"chiTietSanPhamId": 1, "soLuong": 1, "gia": 150000, "thanhTien": 150000}],
    "diaChiId": 16,
    "phuongThucThanhToanId": 1,
    "phiVanChuyen": 30000,
    "tongTienHang": 150000,
    "tongThanhToan": 180000
  }'
```

## 🎯 **CÁC BƯỚC TIẾP THEO**

1. **Chạy script SQL** để kiểm tra backend
2. **Refresh trang checkout** để load code đã sửa
3. **Chạy script debug** để kiểm tra dữ liệu
4. **Chạy script fix** để sửa dữ liệu
5. **Thử checkout lại**

## 🚨 **LỖI THƯỜNG GẶP**

### **Lỗi 400 Bad Request**

- **Nguyên nhân**: Cấu trúc dữ liệu không đúng
- **Giải pháp**: Sử dụng script fix để sửa format dữ liệu

### **Lỗi 401 Unauthorized**

- **Nguyên nhân**: Session hết hạn hoặc chưa đăng nhập
- **Giải pháp**: Đăng nhập lại

### **Lỗi 404 Not Found**

- **Nguyên nhân**: API endpoint không tồn tại
- **Giải pháp**: Kiểm tra backend có chạy không

### **Lỗi Database**

- **Nguyên nhân**: Thiếu bảng hoặc dữ liệu
- **Giải pháp**: Chạy script SQL để tạo dữ liệu mẫu

## 📞 **HỖ TRỢ**

Nếu vẫn gặp lỗi, hãy:

1. Chạy script debug và gửi log
2. Kiểm tra console browser
3. Kiểm tra log backend
4. Đảm bảo database có đủ dữ liệu

---

**🎉 Sau khi hoàn thành các bước trên, checkout sẽ hoạt động bình thường!**
