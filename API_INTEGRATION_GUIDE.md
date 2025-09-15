# 🚀 Hướng dẫn tích hợp API Địa chỉ

## 📋 **Tổng quan**

Đã hoàn thành tích hợp API cho quản lý địa chỉ khách hàng với các tính năng:

- ✅ **Thêm địa chỉ mới**
- ✅ **Cập nhật địa chỉ**
- ✅ **Xóa địa chỉ**
- ✅ **Đặt địa chỉ mặc định**
- ✅ **Hiển thị danh sách địa chỉ**

## 🗄️ **Database Setup**

### **1. Chạy script SQL**

```sql
-- Chạy file: create_address_table.sql
-- Tạo bảng dia_chi_khach_hang với dữ liệu mẫu

-- Chạy file: create_order_tables.sql
-- Tạo bảng don_hang và chi_tiet_don_hang với dữ liệu mẫu
```

### **2. Cấu trúc bảng**

```sql
dia_chi_khach_hang (
    id INT PRIMARY KEY,
    khach_hang_id INT FOREIGN KEY,
    ho_ten NVARCHAR(100),
    so_dien_thoai VARCHAR(15),
    tinh_thanh NVARCHAR(100),
    quan_huyen NVARCHAR(100),
    phuong_xa NVARCHAR(100),
    dia_chi_chi_tiet NVARCHAR(500),
    loai_dia_chi VARCHAR(20), -- 'home', 'office'
    mac_dinh BIT,
    ngay_tao DATETIME,
    ngay_cap_nhat DATETIME
)
```

## 🔧 **Backend Files**

### **1. Entity**

- `DiaChiKhachHang.java` - Entity cho địa chỉ

### **2. Repository**

- `DiaChiKhachHangRepository.java` - Repository với các method:
  - `findByKhachHangIdOrderByMacDinhDescNgayTaoDesc()`
  - `findByKhachHangIdAndMacDinhTrue()`
  - `resetMacDinhByKhachHangId()`
  - `setMacDinhById()`

### **3. DTO**

- `DiaChiDto.java` - Data Transfer Object

### **4. Controller**

- `DiaChiController.java` - REST API endpoints:
  - `GET /api/addresses` - Lấy danh sách địa chỉ
  - `POST /api/addresses` - Thêm địa chỉ mới
  - `PUT /api/addresses/{id}` - Cập nhật địa chỉ
  - `DELETE /api/addresses/{id}` - Xóa địa chỉ
  - `POST /api/addresses/{id}/set-default` - Đặt mặc định

### **5. Đơn hàng Files**

- `DonHang.java` - Entity cho đơn hàng
- `ChiTietDonHang.java` - Entity cho chi tiết đơn hàng
- `DonHangRepository.java` - Repository cho đơn hàng
- `DonHangDto.java` - DTO cho đơn hàng
- `ChiTietDonHangDto.java` - DTO cho chi tiết đơn hàng
- `DonHangController.java` - REST API endpoints:
  - `GET /api/orders` - Lấy danh sách đơn hàng
  - `GET /api/orders/{id}` - Lấy chi tiết đơn hàng
  - `GET /api/orders/status/{status}` - Lấy đơn hàng theo trạng thái

## 🎨 **Frontend Files**

### **1. Service**

- `addressService.js` - Service gọi API:

  - `getAddresses()`
  - `addAddress(addressData)`
  - `updateAddress(id, addressData)`
  - `deleteAddress(id)`
  - `setDefaultAddress(id)`

- `orderService.js` - Service gọi API:
  - `getOrders()`
  - `getOrderById(id)`
  - `getOrdersByStatus(status)`

### **2. Component**

- `Profile.js` - Đã tích hợp đầy đủ:
  - ✅ Load địa chỉ từ API
  - ✅ Thêm địa chỉ mới
  - ✅ Xóa địa chỉ
  - ✅ Đặt địa chỉ mặc định
  - ✅ Hiển thị danh sách địa chỉ
  - ✅ Form validation
  - ✅ Loading states
  - ✅ Error handling

## 🚀 **Cách sử dụng**

### **1. Khởi động Backend**

```bash
cd "DATN-FRONTEND/Website-b-n-qu-n-o-nam-ZMEN/ZMEN"
mvn spring-boot:run
```

### **2. Khởi động Frontend**

```bash
cd "DATN-FRONTEND/datn_web_fe"
npm start
```

### **3. Test API**

1. **Đăng nhập** vào hệ thống
2. **Vào trang Profile** → Tab "Địa chỉ"
3. **Thêm địa chỉ mới** với form
4. **Xóa địa chỉ** bằng nút trash
5. **Đặt mặc định** bằng nút check

## 📱 **Tính năng đã hoàn thành**

### **✅ Quản lý địa chỉ**

- [x] Hiển thị danh sách địa chỉ
- [x] Thêm địa chỉ mới
- [x] Xóa địa chỉ
- [x] Đặt địa chỉ mặc định
- [x] Form validation
- [x] Loading states
- [x] Error handling
- [x] Toast notifications

### **✅ Quản lý đơn hàng**

- [x] Hiển thị danh sách đơn hàng
- [x] Lọc đơn hàng theo trạng thái
- [x] Xem chi tiết đơn hàng
- [x] Hiển thị sản phẩm trong đơn hàng
- [x] Loading states
- [x] Error handling
- [x] Fallback data

### **✅ UI/UX**

- [x] Modern design với gradients
- [x] Responsive layout
- [x] Hover effects
- [x] Loading animations
- [x] Empty states
- [x] Confirmation dialogs

### **✅ Backend**

- [x] RESTful API
- [x] Session-based authentication
- [x] Data validation
- [x] Error handling
- [x] Database relationships

## 🔄 **API Endpoints**

### **Địa chỉ API**

| Method | Endpoint                          | Description           |
| ------ | --------------------------------- | --------------------- |
| GET    | `/api/addresses`                  | Lấy danh sách địa chỉ |
| POST   | `/api/addresses`                  | Thêm địa chỉ mới      |
| PUT    | `/api/addresses/{id}`             | Cập nhật địa chỉ      |
| DELETE | `/api/addresses/{id}`             | Xóa địa chỉ           |
| POST   | `/api/addresses/{id}/set-default` | Đặt địa chỉ mặc định  |

### **Đơn hàng API**

| Method | Endpoint                      | Description                  |
| ------ | ----------------------------- | ---------------------------- |
| GET    | `/api/orders`                 | Lấy danh sách đơn hàng       |
| GET    | `/api/orders/{id}`            | Lấy chi tiết đơn hàng        |
| GET    | `/api/orders/status/{status}` | Lấy đơn hàng theo trạng thái |

## 🎯 **Tiếp theo**

### **✅ Đơn hàng API - Đã hoàn thành**

- [x] Tạo Entity `DonHang`
- [x] Tạo Entity `ChiTietDonHang`
- [x] Tạo Repository và Controller
- [x] Tích hợp vào Frontend
- [x] Script SQL tạo bảng và dữ liệu mẫu

### **🔄 Tính năng nâng cao**

- [ ] Upload avatar
- [ ] 2FA authentication
- [ ] Email notifications
- [ ] Address validation

## 📞 **Hỗ trợ**

Nếu gặp vấn đề:

1. Kiểm tra console logs
2. Kiểm tra network requests
3. Kiểm tra database connection
4. Kiểm tra CORS configuration

---

**🎉 Tích hợp API địa chỉ đã hoàn thành!**
