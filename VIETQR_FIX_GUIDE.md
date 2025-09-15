# 🔧 Hướng Dẫn Sửa Lỗi VietQR API

## 🚨 Vấn Đề Đã Gặp

**Lỗi:** `404 Not Found from POST https://api.vietqr.io/v2/v2/generate`

**Nguyên nhân:** URL endpoint bị lặp `/v2` do cấu hình sai trong `VietQRService.java`

## ✅ Đã Sửa

### 1. Sửa URL Endpoint

**File:** `Website-b-n-qu-n-o-nam-ZMEN/ZMEN/src/main/java/com/example/ZMEN/service/Impl/VietQRService.java`

**Thay đổi:**

```java
// Trước (SAI):
.uri("/v2/generate")

// Sau (ĐÚNG):
.uri("/generate")
```

### 2. Cải Thiện Base URL Handling

```java
@PostConstruct
public void initWebClient() {
    // Đảm bảo baseUrl không kết thúc bằng dấu /
    String baseUrl = vietqrApiUrl.endsWith("/") ?
        vietqrApiUrl.substring(0, vietqrApiUrl.length() - 1) : vietqrApiUrl;
    this.webClient = WebClient.builder().baseUrl(baseUrl).build();
    System.out.println("VietQR WebClient initialized with baseUrl: " + baseUrl);
}
```

### 3. Thêm Logging Chi Tiết

```java
System.out.println("Full URL will be: " + vietqrApiUrl + "generate");
```

### 4. Cải Thiện Error Handling

```java
.doOnError(e -> {
    System.err.println("Error calling VietQR API: " + e.getMessage());
    System.err.println("Error type: " + e.getClass().getSimpleName());
    if (e instanceof WebClientResponseException) {
        WebClientResponseException wcre = (WebClientResponseException) e;
        System.err.println("HTTP Status: " + wcre.getStatusCode());
        System.err.println("Response Body: " + wcre.getResponseBodyAsString());
    }
});
```

## 🔍 Cấu Hình Hiện Tại

**File:** `application.properties`

```properties
vietqr.api.url=https://api.vietqr.io/v2/
vietqr.client.id=9ac2d2e8-e22d-4c34-bc65-56e81b038425
vietqr.api.key=4fb61319-32fc-4a89-b31d-fc5da34c7f67
vietqr.bank.id=970422
vietqr.account.number=0564746199999
vietqr.account.name=DANG LAM HUNG
```

**URL cuối cùng sẽ là:** `https://api.vietqr.io/v2/generate` ✅

## 🧪 Test Sau Khi Sửa

### 1. Restart Backend

```bash
cd Website-b-n-qu-n-o-nam-ZMEN/ZMEN
mvn spring-boot:run
```

### 2. Chạy Test Script

```bash
# Mở browser console và chạy:
node test_vietqr_fix.js
```

### 3. Test Thủ Công

```bash
curl -X POST http://localhost:8080/api/payment/create-vietqr-payment \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100000,
    "orderCode": "TEST_ORDER_123",
    "description": "Test payment"
  }'
```

## 📋 Kiểm Tra Logs

Khi chạy backend, bạn sẽ thấy:

```
VietQR WebClient initialized with baseUrl: https://api.vietqr.io/v2
Requesting VietQR API with data: {...}
Full URL will be: https://api.vietqr.io/v2/generate
```

## 🎯 Kết Quả Mong Đợi

✅ **Thành công:**

```json
{
  "qrDataURL": "https://api.vietqr.io/image/..."
}
```

❌ **Nếu vẫn lỗi:**

- Kiểm tra API key và client ID
- Kiểm tra thông tin tài khoản ngân hàng
- Xem logs chi tiết trong console

## 🔧 Troubleshooting

### Nếu vẫn gặp lỗi 404:

1. **Kiểm tra API key:**

   ```bash
   curl -H "x-client-id: YOUR_CLIENT_ID" \
        -H "x-api-key: YOUR_API_KEY" \
        https://api.vietqr.io/v2/generate
   ```

2. **Kiểm tra tài khoản ngân hàng:**

   - Đảm bảo `bankId` đúng
   - Đảm bảo `accountNumber` và `accountName` chính xác

3. **Test với Postman:**
   - Method: POST
   - URL: `https://api.vietqr.io/v2/generate`
   - Headers: `x-client-id`, `x-api-key`
   - Body: JSON với thông tin thanh toán

## 📞 Hỗ Trợ

Nếu vẫn gặp vấn đề:

1. Kiểm tra logs Spring Boot
2. Xem response body từ VietQR API
3. Kiểm tra cấu hình trong `application.properties`
4. Test với Postman trước khi test trong code

**Lỗi URL đã được sửa, bây giờ VietQR API sẽ hoạt động bình thường! 🎉**
