import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import AddProduct from "./pages/AddProduct";

// Layout Components
import DashboardLayout from "./layouts/DashboardLayout";

// Pages
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Customers from "./pages/Customers";
import OrderUpdate from "./pages/OrderUpdate";
import Accounts from "./pages/Accounts";
import AddEmployee from "./pages/AddEmployee";
import AddAdmin from "./pages/AddAdmin";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import Categories from "./pages/Categories";
import Colors from "./pages/Colors";
import Sizes from "./pages/Sizes";
import Materials from "./pages/Materials";
import EditProduct from "./pages/EditProduct";
import Vouchers from "./pages/Vouchers";
import Statistics from "./pages/Statistics";
import OrderDetail from "./pages/OrderDetail";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Route mặc định - chuyển hướng đến login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Route đăng nhập - chỉ hiển thị khi chưa đăng nhập */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* Các route được bảo vệ - yêu cầu đăng nhập */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="stats" element={<Statistics />} />
          <Route path="products" element={<Products />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="products/edit/:productId" element={<EditProduct />} />
          <Route path="orders" element={<Orders />} />
          <Route path="customers" element={<Customers />} />
          <Route path="accounts" element={<Accounts />} />
          <Route path="accounts/add-employee" element={<AddEmployee />} />
          <Route path="accounts/add-admin" element={<AddAdmin />} />
          <Route path="categories" element={<Categories />} />
          <Route path="colors" element={<Colors />} />
          <Route path="sizes" element={<Sizes />} />
          <Route path="materials" element={<Materials />} />
          <Route path="settings" element={<Settings />} />
          <Route path="vouchers" element={<Vouchers />} />
        </Route>

        {/* Route cập nhật đơn hàng */}
        <Route
          path="/orders/update"
          element={
            <ProtectedRoute>
              <OrderUpdate />
            </ProtectedRoute>
          }
        />

        {/* Route chi tiết đơn hàng */}
        <Route
          path="/orders/:orderId"
          element={
            <ProtectedRoute>
              <OrderDetail />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
