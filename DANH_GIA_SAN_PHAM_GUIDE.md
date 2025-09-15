# Hướng dẫn sử dụng chức năng đánh giá sản phẩm

## Tổng quan

Hệ thống đánh giá sản phẩm đã được triển khai để thay thế đánh giá fix cứng. Khách hàng có thể đánh giá sản phẩm từ 1-5 sao và viết bình luận.

## Các tính năng chính

### 1. Hiển thị đánh giá

- **Thống kê tổng quan**: Hiển thị trung bình số sao và tổng số đánh giá
- **Phân bố đánh giá**: Biểu đồ phân bố số sao từ 1-5
- **Danh sách đánh giá**: Hiển thị các đánh giá gần đây nhất

### 2. Thêm đánh giá

- **Chọn số sao**: Từ 1-5 sao với giao diện tương tác
- **Viết bình luận**: Tối đa 500 ký tự
- **Validation**: Kiểm tra đã đánh giá chưa, bắt buộc nhập đầy đủ

### 3. Cập nhật đánh giá

- **Chỉnh sửa**: Khách hàng có thể cập nhật đánh giá của mình
- **Lịch sử**: Hiển thị thời gian cập nhật

## Cấu trúc Database

### Bảng `danh_gia`

```sql
CREATE TABLE danh_gia (
    id INT IDENTITY(1,1) PRIMARY KEY,
    id_khach_hang INT NOT NULL,
    id_san_pham INT NOT NULL,
    so_sao TINYINT NOT NULL CHECK (so_sao >= 1 AND so_sao <= 5),
    binh_luan NVARCHAR(MAX),
    ngay_danh_gia DATETIME2 DEFAULT GETDATE(),
    trang_thai TINYINT DEFAULT 1, -- 1: Hiển thị, 0: Ẩn

    CONSTRAINT FK_DanhGia_KhachHang FOREIGN KEY (id_khach_hang) REFERENCES khach_hang(id),
    CONSTRAINT FK_DanhGia_SanPham FOREIGN KEY (id_san_pham) REFERENCES san_pham(id),
    CONSTRAINT UQ_DanhGia_KhachHang_SanPham UNIQUE (id_khach_hang, id_san_pham)
);
```

## API Endpoints

### 1. Lấy đánh giá sản phẩm

```
GET /api/danhgia/sanpham/{idSanPham}
```

### 2. Lấy thống kê đánh giá

```
GET /api/danhgia/thongke/{idSanPham}
```

### 3. Tạo đánh giá mới

```
POST /api/danhgia
Body: {
  "idKhachHang": 1,
  "idSanPham": 1,
  "soSao": 5,
  "binhLuan": "Sản phẩm rất tốt!"
}
```

### 4. Cập nhật đánh giá

```
PUT /api/danhgia/{id}
Body: {
  "idKhachHang": 1,
  "idSanPham": 1,
  "soSao": 4,
  "binhLuan": "Sản phẩm tốt, nhưng có thể cải thiện thêm"
}
```

### 5. Xóa đánh giá (ẩn)

```
DELETE /api/danhgia/{id}
```

### 6. Kiểm tra khách hàng đã đánh giá

```
GET /api/danhgia/check/{idKhachHang}/{idSanPham}
```

### 7. Lấy đánh giá của khách hàng

```
GET /api/danhgia/khachhang/{idKhachHang}/sanpham/{idSanPham}
```

## Cài đặt và triển khai

### 1. Cập nhật Database

Chạy các script SQL theo thứ tự:

**Bước 1: Tạo bảng đánh giá**

```sql
-- Chạy script này trong SQL Server Management Studio
-- hoặc sử dụng command line
sqlcmd -S localhost -d abcd7 -i simple_danh_gia_schema.sql
```

**Bước 2: Tạo view và stored procedures**

```sql
-- Chạy script này sau khi đã tạo bảng thành công
sqlcmd -S localhost -d abcd7 -i danh_gia_views_procedures.sql
```

**Bước 3: Kiểm tra schema (tùy chọn)**

```sql
-- Chạy script này để kiểm tra xem tất cả đã được tạo thành công chưa
sqlcmd -S localhost -d abcd7 -i test_danh_gia_schema.sql
```

**Lưu ý:**

- Nếu gặp lỗi, hãy chạy từng phần một trong SQL Server Management Studio
- Đảm bảo có dữ liệu trong bảng `khach_hang` và `san_pham` trước khi test

### 2. Backend (Spring Boot)

Các file đã được tạo:

- `entity/DanhGia.java` - Entity class
- `dto/DanhGiaDTO.java` - Data Transfer Object
- `dto/ThongKeDanhGiaDTO.java` - DTO cho thống kê
- `repository/DanhGiaRepository.java` - Repository interface
- `mapper/DanhGiaMapper.java` - Mapper class
- `service/DanhGiaService.java` - Service interface
- `service/Impl/DanhGiaServiceImpl.java` - Service implementation
- `controller/DanhGiaController.java` - REST Controller

### 3. Frontend (React)

Các file đã được tạo:

- `services/danhGiaService.js` - Service để gọi API
- `components/ProductRating.js` - Component hiển thị đánh giá
- Cập nhật `pages/ProductDetail.js` - Tích hợp component

## Sử dụng trong code

### 1. Import component

```javascript
import ProductRating from "../components/ProductRating";
```

### 2. Sử dụng trong component

```javascript
<ProductRating
  productId={product?.id}
  customerId={customerId} // Lấy từ context hoặc localStorage
  onRatingChange={(newRating) => {
    // Callback khi rating thay đổi
    console.log("Rating mới:", newRating);
  }}
/>
```

### 3. Gọi API trực tiếp

```javascript
import danhGiaService from "../services/danhGiaService";

// Lấy đánh giá sản phẩm
const reviews = await danhGiaService.getDanhGiaBySanPham(productId);

// Tạo đánh giá mới
const newReview = await danhGiaService.createDanhGia({
  idKhachHang: customerId,
  idSanPham: productId,
  soSao: 5,
  binhLuan: "Sản phẩm rất tốt!",
});
```

## Tính năng nâng cao

### 1. Phân trang đánh giá

Có thể mở rộng để hỗ trợ phân trang khi có nhiều đánh giá.

### 2. Lọc đánh giá

- Theo số sao (1-5)
- Theo thời gian (tuần này, tháng này, năm nay)
- Theo hữu ích (like/dislike)

### 3. Đánh giá có hình ảnh

Thêm tính năng upload hình ảnh kèm đánh giá.

### 4. Phản hồi từ shop

Shop có thể phản hồi đánh giá của khách hàng.

### 5. Đánh giá theo variant

Đánh giá chi tiết theo màu sắc, kích thước cụ thể.

## Bảo mật và validation

### 1. Kiểm tra quyền

- Chỉ khách hàng đã mua sản phẩm mới được đánh giá
- Chỉ khách hàng đã đăng nhập mới được đánh giá

### 2. Validation

- Số sao: 1-5
- Bình luận: Tối đa 500 ký tự, không được để trống
- Mỗi khách hàng chỉ đánh giá mỗi sản phẩm 1 lần

### 3. Chống spam

- Giới hạn số đánh giá trong 1 ngày
- Kiểm tra nội dung spam

## Troubleshooting

### 1. Lỗi "Bạn đã đánh giá sản phẩm này rồi"

- Kiểm tra xem khách hàng đã đánh giá chưa
- Có thể cập nhật đánh giá thay vì tạo mới

### 2. Không hiển thị đánh giá

- Kiểm tra kết nối database
- Kiểm tra API endpoint
- Kiểm tra console log để debug

### 3. Lỗi validation

- Đảm bảo đã chọn số sao
- Đảm bảo đã viết bình luận
- Kiểm tra độ dài bình luận (tối đa 500 ký tự)

## Kết luận

Hệ thống đánh giá sản phẩm đã được triển khai hoàn chỉnh với đầy đủ tính năng CRUD, validation và giao diện người dùng thân thiện. Khách hàng có thể dễ dàng đánh giá sản phẩm và xem các đánh giá từ khách hàng khác.
