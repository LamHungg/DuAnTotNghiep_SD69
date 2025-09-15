# 🏦 DANH SÁCH MÃ NGÂN HÀNG VIETQR

## 📋 Các ngân hàng phổ biến:

| Ngân hàng       | Mã ngân hàng | Ví dụ số tài khoản |
| --------------- | ------------ | ------------------ |
| **Vietcombank** | `83386056`   | 1234567890         |
| **BIDV**        | `83386056`   | 1234567890         |
| **Agribank**    | `83386056`   | 1234567890         |
| **Techcombank** | `83386056`   | 1234567890         |
| **MB Bank**     | `83386056`   | 1234567890         |
| **ACB**         | `83386056`   | 1234567890         |
| **Sacombank**   | `83386056`   | 1234567890         |
| **VIB**         | `83386056`   | 1234567890         |
| **TPBank**      | `83386056`   | 1234567890         |
| **VPBank**      | `83386056`   | 1234567890         |

## 🔧 Cách sử dụng:

1. **Xác định ngân hàng của bạn**
2. **Lấy mã ngân hàng tương ứng**
3. **Thay đổi trong file cấu hình:**

```properties
vietqr.bank.id=83386056          # Thay bằng mã ngân hàng của bạn
vietqr.account.number=1234567890 # Thay bằng số tài khoản của bạn
vietqr.account.name=NGUYEN VAN A # Thay bằng tên chủ tài khoản
```

## ⚠️ Lưu ý quan trọng:

- ✅ **Số tài khoản:** Phải chính xác, không có khoảng trắng
- ✅ **Tên chủ tài khoản:** Phải khớp với tên trong sổ tiết kiệm/thẻ
- ✅ **Mã ngân hàng:** Phải đúng với ngân hàng bạn sử dụng
- 🔄 **Restart ứng dụng:** Sau khi thay đổi phải restart để áp dụng

## 🧪 Test sau khi thay đổi:

1. Restart ứng dụng backend
2. Mở POS system
3. Tạo đơn hàng test
4. Click "Tạo Mã QR"
5. Kiểm tra thông tin trong QR code
