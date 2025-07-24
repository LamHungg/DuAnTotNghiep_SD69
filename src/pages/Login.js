import React, { useState, useEffect } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import Toast from "../components/Toast";
import nguoiDungService from "../services/nguoiDungService";

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

const FormLogin = ({
  email,
  handleSubmit,
  setShowForgot,
  formData,
  handleChange,
  isLoading,
  errors,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="input-group" style={{ marginBottom: 18 }}>
        <label
          htmlFor="tenDangNhap"
          className="form-label"
          style={{
            marginBottom: 4,
            marginLeft: 2,
            color: "#4b2e7a",
            fontWeight: 500,
          }}
        >
          Tên đăng nhập
        </label>
        <div style={{ position: "relative" }}>
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
            style={{ paddingLeft: 40 }}
          />
        </div>
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
        <label
          htmlFor="matKhau"
          className="form-label"
          style={{
            marginBottom: 4,
            marginLeft: 2,
            color: "#4b2e7a",
            fontWeight: 500,
          }}
        >
          Mật khẩu
        </label>
        <div style={{ position: "relative" }}>
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
            style={{ paddingLeft: 40, paddingRight: 40 }}
          />
          <span
            className="input-icon-right"
            onClick={() => setShowPassword((v) => !v)}
            style={{ userSelect: "none" }}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>
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
      <div style={{ textAlign: "right", marginTop: 8 }}>
        <span
          style={{
            color: "#ffffff",
            textDecoration: "underline",
            cursor: "pointer",
            fontWeight: 500,
            fontSize: 15,
          }}
          onClick={() => setShowForgot(true)}
        >
          Quên mật khẩu?
        </span>
      </div>
      <button className="login-btn" type="submit" disabled={isLoading}>
        {isLoading ? "Đang đăng nhập..." : "Login"}
      </button>
    </form>
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
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const otpRefs = Array.from({ length: 6 }, () => React.createRef());
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetPassword, setResetPassword] = useState({
    password: "",
    confirm: "",
  });
  const [resetError, setResetError] = useState("");

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

  const checkEmailExists = async (email) => {
    try {
      const res = await nguoiDungService.checkEmailTonTai(email.trim());
      console.log("API check email trả về:", res, typeof res);
      return res && res.exists === true;
    } catch (error) {
      return false;
    }
  };

  // Hàm xử lý nhập OTP
  const handleOtpChange = (idx, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[idx] = value;
    setOtp(newOtp);
    setOtpError("");
    if (value && idx < 5) {
      otpRefs[idx + 1].current.focus();
    }
  };

  const handleOtpKeyDown = (idx, e) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      otpRefs[idx - 1].current.focus();
    }
  };

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
          {!showForgot ? (
            <FormLogin
              email={formData.tenDangNhap}
              handleSubmit={handleSubmit}
              setShowForgot={setShowForgot}
              formData={formData}
              handleChange={handleChange}
              isLoading={isLoading}
              errors={errors}
            />
          ) : showOTP ? (
            <form
              className="login-form"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <div style={{ marginBottom: 16 }}>
                <div
                  style={{ marginBottom: 8, color: "#4b2e7a", fontWeight: 500 }}
                >
                  Nhập mã OTP đã gửi về email
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    justifyContent: "center",
                    marginBottom: 8,
                  }}
                >
                  {otp.map((val, idx) => (
                    <input
                      key={idx}
                      ref={otpRefs[idx]}
                      type="text"
                      maxLength={1}
                      value={val}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      style={{
                        width: 38,
                        height: 44,
                        textAlign: "center",
                        fontSize: 22,
                        borderRadius: 8,
                        border: "1.5px solid #7c3aed",
                        outline: "none",
                        background: "#fff",
                        color: "#4b2e7a",
                        fontWeight: 600,
                      }}
                      autoFocus={idx === 0}
                    />
                  ))}
                </div>
                {otpError && (
                  <div style={{ color: "#ff6b6b", fontSize: 13, marginTop: 4 }}>
                    {otpError}
                  </div>
                )}
              </div>
              <button
                className="login-btn"
                type="button"
                style={{ marginTop: 8 }}
                onClick={async () => {
                  if (otp.some((val) => !val)) {
                    setOtpError("Vui lòng nhập đầy đủ mã OTP");
                    return;
                  }
                  setOtpError("");
                  try {
                    const otpCode = otp.join("").trim();
                    const emailTrimmed = forgotEmail.trim();
                    console.log("Gửi validate OTP:", emailTrimmed, otpCode);
                    const res = await nguoiDungService.validateOtp(
                      emailTrimmed,
                      otpCode
                    );
                    if (res?.data && res?.data?.otp) {
                      setShowOTP(false)
                      setShowResetPassword(true);
                    } else {
                      setOtpError("Sai mã OTP");
                    }
                  } catch (err) {
                    let msg = "Sai mã OTP";
                    if (
                      err.response &&
                      err.response.data &&
                      err.response.data.message
                    ) {
                      msg = err.response.data.message;
                    }
                    setOtpError(msg);
                  }
                }}
              >
                Xác nhận
              </button>
              <div style={{ textAlign: "right", marginTop: 8 }}>
                <span
                  style={{
                    color: "#ffffff",
                    cursor: "pointer",
                    fontWeight: 500,
                    fontSize: 15,
                  }}
                  onClick={() => {
                    setShowOTP(false);
                    setShowForgot(true);
                  }}
                >
                  Quay lại nhập email
                </span>
              </div>
            </form>
          ) : showResetPassword ? (
            <form
              className="login-form"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <div style={{ marginBottom: 16 }}>
                <label
                  className="form-label"
                  style={{
                    marginBottom: 4,
                    marginLeft: 2,
                    color: "#4b2e7a",
                    fontWeight: 500,
                  }}
                >
                  Nhập mật khẩu mới
                </label>
                <input
                  type="password"
                  className="login-input"
                  placeholder="Mật khẩu mới"
                  value={resetPassword.password}
                  onChange={(e) =>
                    setResetPassword((r) => ({
                      ...r,
                      password: e.target.value,
                    }))
                  }
                  style={{ paddingLeft: 16 }}
                  autoFocus
                />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label
                  className="form-label"
                  style={{
                    marginBottom: 4,
                    marginLeft: 2,
                    color: "#4b2e7a",
                    fontWeight: 500,
                  }}
                >
                  Nhập lại mật khẩu mới
                </label>
                <input
                  type="password"
                  className="login-input"
                  placeholder="Xác nhận mật khẩu mới"
                  value={resetPassword.confirm}
                  onChange={(e) =>
                    setResetPassword((r) => ({ ...r, confirm: e.target.value }))
                  }
                  style={{ paddingLeft: 16 }}
                />
              </div>
              {resetError && (
                <div style={{ color: "#ff6b6b", fontSize: 13, marginTop: 4 }}>
                  {resetError}
                </div>
              )}
              <button
                className="login-btn"
                type="button"
                style={{ marginTop: 8 }}
                onClick={async () => {
                  if (!resetPassword.password || !resetPassword.confirm) {
                    setResetError("Vui lòng nhập đầy đủ thông tin");
                    return;
                  }
                  if (resetPassword.password !== resetPassword.confirm) {
                    setResetError("Mật khẩu xác nhận không khớp");
                    return;
                  }
                  setResetError("");
                  try {
                    await nguoiDungService.resetPasswordByEmail(forgotEmail, resetPassword.password);
                    setToast({
                      visible: true,
                      type: "success",
                      message: "Đặt lại mật khẩu thành công! Đang chuyển về trang đăng nhập...",
                    });
                    setTimeout(() => {
                      window.location.href = "/login";
                    }, 1500);
                  } catch (err) {
                    setResetError("Đặt lại mật khẩu thất bại. Vui lòng thử lại!");
                  }
                }}
              >
                Next
              </button>
            </form>
          ) : (
            <form
              className="login-form"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <div style={{ marginBottom: 16 }}>
                <label
                  htmlFor="forgotEmail"
                  className="form-label"
                  style={{
                    marginBottom: 4,
                    marginLeft: 2,
                    color: "#4b2e7a",
                    fontWeight: 500,
                  }}
                >
                  Nhập email để lấy lại mật khẩu
                </label>
                <input
                  type="email"
                  id="forgotEmail"
                  className="login-input"
                  placeholder="Nhập email"
                  value={forgotEmail}
                  onChange={(e) => {
                    setForgotEmail(e.target.value);
                    setForgotError("");
                  }}
                  style={{ paddingLeft: 16 }}
                  autoFocus
                />
                {forgotError && (
                  <div style={{ color: "#ff6b6b", fontSize: 13, marginTop: 4 }}>
                    {forgotError}
                  </div>
                )}
              </div>
              <button
                className="login-btn"
                type="button"
                style={{ marginTop: 8 }}
                onClick={async () => {
                  if (!forgotEmail.trim()) {
                    setForgotError("Vui lòng nhập email");
                    return;
                  }
                  if (!/^\S+@\S+\.\S+$/.test(forgotEmail)) {
                    setForgotError("Email không hợp lệ");
                    return;
                  }
                  setForgotError("");
                  const exists = await checkEmailExists(forgotEmail);
                  if (!exists) {
                    setForgotError("Tài khoản không tồn tại");
                  } else {
                    setForgotError("");
                    try {
                      await nguoiDungService.sendOtpToEmail(forgotEmail.trim());
                      setToast({
                        visible: true,
                        type: "success",
                        message: "Đã gửi mã OTP về email!",
                      });
                    } catch (err) {
                      setToast({
                        visible: true,
                        type: "error",
                        message: "Gửi OTP thất bại!",
                      });
                    }
                    setShowOTP(true);
                    setToast((t) => ({ ...t, visible: false }));
                  }
                }}
              >
                Next
              </button>
              <div style={{ textAlign: "right", marginTop: 8 }}>
                <span
                  style={{
                    color: "#7c3aed",
                    cursor: "pointer",
                    fontWeight: 500,
                    fontSize: 15,
                  }}
                  onClick={() => setShowForgot(false)}
                >
                  Quay lại đăng nhập
                </span>
              </div>
            </form>
          )}
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
