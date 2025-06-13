import React, { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
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
} from "react-icons/fa";

const sidebarMenus = [
  { label: "Trang chủ", icon: <FaHome />, to: "/" },
  { label: "Thống Kê", icon: <FaChartBar />, to: "/stats" },
  { label: "Bán Hàng Tại Quầy", icon: <FaBoxOpen />, to: "/pos" },
  { label: "Trả hàng", icon: <FaRegHandPaper />, to: "/returns" },
  {
    label: "Quản Lý Sản Phẩm",
    icon: <FaTshirt />,
    children: [
      { label: "Sản Phẩm", icon: <FaTshirt />, to: "/products" },
      { label: "Danh Mục", icon: <FaThList />, to: "/categories" },
      { label: "Màu Sắc", icon: <FaPalette />, to: "/colors" },
      { label: "Kích Cỡ", icon: <FaRulerCombined />, to: "/sizes" },
      { label: "Thương Hiệu", icon: <FaTrademark />, to: "/brands" },
      { label: "Chất Liệu", icon: <FaTint />, to: "/materials" },
      { label: "Kiểu Tay Áo", icon: <FaRegHandPaper />, to: "/sleeves" },
      { label: "Kiểu Cổ Áo", icon: <FaRegCircle />, to: "/collars" },
    ],
  },
  { label: "Quản Lý Đơn Hàng", icon: <FaShoppingCart />, to: "/orders" },
  { label: "Quản Lý Khách Hàng", icon: <FaUsers />, to: "/customers" },
  { label: "Cài đặt", icon: <FaCog />, to: "/settings" },
];

const DashboardLayout = () => {
  const [openMenu, setOpenMenu] = useState("Quản Lý Sản Phẩm");

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
            <span className="navbar-brand fw-bold">Admin Dashboard</span>
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
