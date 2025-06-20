import React, { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
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
} from "react-icons/fa";

const sidebarMenus = [
  { label: "Trang chủ", icon: <FaHome />, to: "/dashboard" },
  { label: "Thống Kê", icon: <FaChartBar />, to: "/dashboard/stats" },
  { label: "Bán Hàng Tại Quầy", icon: <FaBoxOpen />, to: "/dashboard/pos" },
  { label: "Trả hàng", icon: <FaRegHandPaper />, to: "/dashboard/returns" },
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
  { label: "Quản Lý Đơn Hàng", icon: <FaShoppingCart />, to: "/dashboard/orders" },
  { label: "Quản Lý Khách Hàng", icon: <FaUsers />, to: "/dashboard/customers" },
  { label: "Quản Lý Account", icon: <FaUserTie />, to: "/dashboard/accounts" },
  { label: "Cài đặt", icon: <FaCog />, to: "/dashboard/settings" },
];

function Clock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      background: '#f6f8fa',
      borderRadius: 8,
      padding: '4px 14px',
      fontWeight: 500,
      fontSize: 16,
      color: '#333',
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      marginLeft: 18
    }}>
      <FaRegClock style={{ color: '#7c3aed', fontSize: 20 }} />
      {time.toLocaleTimeString()}
    </span>
  );
}

const DashboardLayout = () => {
  const [openMenu, setOpenMenu] = useState("Quản Lý Sản Phẩm");
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      localStorage.removeItem("currentUser");
      localStorage.removeItem("isLoggedIn");
      alert("Đăng xuất thành công!");
      navigate("/login");
    }
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
        }}
      >
        <div className="d-flex flex-column align-items-start p-3 h-100">
          <div className="mb-4 w-100 d-flex align-items-center gap-2">
            <div
              style={{
                width: 38,
                height: 38,
                background: "#f1f3f6",
                borderRadius: 8,
              }}
              className="d-flex align-items-center justify-content-center me-2"
            >
              <img
                src="/logo192.png"
                alt="logo"
                style={{ width: 28, height: 28 }}
              />
            </div>
            <span style={{ fontWeight: 700, fontSize: 18 }}>ZMEN</span>
          </div>
          <nav className="flex-grow-1 w-100">
            <ul className="nav flex-column w-100">
              {sidebarMenus.map((item, idx) => (
                <li className="nav-item w-100" key={item.label}>
                  {item.children ? (
                    <>
                      <div
                        className={`nav-link d-flex align-items-center w-100 px-3 py-2 mb-1 rounded-2 sidebar-parent ${
                          openMenu === item.label
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
                  )}
                </li>
              ))}
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
    </div>
  );
};

export default DashboardLayout;
