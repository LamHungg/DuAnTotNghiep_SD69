import React, { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  FaBoxOpen,
  FaTshirt,
  FaUsers,
  FaChartBar,
  FaCog,
  FaThList,
  FaPalette,
  FaRulerCombined,
  FaTint,
  FaHome,
  FaShoppingCart,
  FaUserTie,
  FaSignOutAlt,
  FaRegClock,
  FaGift,
  FaImage,
} from "react-icons/fa";
import Toast from "../components/Toast";
import authService from "../services/authService";

const sidebarMenus = [
  { label: "Trang chủ", icon: <FaHome />, to: "/dashboard" },
  { label: "Thống Kê", icon: <FaChartBar />, to: "/dashboard/stats" },
  { label: "Bán Hàng Tại Quầy", icon: <FaBoxOpen />, to: "/dashboard/pos" },
  {
    label: "Quản Lý Sản Phẩm",
    icon: <FaTshirt />,
    children: [
      { label: "Sản Phẩm", icon: <FaTshirt />, to: "/dashboard/products" },
      { label: "Danh Mục", icon: <FaThList />, to: "/dashboard/categories" },
      { label: "Màu Sắc", icon: <FaPalette />, to: "/dashboard/colors" },
      { label: "Kích Cỡ", icon: <FaRulerCombined />, to: "/dashboard/sizes" },
      { label: "Chất Liệu", icon: <FaTint />, to: "/dashboard/materials" },
    ],
  },
  {
    label: "Quản Lý Đơn Hàng",
    icon: <FaShoppingCart />,
    to: "/dashboard/orders",
  },
  {
    label: "Quản Lý Khách Hàng",
    icon: <FaUsers />,
    to: "/dashboard/customers",
  },
  { label: "Quản Lý Account", icon: <FaUserTie />, to: "/dashboard/accounts" },
  {
    label: "Quản Lý Voucher",
    icon: <FaGift />,
    to: "/dashboard/vouchers",
  },
  { label: "Cài đặt", icon: <FaCog />, to: "/dashboard/settings" },
  { label: "Test Upload", icon: <FaImage />, to: "/test-upload" },
];

function Clock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        background: "#f6f8fa",
        borderRadius: 8,
        padding: "4px 14px",
        fontWeight: 500,
        fontSize: 16,
        color: "#333",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        marginLeft: 18,
      }}
    >
      <FaRegClock style={{ color: "#7c3aed", fontSize: 20 }} />
      {time.toLocaleTimeString()}
    </span>
  );
}

const DashboardLayout = () => {
  const [openMenu, setOpenMenu] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    type: "error",
    message: "",
  });
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = authService.getCurrentUser();
  const isNhanVien =
    currentUser &&
    (currentUser.chucVu === "NHANVIEN" || currentUser.role === "NHANVIEN");

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("isLoggedIn");
    setShowLogoutModal(false);
    setToast({
      visible: true,
      type: "success",
      message: "Đăng xuất thành công!",
    });
    setTimeout(() => {
      setToast((t) => ({ ...t, visible: false }));
      navigate("/login");
    }, 1200);
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <div className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="admin-sidebar-content">
          <div className="admin-logo-container">
            <img src="/logo.png" alt="logo" className="admin-logo" />
          </div>
          <nav className="admin-nav">
            <ul className="admin-nav-list">
              {sidebarMenus.map((item, idx) => {
                const isRestricted =
                  isNhanVien &&
                  (item.label === "Quản Lý Account" ||
                    item.label === "Thống Kê");
                return (
                  <li className="admin-nav-item" key={item.label}>
                    {item.children ? (
                      <>
                        <div
                          className={`admin-nav-link admin-nav-parent ${
                            item.children.some((child) =>
                              location.pathname.startsWith(child.to)
                            )
                              ? "admin-nav-active"
                              : ""
                          }`}
                          onClick={() =>
                            setOpenMenu(
                              openMenu === item.label ? "" : item.label
                            )
                          }
                        >
                          <span className="admin-nav-icon">{item.icon}</span>
                          <span className="admin-nav-label">{item.label}</span>
                          <span className="admin-nav-arrow">
                            {openMenu === item.label ? "▾" : "▸"}
                          </span>
                        </div>
                        {openMenu === item.label && (
                          <ul className="admin-nav-children">
                            {item.children.map((child) => (
                              <li className="admin-nav-item" key={child.label}>
                                <NavLink
                                  to={child.to}
                                  className={({ isActive }) =>
                                    `admin-nav-link admin-nav-child ${
                                      isActive ? "admin-nav-active" : ""
                                    }`
                                  }
                                >
                                  <span className="admin-nav-icon">
                                    {child.icon}
                                  </span>
                                  <span className="admin-nav-label">
                                    {child.label}
                                  </span>
                                </NavLink>
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    ) : isRestricted ? (
                      <div
                        className="admin-nav-link admin-nav-disabled"
                        onClick={() =>
                          setToast({
                            visible: true,
                            type: "error",
                            message: "Bạn không có quyền truy cập",
                          })
                        }
                      >
                        <span className="admin-nav-icon">{item.icon}</span>
                        <span className="admin-nav-label">{item.label}</span>
                      </div>
                    ) : (
                      <NavLink
                        to={item.to}
                        className={({ isActive }) =>
                          `admin-nav-link ${isActive ? "admin-nav-active" : ""}`
                        }
                      >
                        <span className="admin-nav-icon">{item.icon}</span>
                        <span className="admin-nav-label">{item.label}</span>
                      </NavLink>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
      {/* Main Content */}
      <div className="admin-main">
        <nav className="admin-navbar">
          <div className="admin-navbar-content">
            <div className="admin-navbar-left">
              <button
                className="admin-sidebar-toggle"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <span></span>
                <span></span>
                <span></span>
              </button>
              <span className="admin-navbar-brand">
                Admin Dashboard
                <Clock />
              </span>
            </div>
            <div className="admin-navbar-right">
              <button
                onClick={handleLogout}
                className="admin-btn admin-btn-outline admin-btn-danger"
              >
                <FaSignOutAlt />
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>
        </nav>
        <main className="admin-main-content">
          <Outlet />
        </main>
      </div>
      {showLogoutModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.25)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              minWidth: 340,
              boxShadow: "0 8px 32px 0 rgba(31,38,135,0.18)",
              padding: "32px 32px 24px 32px",
              textAlign: "center",
              position: "relative",
            }}
          >
            <div
              style={{
                fontSize: 32,
                color: "#f59e42",
                marginBottom: 12,
              }}
            >
              ⚠️
            </div>
            <div
              style={{
                fontWeight: 600,
                fontSize: 20,
                marginBottom: 8,
              }}
            >
              Xác nhận đăng xuất
            </div>
            <div
              style={{
                color: "#444",
                marginBottom: 24,
              }}
            >
              Bạn có chắc chắn muốn đăng xuất?
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 16,
              }}
            >
              <button
                className="btn btn-secondary"
                style={{
                  borderRadius: 8,
                  minWidth: 90,
                  fontWeight: 500,
                  background: "#f5f5f5",
                  color: "#444",
                  border: "none",
                }}
                onClick={() => setShowLogoutModal(false)}
              >
                Hủy
              </button>
              <button
                className="btn btn-danger"
                style={{
                  borderRadius: 8,
                  minWidth: 90,
                  fontWeight: 600,
                  background: "#d32f2f",
                  border: "none",
                }}
                onClick={confirmLogout}
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}
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

export default DashboardLayout;
