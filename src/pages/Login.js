import React, { useState, useEffect } from "react";
import { FaUser, FaLock, FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import Toast from "../components/Toast";
import nguoiDungService from "../services/nguoiDungService";

// Animated Starry sky
const Starry = () => (
  <svg
    className="starry"
    width="100%"
    height="100%"
    style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}
  >
    {[...Array(100)].map((_, i) => {
      const cx = Math.random() * 100;
      const cy = Math.random() * 40 + 2;
      const r = Math.random() * 1.2 + 0.3;
      const opacity = Math.random() * 0.6 + 0.2;
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
            dur={`${Math.random() * 3 + 2}s`}
            repeatCount="indefinite"
            begin={`${Math.random()}s`}
          />
        </circle>
      );
    })}
    {[...Array(25)].map((_, i) => {
      const cx = Math.random() * 100;
      const cy = Math.random() * 35 + 2;
      const r = Math.random() * 2.5 + 1.5;
      const opacity = Math.random() * 0.7 + 0.3;
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
            dur={`${Math.random() * 4 + 3}s`}
            repeatCount="indefinite"
            begin={`${Math.random()}s`}
          />
        </circle>
      );
    })}
    {[...Array(5)].map((_, i) => {
      const x1 = Math.random() * 90 + 5;
      const y1 = Math.random() * 30 + 2;
      return (
        <line
          key={200 + i}
          x1={`${x1}%`}
          y1={`${y1}%`}
          x2={`${x1 + 4}%`}
          y2={`${y1 + 1.5}%`}
          stroke="#fff"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.8"
        >
          <animate
            attributeName="x1"
            values={`${x1}%;${x1 + 15}%`}
            dur="3s"
            repeatCount="indefinite"
            begin={`${i * 1.2}s`}
          />
          <animate
            attributeName="x2"
            values={`${x1 + 4}%;${x1 + 19}%`}
            dur="3s"
            repeatCount="indefinite"
            begin={`${i * 1.2}s`}
          />
          <animate
            attributeName="opacity"
            values="0.8;0;0.8"
            dur="3s"
            repeatCount="indefinite"
            begin={`${i * 1.2}s`}
          />
        </line>
      );
    })}
  </svg>
);

// Forest SVG
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
      height: "40vh",
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
      <radialGradient id="fog" cx="50%" cy="80%" r="70%">
        <stop offset="0%" stopColor="#fff" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#fff" stopOpacity="0" />
      </radialGradient>
    </defs>
    <path
      d="M0,320 Q120,250 240,320 T480,320 T720,320 T960,320 T1200,320 T1440,320 V0 H0 Z"
      fill="url(#treeGradient1)"
    />
    <path
      d="M0,320 Q80,260 160,320 T320,320 T480,320 T640,320 T800,320 T960,320 T1120,320 T1280,320 T1440,320 V80 Q1300,200 1200,320 T0,320 Z"
      fill="url(#treeGradient2)"
    />
    {[...Array(25)].map((_, i) => {
      const x = i * 58 + Math.random() * 30;
      const treeHeight = 70 + Math.random() * 80;
      return (
        <g key={i}>
          <rect
            x={x}
            y={320 - treeHeight}
            width={12}
            height={treeHeight}
            fill="#23123a"
            rx={4}
          />
          <polygon
            points={`${x - 12},${320 - treeHeight + 15} ${x + 6},${
              320 - treeHeight - 35
            } ${x + 24},${320 - treeHeight + 15}`}
            fill="#2d1850"
          />
        </g>
      );
    })}
    <ellipse cx="50%" cy="90%" rx="800" ry="50" fill="url(#fog)" />
  </svg>
);

const FormLogin = ({
  handleSubmit,
  setShowForgot,
  formData,
  handleChange,
  isLoading,
  errors,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="login-card">
      <div className="login-header">
        <h1 className="login-title">ZMEN</h1>
        <p className="login-subtitle">Đăng nhập vào hệ thống</p>
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="tenDangNhap" className="form-label">
            Tên đăng nhập
          </label>
          <div className="input-wrapper">
            <span className="input-icon">
              <FaUser />
            </span>
            <input
              type="text"
              name="tenDangNhap"
              className="login-input"
              placeholder="Nhập tên đăng nhập"
              value={formData.tenDangNhap}
              onChange={handleChange}
              disabled={isLoading}
              autoComplete="username"
            />
          </div>
          {errors.tenDangNhap && (
            <div className="error-message">{errors.tenDangNhap}</div>
          )}
        </div>

        <div className="input-group">
          <label htmlFor="matKhau" className="form-label">
            Mật khẩu
          </label>
          <div className="input-wrapper">
            <span className="input-icon">
              <FaLock />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              name="matKhau"
              className="login-input"
              placeholder="Nhập mật khẩu"
              value={formData.matKhau}
              onChange={handleChange}
              disabled={isLoading}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.matKhau && (
            <div className="error-message">{errors.matKhau}</div>
          )}
        </div>

        <div className="form-options">
          <label className="remember-me">
            <input
              type="checkbox"
              name="remember"
              checked={formData.remember}
              onChange={handleChange}
              disabled={isLoading}
            />
            <span>Ghi nhớ đăng nhập</span>
          </label>

          <button
            type="button"
            className="forgot-password"
            onClick={() => setShowForgot(true)}
          >
            Quên mật khẩu?
          </button>
        </div>

        <button className="login-btn" type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <FaSpinner className="spinner" />
              Đang đăng nhập...
            </>
          ) : (
            "Đăng nhập"
          )}
        </button>
      </form>

      <div className="login-footer">
        <p>
          Chưa có tài khoản? <span className="register-link">Đăng ký ngay</span>
        </p>
      </div>
    </div>
  );
};

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    tenDangNhap: "",
    matKhau: "",
    remember: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    type: "info",
    message: "",
  });
  const [showForgot, setShowForgot] = useState(false);

  useEffect(() => {
    // Không còn demo data - chỉ sử dụng dữ liệu thực tế từ backend
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
      newErrors.tenDangNhap = "Vui lòng nhập tên đăng nhập";
    }
    if (!formData.matKhau.trim()) {
      newErrors.matKhau = "Vui lòng nhập mật khẩu";
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

  return (
    <div className="login-page">
      <Starry />
      <Forest />
      <div className="login-container">
        {!showForgot ? (
          <FormLogin
            handleSubmit={handleSubmit}
            setShowForgot={setShowForgot}
            formData={formData}
            handleChange={handleChange}
            isLoading={isLoading}
            errors={errors}
          />
        ) : (
          <div className="login-card">
            <div className="login-header">
              <h1 className="login-title">Quên mật khẩu</h1>
              <p className="login-subtitle">Nhập email để lấy lại mật khẩu</p>
            </div>
            <div className="login-footer">
              <button
                className="forgot-password"
                onClick={() => setShowForgot(false)}
              >
                ← Quay lại đăng nhập
              </button>
            </div>
          </div>
        )}
      </div>
      <Toast
        type={toast.type}
        message={toast.message}
        visible={toast.visible}
        onClose={() => setToast((t) => ({ ...t, visible: false }))}
      />
    </div>
  );
};

export default Login;
