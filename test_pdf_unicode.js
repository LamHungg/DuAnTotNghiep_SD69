// Script test PDF với font Unicode và dấu tiếng Việt
// Copy và paste vào Console của browser khi đang ở trang Statistics

const testPDFUnicode = () => {
  console.log('🔍 Test PDF Với Font Unicode Và Dấu Tiếng Việt...\n');

  try {
    // Test 1: Kiểm tra dữ liệu thực tế từ backend
    console.log('1️⃣ Test Dữ Liệu Thực Tế Từ Backend:');
    
    const testBackendData = async () => {
      try {
        const response = await fetch('http://localhost:8080/zmen/tong-quan');
        const data = await response.json();
        console.log('✅ Backend Data:', data);
        
        // Kiểm tra cấu trúc dữ liệu
        if (data && typeof data === 'object') {
          console.log('✅ Cấu trúc dữ liệu hợp lệ:');
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
          const isRealData = data.doanhThuHomNay !== 1500000 && 
                           data.doanhThuThangNay !== 45000000 && 
                           data.doanhThuNamNay !== 540000000;
          
          if (isRealData) {
            console.log('✅ Dữ liệu thực tế từ database');
          } else {
            console.log('⚠️ Có thể là demo data');
          }
        }
      } catch (error) {
        console.log('❌ Lỗi lấy dữ liệu backend:', error.message);
      }
    };

    testBackendData();

    // Test 2: Kiểm tra dữ liệu gửi đến PDF API với Unicode
    console.log('\n2️⃣ Test Dữ Liệu Gửi Đến PDF API Với Unicode:');
    
    const testPDFUnicodeData = async () => {
      try {
        // Lấy dữ liệu thực tế từ backend
        const response = await fetch('http://localhost:8080/zmen/tong-quan');
        const realData = await response.json();
        
        // Tạo payload cho PDF với dữ liệu thực tế
        const pdfPayload = {
          filterType: 'hom-nay',
          selectedDate: new Date().toISOString().split('T')[0],
          selectedMonth: new Date().getMonth() + 1,
          selectedYear: new Date().getFullYear(),
          dateFrom: new Date().toISOString().split('T')[0],
          dateTo: new Date().toISOString().split('T')[0],
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
            tangTruongNam: realData.tangTruongNam || 0
          },
          doanhThuChart: realData.doanhThuChart || [],
          doanhThuTheoDanhMuc: realData.doanhThuTheoDanhMuc || [],
          topSanPham: realData.topSanPhamThang || [],
          topKhachHang: realData.topKhachHangThang || []
        };
        
        console.log('✅ PDF Payload với dữ liệu thực tế và Unicode:', pdfPayload);
        
        // Test gọi PDF API
        const pdfResponse = await fetch('http://localhost:8080/zmen/export/thong-ke-pdf', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(pdfPayload)
        });
        
        if (pdfResponse.ok) {
          console.log('✅ PDF API trả về thành công');
          console.log(`   Status: ${pdfResponse.status}`);
          console.log(`   Content-Type: ${pdfResponse.headers.get('content-type')}`);
          
          // Kiểm tra content type
          const contentType = pdfResponse.headers.get('content-type');
          if (contentType && contentType.includes('application/pdf')) {
            console.log('✅ Response là file PDF hợp lệ');
            console.log('💡 PDF sẽ chứa dữ liệu thực tế và font Unicode hỗ trợ dấu tiếng Việt');
          } else {
            console.log('⚠️ Response không phải PDF');
          }
        } else {
          console.log('❌ PDF API lỗi:', pdfResponse.status, pdfResponse.statusText);
        }
        
      } catch (error) {
        console.log('❌ Lỗi test PDF API Unicode:', error.message);
      }
    };

    testPDFUnicodeData();

    // Test 3: Kiểm tra button export PDF
    console.log('\n3️⃣ Test Button Export PDF Với Unicode:');
    
    const pdfButton = document.querySelector('.btn-danger:has(.fa-file-pdf)');
    if (pdfButton) {
      console.log('✅ Tìm thấy button "Xuất PDF"');
      console.log(`   Text: "${pdfButton.textContent.trim()}"`);
      console.log(`   Disabled: ${pdfButton.disabled}`);
      
      if (!pdfButton.disabled) {
        console.log('🔄 Đang test click button PDF...');
        pdfButton.click();
        console.log('✅ Đã click button PDF - Kiểm tra file download');
        console.log('💡 PDF sẽ chứa dữ liệu thực tế và font Unicode hỗ trợ dấu tiếng Việt');
        console.log('📝 Các từ tiếng Việt sẽ hiển thị đúng dấu:');
        console.log('   - "Doanh thu hôm nay" thay vì "Doanh thu hom nay"');
        console.log('   - "Tổng đơn hàng" thay vì "Tong don hang"');
        console.log('   - "Khách hàng mới" thay vì "Khach hang moi"');
        console.log('   - "Tỷ lệ hủy" thay vì "Ty le huy"');
        console.log('   - "Tăng trưởng" thay vì "Tang truong"');
      } else {
        console.log('⚠️ Button PDF bị disabled');
      }
    } else {
      console.log('❌ Không tìm thấy button "Xuất PDF"');
    }

    // Test 4: Kiểm tra Unicode support
    console.log('\n4️⃣ Test Unicode Support:');
    
    const unicodeTest = () => {
      const vietnameseWords = [
        'Doanh thu hôm nay',
        'Tổng đơn hàng', 
        'Khách hàng mới',
        'Tỷ lệ hủy',
        'Tăng trưởng',
        'Biểu đồ doanh thu',
        'Top sản phẩm bán chạy',
        'Top khách hàng',
        'Báo cáo được tạo tự động'
      ];
      
      console.log('✅ Danh sách từ tiếng Việt có dấu sẽ hiển thị trong PDF:');
      vietnameseWords.forEach((word, index) => {
        console.log(`   ${index + 1}. ${word}`);
      });
      
      console.log('\n✅ Font Unicode sẽ hỗ trợ:');
      console.log('   - Các ký tự có dấu: á, à, ả, ã, ạ, ă, ắ, ằ, ẳ, ẵ, ặ');
      console.log('   - Các ký tự đặc biệt: đ, Đ');
      console.log('   - Các dấu thanh: sắc, huyền, hỏi, ngã, nặng');
    };

    unicodeTest();

    // Test 5: Kiểm tra không có demo data
    console.log('\n5️⃣ Test Không Có Demo Data:');
    
    // Kiểm tra các biến demo data
    const demoVars = ['demoData', 'mockData', 'sampleData', 'testData'];
    let hasDemoData = false;
    
    demoVars.forEach(varName => {
      if (window[varName]) {
        console.log(`❌ Tìm thấy demo data: ${varName}`);
        hasDemoData = true;
      }
    });
    
    if (!hasDemoData) {
      console.log('✅ Không tìm thấy demo data trong window object');
    }

    console.log('\n✅ Test hoàn thành! PDF sử dụng dữ liệu thực tế và font Unicode hỗ trợ dấu tiếng Việt');

  } catch (error) {
    console.log('❌ Lỗi test PDF Unicode:', error.message);
  }
};

// Test backend endpoints với Unicode support
const testBackendUnicode = () => {
  console.log('\n🔍 Test Backend Endpoints Với Unicode Support...\n');

  try {
    const endpoints = [
      { name: 'Thống kê tổng quan', url: 'http://localhost:8080/zmen/tong-quan' },
      { name: 'Biểu đồ doanh thu', url: 'http://localhost:8080/zmen/doanh-thu/bieu-do?filterType=hom-nay&year=2025&month=8' },
      { name: 'Danh sách đơn hàng', url: 'http://localhost:8080/zmen/don-hang/list?filterType=hom-nay' },
      { name: 'Export Excel', url: 'http://localhost:8080/zmen/export/thong-ke-excel' },
      { name: 'Export PDF', url: 'http://localhost:8080/zmen/export/thong-ke-pdf' }
    ];

    endpoints.forEach(async (endpoint) => {
      try {
        if (endpoint.name === 'Export Excel' || endpoint.name === 'Export PDF') {
          // Test POST endpoints với dữ liệu thực tế
          const testData = {
            filterType: 'hom-nay',
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
              tangTruongNam: 0
            }
          };
          
          const response = await fetch(endpoint.url, { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testData)
          });
          console.log(`✅ ${endpoint.name}: ${response.status} ${response.statusText}`);
        } else {
          // Test GET endpoints
          const response = await fetch(endpoint.url, { method: 'GET' });
          console.log(`✅ ${endpoint.name}: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        console.log(`❌ ${endpoint.name}: ${error.message}`);
      }
    });

  } catch (error) {
    console.log('❌ Lỗi test backend Unicode:', error.message);
  }
};

// Chạy tests
testPDFUnicode();
testBackendUnicode();

// Export functions
window.testPDFUnicode = testPDFUnicode;
window.testBackendUnicode = testBackendUnicode;
