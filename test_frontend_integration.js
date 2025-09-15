// Script test tích hợp Frontend với API
// Copy và paste vào Console của browser khi đang ở trang Statistics

const testFrontendIntegration = async () => {
  console.log("🔍 Test Tích Hợp Frontend với API...\n");

  try {
    // Test 1: Kiểm tra component Statistics có tồn tại không
    console.log("1️⃣ Kiểm tra component Statistics:");
    const statisticsElement =
      document.querySelector('[data-testid="statistics-page"]') ||
      document.querySelector(".statistics-container") ||
      document.querySelector(".statistics");

    if (statisticsElement) {
      console.log("✅ Component Statistics đã được render");
    } else {
      console.log("❌ Không tìm thấy component Statistics");
    }

    // Test 2: Kiểm tra KPI cards
    console.log("\n2️⃣ Kiểm tra KPI Cards:");
    const kpiCards = document.querySelectorAll(
      '.kpi-card, .stat-card, [class*="card"]'
    );
    console.log(`✅ Tìm thấy ${kpiCards.length} KPI cards`);

    // Test 3: Kiểm tra biểu đồ
    console.log("\n3️⃣ Kiểm tra Biểu Đồ:");
    const charts = document.querySelectorAll(
      '.recharts-wrapper, [class*="chart"], [class*="Chart"]'
    );
    console.log(`✅ Tìm thấy ${charts.length} biểu đồ`);

    // Test 4: Kiểm tra bảng dữ liệu
    console.log("\n4️⃣ Kiểm tra Bảng Dữ Liệu:");
    const tables = document.querySelectorAll('table, [class*="table"]');
    console.log(`✅ Tìm thấy ${tables.length} bảng dữ liệu`);

    // Test 5: Gọi API và cập nhật dữ liệu
    console.log("\n5️⃣ Gọi API và cập nhật dữ liệu:");
    const apiResponse = await fetch("http://localhost:8080/zmen/tong-quan");
    if (apiResponse.ok) {
      const apiData = await apiResponse.json();
      console.log("✅ API trả về dữ liệu:", apiData);

      // Kiểm tra xem dữ liệu có được hiển thị trên giao diện không
      const doanhThuElements = document.querySelectorAll(
        '[class*="doanh-thu"], [class*="revenue"]'
      );
      console.log(
        `✅ Tìm thấy ${doanhThuElements.length} elements hiển thị doanh thu`
      );

      // Kiểm tra loading state
      const loadingElements = document.querySelectorAll(
        '[class*="loading"], [class*="spinner"]'
      );
      if (loadingElements.length > 0) {
        console.log("⏳ Đang trong trạng thái loading");
      } else {
        console.log("✅ Không có loading state");
      }
    } else {
      console.log("❌ API không trả về dữ liệu");
    }

    // Test 6: Kiểm tra các nút chức năng
    console.log("\n6️⃣ Kiểm tra các nút chức năng:");
    const exportButtons = document.querySelectorAll(
      'button[class*="export"], [class*="download"]'
    );
    console.log(`✅ Tìm thấy ${exportButtons.length} nút export`);

    const filterButtons = document.querySelectorAll(
      'button[class*="filter"], [class*="date"]'
    );
    console.log(`✅ Tìm thấy ${filterButtons.length} nút filter`);

    // Test 7: Kiểm tra responsive
    console.log("\n7️⃣ Kiểm tra Responsive:");
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    const isDesktop = window.innerWidth >= 1024;

    console.log(`📱 Viewport: ${window.innerWidth}x${window.innerHeight}`);
    console.log(
      `📱 Device: ${isMobile ? "Mobile" : isTablet ? "Tablet" : "Desktop"}`
    );

    // Test 8: Kiểm tra console errors
    console.log("\n8️⃣ Kiểm tra Console Errors:");
    const originalError = console.error;
    let errorCount = 0;

    console.error = function (...args) {
      errorCount++;
      originalError.apply(console, args);
    };

    // Trigger một số actions để kiểm tra errors
    setTimeout(() => {
      console.log(`✅ Tìm thấy ${errorCount} errors trong console`);
      console.error = originalError; // Restore original
    }, 1000);
  } catch (error) {
    console.log("❌ Lỗi test tích hợp:", error.message);
  }
};

// Chạy test
testFrontendIntegration();

// Thêm function để trigger reload data
const reloadStatisticsData = async () => {
  console.log("🔄 Reload dữ liệu thống kê...");

  try {
    // Gọi API tổng quan
    const response = await fetch("http://localhost:8080/zmen/tong-quan");
    if (response.ok) {
      const data = await response.json();
      console.log("✅ Dữ liệu mới:", data);

      // Trigger reload trên component (nếu có)
      const reloadButton = document.querySelector(
        '[class*="reload"], [class*="refresh"]'
      );
      if (reloadButton) {
        reloadButton.click();
        console.log("✅ Đã click nút reload");
      } else {
        console.log("⚠️ Không tìm thấy nút reload, thử reload page");
        window.location.reload();
      }
    }
  } catch (error) {
    console.log("❌ Lỗi reload:", error.message);
  }
};

// Thêm function để test export
const testExport = async () => {
  console.log("📤 Test Export...");

  try {
    // Test export Excel
    const excelResponse = await fetch(
      "http://localhost:8080/zmen/export/thong-ke-excel",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filterType: "thang-nay",
          year: 2025,
          month: 8,
        }),
      }
    );

    if (excelResponse.ok) {
      console.log("✅ Export Excel thành công");
    } else {
      console.log("❌ Export Excel thất bại");
    }
  } catch (error) {
    console.log("❌ Lỗi export:", error.message);
  }
};

// Export các functions để sử dụng
window.testStatisticsIntegration = testFrontendIntegration;
window.reloadStatisticsData = reloadStatisticsData;
window.testExport = testExport;
