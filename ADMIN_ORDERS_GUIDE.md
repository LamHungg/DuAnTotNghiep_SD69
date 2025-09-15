# 🛍️ HƯỚNG DẪN HỆ THỐNG QUẢN LÝ ĐƠN HÀNG ADMIN

## 📋 Tổng quan

Hệ thống quản lý đơn hàng Admin cho phép quản lý toàn bộ quy trình đơn hàng từ khi khách hàng đặt hàng đến khi hoàn thành giao hàng.

## 🚀 Tính năng chính

### 1. **Quản lý đơn hàng**

- ✅ Xem danh sách tất cả đơn hàng
- ✅ Xem chi tiết đơn hàng
- ✅ Cập nhật trạng thái đơn hàng
- ✅ Tìm kiếm và lọc đơn hàng
- ✅ Thống kê tổng quan

### 2. **Quy trình trạng thái đơn hàng**

```
Chờ thêm sản phẩm → Chờ xác nhận → Đã xác nhận → Đang giao hàng → Giao hàng thành công → Hoàn thành
                                    ↓
                                 Đã hủy
```

### 3. **Các API Endpoints**

#### **Backend (Spring Boot)**

```java
@RestController
@RequestMapping("/ZMEN/Admin/DonHang")
public class DonHangContro {

    // Lấy danh sách đơn hàng
    @GetMapping
    public ResponseEntity<List<DonHangDto>> layDanhSachDonHang()

    // Lấy chi tiết đơn hàng
    @GetMapping("/{id}")
    public ResponseEntity<ChiTietDonHangDto> layDonHangTheoId(@PathVariable Integer id)

    // Xác nhận đơn hàng
    @PostMapping("/{id}/confirm")
    public ResponseEntity<?> confirmDonHang(@PathVariable Integer id)

    // Bắt đầu giao hàng
    @PostMapping("/{id}/ship")
    public ResponseEntity<?> shipDonHang(@PathVariable Integer id)

    // Giao hàng thành công
    @PostMapping("/{id}/deliver")
    public ResponseEntity<DonHangDto> deliverDonHang(@PathVariable Integer id)

    // Hoàn thành đơn hàng
    @PostMapping("/{id}/complete")
    public ResponseEntity<DonHangDto> completeDonHang(@PathVariable Integer id)

    // Hủy đơn hàng
    @PostMapping("/{id}/cancel")
    public ResponseEntity<?> cancelDonHang(@PathVariable Integer id)
}
```

#### **Frontend (React)**

```javascript
// Services
export const getAllOrders = () => axios.get(`${API_BASE}`);
export const getOrderById = (id) => axios.get(`${API_BASE}/${id}`);
export const confirmOrder = (id) => axios.post(`${API_BASE}/${id}/confirm`);
export const shipOrder = (id) => axios.post(`${API_BASE}/${id}/ship`);
export const deliverOrder = (id) => axios.post(`${API_BASE}/${id}/deliver`);
export const completeOrder = (id) => axios.post(`${API_BASE}/${id}/complete`);
export const cancelOrder = (id) => axios.post(`${API_BASE}/${id}/cancel`);
```

## 🎨 Giao diện người dùng

### **Trang danh sách đơn hàng (`/dashboard/orders`)**

- 📊 **Thống kê tổng quan**: Tổng đơn hàng, chờ xử lý, đang giao, doanh thu
- 🔍 **Tìm kiếm nâng cao**: Theo mã đơn hàng, tên khách hàng, trạng thái, ngày
- 📋 **Bảng đơn hàng**: Hiển thị thông tin chi tiết với phân trang
- 🏷️ **Tab trạng thái**: Lọc theo từng trạng thái đơn hàng
- ⚡ **Cập nhật real-time**: Tự động cập nhật dữ liệu

### **Trang chi tiết đơn hàng (`/orders/:orderId`)**

- 📝 **Thông tin đơn hàng**: Mã đơn hàng, ngày đặt, trạng thái
- 👤 **Thông tin khách hàng**: Tên, số điện thoại, địa chỉ
- 📦 **Chi tiết sản phẩm**: Danh sách sản phẩm, số lượng, giá
- 💰 **Thông tin thanh toán**: Tổng tiền hàng, phí vận chuyển, tổng thanh toán
- 🚚 **Thông tin giao hàng**: Địa chỉ giao hàng, phương thức thanh toán
- 📜 **Lịch sử đơn hàng**: Timeline các thay đổi trạng thái
- 🔧 **Các nút hành động**: Xác nhận, giao hàng, hoàn thành, hủy

## 🎯 Quy trình làm việc

### **1. Khách hàng đặt hàng**

- Đơn hàng được tạo với trạng thái "Chờ thêm sản phẩm" hoặc "Chờ xác nhận"
- Admin nhận thông báo đơn hàng mới

### **2. Admin xác nhận đơn hàng**

- Kiểm tra thông tin đơn hàng
- Xác nhận sản phẩm có sẵn
- Chuyển trạng thái sang "Đã xác nhận"

### **3. Chuẩn bị và giao hàng**

- Đóng gói sản phẩm
- Chuyển trạng thái sang "Đang giao hàng"
- Giao hàng đến khách hàng
- Chuyển trạng thái sang "Giao hàng thành công"

### **4. Hoàn thành đơn hàng**

- Khách hàng xác nhận nhận hàng
- Chuyển trạng thái sang "Hoàn thành"

### **5. Xử lý hủy đơn hàng** (nếu cần)

- Chỉ có thể hủy khi đơn hàng ở trạng thái "Chờ xác nhận"
- Chuyển trạng thái sang "Đã hủy"

## 🔧 Cài đặt và chạy

### **Backend**

```bash
# Chạy Spring Boot application
cd Website-b-n-qu-n-o-nam-ZMEN/ZMEN
java -jar target/ZMEN-0.0.1-SNAPSHOT.jar
```

### **Frontend Admin**

```bash
# Chạy React Admin application
cd src
npm start
```

### **Truy cập**

- **Admin Dashboard**: `http://localhost:3000/dashboard`
- **Quản lý đơn hàng**: `http://localhost:3000/dashboard/orders`

## 🧪 Testing

### **Test API**

```javascript
// Chạy script test trong browser console
testAdminOrders();
```

### **Cải thiện giao diện**

```javascript
// Chạy script cải thiện trong browser console
improveAdminOrders();
```

## 📊 Cấu trúc dữ liệu

### **DonHangDto (Đơn hàng tóm tắt)**

```json
{
  "id": 1,
  "maDonHang": "DH001",
  "tenKhachHang": "Nguyễn Văn A",
  "hinhThucDonHang": "Online",
  "tenTrangThai": "Chờ xác nhận",
  "ngayDat": "2025-08-19T10:30:00",
  "tongTienHang": 1000000,
  "tongThanhToan": 1030000
}
```

### **ChiTietDonHangDto (Chi tiết đơn hàng)**

```json
{
  "id": 1,
  "maDonHang": "DH001",
  "khachHang": {
    "id": 1,
    "hoTen": "Nguyễn Văn A",
    "soDienThoai": "0123456789"
  },
  "diaChi": {
    "tinhThanh": "Hà Nội",
    "quanHuyen": "Cầu Giấy",
    "phuongXa": "Dịch Vọng",
    "duong": "123 Đường ABC"
  },
  "chiTietSanPham": [
    {
      "id": 1,
      "tenSanPham": "Áo thun nam",
      "soLuong": 2,
      "gia": 500000,
      "thanhTien": 1000000
    }
  ],
  "phuongThucThanhToan": "Tiền mặt",
  "tongTienHang": 1000000,
  "phiVanChuyen": 30000,
  "tongThanhToan": 1030000,
  "tenTrangThai": "Chờ xác nhận",
  "lichSuDonHang": [
    {
      "trangThai": "Chờ xác nhận",
      "ngayCapNhat": "2025-08-19T10:30:00",
      "ghiChu": "Đơn hàng được tạo"
    }
  ]
}
```

## 🎨 Tùy chỉnh giao diện

### **CSS Classes**

- `.orders-table`: Bảng đơn hàng chính
- `.order-badge`: Badge trạng thái đơn hàng
- `.btn-action`: Nút hành động
- `.stats-cards`: Thống kê tổng quan
- `.filter-section`: Phần tìm kiếm và lọc

### **Trạng thái đơn hàng**

- `Chờ thêm sản phẩm`: Màu cam
- `Chờ xác nhận`: Màu vàng
- `Đã xác nhận`: Màu xanh lá
- `Đang giao hàng`: Màu xanh dương
- `Giao hàng thành công`: Màu tím
- `Hoàn thành`: Màu xanh đậm
- `Đã hủy`: Màu đỏ

## 🔒 Bảo mật

### **Authentication**

- Sử dụng JWT token
- Kiểm tra quyền admin
- Protected routes

### **Validation**

- Kiểm tra trạng thái đơn hàng trước khi cập nhật
- Validate dữ liệu đầu vào
- Xử lý lỗi gracefully

## 📈 Monitoring và Analytics

### **Thống kê**

- Tổng số đơn hàng
- Số đơn hàng theo trạng thái
- Doanh thu tổng
- Tỷ lệ hoàn thành

### **Báo cáo**

- Đơn hàng theo ngày/tháng
- Sản phẩm bán chạy
- Khách hàng thân thiết
- Hiệu suất giao hàng

## 🚀 Tính năng nâng cao

### **Đã hoàn thành**

- ✅ Quản lý đơn hàng cơ bản
- ✅ Cập nhật trạng thái
- ✅ Tìm kiếm và lọc
- ✅ Giao diện responsive
- ✅ Thống kê real-time

### **Có thể phát triển thêm**

- 🔄 **Email notifications**: Gửi email thông báo trạng thái
- 📱 **Mobile app**: Ứng dụng mobile cho admin
- 📊 **Advanced analytics**: Báo cáo chi tiết hơn
- 🤖 **Auto-processing**: Tự động xử lý đơn hàng
- 📦 **Inventory management**: Quản lý kho hàng
- 🚚 **Shipping integration**: Tích hợp đơn vị vận chuyển

## 🎯 Kết luận

Hệ thống quản lý đơn hàng Admin đã được hoàn thiện với đầy đủ tính năng cần thiết cho việc quản lý quy trình đơn hàng từ A đến Z. Giao diện thân thiện, dễ sử dụng và có thể mở rộng thêm các tính năng nâng cao trong tương lai.

---

**🎉 Chúc mừng! Hệ thống quản lý đơn hàng Admin đã sẵn sàng sử dụng!**
