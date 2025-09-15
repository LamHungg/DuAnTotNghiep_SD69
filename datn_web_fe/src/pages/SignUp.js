import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaLock,
  FaUser,
  FaPhone,
  FaGoogle,
  FaFacebook,
} from "react-icons/fa";
import authService from "../services/authService";
import AuthToast from "../components/AuthToast";
import "./SignUp.css";

const passwordChecks = [
  { label: "Ít nhất 8 ký tự", test: (v) => v.length >= 8 },
  { label: "Có chữ in hoa", test: (v) => /[A-Z]/.test(v) },
  { label: "Có số", test: (v) => /[0-9]/.test(v) },
  { label: "Có ký tự đặc biệt", test: (v) => /[^A-Za-z0-9]/.test(v) },
];

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({
    visible: false,
    type: "success",
    message: "",
  });

  useEffect(() => {
    // Kiểm tra nếu đã đăng nhập thì chuyển hướng
    if (authService.isAuthenticated()) {
      navigate("/profile", { replace: true });
    }
  }, [navigate]);

  const validateForm = () => {
    const newErrors = {};

    // Validate firstName
    if (!formData.firstName.trim()) {
      newErrors.firstName = "Họ là bắt buộc";
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "Họ phải có ít nhất 2 ký tự";
    }

    // Validate lastName
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Tên là bắt buộc";
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = "Tên phải có ít nhất 2 ký tự";
    }

    // Validate email
    if (!formData.email) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = "Mật khẩu là bắt buộc";
    } else if (formData.password.length < 8) {
      newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";
    } else if (
      !passwordChecks.every((check) => check.test(formData.password))
    ) {
      newErrors.password = "Mật khẩu không đủ mạnh";
    }

    // Validate confirmPassword
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Xác nhận mật khẩu là bắt buộc";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu không khớp";
    }

    // Validate phone (optional)
    if (formData.phone && !/^[0-9]{10,11}$/.test(formData.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const userData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.toLowerCase(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        phone: formData.phone || "",
      };

      await authService.register(userData);

      showToast("Đăng ký thành công! Vui lòng đăng nhập.", "success");

      // Chuyển hướng đến trang đăng nhập sau 2 giây
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Lỗi đăng ký:", error);

      let errorMessage = "Đăng ký thất bại. Vui lòng thử lại.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 409) {
        errorMessage = "Email đã tồn tại. Vui lòng sử dụng email khác.";
      } else if (error.response?.status === 400) {
        errorMessage = "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.";
      }

      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = "success") => {
    setToast({
      visible: true,
      type,
      message,
    });
  };

  const handleSocialSignUp = (provider) => {
    showToast(`Đăng ký bằng ${provider} đang được phát triển!`, "info");
  };

  const isPasswordValid = passwordChecks.every((check) =>
    check.test(formData.password)
  );
  const isFormValid =
    isPasswordValid &&
    formData.password === formData.confirmPassword &&
    formData.firstName.trim() &&
    formData.lastName.trim() &&
    /\S+@\S+\.\S+/.test(formData.email) &&
    (!formData.phone || /^[0-9]{10,11}$/.test(formData.phone));

  return (
    <div className="auth-container">
      <AuthToast
        visible={toast.visible}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ ...toast, visible: false })}
      />
      <div className="auth-card signup-card">
        <div className="auth-header">
          <h1 className="auth-title">Tạo tài khoản</h1>
          <p className="auth-subtitle">
            Tham gia để bắt đầu mua sắm cùng chúng tôi
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Họ</label>
              <div className="input-wrapper">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Nhập họ"
                  className={`form-input ${errors.firstName ? "error" : ""}`}
                  disabled={loading}
                />
              </div>
              {errors.firstName && (
                <span className="error-message">{errors.firstName}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Tên</label>
              <div className="input-wrapper">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Nhập tên"
                  className={`form-input ${errors.lastName ? "error" : ""}`}
                  disabled={loading}
                />
              </div>
              {errors.lastName && (
                <span className="error-message">{errors.lastName}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <div className="input-wrapper">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Nhập email"
                className={`form-input ${errors.email ? "error" : ""}`}
                disabled={loading}
              />
            </div>
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Số điện thoại</label>
            <div className="input-wrapper">
              <FaPhone className="input-icon" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Nhập số điện thoại (tùy chọn)"
                className={`form-input ${errors.phone ? "error" : ""}`}
                disabled={loading}
              />
            </div>
            {errors.phone && (
              <span className="error-message">{errors.phone}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Mật khẩu</label>
            <div className="input-wrapper">
              <FaLock className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Tạo mật khẩu"
                className={`form-input ${errors.password ? "error" : ""}`}
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          <div className="password-checklist">
            {passwordChecks.map((check, index) => (
              <div
                key={index}
                className={`check-item ${
                  check.test(formData.password) ? "valid" : "invalid"
                }`}
              >
                <span className="check-icon">
                  {check.test(formData.password) ? "✓" : "✗"}
                </span>
                <span className="check-label">{check.label}</span>
              </div>
            ))}
          </div>

          <div className="form-group">
            <label className="form-label">Xác nhận mật khẩu</label>
            <div className="input-wrapper">
              <FaLock className="input-icon" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Nhập lại mật khẩu"
                className={`form-input ${
                  errors.confirmPassword ? "error" : ""
                }`}
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={loading}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="error-message">{errors.confirmPassword}</span>
            )}
          </div>

          <button
            type="submit"
            className={`auth-button ${loading ? "loading" : ""}`}
            disabled={loading || !isFormValid}
          >
            {loading ? (
              <div className="loading-spinner"></div>
            ) : (
              "Tạo tài khoản"
            )}
          </button>
        </form>

        <div className="auth-divider">
          <span>hoặc</span>
        </div>

        <div className="social-login">
          <button
            type="button"
            className="social-button google"
            onClick={() => handleSocialSignUp("Google")}
            disabled={loading}
          >
            <FaGoogle />
            <span>Đăng ký bằng Google</span>
          </button>
          <button
            type="button"
            className="social-button facebook"
            onClick={() => handleSocialSignUp("Facebook")}
            disabled={loading}
          >
            <FaFacebook />
            <span>Đăng ký bằng Facebook</span>
          </button>
        </div>

        <div className="auth-footer">
          <p>
            Đã có tài khoản?{" "}
            <Link to="/login" className="auth-link">
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
