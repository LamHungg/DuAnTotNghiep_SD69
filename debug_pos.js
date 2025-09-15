const axios = require("axios");

const API_URL = "http://localhost:8080/api";

async function debugPOSData() {
  try {
    console.log("🔍 Debug POS Data...\n");

    // 1. Lấy sản phẩm
    console.log("1️⃣ Lấy danh sách sản phẩm:");
    const productsResponse = await axios.get(`${API_URL}/pos/products`);
    const products = productsResponse.data;
    
    console.log(`   📦 Tổng số sản phẩm: ${products.length}`);
    
    if (products.length > 0) {
      const firstProduct = products[0];
      console.log("   📋 Sản phẩm đầu tiên:");
      console.log(`      ID: ${firstProduct.id}`);
      console.log(`      Tên: ${firstProduct.tenSanPham}`);
      console.log(`      Giá: ${firstProduct.gia}`);
      console.log(`      Giá bán: ${firstProduct.giaBan}`);
      console.log(`      Tồn kho: ${firstProduct.soLuong}`);
      console.log(`      Trạng thái: ${firstProduct.trangThai}`);
    }

    // 2. Lấy khách hàng
    console.log("\n2️⃣ Lấy danh sách khách hàng:");
    const customersResponse = await axios.get(`${API_URL}/pos/customers`);
    const customers = customersResponse.data;
    
    console.log(`   👥 Tổng số khách hàng: ${customers.length}`);
    
    if (customers.length > 0) {
      const firstCustomer = customers[0];
      console.log("   📋 Khách hàng đầu tiên:");
      console.log(`      ID: ${firstCustomer.id}`);
      console.log(`      Tên: ${firstCustomer.hoTen}`);
      console.log(`      SĐT: ${firstCustomer.soDienThoai}`);
    }

    // 3. Lấy voucher
    console.log("\n3️⃣ Lấy danh sách voucher:");
    const vouchersResponse = await axios.get(`${API_URL}/pos/vouchers/active`);
    const vouchers = vouchersResponse.data;
    
    console.log(`   🎫 Tổng số voucher: ${vouchers.length}`);
    
    if (vouchers.length > 0) {
      const firstVoucher = vouchers[0];
      console.log("   📋 Voucher đầu tiên:");
      console.log(`      ID: ${firstVoucher.id}`);
      console.log(`      Mã: ${firstVoucher.maVoucher}`);
      console.log(`      Giá trị: ${firstVoucher.giaTriGiam}`);
    }

    // 4. Test tạo đơn hàng với dữ liệu thực tế
    console.log("\n4️⃣ Test tạo đơn hàng với dữ liệu thực tế:");
    
    if (products.length > 0) {
      const testProduct = products[0];
      const testCustomer = customers.length > 0 ? customers[0] : null;
      
      const orderData = {
        maDonHang: `POS-DEBUG-${Date.now()}`,
        khachHangId: testCustomer?.id || null,
        voucherId: null,
        phuongThucThanhToan: "Tiền mặt",
        tongThanhToan: testProduct.gia || testProduct.giaBan || 0,
        ghiChu: "Test debug order",
        chiTietDonHang: [
          {
            chiTietSanPhamId: testProduct.id,
            soLuong: 1,
            giaBan: testProduct.gia || testProduct.giaBan || 0
          }
        ]
      };

      console.log("   📦 Dữ liệu đơn hàng:");
      console.log(JSON.stringify(orderData, null, 4));

      const orderResponse = await axios.post(`${API_URL}/pos/orders`, orderData, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      console.log("   ✅ Kết quả tạo đơn hàng:");
      console.log(JSON.stringify(orderResponse.data, null, 4));
    }

    console.log("\n🎉 Debug hoàn thành!");

  } catch (error) {
    console.error("❌ Lỗi debug:", error.message);
    if (error.response) {
      console.error("   Status:", error.response.status);
      console.error("   Data:", error.response.data);
    }
  }
}

// Chạy debug
debugPOSData();
