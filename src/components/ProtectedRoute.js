import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  // Kiểm tra xem user đã đăng nhập chưa
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");

  // Nếu chưa đăng nhập, chuyển hướng đến trang login
  if (!isLoggedIn || !currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Nếu đã đăng nhập, hiển thị component con
  return children;
};

export default ProtectedRoute; 