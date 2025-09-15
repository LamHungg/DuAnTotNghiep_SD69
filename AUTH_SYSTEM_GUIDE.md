# Hướng dẫn hệ thống đăng nhập

## Tổng quan

Hệ thống đăng nhập đã được hoàn thiện với giao diện hiện đại, đẹp mắt và dễ sử dụng. Hệ thống bao gồm:

- **Đăng nhập** - Giao diện đăng nhập với validation và social login
- **Đăng ký** - Form đăng ký với kiểm tra mật khẩu mạnh
- **Quên mật khẩu** - Hệ thống khôi phục mật khẩu qua email
- **Toast notifications** - Thông báo đẹp mắt cho người dùng

## 🎨 Tính năng thiết kế

### Giao diện hiện đại

- **Gradient background** - Sử dụng gradient tím-xanh đẹp mắt
- **Card design** - Thiết kế card với shadow và border radius
- **Animation mượt mà** - Hiệu ứng slide up và hover effects
- **Responsive design** - Tương thích hoàn hảo trên mọi thiết bị

### UX/UI cải tiến

- **Icon integration** - Sử dụng React Icons cho trải nghiệm tốt hơn
- **Loading states** - Hiển thị spinner khi đang xử lý
- **Error handling** - Validation real-time với thông báo lỗi rõ ràng
- **Password visibility** - Toggle hiển thị/ẩn mật khẩu
- **Social login** - Hỗ trợ đăng nhập bằng Google/Facebook (placeholder)

## 📁 Cấu trúc file

### Services

```
src/services/
├── authService.js          # Service xử lý authentication
```

### Components

```
src/components/
├── AuthToast.js           # Component thông báo
```

### Pages

```
src/pages/
├── Login.js              # Trang đăng nhập
├── SignUp.js             # Trang đăng ký
└── ForgotPassword.js     # Trang quên mật khẩu
```

## 🔧 Cài đặt và sử dụng

### 1. Cài đặt dependencies

```bash
npm install react-icons axios
```

### 2. Cấu hình API

Chỉnh sửa `API_URL` trong `authService.js`:

```javascript
const API_URL = "http://localhost:8080/api"; // Thay đổi theo backend của bạn
```

### 3. Sử dụng trong component

```javascript
import authService from "../services/authService";

// Kiểm tra đăng nhập
if (authService.isAuthenticated()) {
  // User đã đăng nhập
}

// Lấy thông tin user
const user = authService.getCurrentUser();

// Đăng xuất
authService.logout();
```

## 🚀 Tính năng chi tiết

### 1. Trang Đăng nhập (`Login.js`)

**Tính năng:**

- Form đăng nhập với email và mật khẩu
- Validation real-time
- Toggle hiển thị mật khẩu
- "Ghi nhớ đăng nhập" checkbox
- Social login buttons (Google/Facebook)
- Redirect sau khi đăng nhập thành công
- Error handling với toast notifications

**Validation:**

- Email phải hợp lệ
- Mật khẩu tối thiểu 6 ký tự
- Hiển thị lỗi real-time

### 2. Trang Đăng ký (`SignUp.js`)

**Tính năng:**

- Form đăng ký với họ, tên, email, mật khẩu
- Kiểm tra độ mạnh mật khẩu
- Xác nhận mật khẩu
- Password checklist với 4 tiêu chí
- Validation comprehensive
- Social signup buttons

**Password Requirements:**

- Ít nhất 8 ký tự
- Có chữ in hoa
- Có số
- Có ký tự đặc biệt

### 3. Trang Quên mật khẩu (`ForgotPassword.js`)

**Tính năng:**

- Form nhập email
- Gửi email đặt lại mật khẩu
- Hướng dẫn chi tiết sau khi gửi email
- Tùy chọn gửi lại email
- Validation email

### 4. Toast Notifications (`AuthToast.js`)

**Tính năng:**

- 4 loại thông báo: success, error, warning, info
- Auto-dismiss sau 4 giây
- Progress bar animation
- Responsive design
- Close button

## 🎯 API Endpoints

### Authentication Endpoints

```javascript
// Đăng nhập
POST /api/auth/login
Body: { email, password }

// Đăng ký
POST /api/auth/register
Body: { firstName, lastName, email, password }

// Quên mật khẩu
POST /api/auth/forgot-password
Body: { email }

// Đặt lại mật khẩu
POST /api/auth/reset-password
Body: { token, newPassword }

// Cập nhật profile
PUT /api/auth/profile
Headers: { Authorization: Bearer <token> }
Body: { userData }

// Đổi mật khẩu
POST /api/auth/change-password
Headers: { Authorization: Bearer <token> }
Body: { oldPassword, newPassword }

// Refresh token
POST /api/auth/refresh-token
Headers: { Authorization: Bearer <token> }
```

## 🔒 Bảo mật

### Token Management

- JWT token được lưu trong localStorage
- Auto-refresh token khi cần thiết
- Clear token khi đăng xuất

### Validation

- Client-side validation cho UX tốt hơn
- Server-side validation cho bảo mật
- Password strength requirements
- Email format validation

### Error Handling

- Graceful error handling
- User-friendly error messages
- Network error handling
- Timeout handling

## 📱 Responsive Design

### Breakpoints

- **Desktop**: > 768px
- **Tablet**: 768px - 480px
- **Mobile**: < 480px

### Mobile Optimizations

- Touch-friendly buttons
- Larger input fields
- Simplified layouts
- Optimized spacing

## 🎨 Customization

### Colors

```css
/* Primary gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Success */
background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);

/* Error */
background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%);

/* Warning */
background: linear-gradient(135deg, #ed8936 0%, #dd6b20 100%);
```

### Typography

```css
/* Headers */
font-size: 28px;
font-weight: 700;

/* Body text */
font-size: 16px;
font-weight: 500;

/* Labels */
font-size: 14px;
font-weight: 600;
```

## 🚀 Deployment

### 1. Build production

```bash
npm run build
```

### 2. Environment variables

Tạo file `.env`:

```
REACT_APP_API_URL=http://your-api-domain.com/api
```

### 3. Update API URL

```javascript
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";
```

## 🔧 Troubleshooting

### Lỗi thường gặp

1. **CORS Error**

   - Kiểm tra backend CORS configuration
   - Đảm bảo API_URL đúng

2. **Token không hợp lệ**

   - Clear localStorage
   - Đăng nhập lại

3. **Validation không hoạt động**

   - Kiểm tra console errors
   - Đảm bảo đã import đúng components

4. **Toast không hiển thị**
   - Kiểm tra z-index
   - Đảm bảo component được render

### Debug Mode

```javascript
// Thêm vào authService.js
const DEBUG = process.env.NODE_ENV === "development";

if (DEBUG) {
  console.log("Auth request:", { url, data });
}
```

## 📈 Performance

### Optimizations

- Lazy loading cho components
- Memoization cho expensive operations
- Debounced input validation
- Optimized re-renders

### Bundle Size

- Tree shaking cho React Icons
- Code splitting cho routes
- Minified production build

## 🔄 Future Enhancements

### Planned Features

- [ ] Two-factor authentication (2FA)
- [ ] Biometric authentication
- [ ] Remember me functionality
- [ ] Session management
- [ ] Account lockout after failed attempts
- [ ] Email verification
- [ ] Phone number verification

### Social Login

- [ ] Google OAuth integration
- [ ] Facebook OAuth integration
- [ ] Apple Sign In
- [ ] GitHub OAuth

## 📞 Support

Nếu gặp vấn đề, hãy kiểm tra:

1. Console errors
2. Network tab
3. API response
4. Environment configuration

---

**Hệ thống đăng nhập đã sẵn sàng sử dụng!** 🎉
