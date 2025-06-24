import React, { useState, useEffect } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import Toast from "../components/Toast";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    tenDangNhap: "",
    matKhau: "",
    remember: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    type: "info",
    message: "",
  });

  useEffect(() => {
    const employees = localStorage.getItem("employees");
    const admins = localStorage.getItem("admins");
    if (!employees) {
      const demoEmployees = [
        {
          ma: "NV001",
          chuc_vu: "Nhân viên",
          ho_ten: "Nguyễn Văn A",
          ten_dang_nhap: "nv001",
          mat_khau: "123456",
          email: "nva@example.com",
          so_dien_thoai: "0123456789",
          trang_thai: 1,
          ngay_tao: new Date().toISOString(),
          ngay_cap_nhat: new Date().toISOString(),
        },
        {
          ma: "NV002",
          chuc_vu: "Nhân viên",
          ho_ten: "Trần Thị B",
          ten_dang_nhap: "nv002",
          mat_khau: "123456",
          email: "ttb@example.com",
          so_dien_thoai: "0987654321",
          trang_thai: 1,
          ngay_tao: new Date().toISOString(),
          ngay_cap_nhat: new Date().toISOString(),
        },
      ];
      localStorage.setItem("employees", JSON.stringify(demoEmployees));
    }
    if (!admins) {
      const demoAdmins = [
        {
          ma: "AD001",
          chuc_vu: "Admin",
          ho_ten: "Admin ZMEN",
          ten_dang_nhap: "admin",
          mat_khau: "123456",
          email: "admin@zmen.com",
          so_dien_thoai: "0909090909",
          trang_thai: 1,
          ngay_tao: new Date().toISOString(),
          ngay_cap_nhat: new Date().toISOString(),
        },
      ];
      localStorage.setItem("admins", JSON.stringify(demoAdmins));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.tenDangNhap.trim()) {
      newErrors.tenDangNhap = "Tên đăng nhập không được để trống";
    }
    if (!formData.matKhau.trim()) {
      newErrors.matKhau = "Mật khẩu không được để trống";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const userData = await authService.login(
        formData.tenDangNhap,
        formData.matKhau
      );
      if (userData && userData.trangThai) {
        localStorage.setItem("currentUser", JSON.stringify(userData));
        localStorage.setItem("isLoggedIn", "true");
        setToast({
          visible: true,
          type: "success",
          message: "Đăng nhập thành công!",
        });
        setTimeout(() => {
          setToast((t) => ({ ...t, visible: false }));
          navigate("/dashboard", { replace: true });
        }, 1500);
      } else {
        setToast({
          visible: true,
          type: "error",
          message: "Sai tài khoản hoặc mật khẩu!",
        });
        setTimeout(() => setToast((t) => ({ ...t, visible: false })), 1500);
      }
    } catch (error) {
      setToast({
        visible: true,
        type: "error",
        message: "Sai tài khoản hoặc mật khẩu!",
      });
      setTimeout(() => setToast((t) => ({ ...t, visible: false })), 1500);
    } finally {
      setIsLoading(false);
    }
  };

  // Animated Starry sky (chi tiết hơn, nhiều lớp, có sao băng)
  const Starry = () => (
    <svg
      className="starry"
      width="100%"
      height="100%"
      style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}
    >
      {/* Lớp sao nhỏ */}
      {[...Array(80)].map((_, i) => {
        const cx = Math.random() * 100;
        const cy = Math.random() * 35 + 2;
        const r = Math.random() * 1.1 + 0.5;
        const opacity = Math.random() * 0.4 + 0.3;
        return (
          <circle
            key={i}
            cx={`${cx}%`}
            cy={`${cy}%`}
            r={r}
            fill="#fff"
            opacity={opacity}
          >
            <animate
              attributeName="opacity"
              values={`${opacity};0.1;${opacity}`}
              dur={`${Math.random() * 2 + 2}s`}
              repeatCount="indefinite"
              begin={`${Math.random()}s`}
            />
          </circle>
        );
      })}
      {/* Lớp sao lớn hơn */}
      {[...Array(20)].map((_, i) => {
        const cx = Math.random() * 100;
        const cy = Math.random() * 30 + 2;
        const r = Math.random() * 2 + 1.2;
        const opacity = Math.random() * 0.5 + 0.5;
        return (
          <circle
            key={100 + i}
            cx={`${cx}%`}
            cy={`${cy}%`}
            r={r}
            fill="#fff"
            opacity={opacity}
          >
            <animate
              attributeName="opacity"
              values={`${opacity};0.2;${opacity}`}
              dur={`${Math.random() * 3 + 2}s`}
              repeatCount="indefinite"
              begin={`${Math.random()}s`}
            />
          </circle>
        );
      })}
      {/* Sao băng */}
      {[...Array(3)].map((_, i) => {
        const x1 = Math.random() * 90 + 5;
        const y1 = Math.random() * 25 + 2;
        return (
          <line
            key={200 + i}
            x1={`${x1}%`}
            y1={`${y1}%`}
            x2={`${x1 + 3}%`}
            y2={`${y1 + 1}%`}
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.7"
          >
            <animate
              attributeName="x1"
              values={`${x1}%;${x1 + 10}%`}
              dur="2.5s"
              repeatCount="indefinite"
              begin={`${i * 0.8}s`}
            />
            <animate
              attributeName="x2"
              values={`${x1 + 3}%;${x1 + 13}%`}
              dur="2.5s"
              repeatCount="indefinite"
              begin={`${i * 0.8}s`}
            />
            <animate
              attributeName="opacity"
              values="0.7;0;0.7"
              dur="2.5s"
              repeatCount="indefinite"
              begin={`${i * 0.8}s`}
            />
          </line>
        );
      })}
    </svg>
  );

  // Forest SVG (nhiều lớp cây, thêm sương mù)
  const Forest = () => (
    <svg
      className="forest"
      viewBox="0 0 1440 320"
      preserveAspectRatio="none"
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100vw",
        height: "38vh",
        zIndex: 2,
      }}
    >
      <defs>
        <linearGradient id="treeGradient1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4b2e7a" />
          <stop offset="100%" stopColor="#2d1850" />
        </linearGradient>
        <linearGradient id="treeGradient2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6e48aa" />
          <stop offset="100%" stopColor="#3a2067" />
        </linearGradient>
        <radialGradient id="fog" cx="50%" cy="80%" r="60%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Lớp cây xa */}
      <path
        d="M0,320 Q120,250 240,320 T480,320 T720,320 T960,320 T1200,320 T1440,320 V0 H0 Z"
        fill="url(#treeGradient1)"
      />
      {/* Lớp cây gần hơn */}
      <path
        d="M0,320 Q80,260 160,320 T320,320 T480,320 T640,320 T800,320 T960,320 T1120,320 T1280,320 T1440,320 V80 Q1300,200 1200,320 T0,320 Z"
        fill="url(#treeGradient2)"
      />
      {/* Thêm các cây nhỏ phía trước */}
      {[...Array(22)].map((_, i) => {
        const x = i * 65 + Math.random() * 25;
        const treeHeight = 60 + Math.random() * 60;
        return (
          <g key={i}>
            <rect
              x={x}
              y={320 - treeHeight}
              width={10}
              height={treeHeight}
              fill="#23123a"
              rx={3}
            />
            <polygon
              points={`${x - 10},${320 - treeHeight + 10} ${x + 5},${
                320 - treeHeight - 30
              } ${x + 20},${320 - treeHeight + 10}`}
              fill="#2d1850"
            />
          </g>
        );
      })}
      {/* Sương mù */}
      <ellipse cx="50%" cy="90%" rx="700" ry="40" fill="url(#fog)" />
    </svg>
  );

  return (
    <div className="login-bg">
      <Starry />
      <Forest />
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div className="login-glass">
          <div className="login-title">Login</div>
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <span className="input-icon">
                <FaUser />
              </span>
              <input
                type="text"
                name="tenDangNhap"
                className="login-input"
                placeholder="Username"
                value={formData.tenDangNhap}
                onChange={handleChange}
                disabled={isLoading}
                autoComplete="username"
              />
              {errors.tenDangNhap && (
                <div
                  style={{
                    color: "#ff6b6b",
                    fontSize: 13,
                    marginTop: 4,
                  }}
                >
                  {errors.tenDangNhap}
                </div>
              )}
            </div>
            <div className="input-group">
              <span className="input-icon">
                <FaLock />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                name="matKhau"
                className="login-input"
                placeholder="Password"
                value={formData.matKhau}
                onChange={handleChange}
                disabled={isLoading}
                autoComplete="current-password"
              />
              <span
                className="input-icon-right"
                onClick={() => setShowPassword((v) => !v)}
                style={{ userSelect: "none" }}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
              {errors.matKhau && (
                <div
                  style={{
                    color: "#ff6b6b",
                    fontSize: 13,
                    marginTop: 4,
                  }}
                >
                  {errors.matKhau}
                </div>
              )}
            </div>
            <div className="login-remember">
              <input
                type="checkbox"
                id="remember"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
                disabled={isLoading}
                style={{ accentColor: "#9d50bb" }}
              />
              <label htmlFor="remember">Remember me</label>
            </div>
            <button className="login-btn" type="submit" disabled={isLoading}>
              {isLoading ? "Đang đăng nhập..." : "Login"}
            </button>
          </form>
        </div>
        <Toast
          type={toast.type}
          message={toast.message}
          visible={toast.visible}
          onClose={() => setToast((t) => ({ ...t, visible: false }))}
        />
      </div>
    </div>
  );
};

export default Login;
