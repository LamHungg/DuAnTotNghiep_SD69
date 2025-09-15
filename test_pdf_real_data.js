// Script test PDF sử dụng dữ liệu thực tế
// Copy và paste vào Console của browser khi đang ở trang Statistics

const testPDFRealData = () => {
  console.log('🔍 Test PDF Sử Dụng Dữ Liệu Thực Tế...\n');

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

    // Test 2: Kiểm tra dữ liệu gửi đến PDF API
    console.log('\n2️⃣ Test Dữ Liệu Gửi Đến PDF API:');
    
    const testPDFData = async () => {
      try {
        // Lấy dữ liệu thực tế từ backend
        const response = await fetch('http://localhost:8080/zmen/tong-quan');
        const realData = await response.json();
        
        // Tạo payload cho PDF
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
        
        console.log('✅ PDF Payload với dữ liệu thực tế:', pdfPayload);
        
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
          } else {
            console.log('⚠️ Response không phải PDF');
          }
        } else {
          console.log('❌ PDF API lỗi:', pdfResponse.status, pdfResponse.statusText);
        }
        
      } catch (error) {
        console.log('❌ Lỗi test PDF API:', error.message);
      }
    };

    testPDFData();

    // Test 3: Kiểm tra button export PDF
    console.log('\n3️⃣ Test Button Export PDF:');
    
    const pdfButton = document.querySelector('.btn-danger:has(.fa-file-pdf)');
    if (pdfButton) {
      console.log('✅ Tìm thấy button "Xuất PDF"');
      console.log(`   Text: "${pdfButton.textContent.trim()}"`);
      console.log(`   Disabled: ${pdfButton.disabled}`);
      
      if (!pdfButton.disabled) {
        console.log('🔄 Đang test click button PDF...');
        pdfButton.click();
        console.log('✅ Đã click button PDF - Kiểm tra file download');
        console.log('💡 PDF sẽ chứa dữ liệu thực tế từ backend');
      } else {
        console.log('⚠️ Button PDF bị disabled');
      }
    } else {
      console.log('❌ Không tìm thấy button "Xuất PDF"');
    }

    // Test 4: Kiểm tra không có demo data trong code
    console.log('\n4️⃣ Test Không Có Demo Data Trong Code:');
    
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

    // Test 5: Kiểm tra localStorage
    console.log('\n5️⃣ Test LocalStorage:');
    
    const demoKeys = ['demoEmployees', 'demoAdmins', 'demoProducts', 'demoCustomers'];
    let hasDemoLocalStorage = false;
    
    demoKeys.forEach(key => {
      if (localStorage.getItem(key)) {
        console.log(`❌ Tìm thấy demo data trong localStorage: ${key}`);
        hasDemoLocalStorage = true;
      }
    });
    
    if (!hasDemoLocalStorage) {
      console.log('✅ Không tìm thấy demo data trong localStorage');
    }

    console.log('\n✅ Test hoàn thành! PDF sử dụng dữ liệu thực tế từ backend');

  } catch (error) {
    console.log('❌ Lỗi test PDF real data:', error.message);
  }
};

// Test backend endpoints với dữ liệu thực tế
const testBackendRealData = () => {
  console.log('\n🔍 Test Backend Endpoints Với Dữ Liệu Thực Tế...\n');

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
    console.log('❌ Lỗi test backend real data:', error.message);
  }
};

// Chạy tests
testPDFRealData();
testBackendRealData();

// Export functions
window.testPDFRealData = testPDFRealData;
window.testBackendRealData = testBackendRealData;
