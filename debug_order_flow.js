const axios = require("axios");

const API_URL = "http://localhost:8080/api";

async function debugOrderFlow() {
  try {
    console.log("🔍 Debug Order Flow...\n");

    // 1. Lấy sản phẩm để test
    console.log("1️⃣ Lấy sản phẩm:");
    const productsResponse = await axios.get(`${API_URL}/pos/products`);
    const products = productsResponse.data;
    
    if (products.length === 0) {
      throw new Error("Không có sản phẩm nào");
    }

    const product = products[0];
    console.log(`   📦 Sản phẩm: ${product.tenSanPham} (ID: ${product.id})`);
    console.log(`   💰 Giá: ${product.gia}`);
    console.log(`   📦 Tồn kho: ${product.soLuong}`);

    // 2. Lấy khách hàng
    console.log("\n2️⃣ Lấy khách hàng:");
    const customersResponse = await axios.get(`${API_URL}/pos/customers`);
    const customers = customersResponse.data;
    
    const customer = customers.length > 0 ? customers[0] : null;
    if (customer) {
      console.log(`   👤 Khách hàng: ${customer.hoTen} (ID: ${customer.id})`);
    } else {
      console.log("   👤 Không có khách hàng");
    }

    // 3. Tạo dữ liệu đơn hàng giống như frontend
    console.log("\n3️⃣ Tạo dữ liệu đơn hàng:");
    const orderData = {
      maDonHang: `POS-DEBUG-${Date.now()}`,
      khachHangId: customer?.id || null,
      voucherId: null,
      phuongThucThanhToan: "Tiền mặt",
      tongThanhToan: product.gia,
      ghiChu: "Test order from debug",
      chiTietDonHang: [
        {
          chiTietSanPhamId: product.id,
          soLuong: 1,
          giaBan: product.gia
        }
      ]
    };

    console.log("   📋 Dữ liệu đơn hàng:");
    console.log(JSON.stringify(orderData, null, 2));

    // 4. Gọi API tạo đơn hàng
    console.log("\n4️⃣ Gọi API tạo đơn hàng:");
    const orderResponse = await axios.post(`${API_URL}/pos/orders`, orderData, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    console.log("   ✅ Response status:", orderResponse.status);
    console.log("   📋 Response data:");
    console.log(JSON.stringify(orderResponse.data, null, 2));

    // 5. Kiểm tra đơn hàng đã được tạo
    console.log("\n5️⃣ Kiểm tra đơn hàng trong database:");
    try {
      const ordersResponse = await axios.get(`${API_URL}/orders`);
      const orders = ordersResponse.data;
      const createdOrder = orders.find(order => order.maDonHang === orderData.maDonHang);
      
      if (createdOrder) {
        console.log("   ✅ Đơn hàng đã được lưu vào database:");
        console.log(`      ID: ${createdOrder.id}`);
        console.log(`      Mã: ${createdOrder.maDonHang}`);
        console.log(`      Trạng thái: ${createdOrder.trangThai}`);
        console.log(`      Tổng tiền: ${createdOrder.tongThanhToan}`);
      } else {
        console.log("   ❌ Không tìm thấy đơn hàng trong database");
      }
    } catch (error) {
      console.log("   ⚠️ Không thể kiểm tra database:", error.message);
    }

    // 6. Kiểm tra chi tiết đơn hàng
    console.log("\n6️⃣ Kiểm tra chi tiết đơn hàng:");
    try {
      const orderDetailsResponse = await axios.get(`${API_URL}/orders/${orderResponse.data.donHangId}/details`);
      const orderDetails = orderDetailsResponse.data;
      
      console.log("   📋 Chi tiết đơn hàng:");
      console.log(JSON.stringify(orderDetails, null, 2));
    } catch (error) {
      console.log("   ⚠️ Không thể lấy chi tiết đơn hàng:", error.message);
    }

    console.log("\n🎉 Debug Order Flow hoàn thành!");

  } catch (error) {
    console.error("❌ Lỗi debug order flow:", error.message);
    if (error.response) {
      console.error("   Status:", error.response.status);
      console.error("   Data:", error.response.data);
    }
  }
}

// Chạy debug
debugOrderFlow();
