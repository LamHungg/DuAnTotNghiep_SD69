// Script test chi tiết Frontend Integration
// Copy và paste vào Console của browser khi đang ở trang Statistics

const testDetailedIntegration = async () => {
    console.log('🔍 Test Chi Tiết Frontend Integration...\n');

    try {
        // Test 1: Kiểm tra header và nút export
        console.log('1️⃣ Kiểm tra Header và Nút Export:');
        const headerElement = document.querySelector('.statistics-header');
        if (headerElement) {
            console.log('✅ Header tồn tại');
            
            const exportButtons = headerElement.querySelectorAll('.btn');
            console.log(`✅ Tìm thấy ${exportButtons.length} nút trong header`);
            
            exportButtons.forEach((btn, index) => {
                const text = btn.textContent.trim();
                console.log(`   ${index + 1}. "${text}"`);
            });
        } else {
            console.log('❌ Không tìm thấy header');
        }

        // Test 2: Kiểm tra KPI cards chi tiết
        console.log('\n2️⃣ Kiểm tra KPI Cards Chi Tiết:');
        const kpiCards = document.querySelectorAll('.kpi-card, .stat-card, [class*="card"]');
        console.log(`✅ Tìm thấy ${kpiCards.length} KPI cards`);
        
        kpiCards.forEach((card, index) => {
            const title = card.querySelector('h3, .card-title, [class*="title"]')?.textContent?.trim();
            const value = card.querySelector('[class*="value"], [class*="amount"]')?.textContent?.trim();
            console.log(`   ${index + 1}. ${title || 'Không có title'}: ${value || 'Không có value'}`);
        });

        // Test 3: Kiểm tra dữ liệu thực tế
        console.log('\n3️⃣ Kiểm tra Dữ Liệu Thực Tế:');
        const apiResponse = await fetch('http://localhost:8080/zmen/tong-quan');
        if (apiResponse.ok) {
            const apiData = await apiResponse.json();
            console.log('✅ API Data:', apiData);
            
            // Kiểm tra xem dữ liệu có hiển thị trên giao diện không
            const allText = document.body.textContent;
            
            // Tìm kiếm các giá trị trong text
            const doanhThuThang = apiData.doanhThuThangNay?.toString();
            const tongDonHang = apiData.tongDonHang?.toString();
            const khachHangMoi = apiData.khachHangMoi?.toString();
            
            if (doanhThuThang && allText.includes(doanhThuThang)) {
                console.log('✅ Doanh thu tháng hiển thị trên giao diện');
            } else {
                console.log('❌ Doanh thu tháng KHÔNG hiển thị trên giao diện');
            }
            
            if (tongDonHang && allText.includes(tongDonHang)) {
                console.log('✅ Tổng đơn hàng hiển thị trên giao diện');
            } else {
                console.log('❌ Tổng đơn hàng KHÔNG hiển thị trên giao diện');
            }
            
            if (khachHangMoi && allText.includes(khachHangMoi)) {
                console.log('✅ Khách hàng mới hiển thị trên giao diện');
            } else {
                console.log('❌ Khách hàng mới KHÔNG hiển thị trên giao diện');
            }
        }

        // Test 4: Kiểm tra biểu đồ
        console.log('\n4️⃣ Kiểm tra Biểu Đồ:');
        const charts = document.querySelectorAll('.recharts-wrapper');
        console.log(`✅ Tìm thấy ${charts.length} biểu đồ Recharts`);
        
        if (charts.length > 0) {
            charts.forEach((chart, index) => {
                const chartType = chart.querySelector('svg')?.getAttribute('class') || 'Unknown';
                console.log(`   ${index + 1}. Chart type: ${chartType}`);
            });
        }

        // Test 5: Kiểm tra bảng dữ liệu
        console.log('\n5️⃣ Kiểm tra Bảng Dữ Liệu:');
        const tables = document.querySelectorAll('table');
        console.log(`✅ Tìm thấy ${tables.length} bảng`);
        
        tables.forEach((table, index) => {
            const rows = table.querySelectorAll('tr');
            const headers = table.querySelectorAll('th');
            console.log(`   ${index + 1}. Bảng có ${rows.length} rows, ${headers.length} headers`);
        });

        // Test 6: Kiểm tra filter buttons
        console.log('\n6️⃣ Kiểm tra Filter Buttons:');
        const filterButtons = document.querySelectorAll('.filter-btn, button[class*="filter"]');
        console.log(`✅ Tìm thấy ${filterButtons.length} nút filter`);
        
        filterButtons.forEach((btn, index) => {
            const text = btn.textContent.trim();
            const isActive = btn.classList.contains('active');
            console.log(`   ${index + 1}. "${text}" ${isActive ? '(active)' : ''}`);
        });

        // Test 7: Kiểm tra loading state
        console.log('\n7️⃣ Kiểm tra Loading State:');
        const loadingElements = document.querySelectorAll('[class*="loading"], [class*="spinner"], .spinning');
        if (loadingElements.length > 0) {
            console.log('⏳ Đang trong trạng thái loading');
        } else {
            console.log('✅ Không có loading state');
        }

        // Test 8: Kiểm tra responsive
        console.log('\n8️⃣ Kiểm tra Responsive:');
        console.log(`📱 Viewport: ${window.innerWidth}x${window.innerHeight}`);
        console.log(`📱 Device: ${window.innerWidth < 768 ? 'Mobile' : window.innerWidth < 1024 ? 'Tablet' : 'Desktop'}`);

        // Test 9: Kiểm tra console errors
        console.log('\n9️⃣ Kiểm tra Console Errors:');
        const originalError = console.error;
        let errorCount = 0;
        
        console.error = function(...args) {
            errorCount++;
            originalError.apply(console, args);
        };
        
        setTimeout(() => {
            console.log(`✅ Tìm thấy ${errorCount} errors trong console`);
            console.error = originalError;
        }, 1000);

    } catch (error) {
        console.log('❌ Lỗi test chi tiết:', error.message);
    }
};

// Function để test click các nút
const testButtonClicks = () => {
    console.log('🖱️ Test Click Buttons...');
    
    // Test click export Excel
    const excelBtn = document.querySelector('.btn-success');
    if (excelBtn) {
        console.log('✅ Tìm thấy nút Export Excel');
        // excelBtn.click(); // Uncomment để test click
    } else {
        console.log('❌ Không tìm thấy nút Export Excel');
    }
    
    // Test click filter
    const filterBtns = document.querySelectorAll('.filter-btn');
    if (filterBtns.length > 0) {
        console.log(`✅ Tìm thấy ${filterBtns.length} nút filter`);
        // filterBtns[0].click(); // Uncomment để test click
    }
};

// Function để test reload data
const testReloadData = async () => {
    console.log('🔄 Test Reload Data...');
    
    try {
        const reloadBtn = document.querySelector('.btn-primary');
        if (reloadBtn) {
            console.log('✅ Tìm thấy nút reload');
            // reloadBtn.click(); // Uncomment để test click
        } else {
            console.log('❌ Không tìm thấy nút reload');
        }
    } catch (error) {
        console.log('❌ Lỗi reload:', error.message);
    }
};

// Chạy test
testDetailedIntegration();

// Export functions
window.testDetailedIntegration = testDetailedIntegration;
window.testButtonClicks = testButtonClicks;
window.testReloadData = testReloadData;
