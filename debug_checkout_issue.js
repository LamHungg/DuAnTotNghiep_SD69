console.log(`
🔧 DEBUG CHECKOUT ISSUE - Copy và paste vào Console:

// Bước 1: Kiểm tra dữ liệu checkout hiện tại
console.log('=== BƯỚC 1: KIỂM TRA DỮ LIỆU CHECKOUT ===');

// Lấy dữ liệu từ localStorage
const savedCart = localStorage.getItem("checkout_cart");
const savedVoucher = localStorage.getItem("checkout_voucher");

console.log('Saved cart:', savedCart);
console.log('Saved voucher:', savedVoucher);

if (savedCart) {
  const parsedCart = JSON.parse(savedCart);
  console.log('Parsed cart:', parsedCart);
  
  // Kiểm tra cấu trúc dữ liệu
  console.log('Cart item structure check:');
  parsedCart.forEach((item, index) => {
    console.log(\`Item \${index + 1}:\`, {
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      thanhTien: item.thanhTien,
      chiTietSanPhamId: item.id // Đây có thể là vấn đề!
    });
  });
}

// Bước 2: Kiểm tra API endpoint
console.log('\\n=== BƯỚC 2: KIỂM TRA API ENDPOINT ===');

// Test API endpoint
fetch('http://localhost:8080/api/checkout/test', {
  method: 'GET',
  credentials: 'include'
})
.then(response => {
  console.log('Test endpoint status:', response.status);
  return response.json();
})
.then(data => {
  console.log('Test endpoint response:', data);
})
.catch(error => {
  console.log('Test endpoint error:', error);
});

// Bước 3: Kiểm tra session
console.log('\\n=== BƯỚC 3: KIỂM TRA SESSION ===');

fetch('http://localhost:8080/api/auth/test-check-session', {
  method: 'GET',
  credentials: 'include'
})
.then(response => {
  console.log('Session check status:', response.status);
  return response.json();
})
.then(data => {
  console.log('Session check response:', data);
})
.catch(error => {
  console.log('Session check error:', error);
});

// Bước 4: Tạo dữ liệu checkout đúng format
console.log('\\n=== BƯỚC 4: TẠO DỮ LIỆU CHECKOUT ĐÚNG FORMAT ===');

if (savedCart) {
  const parsedCart = JSON.parse(savedCart);
  
  // Transform cart items đúng format cho backend
  const transformedCart = parsedCart.map((item) => ({
    chiTietSanPhamId: item.id, // Đảm bảo đây là ID của chi tiết sản phẩm
    soLuong: item.quantity,
    gia: item.price,
    thanhTien: item.thanhTien || item.price * item.quantity
  }));
  
  console.log('Transformed cart for API:', transformedCart);
  
  // Tạo checkout data đúng format
  const checkoutData = {
    cartItems: transformedCart,
    diaChiId: 16, // Thay bằng ID địa chỉ thực tế
    voucherId: null,
    phuongThucThanhToanId: 1,
    ghiChuKhachHang: 'Test checkout',
    phiVanChuyen: 30000,
    tongTienHang: transformedCart.reduce((sum, item) => sum + item.thanhTien, 0),
    tongThanhToan: transformedCart.reduce((sum, item) => sum + item.thanhTien, 0) + 30000
  };
  
  console.log('Checkout data đúng format:', checkoutData);
  
  // Test với dữ liệu đúng format
  console.log('\\n=== BƯỚC 5: TEST VỚI DỮ LIỆU ĐÚNG FORMAT ===');
  
  fetch('http://localhost:8080/api/checkout/test-process', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(checkoutData)
  })
  .then(response => {
    console.log('Test process status:', response.status);
    return response.json();
  })
  .then(data => {
    console.log('Test process response:', data);
  })
  .catch(error => {
    console.log('Test process error:', error);
  });
}

console.log('\\n🎯 Nếu vẫn lỗi, có thể là vấn đề với:');
console.log('1. Session authentication');
console.log('2. Database constraints');
console.log('3. Missing required data');
console.log('4. CORS configuration');
`);
