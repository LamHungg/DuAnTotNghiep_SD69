import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import GioiThieu from "./pages/GioiThieu";
import Size from "./pages/Size";
import TestData from "./components/TestData";
import DebugData from "./components/DebugData";
import FinalTest from "./components/FinalTest";
import ErrorTest from "./components/ErrorTest";
import Header from "./components/Header";
import Footer from "./components/Footer";
import authService from "./services/authService";
import "./styles/main.css";

const Layout = ({ children }) => (
  <div className="main-layout">
    <Header />
    {children}
    <Footer />
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children, redirectTo = "/login" }) => {
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

// Public Route Component (redirect if already logged in)
const PublicRoute = ({ children, redirectTo = "/profile" }) => {
  const isAuthenticated = authService.isAuthenticated();

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes with Layout */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product-detail" element={<ProductDetail />} />
        <Route path="/product-detail/:id" element={<ProductDetail />} />
        <Route path="/gioi-thieu" element={<GioiThieu />} />
        <Route path="/size" element={<Size />} />
        <Route path="/test" element={<TestData />} />
        <Route path="/debug" element={<DebugData />} />
        <Route path="/final" element={<FinalTest />} />
        <Route path="/error-test" element={<ErrorTest />} />

        {/* Protected Routes with Layout */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Layout>
                <Cart />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Layout>
                <Checkout />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Auth Routes (No Layout - Full Screen) */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignUp />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
