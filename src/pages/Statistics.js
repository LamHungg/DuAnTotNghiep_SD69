import React, { useEffect, useState } from "react";
import {
  FaWallet,
  FaChartLine,
  FaPiggyBank,
  FaDownload,
  FaSync,
  FaCalendarAlt,
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
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
} from "recharts";
import thongKeService from "../services/thongKeService";
import Toast from "../components/Toast";
import "./Statistics.css";

const Statistics = () => {
  // Filter state
  const [filterType, setFilterType] = useState("ngay");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [dateFrom, setDateFrom] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [dateTo, setDateTo] = useState(new Date().toISOString().split("T")[0]);

  // Data state
  const [doanhThu, setDoanhThu] = useState(null);
  const [sanPhamBanChay, setSanPhamBanChay] = useState([]);
  const [hieuSuatNV, setHieuSuatNV] = useState([]);
  const [khachHangChiTieu, setKhachHangChiTieu] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    type: "info",
    message: "",
  });

  // Chart data state
  const [lineData, setLineData] = useState([]);
  const [radarData, setRadarData] = useState([]);
  const [activityData, setActivityData] = useState([]);
  const [yearlyExpenseData, setYearlyExpenseData] = useState([]);

  // KPI cards
  const kpiData = [
    {
      title: "Trạng thái số dư",
      value: doanhThu ? doanhThu.tongDoanhThu : 0,
      icon: <FaWallet className="kpi-icon" />,
      percent: 85,
      desc: doanhThu ? doanhThu.moTa : "",
      color: "#4f8cff",
    },
    {
      title: "Doanh thu",
      value: doanhThu ? doanhThu.tongDoanhThu : 0,
      icon: <FaChartLine className="kpi-icon" />,
      percent: 75,
      desc: "Tổng doanh thu",
      color: "#00c49f",
    },
    {
      title: "Tiết kiệm/Lợi nhuận",
      value: doanhThu ? Math.round(doanhThu.tongDoanhThu * 0.35) : 0,
      icon: <FaPiggyBank className="kpi-icon" />,
      percent: 60,
      desc: "Ước tính lợi nhuận",
      color: "#ffbb28",
    },
  ];

  // Load data khi filter thay đổi
  useEffect(() => {
    loadData();
    // eslint-disable-next-line
  }, [filterType, selectedDate, selectedMonth, selectedYear, dateFrom, dateTo]);

  const loadData = async () => {
    setLoading(true);
    try {
      let promises = [];
      switch (filterType) {
        case "ngay":
          promises = [
            thongKeService.getDoanhThuTheoNgay(selectedDate),
            thongKeService.getSanPhamBanChayTheoNgay(selectedDate),
            thongKeService.getHieuSuatNVTheoNgay(selectedDate),
            thongKeService.getKhachHangChiTieuTheoNgay(selectedDate),
          ];
          break;
        case "thang":
          promises = [
            thongKeService.getDoanhThuTheoThang(selectedMonth, selectedYear),
            thongKeService.getSanPhamBanChayTheoThang(
              selectedMonth,
              selectedYear
            ),
            thongKeService.getHieuSuatNVTheoThang(selectedMonth, selectedYear),
            thongKeService.getKhachHangChiTieuTheoThang(
              selectedMonth,
              selectedYear
            ),
          ];
          break;
        case "nam":
          promises = [
            thongKeService.getDoanhThuTheoNam(selectedYear),
            thongKeService.getSanPhamBanChayTheoNam(selectedYear),
            thongKeService.getHieuSuatNVTheoNam(selectedYear),
            thongKeService.getKhachHangChiTieuTheoNam(selectedYear),
          ];
          break;
        case "khoang-ngay":
          promises = [
            thongKeService.getDoanhThuKhoangNgay(dateFrom, dateTo),
            thongKeService.getSanPhamBanChayKhoangNgay(dateFrom, dateTo),
            thongKeService.getHieuSuatNVKhoangNgay(dateFrom, dateTo),
            thongKeService.getKhachHangChiTieuKhoangNgay(dateFrom, dateTo),
          ];
          break;
        default:
          break;
      }
      const [doanhThuData, sanPhamData, hieuSuatData, khachHangData] =
        await Promise.all(promises);
      setDoanhThu(doanhThuData);
      setSanPhamBanChay(sanPhamData || []);
      setHieuSuatNV(hieuSuatData || []);
      setKhachHangChiTieu(khachHangData || []);

      // Chuẩn hóa dữ liệu cho biểu đồ
      setLineData(genLineData(sanPhamData));
      setRadarData(genRadarData(doanhThuData, hieuSuatData, khachHangData));
      setActivityData(genActivityData(sanPhamData));
      setYearlyExpenseData(genYearlyExpenseData(doanhThuData));
    } catch (error) {
      setToast({
        visible: true,
        type: "error",
        message: "Không thể tải dữ liệu thống kê. Vui lòng thử lại!",
      });
    } finally {
      setLoading(false);
    }
  };

  // Hàm chuẩn hóa dữ liệu cho các biểu đồ
  const genLineData = (sanPhamData) => {
    // Giả sử sanPhamData là mảng các sản phẩm bán chạy theo tháng
    // Có thể custom lại nếu backend trả về khác
    if (!sanPhamData || sanPhamData.length === 0) return [];
    // Demo: mỗi sản phẩm là 1 tháng
    return sanPhamData.map((sp, idx) => ({
      month: `T${idx + 1}`,
      income: sp.soLuongBan * 100, // demo
      earning: sp.soLuongBan * 80, // demo
    }));
  };
  const genRadarData = (doanhThuData, hieuSuatData, khachHangData) => {
    return [
      {
        subject: "Doanh thu",
        A: doanhThuData?.tongDoanhThu || 0,
        B: doanhThuData?.tongDoanhThu ? doanhThuData.tongDoanhThu * 0.8 : 0,
        fullMark: doanhThuData?.tongDoanhThu || 100,
      },
      {
        subject: "Đơn hàng",
        A: hieuSuatData?.reduce?.((a, b) => a + (b.soLuongDon || 0), 0) || 0,
        B: 100,
        fullMark: 150,
      },
      {
        subject: "Khách hàng",
        A: khachHangData?.length || 0,
        B: 100,
        fullMark: 150,
      },
      {
        subject: "Lợi nhuận",
        A: doanhThuData?.tongDoanhThu ? doanhThuData.tongDoanhThu * 0.35 : 0,
        B: 100,
        fullMark: 150,
      },
      {
        subject: "Chi phí",
        A: doanhThuData?.tongDoanhThu ? doanhThuData.tongDoanhThu * 0.65 : 0,
        B: 100,
        fullMark: 150,
      },
      { subject: "Tăng trưởng", A: 65, B: 85, fullMark: 150 },
    ];
  };
  const genActivityData = (sanPhamData) => {
    // Demo: lấy 3 sản phẩm gần nhất
    if (!sanPhamData || sanPhamData.length === 0) return [];
    return sanPhamData
      .slice(0, 3)
      .map((sp, idx) => ({ name: sp.tenSanPham, value: sp.soLuongBan }));
  };
  const genYearlyExpenseData = (doanhThuData) => {
    // Demo: tạo dữ liệu giả cho 3 năm
    return [
      {
        year: "2022",
        a: doanhThuData?.tongDoanhThu * 0.7 || 0,
        b: doanhThuData?.tongDoanhThu * 0.8 || 0,
        c: doanhThuData?.tongDoanhThu * 0.9 || 0,
      },
      {
        year: "2023",
        a: doanhThuData?.tongDoanhThu * 0.8 || 0,
        b: doanhThuData?.tongDoanhThu * 0.9 || 0,
        c: doanhThuData?.tongDoanhThu || 0,
      },
      {
        year: "2024",
        a: doanhThuData?.tongDoanhThu || 0,
        b: doanhThuData?.tongDoanhThu * 0.95 || 0,
        c: doanhThuData?.tongDoanhThu * 0.98 || 0,
      },
    ];
  };

  // Export Excel
  const handleExport = async (type) => {
    try {
      let params = {};
      switch (filterType) {
        case "ngay":
          params = { ngay: selectedDate };
          break;
        case "thang":
          params = { thang: selectedMonth, nam: selectedYear };
          break;
        case "nam":
          params = { nam: selectedYear };
          break;
        case "khoang-ngay":
          params = { tuNgay: dateFrom, denNgay: dateTo };
          break;
        default:
          break;
      }
      switch (type) {
        case "doanh-thu":
          await thongKeService.exportDoanhThuExcel(filterType, params);
          break;
        case "san-pham":
          await thongKeService.exportSanPhamBanChayExcel(filterType, params);
          break;
        case "nhan-vien":
          await thongKeService.exportHieuSuatNVExcel(filterType, params);
          break;
        case "khach-hang":
          await thongKeService.exportKhachHangChiTieuExcel(filterType, params);
          break;
        default:
          break;
      }
      setToast({
        visible: true,
        type: "success",
        message: "Xuất Excel thành công!",
      });
    } catch (error) {
      setToast({
        visible: true,
        type: "error",
        message: "Không thể xuất Excel. Vui lòng thử lại!",
      });
    }
  };

  // Format
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0);
  };
  const getFilterDescription = () => {
    switch (filterType) {
      case "ngay":
        return `Ngày ${selectedDate}`;
      case "thang":
        return `Tháng ${selectedMonth}/${selectedYear}`;
      case "nam":
        return `Năm ${selectedYear}`;
      case "khoang-ngay":
        return `Từ ${dateFrom} đến ${dateTo}`;
      default:
        return "";
    }
  };

  return (
    <div className="dashboard-statistics">
      <div className="dashboard-header">Thống kê tổng quan</div>
      {/* Filter Section */}
      <div className="filter-section mb-4">
        <div className="card">
          <div className="card-body">
            <div className="row g-3 align-items-end">
              <div className="col-md-2">
                <label className="form-label fw-semibold">Loại thống kê</label>
                <select
                  className="form-select"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="ngay">Theo ngày</option>
                  <option value="thang">Theo tháng</option>
                  <option value="nam">Theo năm</option>
                  <option value="khoang-ngay">Khoảng ngày</option>
                </select>
              </div>
              {filterType === "ngay" && (
                <div className="col-md-2">
                  <label className="form-label fw-semibold">Chọn ngày</label>
                  <input
                    type="date"
                    className="form-control"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
              )}
              {filterType === "thang" && (
                <>
                  <div className="col-md-2">
                    <label className="form-label fw-semibold">Tháng</label>
                    <select
                      className="form-select"
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(
                        (month) => (
                          <option key={month} value={month}>
                            Tháng {month}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                  <div className="col-md-2">
                    <label className="form-label fw-semibold">Năm</label>
                    <select
                      className="form-select"
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(Number(e.target.value))}
                    >
                      {Array.from(
                        { length: 5 },
                        (_, i) => new Date().getFullYear() - 2 + i
                      ).map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}
              {filterType === "nam" && (
                <div className="col-md-2">
                  <label className="form-label fw-semibold">Năm</label>
                  <select
                    className="form-select"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                  >
                    {Array.from(
                      { length: 5 },
                      (_, i) => new Date().getFullYear() - 2 + i
                    ).map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {filterType === "khoang-ngay" && (
                <>
                  <div className="col-md-2">
                    <label className="form-label fw-semibold">Từ ngày</label>
                    <input
                      type="date"
                      className="form-control"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                    />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label fw-semibold">Đến ngày</label>
                    <input
                      type="date"
                      className="form-control"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                    />
                  </div>
                </>
              )}
              <div className="col-md-2">
                <button
                  className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                  onClick={loadData}
                  disabled={loading}
                >
                  {loading ? (
                    <div
                      className="spinner-border spinner-border-sm"
                      role="status"
                    >
                      <span className="visually-hidden">Đang tải...</span>
                    </div>
                  ) : (
                    <FaSync />
                  )}
                  {loading ? "Đang tải..." : "Tải dữ liệu"}
                </button>
              </div>
            </div>
            {getFilterDescription() && (
              <div className="mt-3">
                <span className="badge bg-info fs-6">
                  <FaCalendarAlt className="me-1" />
                  {getFilterDescription()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="dashboard-kpi-row">
        {kpiData.map((kpi, idx) => (
          <div
            className="dashboard-kpi-card"
            key={idx}
            style={{ borderTop: `4px solid ${kpi.color}` }}
          >
            <div className="dashboard-kpi-title">{kpi.title}</div>
            <div className="dashboard-kpi-value-row">
              <span className="dashboard-kpi-value">
                {formatCurrency(kpi.value)}
              </span>
              <span className="dashboard-kpi-icon" style={{ color: kpi.color }}>
                {kpi.icon}
              </span>
            </div>
            <div className="dashboard-kpi-desc">{kpi.desc}</div>
            <div className="dashboard-kpi-progress">
              <div
                className="dashboard-kpi-progress-bar"
                style={{ width: `${kpi.percent}%`, background: kpi.color }}
              ></div>
            </div>
            <div className="dashboard-kpi-percent">
              <span style={{ color: kpi.color }}>{kpi.percent}%</span> sử dụng
              <span className="text-muted ms-2">
                {100 - kpi.percent}% còn lại
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="dashboard-main-row">
        <div className="dashboard-main-chart">
          <div className="dashboard-chart-title d-flex justify-content-between align-items-center">
            <span>Thống kê</span>
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => handleExport("doanh-thu")}
            >
              {" "}
              <FaDownload className="me-1" /> Xuất Excel{" "}
            </button>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart
              data={lineData}
              margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                contentStyle={{ fontSize: 15 }}
                formatter={(value) => formatCurrency(value)}
                labelFormatter={(label) => `Tháng: ${label}`}
              />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#4f8cff"
                strokeWidth={3}
                dot={{ r: 5 }}
                activeDot={{ r: 8 }}
                name="Doanh thu"
              />
              <Line
                type="monotone"
                dataKey="earning"
                stroke="#00c49f"
                strokeWidth={3}
                dot={{ r: 5 }}
                name="Lợi nhuận"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="dashboard-radar-chart">
          <div className="dashboard-chart-title d-flex justify-content-between align-items-center">
            <span>Hiệu suất</span>
            <button
              className="btn btn-sm btn-outline-info"
              onClick={() => handleExport("nhan-vien")}
            >
              {" "}
              <FaDownload className="me-1" /> Xuất Excel{" "}
            </button>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis />
              <Radar
                name="Chỉ số A"
                dataKey="A"
                stroke="#4f8cff"
                fill="#4f8cff"
                fillOpacity={0.6}
              />
              <Radar
                name="Chỉ số B"
                dataKey="B"
                stroke="#00c49f"
                fill="#00c49f"
                fillOpacity={0.4}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Charts Row */}
      <div className="dashboard-bottom-row">
        <div className="dashboard-activity">
          <div className="dashboard-chart-title d-flex justify-content-between align-items-center">
            <span>Hoạt động</span>
            <button
              className="btn btn-sm btn-outline-success"
              onClick={() => handleExport("san-pham")}
            >
              {" "}
              <FaDownload className="me-1" /> Xuất Excel{" "}
            </button>
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                contentStyle={{ fontSize: 15 }}
                formatter={(value) => `${value} sản phẩm`}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#4f8cff"
                strokeWidth={3}
                dot={{ r: 5 }}
                name="Số lượng bán"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="dashboard-yearly-expense">
          <div className="dashboard-chart-title d-flex justify-content-between align-items-center">
            <span>Chi phí theo năm</span>
            <button
              className="btn btn-sm btn-outline-warning"
              onClick={() => handleExport("khach-hang")}
            >
              {" "}
              <FaDownload className="me-1" /> Xuất Excel{" "}
            </button>
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={yearlyExpenseData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip
                contentStyle={{ fontSize: 15 }}
                formatter={(value) => formatCurrency(value)}
              />
              <Bar dataKey="a" fill="#4f8cff" name="Năm 1" />
              <Bar dataKey="b" fill="#00c49f" name="Năm 2" />
              <Bar dataKey="c" fill="#ffbb28" name="Năm 3" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Toast */}
      {toast.visible && (
        <Toast
          type={toast.type}
          message={toast.message}
          visible={toast.visible}
          onClose={() => setToast((t) => ({ ...t, visible: false }))}
        />
      )}
    </div>
  );
};

export default Statistics;
