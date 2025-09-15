import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import authService from "../services/authService";
import AuthToast from "../components/AuthToast";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({
    visible: false,
    type: "success",
    message: "",
  });
  const navigate = useNavigate();

  const validateEmail = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email không hợp lệ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail()) {
      return;
    }

    setLoading(true);

    try {
      await authService.forgotPassword(email);

      setEmailSent(true);
      showToast(
        "Email đặt lại mật khẩu đã được gửi! Vui lòng kiểm tra hộp thư.",
        "success"
      );
    } catch (error) {
      console.error("Lỗi gửi email:", error);

      let errorMessage = "Không thể gửi email. Vui lòng thử lại.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 404) {
        errorMessage = "Email không tồn tại trong hệ thống.";
      } else if (error.response?.status === 429) {
        errorMessage = "Quá nhiều yêu cầu. Vui lòng thử lại sau.";
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

  const handleBackToLogin = () => {
    navigate("/login");
  };

  const handleResendEmail = () => {
    setEmailSent(false);
    setEmail("");
  };

  if (emailSent) {
    return (
      <div className="auth-container">
        <AuthToast
          visible={toast.visible}
          type={toast.type}
          message={toast.message}
          onClose={() => setToast({ ...toast, visible: false })}
        />
        <div className="auth-card">
          <div className="auth-header">
            <div className="success-icon">
              <FaCheckCircle />
            </div>
            <h1 className="auth-title">Email đã được gửi!</h1>
            <p className="auth-subtitle">
              Chúng tôi đã gửi email đặt lại mật khẩu đến{" "}
              <strong>{email}</strong>
            </p>
          </div>

          <div className="instructions">
            <h3>Hướng dẫn đặt lại mật khẩu:</h3>
            <ol>
              <li>Kiểm tra email của bạn</li>
              <li>Nhấp vào liên kết đặt lại mật khẩu</li>
              <li>Tạo mật khẩu mới</li>
              <li>Đăng nhập với mật khẩu mới</li>
            </ol>

            <div className="email-note">
              <p>
                <strong>Lưu ý:</strong> Email có thể mất vài phút để đến. Nếu
                không thấy email, hãy kiểm tra thư mục spam.
              </p>
            </div>
          </div>

          <div className="auth-footer">
            <p>
              Không nhận được email?{" "}
              <button
                type="button"
                onClick={handleResendEmail}
                className="auth-link"
              >
                Gửi lại
              </button>
            </p>
            <p>
              <button
                type="button"
                onClick={handleBackToLogin}
                className="auth-link"
              >
                <FaArrowLeft style={{ marginRight: "8px" }} />
                Quay lại đăng nhập
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <AuthToast
        visible={toast.visible}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ ...toast, visible: false })}
      />
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Quên mật khẩu?</h1>
          <p className="auth-subtitle">
            Nhập email của bạn và chúng tôi sẽ gửi liên kết đặt lại mật khẩu
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <div className="input-wrapper">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) {
                    setErrors((prev) => ({ ...prev, email: "" }));
                  }
                }}
                placeholder="Nhập email của bạn"
                className={`form-input ${errors.email ? "error" : ""}`}
                disabled={loading}
              />
            </div>
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <button
            type="submit"
            className={`auth-button ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? (
              <div className="loading-spinner"></div>
            ) : (
              "Gửi email đặt lại mật khẩu"
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Nhớ mật khẩu?{" "}
            <button
              type="button"
              onClick={handleBackToLogin}
              className="auth-link"
            >
              Đăng nhập
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
