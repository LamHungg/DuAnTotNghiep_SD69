// Script test gọi API thống kê
// Copy và paste vào Console của browser

const testStatisticsAPI = async () => {
    console.log('🔍 Gọi API Thống Kê...\n');

    try {
        // Test 1: API tổng quan
        console.log('1️⃣ Gọi API tổng quan:');
        const tongQuanResponse = await fetch('http://localhost:8080/zmen/tong-quan');
        if (tongQuanResponse.ok) {
            const tongQuanData = await tongQuanResponse.json();
            console.log('✅ Dữ liệu tổng quan:', tongQuanData);
            
            // Hiển thị KPI
            console.log('\n📊 KPI Tổng Quan:');
            console.log(`💰 Doanh thu hôm nay: ${tongQuanData.doanhThuHomNay?.toLocaleString('vi-VN')} VNĐ`);
            console.log(`💰 Doanh thu tháng này: ${tongQuanData.doanhThuThangNay?.toLocaleString('vi-VN')} VNĐ`);
            console.log(`💰 Doanh thu năm nay: ${tongQuanData.doanhThuNamNay?.toLocaleString('vi-VN')} VNĐ`);
            console.log(`📦 Tổng đơn hàng: ${tongQuanData.tongDonHang}`);
            console.log(`👥 Tổng khách hàng: ${tongQuanData.tongKhachHang}`);
            console.log(`📦 Tổng sản phẩm: ${tongQuanData.tongSanPham}`);
            console.log(`🆕 Khách hàng mới: ${tongQuanData.khachHangMoi}`);
            console.log(`❌ Tỷ lệ hủy: ${tongQuanData.tyLeHuy?.toFixed(2)}%`);
            console.log(`📈 Tăng trưởng tháng: ${tongQuanData.tangTruongThang}%`);
            console.log(`📈 Tăng trưởng năm: ${tongQuanData.tangTruongNam}%`);
            
            // Hiển thị top sản phẩm
            if (tongQuanData.topSanPhamThang && tongQuanData.topSanPhamThang.length > 0) {
                console.log('\n🏆 Top Sản Phẩm Bán Chạy:');
                tongQuanData.topSanPhamThang.forEach((sp, index) => {
                    console.log(`${index + 1}. ${sp.tenSanPham} - ${sp.soLuongBan} sản phẩm - ${sp.doanhThu?.toLocaleString('vi-VN')} VNĐ`);
                });
            } else {
                console.log('\n🏆 Top Sản Phẩm: Không có dữ liệu');
            }
            
            // Hiển thị top khách hàng
            if (tongQuanData.topKhachHangThang && tongQuanData.topKhachHangThang.length > 0) {
                console.log('\n👑 Top Khách Hàng:');
                tongQuanData.topKhachHangThang.forEach((kh, index) => {
                    console.log(`${index + 1}. ${kh.hoTen} - ${kh.soLuongDon} đơn hàng - ${kh.tongChiTieu?.toLocaleString('vi-VN')} VNĐ`);
                });
            } else {
                console.log('\n👑 Top Khách Hàng: Không có dữ liệu');
            }
        } else {
            const errorText = await tongQuanResponse.text();
            console.log('❌ Lỗi API tổng quan:', tongQuanResponse.status, errorText);
        }
        
        // Test 2: API biểu đồ doanh thu
        console.log('\n2️⃣ Gọi API biểu đồ doanh thu:');
        const doanhThuResponse = await fetch('http://localhost:8080/zmen/doanh-thu/bieu-do?filterType=thang-nay&year=2025&month=8');
        if (doanhThuResponse.ok) {
            const doanhThuData = await doanhThuResponse.json();
            console.log('✅ Dữ liệu biểu đồ doanh thu:', doanhThuData);
            if (doanhThuData && doanhThuData.length > 0) {
                console.log('\n📈 Mẫu dữ liệu biểu đồ:');
                doanhThuData.slice(0, 3).forEach((item, index) => {
                    console.log(`${index + 1}. ${item.thoiGian || item.ngay}: ${item.doanhThu?.toLocaleString('vi-VN')} VNĐ`);
                });
            }
        } else {
            const errorText = await doanhThuResponse.text();
            console.log('❌ Lỗi API biểu đồ:', doanhThuResponse.status, errorText);
        }
        
        // Test 3: API danh sách đơn hàng
        console.log('\n3️⃣ Gọi API danh sách đơn hàng:');
        const donHangResponse = await fetch('http://localhost:8080/zmen/don-hang/list?filterType=thang-nay&selectedDate=2025-08-27&selectedMonth=8&selectedYear=2025&dateFrom=2025-08-01&dateTo=2025-08-31');
        if (donHangResponse.ok) {
            const donHangData = await donHangResponse.json();
            console.log('✅ Dữ liệu đơn hàng:', donHangData);
            if (donHangData && donHangData.length > 0) {
                console.log('\n📋 Mẫu đơn hàng:');
                donHangData.slice(0, 3).forEach((dh, index) => {
                    console.log(`${index + 1}. ${dh.maDonHang} - ${dh.khachHang} - ${dh.ngayDat} - ${dh.tongTien?.toLocaleString('vi-VN')} VNĐ - ${dh.trangThai}`);
                });
            } else {
                console.log('\n📋 Không có đơn hàng nào');
            }
        } else {
            const errorText = await donHangResponse.text();
            console.log('❌ Lỗi API đơn hàng:', donHangResponse.status, errorText);
        }
        
        // Test 4: API doanh thu theo danh mục
        console.log('\n4️⃣ Gọi API doanh thu theo danh mục:');
        const danhMucResponse = await fetch('http://localhost:8080/zmen/danh-muc/doanh-thu?year=2025&month=8');
        if (danhMucResponse.ok) {
            const danhMucData = await danhMucResponse.json();
            console.log('✅ Dữ liệu doanh thu theo danh mục:', danhMucData);
            if (danhMucData && danhMucData.length > 0) {
                console.log('\n🥧 Mẫu dữ liệu danh mục:');
                danhMucData.slice(0, 3).forEach((dm, index) => {
                    console.log(`${index + 1}. ${dm.tenDanhMuc || dm.danhMuc}: ${dm.doanhThu?.toLocaleString('vi-VN')} VNĐ (${dm.tyLe?.toFixed(2)}%)`);
                });
            }
        } else {
            const errorText = await danhMucResponse.text();
            console.log('❌ Lỗi API danh mục:', danhMucResponse.status, errorText);
        }
        
    } catch (error) {
        console.log('❌ Lỗi kết nối:', error.message);
    }
};

// Chạy test
testStatisticsAPI();
