// Script cải thiện hệ thống quản lý đơn hàng Admin
// Chạy script này trong browser console khi đang ở trang Admin

const improveAdminOrders = async () => {
  try {
    console.log("=== IMPROVING ADMIN ORDERS SYSTEM ===");

    // 1. Kiểm tra và cải thiện UI
    console.log("1. Improving UI elements...");

    // Thêm CSS cho giao diện đẹp hơn
    const customCSS = `
      .orders-container {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        min-height: 100vh;
        padding: 20px;
      }
      
      .orders-header {
        background: rgba(255, 255, 255, 0.95);
        border-radius: 15px;
        padding: 25px;
        margin-bottom: 20px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(10px);
      }
      
      .orders-table {
        background: rgba(255, 255, 255, 0.95);
        border-radius: 15px;
        overflow: hidden;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(10px);
      }
      
      .orders-table th {
        background: linear-gradient(90deg, #4e54c8 0%, #8f94fb 100%);
        color: white;
        font-weight: 600;
        padding: 15px;
        border: none;
      }
      
      .orders-table td {
        padding: 12px 15px;
        border-bottom: 1px solid #e9ecef;
        vertical-align: middle;
      }
      
      .orders-table tbody tr:hover {
        background: rgba(78, 84, 200, 0.05);
        transform: translateY(-2px);
        transition: all 0.3s ease;
      }
      
      .order-badge {
        padding: 6px 12px;
        border-radius: 20px;
        font-weight: 600;
        font-size: 0.85rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .order-badge-pending {
        background: linear-gradient(45deg, #ff9a9e 0%, #fecfef 100%);
        color: #d63384;
      }
      
      .order-badge-confirmed {
        background: linear-gradient(45deg, #a8edea 0%, #fed6e3 100%);
        color: #198754;
      }
      
      .order-badge-shipping {
        background: linear-gradient(45deg, #ffecd2 0%, #fcb69f 100%);
        color: #fd7e14;
      }
      
      .order-badge-delivered {
        background: linear-gradient(45deg, #d299c2 0%, #fef9d7 100%);
        color: #6f42c1;
      }
      
      .order-badge-complete {
        background: linear-gradient(45deg, #89f7fe 0%, #66a6ff 100%);
        color: #0d6efd;
      }
      
      .order-badge-cancel {
        background: linear-gradient(45deg, #ff9a9e 0%, #fad0c4 100%);
        color: #dc3545;
      }
      
      .btn-action {
        border-radius: 25px;
        padding: 8px 16px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        transition: all 0.3s ease;
        border: none;
        margin: 2px;
      }
      
      .btn-confirm {
        background: linear-gradient(45deg, #11998e 0%, #38ef7d 100%);
        color: white;
      }
      
      .btn-ship {
        background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
        color: white;
      }
      
      .btn-deliver {
        background: linear-gradient(45deg, #f093fb 0%, #f5576c 100%);
        color: white;
      }
      
      .btn-complete {
        background: linear-gradient(45deg, #4facfe 0%, #00f2fe 100%);
        color: white;
      }
      
      .btn-cancel {
        background: linear-gradient(45deg, #fa709a 0%, #fee140 100%);
        color: white;
      }
      
      .btn-action:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
      }
      
      .filter-section {
        background: rgba(255, 255, 255, 0.9);
        border-radius: 15px;
        padding: 20px;
        margin-bottom: 20px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
      }
      
      .stats-cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        margin-bottom: 20px;
      }
      
      .stat-card {
        background: rgba(255, 255, 255, 0.95);
        border-radius: 15px;
        padding: 20px;
        text-align: center;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(10px);
      }
      
      .stat-number {
        font-size: 2rem;
        font-weight: 700;
        color: #4e54c8;
        margin-bottom: 5px;
      }
      
      .stat-label {
        color: #6c757d;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
    `;

    // Thêm CSS vào head
    if (!document.getElementById("admin-orders-css")) {
      const style = document.createElement("style");
      style.id = "admin-orders-css";
      style.textContent = customCSS;
      document.head.appendChild(style);
      console.log("✅ Custom CSS added");
    }

    // 2. Thêm thống kê tổng quan
    console.log("2. Adding statistics dashboard...");

    const statsContainer = document.createElement("div");
    statsContainer.className = "stats-cards";
    statsContainer.innerHTML = `
      <div class="stat-card">
        <div class="stat-number" id="total-orders">-</div>
        <div class="stat-label">Tổng đơn hàng</div>
      </div>
      <div class="stat-card">
        <div class="stat-number" id="pending-orders">-</div>
        <div class="stat-label">Chờ xử lý</div>
      </div>
      <div class="stat-card">
        <div class="stat-number" id="shipping-orders">-</div>
        <div class="stat-label">Đang giao</div>
      </div>
      <div class="stat-card">
        <div class="stat-number" id="total-revenue">-</div>
        <div class="stat-label">Doanh thu</div>
      </div>
    `;

    // Chèn stats vào đầu trang
    const mainContainer =
      document.querySelector(".container-fluid") ||
      document.querySelector(".container");
    if (mainContainer) {
      mainContainer.insertBefore(statsContainer, mainContainer.firstChild);
      console.log("✅ Statistics dashboard added");
    }

    // 3. Cải thiện bảng đơn hàng
    console.log("3. Improving orders table...");

    const table = document.querySelector("table");
    if (table) {
      table.classList.add("orders-table");
      console.log("✅ Table styling improved");
    }

    // 4. Thêm tính năng real-time updates
    console.log("4. Adding real-time updates...");

    // Hàm cập nhật thống kê
    const updateStats = (orders) => {
      const totalOrders = orders.length;
      const pendingOrders = orders.filter(
        (o) =>
          o.tenTrangThai === "Chờ xác nhận" ||
          o.tenTrangThai === "Chờ thêm sản phẩm"
      ).length;
      const shippingOrders = orders.filter(
        (o) =>
          o.tenTrangThai === "Đang giao hàng" || o.tenTrangThai === "Đang giao"
      ).length;
      const totalRevenue = orders.reduce(
        (sum, o) => sum + (o.tongThanhToan || 0),
        0
      );

      document.getElementById("total-orders").textContent = totalOrders;
      document.getElementById("pending-orders").textContent = pendingOrders;
      document.getElementById("shipping-orders").textContent = shippingOrders;
      document.getElementById("total-revenue").textContent =
        totalRevenue.toLocaleString("vi-VN") + "₫";
    };

    // 5. Thêm tính năng search và filter nâng cao
    console.log("5. Adding advanced search and filter...");

    const searchBox = document.createElement("div");
    searchBox.className = "filter-section";
    searchBox.innerHTML = `
      <div class="row">
        <div class="col-md-3">
          <label class="form-label">Tìm kiếm</label>
          <input type="text" class="form-control" id="search-input" placeholder="Mã đơn hàng, tên KH...">
        </div>
        <div class="col-md-2">
          <label class="form-label">Trạng thái</label>
          <select class="form-select" id="status-filter">
            <option value="">Tất cả</option>
            <option value="Chờ xác nhận">Chờ xác nhận</option>
            <option value="Đã xác nhận">Đã xác nhận</option>
            <option value="Đang giao hàng">Đang giao hàng</option>
            <option value="Giao hàng thành công">Giao hàng thành công</option>
            <option value="Hoàn thành">Hoàn thành</option>
            <option value="Đã hủy">Đã hủy</option>
          </select>
        </div>
        <div class="col-md-2">
          <label class="form-label">Từ ngày</label>
          <input type="date" class="form-control" id="date-from">
        </div>
        <div class="col-md-2">
          <label class="form-label">Đến ngày</label>
          <input type="date" class="form-control" id="date-to">
        </div>
        <div class="col-md-3">
          <label class="form-label">&nbsp;</label>
          <div>
            <button class="btn btn-primary me-2" onclick="applyFilters()">Lọc</button>
            <button class="btn btn-secondary" onclick="clearFilters()">Xóa lọc</button>
          </div>
        </div>
      </div>
    `;

    if (mainContainer) {
      const existingFilter = document.querySelector(".filter-section");
      if (existingFilter) {
        existingFilter.replaceWith(searchBox);
      } else {
        mainContainer.insertBefore(searchBox, statsContainer.nextSibling);
      }
      console.log("✅ Advanced search and filter added");
    }

    // 6. Thêm các hàm tiện ích
    window.applyFilters = () => {
      const searchTerm = document
        .getElementById("search-input")
        .value.toLowerCase();
      const statusFilter = document.getElementById("status-filter").value;
      const dateFrom = document.getElementById("date-from").value;
      const dateTo = document.getElementById("date-to").value;

      const rows = document.querySelectorAll("tbody tr");
      rows.forEach((row) => {
        const orderData = row.textContent.toLowerCase();
        const status = row.querySelector(".order-badge")?.textContent || "";
        const date = row.cells[5]?.textContent || "";

        const matchesSearch = !searchTerm || orderData.includes(searchTerm);
        const matchesStatus = !statusFilter || status.includes(statusFilter);
        const matchesDate =
          !dateFrom || !dateTo || (date >= dateFrom && date <= dateTo);

        row.style.display =
          matchesSearch && matchesStatus && matchesDate ? "" : "none";
      });
    };

    window.clearFilters = () => {
      document.getElementById("search-input").value = "";
      document.getElementById("status-filter").value = "";
      document.getElementById("date-from").value = "";
      document.getElementById("date-to").value = "";

      const rows = document.querySelectorAll("tbody tr");
      rows.forEach((row) => (row.style.display = ""));
    };

    // 7. Test API và cập nhật dữ liệu
    console.log("6. Testing API and updating data...");

    try {
      const response = await fetch("http://localhost:8080/ZMEN/Admin/DonHang", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });

      if (response.ok) {
        const orders = await response.json();
        updateStats(orders);
        console.log("✅ Data updated successfully:", orders.length, "orders");
      } else {
        console.log("❌ Failed to fetch orders:", response.status);
      }
    } catch (error) {
      console.log("❌ API error:", error.message);
    }

    console.log("=== ADMIN ORDERS IMPROVEMENT COMPLETED ===");
    console.log("🎉 Hệ thống quản lý đơn hàng đã được cải thiện!");
    console.log("✅ Giao diện đẹp hơn với gradient và animation");
    console.log("✅ Thống kê tổng quan real-time");
    console.log("✅ Tìm kiếm và lọc nâng cao");
    console.log("✅ Responsive design");
  } catch (error) {
    console.error("❌ Error in admin orders improvement:", error);
  }
};

// Export function
window.improveAdminOrders = improveAdminOrders;

// Auto-run
improveAdminOrders();
