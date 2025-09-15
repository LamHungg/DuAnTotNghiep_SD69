console.log(`
🔧 FIX CHECKOUT DATA FORMAT - Copy và paste vào Console:

// Bước 1: Sửa dữ liệu checkout trong localStorage
console.log('=== BƯỚC 1: SỬA DỮ LIỆU CHECKOUT ===');

const savedCart = localStorage.getItem("checkout_cart");
if (savedCart) {
  const parsedCart = JSON.parse(savedCart);
  console.log('Original cart data:', parsedCart);
  
  // Transform cart items đúng format cho backend
  const fixedCart = parsedCart.map((item) => ({
    chiTietSanPhamId: item.id, // Đảm bảo đây là ID của chi tiết sản phẩm
    soLuong: item.quantity || 1,
    gia: item.price || 0,
    thanhTien: item.thanhTien || (item.price * (item.quantity || 1)),
    // Giữ lại thông tin hiển thị cho frontend
    tenSanPham: item.name,
    mauSac: item.mauSac,
    kichCo: item.kichCo,
    hinhAnh: item.image
  }));
  
  console.log('Fixed cart data:', fixedCart);
  
  // Lưu lại dữ liệu đã sửa
  localStorage.setItem("checkout_cart_fixed", JSON.stringify(fixedCart));
  console.log('✅ Đã lưu dữ liệu cart đã sửa');
}

// Bước 2: Tạo checkout data đúng format
console.log('\\n=== BƯỚC 2: TẠO CHECKOUT DATA ĐÚNG FORMAT ===');

const fixedCart = localStorage.getItem("checkout_cart_fixed");
if (fixedCart) {
  const cartItems = JSON.parse(fixedCart);
  
  // Tính toán tổng tiền
  const tongTienHang = cartItems.reduce((sum, item) => sum + item.thanhTien, 0);
  const phiVanChuyen = 30000;
  const tongThanhToan = tongTienHang + phiVanChuyen;
  
  const checkoutData = {
    cartItems: cartItems.map(item => ({
      chiTietSanPhamId: item.chiTietSanPhamId,
      soLuong: item.soLuong,
      gia: item.gia,
      thanhTien: item.thanhTien
    })),
    diaChiId: 16, // Thay bằng ID địa chỉ thực tế
    voucherId: null,
    phuongThucThanhToanId: 1,
    ghiChuKhachHang: 'Đơn hàng từ website',
    phiVanChuyen: phiVanChuyen,
    tongTienHang: tongTienHang,
    tongThanhToan: tongThanhToan
  };
  
  console.log('Checkout data đúng format:', checkoutData);
  
  // Lưu checkout data đã sửa
  localStorage.setItem("checkout_data_fixed", JSON.stringify(checkoutData));
  console.log('✅ Đã lưu checkout data đã sửa');
}

// Bước 3: Test API với dữ liệu đã sửa
console.log('\\n=== BƯỚC 3: TEST API VỚI DỮ LIỆU ĐÃ SỬA ===');

const checkoutDataFixed = localStorage.getItem("checkout_data_fixed");
if (checkoutDataFixed) {
  const data = JSON.parse(checkoutDataFixed);
  
  // Test với endpoint test-process
  fetch('http://localhost:8080/api/checkout/test-process', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(data)
  })
  .then(response => {
    console.log('Test process status:', response.status);
    return response.json();
  })
  .then(result => {
    console.log('Test process result:', result);
    if (response.status === 200) {
      console.log('✅ Test process thành công!');
      
      // Nếu test thành công, thử với endpoint thật
      console.log('\\n=== BƯỚC 4: THỬ VỚI ENDPOINT THẬT ===');
      
      fetch('http://localhost:8080/api/checkout/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(data)
      })
      .then(response => {
        console.log('Real process status:', response.status);
        return response.json();
      })
      .then(result => {
        console.log('Real process result:', result);
        if (response.status === 200) {
          console.log('🎉 CHECKOUT THÀNH CÔNG!');
          console.log('Order ID:', result.orderId);
          console.log('Order Number:', result.maDonHang);
        } else {
          console.log('❌ Checkout thất bại:', result);
        }
      })
      .catch(error => {
        console.log('❌ Real process error:', error);
      });
    } else {
      console.log('❌ Test process thất bại:', result);
    }
  })
  .catch(error => {
    console.log('❌ Test process error:', error);
  });
}

// Bước 4: Sửa checkoutService.js
console.log('\\n=== BƯỚC 4: HƯỚNG DẪN SỬA CHECKOUTSERVICE.JS ===');

console.log(`
🔧 Cần sửa file: datn_web_fe/src/services/checkoutService.js

Thay đổi hàm processCheckout:

const processCheckout = async (checkoutData) => {
  try {
    console.log("Checkout data:", checkoutData);

    // Đảm bảo cartItems có đúng format
    const fixedCartItems = checkoutData.cartItems.map(item => ({
      chiTietSanPhamId: item.chiTietSanPhamId || item.id,
      soLuong: item.soLuong || item.quantity,
      gia: item.gia || item.price,
      thanhTien: item.thanhTien || (item.gia * item.soLuong)
    }));

    const fixedCheckoutData = {
      ...checkoutData,
      cartItems: fixedCartItems
    };

    console.log("Fixed checkout data:", fixedCheckoutData);

    const response = await axios.post(
      \`\${API_URL}/checkout/process\`,
      fixedCheckoutData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    console.log("Checkout response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi checkout:", error);
    throw error;
  }
};
`);

console.log('\\n🎯 Các bước tiếp theo:');
console.log('1. Chạy script này để sửa dữ liệu');
console.log('2. Sửa checkoutService.js theo hướng dẫn');
console.log('3. Refresh trang checkout');
console.log('4. Thử checkout lại');
`);
