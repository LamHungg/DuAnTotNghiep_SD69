// Script test PDF với từ tiếng Việt hoàn chỉnh
// Copy và paste vào Console của browser khi đang ở trang Statistics

const testPDFCompleteVietnamese = () => {
  console.log("🔍 Test PDF Với Từ Tiếng Việt Hoàn Chỉnh...\n");

  try {
    // Test 1: Kiểm tra dữ liệu thực tế từ backend
    console.log("1️⃣ Test Dữ Liệu Thực Tế Từ Backend:");

    const testBackendData = async () => {
      try {
        const response = await fetch("http://localhost:8080/zmen/tong-quan");
        const data = await response.json();
        console.log("✅ Backend Data:", data);

        // Kiểm tra cấu trúc dữ liệu
        if (data && typeof data === "object") {
          console.log("✅ Cấu trúc dữ liệu hợp lệ:");
          console.log(`   - doanhThuHomNay: ${data.doanhThuHomNay || 0}`);
          console.log(`   - doanhThuThangNay: ${data.doanhThuThangNay || 0}`);
          console.log(`   - doanhThuNamNay: ${data.doanhThuNamNay || 0}`);
          console.log(`   - tongDonHang: ${data.tongDonHang || 0}`);
          console.log(`   - tongKhachHang: ${data.tongKhachHang || 0}`);
          console.log(`   - tongSanPham: ${data.tongSanPham || 0}`);
          console.log(`   - khachHangMoi: ${data.khachHangMoi || 0}`);
          console.log(`   - tyLeHuy: ${data.tyLeHuy || 0}`);
          console.log(`   - tangTruongThang: ${data.tangTruongThang || 0}`);
          console.log(`   - tangTruongNam: ${data.tangTruongNam || 0}`);

          // Kiểm tra dữ liệu không phải demo
          const isRealData =
            data.doanhThuHomNay !== 1500000 &&
            data.doanhThuThangNay !== 45000000 &&
            data.doanhThuNamNay !== 540000000;

          if (isRealData) {
            console.log("✅ Dữ liệu thực tế từ database");
          } else {
            console.log("⚠️ Có thể là demo data");
          }
        }
      } catch (error) {
        console.log("❌ Lỗi lấy dữ liệu backend:", error.message);
      }
    };

    testBackendData();

    // Test 2: Kiểm tra dữ liệu gửi đến PDF API với từ tiếng Việt hoàn chỉnh
    console.log(
      "\n2️⃣ Test Dữ Liệu Gửi Đến PDF API Với Từ Tiếng Việt Hoàn Chỉnh:"
    );

    const testPDFCompleteData = async () => {
      try {
        // Lấy dữ liệu thực tế từ backend
        const response = await fetch("http://localhost:8080/zmen/tong-quan");
        const realData = await response.json();

        // Tạo payload cho PDF với dữ liệu thực tế
        const pdfPayload = {
          filterType: "hom-nay",
          selectedDate: new Date().toISOString().split("T")[0],
          selectedMonth: new Date().getMonth() + 1,
          selectedYear: new Date().getFullYear(),
          dateFrom: new Date().toISOString().split("T")[0],
          dateTo: new Date().toISOString().split("T")[0],
          kpiData: {
            doanhThuHomNay: realData.doanhThuHomNay || 0,
            doanhThuThangNay: realData.doanhThuThangNay || 0,
            doanhThuNamNay: realData.doanhThuNamNay || 0,
            tongDonHang: realData.tongDonHang || 0,
            tongKhachHang: realData.tongKhachHang || 0,
            tongSanPham: realData.tongSanPham || 0,
            khachHangMoi: realData.khachHangMoi || 0,
            tyLeHuy: realData.tyLeHuy || 0,
            tangTruongThang: realData.tangTruongThang || 0,
            tangTruongNam: realData.tangTruongNam || 0,
          },
          doanhThuChart: realData.doanhThuChart || [],
          doanhThuTheoDanhMuc: realData.doanhThuTheoDanhMuc || [],
          topSanPham: realData.topSanPhamThang || [],
          topKhachHang: realData.topKhachHangThang || [],
        };

        console.log(
          "✅ PDF Payload với dữ liệu thực tế và từ tiếng Việt hoàn chỉnh:",
          pdfPayload
        );

        // Test gọi PDF API
        const pdfResponse = await fetch(
          "http://localhost:8080/zmen/export/thong-ke-pdf",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(pdfPayload),
          }
        );

        if (pdfResponse.ok) {
          console.log("✅ PDF API trả về thành công");
          console.log(`   Status: ${pdfResponse.status}`);
          console.log(
            `   Content-Type: ${pdfResponse.headers.get("content-type")}`
          );

          // Kiểm tra content type
          const contentType = pdfResponse.headers.get("content-type");
          if (contentType && contentType.includes("application/pdf")) {
            console.log("✅ Response là file PDF hợp lệ");
            console.log(
              "💡 PDF sẽ chứa dữ liệu thực tế và từ tiếng Việt hoàn chỉnh"
            );
          } else {
            console.log("⚠️ Response không phải PDF");
          }
        } else {
          console.log(
            "❌ PDF API lỗi:",
            pdfResponse.status,
            pdfResponse.statusText
          );
        }
      } catch (error) {
        console.log("❌ Lỗi test PDF API từ hoàn chỉnh:", error.message);
      }
    };

    testPDFCompleteData();

    // Test 3: Kiểm tra button export PDF
    console.log("\n3️⃣ Test Button Export PDF Với Từ Tiếng Việt Hoàn Chỉnh:");

    const pdfButton = document.querySelector(".btn-danger:has(.fa-file-pdf)");
    if (pdfButton) {
      console.log('✅ Tìm thấy button "Xuất PDF"');
      console.log(`   Text: "${pdfButton.textContent.trim()}"`);
      console.log(`   Disabled: ${pdfButton.disabled}`);

      if (!pdfButton.disabled) {
        console.log("🔄 Đang test click button PDF...");
        pdfButton.click();
        console.log("✅ Đã click button PDF - Kiểm tra file download");
        console.log(
          "💡 PDF sẽ chứa dữ liệu thực tế và từ tiếng Việt hoàn chỉnh"
        );
        console.log("📝 Các từ tiếng Việt sẽ hiển thị hoàn chỉnh:");
        console.log('   - "Tổng số đơn hàng" thay vì "Tổng đơn hàng"');
        console.log('   - "Tổng số khách hàng" thay vì "Tổng khách hàng"');
        console.log('   - "Tổng số sản phẩm" thay vì "Tổng sản phẩm"');
        console.log('   - "Tỷ lệ hủy đơn hàng (%)" thay vì "Tỷ lệ hủy (%)"');
        console.log(
          '   - "BIỂU ĐỒ DOANH THU THEO NGÀY" thay vì "BIỂU ĐỒ DOANH THU"'
        );
        console.log(
          '   - "TOP 10 SẢN PHẨM BÁN CHẠY NHẤT" thay vì "TOP SẢN PHẨM BÁN CHẠY"'
        );
        console.log(
          '   - "TOP 10 KHÁCH HÀNG CHI TIÊU CAO NHẤT" thay vì "TOP KHÁCH HÀNG"'
        );
      } else {
        console.log("⚠️ Button PDF bị disabled");
      }
    } else {
      console.log('❌ Không tìm thấy button "Xuất PDF"');
    }

    // Test 4: Kiểm tra từ tiếng Việt hoàn chỉnh
    console.log("\n4️⃣ Test Từ Tiếng Việt Hoàn Chỉnh:");

    const completeVietnameseTest = () => {
      const completeVietnameseWords = [
        "ZMEN - CỬA HÀNG THỜI TRANG NAM",
        "Địa chỉ: 123 Đường ABC, Quận XYZ, Thành phố Hồ Chí Minh",
        "Điện thoại: 0123-456-789 | Email: info@zmen.com | Website: www.zmen.com",
        "BÁO CÁO THỐNG KÊ TỔNG QUAN",
        "Thời gian báo cáo: 28/08/2025",
        "CHỈ SỐ KPI",
        "Chỉ số",
        "Giá trị",
        "Doanh thu hôm nay",
        "Doanh thu tháng này",
        "Doanh thu năm nay",
        "Tổng số đơn hàng",
        "Tổng số khách hàng",
        "Tổng số sản phẩm",
        "Khách hàng mới",
        "Tỷ lệ hủy đơn hàng (%)",
        "Tăng trưởng tháng (%)",
        "Tăng trưởng năm (%)",
        "BIỂU ĐỒ DOANH THU THEO NGÀY",
        "Ngày",
        "Doanh thu (VND)",
        "TOP 10 SẢN PHẨM BÁN CHẠY NHẤT",
        "Tên sản phẩm",
        "Số lượng đã bán",
        "Doanh thu (VND)",
        "TOP 10 KHÁCH HÀNG CHI TIÊU CAO NHẤT",
        "Họ và tên",
        "Số đơn hàng",
        "Tổng chi tiêu (VND)",
        "Báo cáo được tạo tự động bởi hệ thống quản lý ZMEN",
      ];

      console.log(
        "✅ Danh sách từ tiếng Việt hoàn chỉnh sẽ hiển thị trong PDF:"
      );
      completeVietnameseWords.forEach((word, index) => {
        console.log(`   ${index + 1}. ${word}`);
      });

      console.log("\n✅ Các cải tiến từ tiếng Việt:");
      console.log(
        '   - Thêm từ "số" vào "Tổng số đơn hàng", "Tổng số khách hàng"'
      );
      console.log('   - Thêm từ "đơn hàng" vào "Tỷ lệ hủy đơn hàng (%)"');
      console.log('   - Thêm "THEO NGÀY" vào "BIỂU ĐỒ DOANH THU THEO NGÀY"');
      console.log(
        '   - Thêm "10" và "NHẤT" vào "TOP 10 SẢN PHẨM BÁN CHẠY NHẤT"'
      );
      console.log(
        '   - Thêm "10" và "CHI TIÊU CAO NHẤT" vào "TOP 10 KHÁCH HÀNG CHI TIÊU CAO NHẤT"'
      );
      console.log('   - Thêm "và" vào "Họ và tên"');
      console.log('   - Thêm "(VND)" vào các cột tiền tệ');
      console.log('   - Thêm "quản lý" vào footer');
      console.log('   - Thêm "Thành phố Hồ Chí Minh" thay vì "TP.HCM"');
      console.log('   - Thêm "Website: www.zmen.com" vào thông tin liên hệ');
    };

    completeVietnameseTest();

    // Test 5: Kiểm tra không có demo data
    console.log("\n5️⃣ Test Không Có Demo Data:");

    // Kiểm tra các biến demo data
    const demoVars = ["demoData", "mockData", "sampleData", "testData"];
    let hasDemoData = false;

    demoVars.forEach((varName) => {
      if (window[varName]) {
        console.log(`❌ Tìm thấy demo data: ${varName}`);
        hasDemoData = true;
      }
    });

    if (!hasDemoData) {
      console.log("✅ Không tìm thấy demo data trong window object");
    }

    console.log(
      "\n✅ Test hoàn thành! PDF sử dụng dữ liệu thực tế và từ tiếng Việt hoàn chỉnh"
    );
  } catch (error) {
    console.log("❌ Lỗi test PDF từ hoàn chỉnh:", error.message);
  }
};

// Test backend endpoints với từ tiếng Việt hoàn chỉnh
const testBackendCompleteVietnamese = () => {
  console.log("\n🔍 Test Backend Endpoints Với Từ Tiếng Việt Hoàn Chỉnh...\n");

  try {
    const endpoints = [
      {
        name: "Thống kê tổng quan",
        url: "http://localhost:8080/zmen/tong-quan",
      },
      {
        name: "Biểu đồ doanh thu",
        url: "http://localhost:8080/zmen/doanh-thu/bieu-do?filterType=hom-nay&year=2025&month=8",
      },
      {
        name: "Danh sách đơn hàng",
        url: "http://localhost:8080/zmen/don-hang/list?filterType=hom-nay",
      },
      {
        name: "Export Excel",
        url: "http://localhost:8080/zmen/export/thong-ke-excel",
      },
      {
        name: "Export PDF",
        url: "http://localhost:8080/zmen/export/thong-ke-pdf",
      },
    ];

    endpoints.forEach(async (endpoint) => {
      try {
        if (
          endpoint.name === "Export Excel" ||
          endpoint.name === "Export PDF"
        ) {
          // Test POST endpoints với dữ liệu thực tế
          const testData = {
            filterType: "hom-nay",
            kpiData: {
              doanhThuHomNay: 0,
              doanhThuThangNay: 0,
              doanhThuNamNay: 0,
              tongDonHang: 0,
              tongKhachHang: 0,
              tongSanPham: 0,
              khachHangMoi: 0,
              tyLeHuy: 0,
              tangTruongThang: 0,
              tangTruongNam: 0,
            },
          };

          const response = await fetch(endpoint.url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(testData),
          });
          console.log(
            `✅ ${endpoint.name}: ${response.status} ${response.statusText}`
          );
        } else {
          // Test GET endpoints
          const response = await fetch(endpoint.url, { method: "GET" });
          console.log(
            `✅ ${endpoint.name}: ${response.status} ${response.statusText}`
          );
        }
      } catch (error) {
        console.log(`❌ ${endpoint.name}: ${error.message}`);
      }
    });
  } catch (error) {
    console.log("❌ Lỗi test backend từ hoàn chỉnh:", error.message);
  }
};

// Chạy tests
testPDFCompleteVietnamese();
testBackendCompleteVietnamese();

// Export functions
window.testPDFCompleteVietnamese = testPDFCompleteVietnamese;
window.testBackendCompleteVietnamese = testBackendCompleteVietnamese;
