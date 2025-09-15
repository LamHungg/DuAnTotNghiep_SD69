// Script test Top Sản Phẩm và Top Khách Hàng
// Copy và paste vào Console của browser khi đang ở trang Statistics

const testTopData = () => {
  console.log('🔍 Test Top Sản Phẩm và Top Khách Hàng...\n');

  try {
    // Test 1: Kiểm tra API Top Sản Phẩm
    console.log('1️⃣ Test API Top Sản Phẩm:');
    
    const testTopSanPham = async () => {
      const today = new Date().toISOString().split('T')[0];
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      
      try {
        // Test theo ngày
        console.log('📅 Test Top Sản Phẩm theo ngày:', today);
        const responseNgay = await fetch(`http://localhost:8080/zmen/san-pham/ngay?ngay=${today}`);
        const dataNgay = await responseNgay.json();
        console.log('✅ Top Sản Phẩm theo ngày:', dataNgay);
        console.log(`   Số lượng: ${dataNgay.length || 0}`);
        
        // Test theo tháng
        console.log('📅 Test Top Sản Phẩm theo tháng:', currentMonth, currentYear);
        const responseThang = await fetch(`http://localhost:8080/zmen/san-pham/thang?thang=${currentMonth}&nam=${currentYear}`);
        const dataThang = await responseThang.json();
        console.log('✅ Top Sản Phẩm theo tháng:', dataThang);
        console.log(`   Số lượng: ${dataThang.length || 0}`);
        
        // Test theo năm
        console.log('📅 Test Top Sản Phẩm theo năm:', currentYear);
        const responseNam = await fetch(`http://localhost:8080/zmen/san-pham/nam?nam=${currentYear}`);
        const dataNam = await responseNam.json();
        console.log('✅ Top Sản Phẩm theo năm:', dataNam);
        console.log(`   Số lượng: ${dataNam.length || 0}`);
        
      } catch (error) {
        console.log('❌ Lỗi test Top Sản Phẩm:', error.message);
      }
    };

    testTopSanPham();

    // Test 2: Kiểm tra API Top Khách Hàng
    console.log('\n2️⃣ Test API Top Khách Hàng:');
    
    const testTopKhachHang = async () => {
      const today = new Date().toISOString().split('T')[0];
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      
      try {
        // Test theo ngày
        console.log('📅 Test Top Khách Hàng theo ngày:', today);
        const responseNgay = await fetch(`http://localhost:8080/zmen/khach-hang/ngay?ngay=${today}`);
        const dataNgay = await responseNgay.json();
        console.log('✅ Top Khách Hàng theo ngày:', dataNgay);
        console.log(`   Số lượng: ${dataNgay.length || 0}`);
        
        // Test theo tháng
        console.log('📅 Test Top Khách Hàng theo tháng:', currentMonth, currentYear);
        const responseThang = await fetch(`http://localhost:8080/zmen/khach-hang/thang?thang=${currentMonth}&nam=${currentYear}`);
        const dataThang = await responseThang.json();
        console.log('✅ Top Khách Hàng theo tháng:', dataThang);
        console.log(`   Số lượng: ${dataThang.length || 0}`);
        
        // Test theo năm
        console.log('📅 Test Top Khách Hàng theo năm:', currentYear);
        const responseNam = await fetch(`http://localhost:8080/zmen/khach-hang/nam?nam=${currentYear}`);
        const dataNam = await responseNam.json();
        console.log('✅ Top Khách Hàng theo năm:', dataNam);
        console.log(`   Số lượng: ${dataNam.length || 0}`);
        
      } catch (error) {
        console.log('❌ Lỗi test Top Khách Hàng:', error.message);
      }
    };

    testTopKhachHang();

    // Test 3: Kiểm tra dữ liệu trong component Statistics
    console.log('\n3️⃣ Test Dữ Liệu Trong Component Statistics:');
    
    const testComponentData = () => {
      // Kiểm tra state topSanPham
      const topSanPhamElement = document.querySelector('[data-testid="top-san-pham"]') || 
                               document.querySelector('.top-san-pham') ||
                               document.querySelector('.table-responsive:has(th:contains("Tên sản phẩm"))');
      
      if (topSanPhamElement) {
        console.log('✅ Tìm thấy element Top Sản Phẩm');
        const rows = topSanPhamElement.querySelectorAll('tbody tr');
        console.log(`   Số dòng dữ liệu: ${rows.length}`);
        
        if (rows.length > 0) {
          console.log('✅ Có dữ liệu Top Sản Phẩm');
          rows.forEach((row, index) => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 4) {
              console.log(`   ${index + 1}. ${cells[1]?.textContent?.trim()} - SL: ${cells[2]?.textContent?.trim()} - DT: ${cells[3]?.textContent?.trim()}`);
            }
          });
        } else {
          console.log('⚠️ Không có dữ liệu Top Sản Phẩm');
        }
      } else {
        console.log('❌ Không tìm thấy element Top Sản Phẩm');
      }
      
      // Kiểm tra state topKhachHang
      const topKhachHangElement = document.querySelector('[data-testid="top-khach-hang"]') || 
                                 document.querySelector('.top-khach-hang') ||
                                 document.querySelector('.table-responsive:has(th:contains("Họ và tên"))');
      
      if (topKhachHangElement) {
        console.log('✅ Tìm thấy element Top Khách Hàng');
        const rows = topKhachHangElement.querySelectorAll('tbody tr');
        console.log(`   Số dòng dữ liệu: ${rows.length}`);
        
        if (rows.length > 0) {
          console.log('✅ Có dữ liệu Top Khách Hàng');
          rows.forEach((row, index) => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 4) {
              console.log(`   ${index + 1}. ${cells[1]?.textContent?.trim()} - ĐH: ${cells[2]?.textContent?.trim()} - CT: ${cells[3]?.textContent?.trim()}`);
            }
          });
        } else {
          console.log('⚠️ Không có dữ liệu Top Khách Hàng');
        }
      } else {
        console.log('❌ Không tìm thấy element Top Khách Hàng');
      }
    };

    testComponentData();

    // Test 4: Kiểm tra filter type hiện tại
    console.log('\n4️⃣ Test Filter Type Hiện Tại:');
    
    const testFilterType = () => {
      // Tìm các button filter
      const filterButtons = document.querySelectorAll('.btn-outline-primary, .btn-primary');
      console.log(`   Tìm thấy ${filterButtons.length} button filter`);
      
      filterButtons.forEach((button, index) => {
        const isActive = button.classList.contains('btn-primary');
        console.log(`   ${index + 1}. "${button.textContent.trim()}" - Active: ${isActive}`);
      });
      
      // Kiểm tra date picker
      const dateInput = document.querySelector('input[type="date"]');
      if (dateInput) {
        console.log(`   Date picker value: ${dateInput.value}`);
      }
      
      // Kiểm tra month/year select
      const monthSelect = document.querySelector('select[name="month"]');
      const yearSelect = document.querySelector('select[name="year"]');
      if (monthSelect) {
        console.log(`   Month select value: ${monthSelect.value}`);
      }
      if (yearSelect) {
        console.log(`   Year select value: ${yearSelect.value}`);
      }
    };

    testFilterType();

    // Test 5: Kiểm tra console errors
    console.log('\n5️⃣ Test Console Errors:');
    
    const testConsoleErrors = () => {
      // Kiểm tra xem có lỗi nào trong console không
      const originalError = console.error;
      const errors = [];
      
      console.error = (...args) => {
        errors.push(args.join(' '));
        originalError.apply(console, args);
      };
      
      // Đợi một chút để bắt lỗi
      setTimeout(() => {
        if (errors.length > 0) {
          console.log('❌ Tìm thấy lỗi trong console:');
          errors.forEach((error, index) => {
            console.log(`   ${index + 1}. ${error}`);
          });
        } else {
          console.log('✅ Không có lỗi trong console');
        }
        
        // Restore original console.error
        console.error = originalError;
      }, 1000);
    };

    testConsoleErrors();

    console.log('\n✅ Test hoàn thành! Kiểm tra kết quả ở trên');

  } catch (error) {
    console.log('❌ Lỗi test top data:', error.message);
  }
};

// Test backend endpoints
const testBackendTopData = () => {
  console.log('\n🔍 Test Backend Endpoints Top Data...\n');

  try {
    const endpoints = [
      { name: 'Top Sản Phẩm theo ngày', url: 'http://localhost:8080/zmen/san-pham/ngay?ngay=2025-08-28' },
      { name: 'Top Sản Phẩm theo tháng', url: 'http://localhost:8080/zmen/san-pham/thang?thang=8&nam=2025' },
      { name: 'Top Sản Phẩm theo năm', url: 'http://localhost:8080/zmen/san-pham/nam?nam=2025' },
      { name: 'Top Khách Hàng theo ngày', url: 'http://localhost:8080/zmen/khach-hang/ngay?ngay=2025-08-28' },
      { name: 'Top Khách Hàng theo tháng', url: 'http://localhost:8080/zmen/khach-hang/thang?thang=8&nam=2025' },
      { name: 'Top Khách Hàng theo năm', url: 'http://localhost:8080/zmen/khach-hang/nam?nam=2025' }
    ];

    endpoints.forEach(async (endpoint) => {
      try {
        const response = await fetch(endpoint.url);
        const data = await response.json();
        console.log(`✅ ${endpoint.name}: ${response.status} - ${data.length || 0} items`);
        
        if (data.length > 0) {
          console.log(`   Sample data:`, data[0]);
        }
      } catch (error) {
        console.log(`❌ ${endpoint.name}: ${error.message}`);
      }
    });

  } catch (error) {
    console.log('❌ Lỗi test backend top data:', error.message);
  }
};

// Chạy tests
testTopData();
testBackendTopData();

// Export functions
window.testTopData = testTopData;
window.testBackendTopData = testBackendTopData;
