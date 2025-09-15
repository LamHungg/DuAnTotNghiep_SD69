import React, { useEffect, useState } from "react";
import {
  FaWallet,
  FaChartLine,
  FaShoppingCart,
  FaUsers,
  FaDownload,
  FaFilePdf,
  FaSync,
  FaCalendarAlt,
  FaFilter,
  FaSearch,
  FaArrowUp,
  FaArrowDown,
  FaTimes,
  FaEye,
  FaPrint,
} from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ComposedChart,
} from "recharts";
import thongKeService from "../services/thongKeService";
import Toast from "../components/Toast";
import "./Statistics.css";

const Statistics = () => {
  // Filter state
  const [filterType, setFilterType] = useState("hom-nay");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [dateFrom, setDateFrom] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [dateTo, setDateTo] = useState(new Date().toISOString().split("T")[0]);
  const [showCustomRange, setShowCustomRange] = useState(false);

  // Data state
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    type: "info",
    message: "",
  });

  // KPI Data
  const [kpiData, setKpiData] = useState({
    doanhThuHomNay: 0,
    doanhThuThangNay: 0,
    tongDonHang: 0,
    khachHangMoi: 0,
    tyLeHuy: 0,
    tangTruong: 0,
  });

  // Chart Data
  const [doanhThuChart, setDoanhThuChart] = useState([]);
  const [doanhThuTheoDanhMuc, setDoanhThuTheoDanhMuc] = useState([]);
  const [topSanPham, setTopSanPham] = useState([]);
  const [topKhachHang, setTopKhachHang] = useState([]);
  // const [donHangList, setDonHangList] = useState([]); // Đã ẩn phần danh sách đơn hàng

  // Table states - Đã ẩn phần đơn hàng
  // const [searchTerm, setSearchTerm] = useState("");
  // const [currentPage, setCurrentPage] = useState(1);
  // const [itemsPerPage] = useState(10);
  // const [sortField, setSortField] = useState("ngayDat");
  // const [sortDirection, setSortDirection] = useState("desc");

  // Colors for charts
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
  ];

  // Load data when component mounts and filters change
  useEffect(() => {
    loadAllData();
  }, [filterType, selectedDate, selectedMonth, selectedYear, dateFrom, dateTo]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([loadKPIData(), loadChartData(), loadTableData()]);
    } catch (error) {
      console.error("Error loading data:", error);
      setToast({
        visible: true,
        type: "error",
        message: "Không thể tải dữ liệu thống kê. Vui lòng thử lại!",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadKPIData = async () => {
    try {
      const data = await thongKeService.getThongKeTongQuan();
      setKpiData({
        doanhThuHomNay: data?.doanhThuHomNay || 0,
        doanhThuThangNay: data?.doanhThuThangNay || 0,
        tongDonHang: data?.tongDonHang || 0,
        khachHangMoi: data?.khachHangMoi || 0,
        tyLeHuy: data?.tyLeHuy || 0,
        tangTruong: data?.tangTruongThang || 0,
      });
    } catch (error) {
      console.error("Error loading KPI data:", error);
      setKpiData({
        doanhThuHomNay: 0,
        doanhThuThangNay: 0,
        tongDonHang: 0,
        khachHangMoi: 0,
        tyLeHuy: 0,
        tangTruong: 0,
      });
    }
  };

  const loadChartData = async () => {
    try {
      // Load doanh thu chart data
      const doanhThuData = await thongKeService.getBieuDoDoanhThu(
        filterType,
        selectedYear,
        selectedMonth
      );
      setDoanhThuChart(doanhThuData || []);

      // Load doanh thu theo danh mục
      const danhMucData = await thongKeService.getDoanhThuTheoDanhMuc(
        selectedYear,
        selectedMonth
      );
      setDoanhThuTheoDanhMuc(danhMucData || []);
    } catch (error) {
      console.error("Error loading chart data:", error);
      setDoanhThuChart([]);
      setDoanhThuTheoDanhMuc([]);
    }
  };

  const loadTableData = async () => {
    try {
      console.log('🔄 Loading table data with filterType:', filterType);
      
      // Load top sản phẩm theo filter type
      let sanPhamData = [];
      if (filterType === 'hom-nay') {
        console.log('📅 Loading top sản phẩm theo ngày:', selectedDate);
        sanPhamData = await thongKeService.getSanPhamBanChayTheoNgay(selectedDate);
      } else if (filterType === 'thang-nay') {
        console.log('📅 Loading top sản phẩm theo tháng:', selectedMonth, selectedYear);
        sanPhamData = await thongKeService.getSanPhamBanChayTheoThang(selectedMonth, selectedYear);
      } else if (filterType === 'nam-nay') {
        console.log('📅 Loading top sản phẩm theo năm:', selectedYear);
        sanPhamData = await thongKeService.getSanPhamBanChayTheoNam(selectedYear);
      } else if (filterType === 'khoang-ngay') {
        console.log('📅 Loading top sản phẩm theo khoảng ngày:', dateFrom, dateTo);
        sanPhamData = await thongKeService.getSanPhamBanChayKhoangNgay(dateFrom, dateTo);
      }
      console.log('✅ Top sản phẩm data:', sanPhamData);
      setTopSanPham(sanPhamData || []);

      // Load top khách hàng theo filter type
      let khachHangData = [];
      if (filterType === 'hom-nay') {
        console.log('📅 Loading top khách hàng theo ngày:', selectedDate);
        khachHangData = await thongKeService.getKhachHangChiTieuTheoNgay(selectedDate);
      } else if (filterType === 'thang-nay') {
        console.log('📅 Loading top khách hàng theo tháng:', selectedMonth, selectedYear);
        khachHangData = await thongKeService.getKhachHangChiTieuTheoThang(selectedMonth, selectedYear);
      } else if (filterType === 'nam-nay') {
        console.log('📅 Loading top khách hàng theo năm:', selectedYear);
        khachHangData = await thongKeService.getKhachHangChiTieuTheoNam(selectedYear);
      } else if (filterType === 'khoang-ngay') {
        console.log('📅 Loading top khách hàng theo khoảng ngày:', dateFrom, dateTo);
        khachHangData = await thongKeService.getKhachHangChiTieuKhoangNgay(dateFrom, dateTo);
      }
      console.log('✅ Top khách hàng data:', khachHangData);
      setTopKhachHang(khachHangData || []);

      // Load danh sách đơn hàng - Đã ẩn
      // const donHangData = await thongKeService.getDonHangList(
      //   filterType,
      //   selectedDate,
      //   selectedMonth,
      //   selectedYear,
      //   dateFrom,
      //   dateTo
      // );
      // setDonHangList(donHangData || []);
    } catch (error) {
      console.error("Error loading table data:", error);
      setTopSanPham([]);
      setTopKhachHang([]);
      // setDonHangList([]); // Đã ẩn phần danh sách đơn hàng
    }
  };

  // Format functions
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat("vi-VN").format(value);
  };

  const formatPercentage = (value) => {
    return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  // Export functions
  const handleExportExcel = async () => {
    try {
      setToast({
        visible: true,
        type: "info",
        message: "Đang xuất file Excel...",
      });

      const data = await thongKeService.exportThongKeExcel({
        filterType,
        selectedDate,
        selectedMonth,
        selectedYear,
        dateFrom,
        dateTo,
        kpiData,
        doanhThuChart,
        doanhThuTheoDanhMuc,
        topSanPham,
        topKhachHang,
        // donHangList, // Đã ẩn phần danh sách đơn hàng
      });

      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `thong-ke-${filterType}-${new Date().toISOString().split("T")[0]}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setToast({
        visible: true,
        type: "success",
        message: "Xuất file Excel thành công!",
      });
    } catch (error) {
      console.error("Error exporting Excel:", error);
      setToast({
        visible: true,
        type: "error",
        message: "Lỗi khi xuất file Excel!",
      });
    }
  };

  const handleExportPDF = async () => {
    try {
      setToast({
        visible: true,
        type: "info",
        message: "Đang xuất file PDF...",
      });

      const data = await thongKeService.exportThongKePDF({
        filterType,
        selectedDate,
        selectedMonth,
        selectedYear,
        dateFrom,
        dateTo,
        kpiData,
        doanhThuChart,
        doanhThuTheoDanhMuc,
        topSanPham,
        topKhachHang,
        // donHangList, // Đã ẩn phần danh sách đơn hàng
      });

      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `bao-cao-thong-ke-${filterType}-${
          new Date().toISOString().split("T")[0]
        }.pdf`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setToast({
        visible: true,
        type: "success",
        message: "Xuất file PDF thành công!",
      });
    } catch (error) {
      console.error("Error exporting PDF:", error);
      setToast({
        visible: true,
        type: "error",
        message: "Lỗi khi xuất file PDF!",
      });
    }
  };

  const handleExportTableData = async (type) => {
    try {
      setToast({
        visible: true,
        type: "info",
        message: `Đang xuất file Excel cho ${type}...`,
      });

      const data = await thongKeService.exportThongKeExcel({
        filterType,
        selectedDate,
        selectedMonth,
        selectedYear,
        dateFrom,
        dateTo,
        kpiData,
        doanhThuChart,
        doanhThuTheoDanhMuc,
        topSanPham,
        topKhachHang,
        // donHangList, // Đã ẩn phần danh sách đơn hàng
      });

      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `thong-ke-${type}-${new Date().toISOString().split("T")[0]}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setToast({
        visible: true,
        type: "success",
        message: `Xuất file Excel cho ${type} thành công!`,
      });
    } catch (error) {
      console.error("Error exporting table data:", error);
      setToast({
        visible: true,
        type: "error",
        message: `Lỗi khi xuất file Excel cho ${type}!`,
      });
    }
  };

  // Table sorting and filtering - Đã ẩn phần đơn hàng
  // const handleSort = (field) => {
  //   if (sortField === field) {
  //     setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  //   } else {
  //     setSortField(field);
  //     setSortDirection("asc");
  //   }
  // };

  // const filteredDonHangList = donHangList
  //   .filter(
  //     (donHang) =>
  //       donHang.maDonHang.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       donHang.khachHang.toLowerCase().includes(searchTerm.toLowerCase())
  //   )
  //   .sort((a, b) => {
  //     const aValue = a[sortField];
  //     const bValue = b[sortField];
  //     if (sortDirection === "asc") {
  //       return aValue > bValue ? 1 : -1;
  //     } else {
  //       return aValue < bValue ? 1 : -1;
  //     }
  //   });

  // const paginatedDonHangList = filteredDonHangList.slice(
  //   (currentPage - 1) * itemsPerPage,
  //   currentPage * itemsPerPage
  // );

  // const totalPages = Math.ceil(filteredDonHangList.length / itemsPerPage);

  // KPI Cards Data
  const kpiCards = [
    {
      title: "Doanh thu hôm nay",
      value: kpiData.doanhThuHomNay,
      icon: <FaWallet />,
      change: kpiData.tangTruong,
      desc: "So với hôm qua",
      color: "#4f8cff",
      format: "currency",
    },
    {
      title: "Doanh thu tháng",
      value: kpiData.doanhThuThangNay,
      icon: <FaChartLine />,
      change: kpiData.tangTruong,
      desc: "Tăng trưởng tháng",
      color: "#00c49f",
      format: "currency",
    },
    {
      title: "Tổng đơn hàng",
      value: kpiData.tongDonHang,
      icon: <FaShoppingCart />,
      change: 8.5,
      desc: "Tổng số đơn hàng",
      color: "#ffbb28",
      format: "number",
    },
    {
      title: "Khách hàng mới",
      value: kpiData.khachHangMoi,
      icon: <FaUsers />,
      change: 12.3,
      desc: "Trong tháng này",
      color: "#ff8042",
      format: "number",
    },
  ];

  const handleViewDetails = (chartType, data) => {
    if (data && data.length > 0) {
      // For now, we'll just show a toast. In a real app, you'd navigate to a new page or modal.
      setToast({
        visible: true,
        type: "info",
        message: `Đang mở chi tiết biểu đồ ${chartType}...`,
      });
    } else {
      setToast({
        visible: true,
        type: "warning",
        message: `Không có dữ liệu để hiển thị chi tiết biểu đồ ${chartType}.`,
      });
    }
  };

  return (
    <div className="statistics-container">
      {/* Header Section */}
      <div className="statistics-header">
        <div className="header-left">
          <h1>📊 Thống Kê & Báo Cáo</h1>
          <p className="header-subtitle">
            Dashboard quản lý và theo dõi hiệu suất kinh doanh
          </p>
        </div>
        <div className="header-actions">
          <button
            className="btn btn-success"
            onClick={handleExportExcel}
            disabled={loading}
          >
            <FaDownload /> Xuất Excel
          </button>
          <button
            className="btn btn-danger"
            onClick={handleExportPDF}
            disabled={loading}
          >
            <FaFilePdf /> Xuất PDF
          </button>
          <button
            className="btn btn-primary"
            onClick={loadAllData}
            disabled={loading}
          >
            <FaSync className={loading ? "spinning" : ""} /> Làm mới
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="filter-section">
        <div className="filter-header">
          <h3>
            <FaFilter /> Bộ Lọc Thời Gian
          </h3>
        </div>
        <div className="filter-controls">
          <div className="quick-filters">
            <button
              className={`filter-btn ${
                filterType === "hom-nay" ? "active" : ""
              }`}
              onClick={() => setFilterType("hom-nay")}
            >
              Hôm nay
            </button>
            <button
              className={`filter-btn ${
                filterType === "tuan-nay" ? "active" : ""
              }`}
              onClick={() => setFilterType("tuan-nay")}
            >
              Tuần này
            </button>
            <button
              className={`filter-btn ${
                filterType === "thang-nay" ? "active" : ""
              }`}
              onClick={() => setFilterType("thang-nay")}
            >
              Tháng này
            </button>
            <button
              className={`filter-btn ${
                filterType === "quy-nay" ? "active" : ""
              }`}
              onClick={() => setFilterType("quy-nay")}
            >
              Quý này
            </button>
            <button
              className={`filter-btn ${showCustomRange ? "active" : ""}`}
              onClick={() => setShowCustomRange(!showCustomRange)}
            >
              <FaCalendarAlt /> Tùy chọn
            </button>
          </div>

          {showCustomRange && (
            <div className="custom-range">
              <div className="date-inputs">
                <div className="input-group">
                  <label>Từ ngày:</label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="form-control"
                  />
                </div>
                <div className="input-group">
                  <label>Đến ngày:</label>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="form-control"
                  />
                </div>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => setShowCustomRange(false)}
                >
                  <FaTimes />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* KPI Cards Section */}
      <div className="kpi-section">
        <div className="kpi-grid">
          {kpiCards.map((kpi, index) => (
            <div
              key={index}
              className="kpi-card"
              style={{ borderLeftColor: kpi.color }}
            >
              <div
                className="kpi-icon-wrapper"
                style={{ backgroundColor: kpi.color }}
              >
                {kpi.icon}
              </div>
              <div className="kpi-content">
                <h3 className="kpi-title">{kpi.title}</h3>
                <div className="kpi-value">
                  {kpi.format === "currency"
                    ? formatCurrency(kpi.value)
                    : formatNumber(kpi.value)}
                </div>
                <div className="kpi-change">
                  <span
                    className={`change-indicator ${
                      kpi.change >= 0 ? "positive" : "negative"
                    }`}
                  >
                    {kpi.change >= 0 ? <FaArrowUp /> : <FaArrowDown />}
                    {formatPercentage(Math.abs(kpi.change))}
                  </span>
                  <span className="kpi-desc">{kpi.desc}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        {/* Doanh Thu Chart */}
        <div className="chart-container large">
          <div className="chart-header">
            <h3>📈 Biểu Đồ Doanh Thu</h3>
            <div className="chart-actions">
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() =>
                  handleViewDetails("biểu đồ doanh thu", doanhThuChart)
                }
              >
                <FaEye /> Xem chi tiết
              </button>
            </div>
          </div>
          {doanhThuChart && doanhThuChart.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={doanhThuChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="thoiGian" />
                <YAxis />
                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                  labelFormatter={(label) => `Thời gian: ${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="doanhThu"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="no-data-message">
              <p>📊 Không có dữ liệu doanh thu để hiển thị</p>
            </div>
          )}
        </div>

        {/* Doanh Thu Theo Danh Mục */}
        <div className="chart-container">
          <div className="chart-header">
            <h3>🥧 Doanh Thu Theo Danh Mục</h3>
          </div>
          {doanhThuTheoDanhMuc && doanhThuTheoDanhMuc.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={doanhThuTheoDanhMuc}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ tenDanhMuc, percent }) =>
                    `${tenDanhMuc} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="doanhThu"
                >
                  {doanhThuTheoDanhMuc.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="no-data-message">
              <p>🥧 Không có dữ liệu doanh thu theo danh mục</p>
            </div>
          )}
        </div>
      </div>

      {/* Data Tables Section */}
      <div className="tables-section">
        {/* Top Sản Phẩm Bán Chạy */}
        <div className="table-container">
          <div className="table-header">
            <h3>🏆 Top 10 Sản Phẩm Bán Chạy</h3>
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => handleExportTableData("san-pham")}
              disabled={!topSanPham || topSanPham.length === 0}
            >
              <FaDownload /> Xuất Excel
            </button>
          </div>
          <div className="table-responsive">
            {topSanPham && topSanPham.length > 0 ? (
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Tên Sản Phẩm</th>
                    <th>Số Lượng Bán</th>
                    <th>Doanh Thu</th>
                    <th>Tỷ Lệ</th>
                  </tr>
                </thead>
                <tbody>
                  {topSanPham.slice(0, 10).map((sp, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{sp.tenSanPham || 'N/A'}</td>
                      <td>{formatNumber(sp.soLuongBan || 0)}</td>
                      <td>{formatCurrency(sp.doanhThu || 0)}</td>
                      <td>
                        <div className="progress">
                          <div
                            className="progress-bar"
                            style={{
                              width: `${(
                                ((sp.soLuongBan || 0) / (topSanPham[0]?.soLuongBan || 1)) *
                                100
                              ).toFixed(1)}%`,
                            }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="no-data-message">
                <p>🏆 Không có dữ liệu sản phẩm bán chạy</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Khách Hàng */}
        <div className="table-container">
          <div className="table-header">
            <h3>👥 Top 10 Khách Hàng</h3>
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => handleExportTableData("khach-hang")}
              disabled={!topKhachHang || topKhachHang.length === 0}
            >
              <FaDownload /> Xuất Excel
            </button>
          </div>
          <div className="table-responsive">
            {topKhachHang && topKhachHang.length > 0 ? (
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Họ Tên</th>
                    <th>Số Đơn Hàng</th>
                    <th>Tổng Chi Tiêu</th>
                    <th>Trung Bình/Đơn</th>
                  </tr>
                </thead>
                <tbody>
                  {topKhachHang.slice(0, 10).map((kh, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{kh.hoTen || 'N/A'}</td>
                      <td>{formatNumber(kh.soLuongDon || 0)}</td>
                      <td>{formatCurrency(kh.tongChiTieu || 0)}</td>
                      <td>{formatCurrency(
                        kh.tongChiTieu && kh.soLuongDon
                          ? kh.tongChiTieu / kh.soLuongDon
                          : 0
                      )}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="no-data-message">
                <p>👥 Không có dữ liệu khách hàng</p>
              </div>
            )}
          </div>
        </div>

        {/* Danh Sách Đơn Hàng - Đã ẩn */}
        {/* 
        <div className="table-container full-width">
          <div className="table-header">
            <h3>📋 Danh Sách Đơn Hàng</h3>
            <div className="table-actions">
              <div className="search-box">
                <FaSearch />
                <input
                  type="text"
                  placeholder="Tìm kiếm đơn hàng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-control"
                />
              </div>
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => handleExportTableData("don-hang")}
                disabled={!donHangList || donHangList.length === 0}
              >
                <FaDownload /> Xuất Excel
              </button>
            </div>
          </div>
          <div className="table-responsive">
            {donHangList && donHangList.length > 0 ? (
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th onClick={() => handleSort("maDonHang")}>
                      Mã Đơn Hàng
                      {sortField === "maDonHang" && (
                        <span className="sort-icon">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </th>
                    <th onClick={() => handleSort("khachHang")}>
                      Khách Hàng
                      {sortField === "khachHang" && (
                        <span className="sort-icon">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </th>
                    <th onClick={() => handleSort("ngayDat")}>
                      Ngày Đặt
                      {sortField === "ngayDat" && (
                        <span className="sort-icon">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </th>
                    <th onClick={() => handleSort("tongTien")}>
                      Tổng Tiền
                      {sortField === "tongTien" && (
                        <span className="sort-icon">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </th>
                    <th>Trạng Thái</th>
                    <th>Hành Động</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedDonHangList.map((donHang, index) => (
                    <tr key={index}>
                      <td>{donHang.maDonHang}</td>
                      <td>{donHang.khachHang}</td>
                      <td>{formatDate(donHang.ngayDat)}</td>
                      <td>{formatCurrency(donHang.tongTien)}</td>
                      <td>
                        <span
                          className={`status-badge ${
                            donHang.trangThai === "Đã giao"
                              ? "success"
                              : donHang.trangThai === "Đang xử lý"
                              ? "warning"
                              : "danger"
                          }`}
                        >
                          {donHang.trangThai}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleViewDetails("đơn hàng", donHang)}
                          title="Xem chi tiết đơn hàng"
                        >
                          <FaEye />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="no-data-message">
                <p>📋 Không có dữ liệu đơn hàng</p>
              </div>
            )}
          </div>

          <div className="pagination-container">
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Trước
            </button>
            <span className="page-info">
              Trang {currentPage} / {totalPages}
            </span>
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Sau
            </button>
          </div>
        </div>
        */}
      </div>

      {/* Toast Notification */}
      <Toast
        visible={toast.visible}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ ...toast, visible: false })}
      />
    </div>
  );
};

export default Statistics;
