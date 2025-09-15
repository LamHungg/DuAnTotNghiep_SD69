import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  // Kiểm tra xem user đã đăng nhập chưa
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");

  // Kiểm tra chi tiết hơn về thông tin người dùng
  const isValidUser =
    currentUser &&
    currentUser.tenDangNhap &&
    currentUser.ma &&
    currentUser.trangThai === true;



  // Nếu chưa đăng nhập hoặc thông tin user không hợp lệ, chuyển hướng đến trang login
  if (!isLoggedIn || !isValidUser) {
    // Xóa dữ liệu không hợp lệ khỏi localStorage
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUser");
    return <Navigate to="/login" replace />;
  }

  // Nếu đã đăng nhập và thông tin hợp lệ, hiển thị component con
  return children;
};

export default ProtectedRoute;
