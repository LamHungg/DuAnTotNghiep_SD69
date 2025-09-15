    // Script kiểm tra và phân tích dữ liệu đơn hàng
    // Chạy script này trong browser console khi đang ở trang Admin

    const checkOrdersData = async () => {
    try {
        console.log("=== CHECKING ORDERS DATA ===");

        // 1. Lấy dữ liệu đơn hàng
        console.log("1. Fetching orders data...");

        const response = await fetch("http://localhost:8080/ZMEN/Admin/DonHang", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        });

        if (!response.ok) {
        console.log("❌ Failed to fetch orders:", response.status);
        return;
        }

        const orders = await response.json();
        console.log("✅ Fetched", orders.length, "orders");

        // 2. Phân tích dữ liệu
        console.log("2. Analyzing orders data...");

        // Kiểm tra cấu trúc dữ liệu
        const dataIssues = [];
        const validOrders = [];

        orders.forEach((order, index) => {
        const issues = [];

        // Kiểm tra các trường bắt buộc
        if (!order.id) issues.push("Missing ID");
        if (!order.maDonHang) issues.push("Missing maDonHang");
        if (!order.tenKhachHang) issues.push("Missing tenKhachHang");
        if (!order.tenTrangThai) issues.push("Missing tenTrangThai");
        if (!order.ngayDat) issues.push("Missing ngayDat");
        if (!order.tongTienHang) issues.push("Missing tongTienHang");
        if (!order.tongThanhToan) issues.push("Missing tongThanhToan");

        if (issues.length > 0) {
            dataIssues.push({
            orderIndex: index,
            orderId: order.id,
            issues: issues,
            });
        } else {
            validOrders.push(order);
        }
        });

        // 3. Báo cáo kết quả
        console.log("3. Data analysis results:");

        if (dataIssues.length > 0) {
        console.log("❌ Found", dataIssues.length, "orders with data issues:");
        dataIssues.forEach((issue) => {
            console.log(
            `   Order ${issue.orderIndex} (ID: ${issue.orderId}):`,
            issue.issues.join(", ")
            );
        });
        } else {
        console.log("✅ All orders have valid data structure");
        }

        console.log("✅ Valid orders:", validOrders.length);
        console.log("❌ Orders with issues:", dataIssues.length);

        // 4. Thống kê chi tiết
        console.log("4. Detailed statistics:");

        if (validOrders.length > 0) {
        // Thống kê theo trạng thái
        const statusStats = {};
        validOrders.forEach((order) => {
            const status = order.tenTrangThai || "Unknown";
            statusStats[status] = (statusStats[status] || 0) + 1;
        });

        console.log("✅ Status distribution:", statusStats);

        // Thống kê theo khách hàng
        const customerStats = {};
        validOrders.forEach((order) => {
            const customer = order.tenKhachHang || "Unknown";
            customerStats[customer] = (customerStats[customer] || 0) + 1;
        });

        console.log("✅ Customer distribution:", customerStats);

        // Thống kê doanh thu
        const totalRevenue = validOrders.reduce(
            (sum, order) => sum + (order.tongThanhToan || 0),
            0
        );
        const avgOrderValue = totalRevenue / validOrders.length;

        console.log("✅ Revenue statistics:");
        console.log(
            "   - Total revenue:",
            totalRevenue.toLocaleString("vi-VN"),
            "VND"
        );
        console.log(
            "   - Average order value:",
            avgOrderValue.toLocaleString("vi-VN"),
            "VND"
        );
        console.log("   - Total orders:", validOrders.length);

        // Thống kê theo thời gian
        const dateStats = {};
        validOrders.forEach((order) => {
            if (order.ngayDat) {
            const date = new Date(order.ngayDat).toLocaleDateString("vi-VN");
            dateStats[date] = (dateStats[date] || 0) + 1;
            }
        });

        console.log("✅ Date distribution:", dateStats);
        } else {
        console.log("⚠️ No valid orders to analyze");
        }

        // 5. Đề xuất cải thiện
        console.log("5. Improvement suggestions:");

        if (dataIssues.length > 0) {
        console.log("🔧 Data quality improvements needed:");
        console.log("   - Fix missing required fields");
        console.log("   - Validate data before saving");
        console.log("   - Add data validation in backend");
        }

        if (validOrders.length > 0) {
        console.log("📊 Analytics opportunities:");
        console.log("   - Track order completion rate");
        console.log("   - Monitor customer behavior");
        console.log("   - Analyze revenue trends");
        console.log("   - Identify popular products");
        }

        // 6. Tạo báo cáo tóm tắt
        console.log("6. Summary report:");
        console.log("📋 ORDERS DATA REPORT");
        console.log("=====================");
        console.log(`Total orders: ${orders.length}`);
        console.log(`Valid orders: ${validOrders.length}`);
        console.log(`Orders with issues: ${dataIssues.length}`);
        console.log(
        `Data quality: ${((validOrders.length / orders.length) * 100).toFixed(
            1
        )}%`
        );

        if (validOrders.length > 0) {
        const totalRevenue = validOrders.reduce(
            (sum, order) => sum + (order.tongThanhToan || 0),
            0
        );
        console.log(`Total revenue: ${totalRevenue.toLocaleString("vi-VN")} VND`);
        console.log(
            `Average order: ${(totalRevenue / validOrders.length).toLocaleString(
            "vi-VN"
            )} VND`
        );
        }

        console.log("=====================");

        // 7. Export data for further analysis
        window.ordersData = {
        allOrders: orders,
        validOrders: validOrders,
        dataIssues: dataIssues,
        summary: {
            total: orders.length,
            valid: validOrders.length,
            issues: dataIssues.length,
            quality:
            orders.length > 0
                ? ((validOrders.length / orders.length) * 100).toFixed(1)
                : 0,
        },
        };

        console.log("✅ Data exported to window.ordersData for further analysis");

        console.log("=== ORDERS DATA CHECK COMPLETED ===");
    } catch (error) {
        console.error("❌ Error in orders data check:", error);
    }
    };

    // Export function
    window.checkOrdersData = checkOrdersData;

    // Auto-run
    checkOrdersData();
