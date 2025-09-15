// Test file để kiểm tra các endpoint backend mới
// Chạy file này để test các API endpoint đã được thêm

const axios = require("axios");

const SERVER_URL = "http://localhost:8080";

console.log("🧪 Bắt đầu test các endpoint backend mới...\n");

// Test 1: Kiểm tra endpoint /don-hang/list
async function testDonHangList() {
  console.log("✅ Test 1: Kiểm tra endpoint /don-hang/list");

  try {
    const response = await axios.get(`${SERVER_URL}/zmen/don-hang/list`, {
      params: {
        filterType: "hom-nay",
        selectedDate: "2025-01-27",
        selectedMonth: 1,
        selectedYear: 2025,
        dateFrom: "2025-01-27",
        dateTo: "2025-01-27",
      },
    });

    console.log("  - Status:", response.status);
    console.log("  - Data length:", response.data.length);
    console.log("  - Sample data:", response.data[0]);
    console.log("  ✅ Endpoint hoạt động tốt!\n");
  } catch (error) {
    console.log(
      "  ❌ Lỗi:",
      error.response?.status,
      error.response?.statusText
    );
    console.log("  - Error message:", error.message);
    console.log("  ❌ Endpoint có vấn đề!\n");
  }
}

// Test 2: Kiểm tra endpoint /tong-quan với dữ liệu mới
async function testTongQuan() {
  console.log("✅ Test 2: Kiểm tra endpoint /tong-quan với dữ liệu mới");

  try {
    const response = await axios.get(`${SERVER_URL}/zmen/tong-quan`);

    console.log("  - Status:", response.status);
    console.log("  - Khách hàng mới:", response.data.khachHangMoi);
    console.log("  - Tỷ lệ hủy:", response.data.tyLeHuy);
    console.log("  ✅ Endpoint hoạt động tốt!\n");
  } catch (error) {
    console.log(
      "  ❌ Lỗi:",
      error.response?.status,
      error.response?.statusText
    );
    console.log("  - Error message:", error.message);
    console.log("  ❌ Endpoint có vấn đề!\n");
  }
}

// Test 3: Kiểm tra endpoint export Excel
async function testExportExcel() {
  console.log("✅ Test 3: Kiểm tra endpoint export Excel");

  try {
    const testData = {
      doanhThuHomNay: 15000000,
      doanhThuThangNay: 450000000,
      tongDonHang: 1250,
      khachHangMoi: 45,
      tyLeHuy: 2.5,
      doanhThuChart: [
        { ngay: "2025-01-27", doanhThu: 15000000 },
        { ngay: "2025-01-26", doanhThu: 12000000 },
      ],
      topSanPham: [
        { tenSanPham: "Sản phẩm A", soLuongBan: 100, doanhThu: 5000000 },
        { tenSanPham: "Sản phẩm B", soLuongBan: 80, doanhThu: 4000000 },
      ],
      topKhachHang: [
        { khachHang: "Khách A", soDonHang: 5, tongChiTieu: 2000000 },
        { khachHang: "Khách B", soDonHang: 3, tongChiTieu: 1500000 },
      ],
      donHangList: [
        {
          maDonHang: "DH001",
          khachHang: "Khách A",
          ngayDat: "2025-01-27",
          tongTien: 500000,
          trangThai: "Đã giao",
        },
        {
          maDonHang: "DH002",
          khachHang: "Khách B",
          ngayDat: "2025-01-27",
          tongTien: 300000,
          trangThai: "Đang xử lý",
        },
      ],
    };

    const response = await axios.post(
      `${SERVER_URL}/zmen/export/thong-ke-excel`,
      testData,
      {
        responseType: "blob",
      }
    );

    console.log("  - Status:", response.status);
    console.log("  - Content-Type:", response.headers["content-type"]);
    console.log("  - Data size:", response.data.size, "bytes");
    console.log("  ✅ Endpoint hoạt động tốt!\n");
  } catch (error) {
    console.log(
      "  ❌ Lỗi:",
      error.response?.status,
      error.response?.statusText
    );
    console.log("  - Error message:", error.message);
    console.log("  ❌ Endpoint có vấn đề!\n");
  }
}

// Test 4: Kiểm tra endpoint export PDF
async function testExportPDF() {
  console.log("✅ Test 4: Kiểm tra endpoint export PDF");

  try {
    const testData = {
      doanhThuHomNay: 15000000,
      doanhThuThangNay: 450000000,
      tongDonHang: 1250,
      khachHangMoi: 45,
      tyLeHuy: 2.5,
    };

    const response = await axios.post(
      `${SERVER_URL}/zmen/export/thong-ke-pdf`,
      testData,
      {
        responseType: "blob",
      }
    );

    console.log("  - Status:", response.status);
    console.log("  - Content-Type:", response.headers["content-type"]);
    console.log("  - Data size:", response.data.size, "bytes");
    console.log("  ✅ Endpoint hoạt động tốt!\n");
  } catch (error) {
    console.log(
      "  ❌ Lỗi:",
      error.response?.status,
      error.response?.statusText
    );
    console.log("  - Error message:", error.message);
    console.log("  ❌ Endpoint có vấn đề!\n");
  }
}

// Test 5: Kiểm tra các endpoint cũ vẫn hoạt động
async function testOldEndpoints() {
  console.log("✅ Test 5: Kiểm tra các endpoint cũ vẫn hoạt động");

  try {
    // Test endpoint sản phẩm
    const response1 = await axios.get(`${SERVER_URL}/zmen/san-pham/ngay`, {
      params: { ngay: "2025-01-27" },
    });
    console.log("  - San pham endpoint:", response1.status);

    // Test endpoint doanh thu
    const response2 = await axios.get(`${SERVER_URL}/zmen/doanh-thu/ngay`, {
      params: { ngay: "2025-01-27" },
    });
    console.log("  - Doanh thu endpoint:", response2.status);

    // Test endpoint khách hàng
    const response3 = await axios.get(`${SERVER_URL}/zmen/khach-hang/ngay`, {
      params: { ngay: "2025-01-27" },
    });
    console.log("  - Khach hang endpoint:", response3.status);

    console.log("  ✅ Tất cả endpoint cũ vẫn hoạt động tốt!\n");
  } catch (error) {
    console.log(
      "  ❌ Lỗi:",
      error.response?.status,
      error.response?.statusText
    );
    console.log("  - Error message:", error.message);
    console.log("  ❌ Có endpoint cũ bị lỗi!\n");
  }
}

// Chạy tất cả tests
async function runAllTests() {
  console.log("🚀 Bắt đầu chạy tất cả tests...\n");

  await testDonHangList();
  await testTongQuan();
  await testExportExcel();
  await testExportPDF();
  await testOldEndpoints();

  console.log("🎉 Hoàn thành tất cả tests!");
  console.log("📊 Backend đã sẵn sàng cho trang Statistics mới!");
}

// Hướng dẫn sử dụng
console.log("📋 Hướng dẫn sử dụng:");
console.log("1. Đảm bảo backend đang chạy trên port 8080");
console.log("2. Chạy: node test_backend_endpoints.js");
console.log("3. Kiểm tra kết quả test\n");

// Chạy tests nếu file được execute trực tiếp
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  testDonHangList,
  testTongQuan,
  testExportExcel,
  testExportPDF,
  testOldEndpoints,
  runAllTests,
};
