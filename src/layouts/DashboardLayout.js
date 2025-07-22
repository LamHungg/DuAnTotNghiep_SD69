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
  FaTrademark,
  FaTint,
  FaRegHandPaper,
  FaRegCircle,
  FaHome,
  FaShoppingCart,
  FaPlus,
  FaUserTie,
  FaSignOutAlt,
  FaRegClock,
  FaGift,
} from "react-icons/fa";
import Toast from "../components/Toast";
import authService from '../services/authService';

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
  const [toast, setToast] = useState({
    visible: false,
    type: "error",
    message: "",
  });
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = authService.getCurrentUser();
  const isNhanVien = currentUser && (currentUser.chucVu === 'NHANVIEN' || currentUser.role === 'NHANVIEN');

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
    <div
      className="d-flex"
      style={{ minHeight: "100vh", background: "#f6f8fa" }}
    >
      {/* Sidebar */}
      <div
        className="bg-white border-end"
        style={{
          width: 260,
          minHeight: "100vh",
          boxShadow: "2px 0 8px #f0f1f2",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="d-flex flex-column align-items-center p-3 h-100 w-100">
          <div
            style={{
              width: 110,
              height: 110,
              background: "#fff",
              borderRadius: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
              border: "1.5px solid #eee",
              margin: "auto",
            }}
            className="mb-4"
          >
            <img
              src="/logo.png"
              alt="logo"
              style={{
                width: 90,
                height: 90,
                objectFit: "contain",
                display: "block",
              }}
            />
          </div>
          <nav className="flex-grow-1 w-100">
            <ul className="nav flex-column w-100">
              {sidebarMenus.map((item, idx) => {
                const isRestricted =
                  isNhanVien && (item.label === 'Quản Lý Account' || item.label === 'Thống Kê');
                return (
                  <li className="nav-item w-100" key={item.label}>
                    {item.children ? (
                      <>
                        <div
                          className={`nav-link d-flex align-items-center w-100 px-3 py-2 mb-1 rounded-2 sidebar-parent ${
                            item.children.some((child) =>
                              location.pathname.startsWith(child.to)
                            )
                              ? "active-menu"
                              : "text-secondary"
                          }`}
                          style={{
                            fontWeight: 500,
                            fontSize: 15,
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            setOpenMenu(openMenu === item.label ? "" : item.label)
                          }
                        >
                          <span className="me-2">{item.icon}</span>
                          {item.label}
                          <span className="ms-auto">
                            {openMenu === item.label ? "▾" : "▸"}
                          </span>
                        </div>
                        {openMenu === item.label && (
                          <ul className="nav flex-column ms-3 sidebar-children">
                            {item.children.map((child) => (
                              <li className="nav-item w-100" key={child.label}>
                                <NavLink
                                  to={child.to}
                                  className={({ isActive }) =>
                                    `nav-link d-flex align-items-center w-100 px-3 py-2 mb-1 rounded-2 sidebar-child ${
                                      isActive ? "active-menu" : "text-secondary"
                                    }`
                                  }
                                  style={{ fontWeight: 500, fontSize: 15 }}
                                >
                                  <span className="me-2">{child.icon}</span>
                                  {child.label}
                                </NavLink>
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    ) : (
                      isRestricted ? (
                        <div
                          className={
                            'nav-link d-flex align-items-center w-100 px-3 py-2 mb-1 rounded-2 text-secondary'
                          }
                          style={{ fontWeight: 500, fontSize: 15, cursor: 'not-allowed', opacity: 0.7 }}
                          onClick={() => setToast({ visible: true, type: 'error', message: 'Bạn không có quyền truy cập' })}
                        >
                          <span className="me-2">{item.icon}</span>
                          {item.label}
                        </div>
                      ) : (
                        <NavLink
                          to={item.to}
                          className={({ isActive }) =>
                            `nav-link d-flex align-items-center w-100 px-3 py-2 mb-1 rounded-2 ${
                              isActive ? "active-menu" : "text-secondary"
                            }`
                          }
                          style={{ fontWeight: 500, fontSize: 15 }}
                        >
                          <span className="me-2">{item.icon}</span>
                          {item.label}
                        </NavLink>
                      )
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-grow-1">
        <nav
          className="navbar navbar-light bg-white border-bottom shadow-sm"
          style={{ minHeight: 60 }}
        >
          <div className="container-fluid">
            <span className="navbar-brand fw-bold d-flex align-items-center">
              Admin Dashboard
              <Clock />
            </span>
            <div className="d-flex align-items-center">
              <button
                onClick={handleLogout}
                className="btn btn-outline-danger d-flex align-items-center gap-2"
                style={{ fontSize: "14px" }}
              >
                <FaSignOutAlt />
                Đăng xuất
              </button>
            </div>
          </div>
        </nav>
        <main className="p-4">
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
