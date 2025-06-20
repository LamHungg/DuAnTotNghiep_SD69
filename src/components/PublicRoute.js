import React from "react";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  // Kiểm tra xem user đã đăng nhập chưa
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");

  // Nếu đã đăng nhập, chuyển hướng đến dashboard
  if (isLoggedIn && currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  // Nếu chưa đăng nhập, hiển thị component con (trang login)
  return children;
};

export default PublicRoute; 