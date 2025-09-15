# Profile Page - Hướng dẫn sử dụng

## Tổng quan

Trang Profile đã được hoàn thiện với đầy đủ các chức năng quản lý thông tin cá nhân, địa chỉ, đơn hàng và bảo mật tài khoản.

## Các tính năng chính

### 1. **Thông tin cá nhân** 👤

- **Cập nhật avatar**: Click vào ảnh đại diện để thay đổi
- **Thông tin cơ bản**: Họ, tên, email, số điện thoại
- **Thông tin bổ sung**: Giới tính, ngày sinh
- **Lưu thay đổi**: Nút "Lưu thay đổi" để cập nhật thông tin

### 2. **Quản lý địa chỉ** 📍

- **Thêm địa chỉ mới**: Form nhập thông tin địa chỉ
- **Thông tin bắt buộc**: Họ tên, số điện thoại, tỉnh/thành phố
- **Thông tin tùy chọn**: Quận/huyện, phường/xã, địa chỉ chi tiết
- **Tùy chọn địa chỉ**:
  - Đặt làm địa chỉ mặc định
  - Loại địa chỉ (Nhà riêng/Văn phòng)
- **Quản lý địa chỉ**: Xem, sửa, xóa địa chỉ đã lưu

### 3. **Lịch sử đơn hàng** 📦

- **Lọc đơn hàng**: Theo trạng thái (Tất cả, Chờ xác nhận, Đang xử lý, Đã giao)
- **Thông tin đơn hàng**: Mã đơn, ngày đặt, trạng thái, tổng tiền
- **Chi tiết sản phẩm**: Tên sản phẩm, số lượng, giá
- **Hành động**: Xem chi tiết, đánh giá (cho đơn đã giao)

### 4. **Bảo mật tài khoản** 🔒

- **Đổi mật khẩu**: Mật khẩu hiện tại, mật khẩu mới, xác nhận mật khẩu
- **Tùy chọn bảo mật**:
  - Xác thực 2 yếu tố
  - Thông báo đăng nhập

### 5. **Đăng xuất** 🚪

- Nút đăng xuất ở cuối trang
- Xóa thông tin đăng nhập và chuyển về trang login

## Thiết kế UI/UX

### **Giao diện hiện đại**

- **Gradient background**: Tạo hiệu ứng đẹp mắt
- **Glass morphism**: Hiệu ứng trong suốt với backdrop blur
- **Responsive design**: Tương thích với mọi thiết bị
- **Smooth animations**: Chuyển động mượt mà

### **Màu sắc và typography**

- **Primary colors**: Gradient xanh tím (#667eea → #764ba2)
- **Typography**: Segoe UI font family
- **Color scheme**:
  - Text chính: #333
  - Text phụ: #666
  - Background: #f8f9fa
  - Border: #e1e5e9

### **Interactive elements**

- **Hover effects**: Scale, shadow, color changes
- **Focus states**: Border highlight cho form inputs
- **Loading states**: Disabled buttons với spinner
- **Toast notifications**: Thông báo thành công/lỗi

## Cấu trúc file

```
DATN-FRONTEND/datn_web_fe/src/pages/
├── Profile.js          # Component chính
└── Profile.css         # Styles cho Profile

DATN-FRONTEND/datn_web_fe/src/services/
└── authService.js      # Service authentication

DATN-FRONTEND/datn_web_fe/src/components/
└── AuthToast.js        # Toast notifications
```

## Authentication Integration

### **Protected Route**

- Trang Profile được bảo vệ bởi `ProtectedRoute`
- Tự động chuyển hướng về `/login` nếu chưa đăng nhập
- Sử dụng `authService.isAuthenticated()` để kiểm tra

### **User Data Management**

- Load thông tin user từ `authService.getCurrentUser()`
- Tự động điền form với dữ liệu hiện tại
- Cập nhật localStorage khi thay đổi thông tin

## Responsive Design

### **Desktop (≥768px)**

- Grid layout 2 cột cho form
- Tabs ngang với icons
- Full-width content

### **Tablet (480px - 768px)**

- Grid layout 1 cột
- Tabs dọc
- Adjusted padding và spacing

### **Mobile (<480px)**

- Single column layout
- Stacked elements
- Touch-friendly buttons
- Optimized for thumb navigation

## State Management

### **Profile Data**

```javascript
const [profileData, setProfileData] = useState({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  gender: "",
  birthDate: "",
  avatar: null,
});
```

### **Address Management**

```javascript
const [addresses, setAddresses] = useState([]);
const [newAddress, setNewAddress] = useState({
  name: "",
  phone: "",
  province: "",
  district: "",
  ward: "",
  detail: "",
  isDefault: false,
  type: "home",
});
```

### **Security**

```javascript
const [securityData, setSecurityData] = useState({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});
```

## API Integration (TODO)

### **Backend Endpoints cần thiết**

1. **Profile Management**

   - `GET /api/profile` - Lấy thông tin profile
   - `PUT /api/profile` - Cập nhật thông tin profile
   - `POST /api/profile/avatar` - Upload avatar

2. **Address Management**

   - `GET /api/addresses` - Lấy danh sách địa chỉ
   - `POST /api/addresses` - Thêm địa chỉ mới
   - `PUT /api/addresses/:id` - Cập nhật địa chỉ
   - `DELETE /api/addresses/:id` - Xóa địa chỉ

3. **Order History**

   - `GET /api/orders` - Lấy lịch sử đơn hàng
   - `GET /api/orders/:id` - Chi tiết đơn hàng

4. **Security**
   - `POST /api/auth/change-password` - Đổi mật khẩu
   - `POST /api/auth/enable-2fa` - Bật xác thực 2 yếu tố

## Validation Rules

### **Profile Information**

- **Họ/Tên**: 2-50 ký tự, bắt buộc
- **Email**: Format hợp lệ, bắt buộc
- **Số điện thoại**: 10-11 số, tùy chọn
- **Ngày sinh**: Format YYYY-MM-DD, tùy chọn

### **Address Information**

- **Họ tên**: 2-50 ký tự, bắt buộc
- **Số điện thoại**: 10-11 số, bắt buộc
- **Tỉnh/Thành phố**: Bắt buộc
- **Địa chỉ chi tiết**: Tùy chọn

### **Password Change**

- **Mật khẩu hiện tại**: Bắt buộc
- **Mật khẩu mới**: 8-100 ký tự, bắt buộc
- **Xác nhận mật khẩu**: Phải khớp với mật khẩu mới

## Error Handling

### **Toast Notifications**

- **Success**: Thông báo thành công với icon ✓
- **Error**: Thông báo lỗi với icon ✗
- **Info**: Thông báo thông tin với icon ℹ

### **Form Validation**

- **Real-time validation**: Kiểm tra ngay khi nhập
- **Error messages**: Hiển thị lỗi cụ thể
- **Field highlighting**: Border đỏ cho field lỗi

## Performance Optimizations

### **Lazy Loading**

- Load dữ liệu theo tab được chọn
- Debounce cho form inputs
- Optimized re-renders với React.memo

### **Image Optimization**

- Avatar compression
- Lazy loading cho images
- Fallback cho broken images

## Accessibility Features

### **Keyboard Navigation**

- Tab navigation cho tất cả elements
- Enter/Space cho buttons
- Escape để đóng modals

### **Screen Reader Support**

- ARIA labels cho form fields
- Semantic HTML structure
- Alt text cho images

### **Color Contrast**

- WCAG AA compliant
- High contrast mode support
- Color-blind friendly design

## Testing Checklist

### **Functional Testing**

- [ ] Đăng nhập và truy cập profile
- [ ] Cập nhật thông tin cá nhân
- [ ] Thay đổi avatar
- [ ] Thêm/sửa/xóa địa chỉ
- [ ] Xem lịch sử đơn hàng
- [ ] Đổi mật khẩu
- [ ] Đăng xuất

### **UI/UX Testing**

- [ ] Responsive trên các thiết bị
- [ ] Hover và focus states
- [ ] Loading states
- [ ] Error handling
- [ ] Toast notifications

### **Security Testing**

- [ ] Protected route access
- [ ] Form validation
- [ ] XSS prevention
- [ ] CSRF protection

## Future Enhancements

### **Planned Features**

1. **Social Login Integration**
2. **Profile Completion Progress**
3. **Order Tracking Integration**
4. **Wishlist Management**
5. **Notification Preferences**
6. **Data Export/Import**

### **Technical Improvements**

1. **JWT Token Implementation**
2. **Real-time Updates**
3. **Offline Support**
4. **Progressive Web App**
5. **Analytics Integration**

## Troubleshooting

### **Common Issues**

1. **Avatar không upload**: Kiểm tra file size và format
2. **Form không submit**: Kiểm tra validation errors
3. **Data không load**: Kiểm tra authentication status
4. **Responsive issues**: Kiểm tra CSS media queries

### **Debug Tips**

- Sử dụng React DevTools để inspect state
- Check browser console cho errors
- Verify API endpoints và responses
- Test trên different browsers

---

**Lưu ý**: Trang Profile hiện tại sử dụng mock data cho một số chức năng. Cần tích hợp với backend API để hoàn thiện toàn bộ tính năng.
