import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Toast from "../components/Toast";
import nguoiDungService from "../services/nguoiDungService";

const Settings = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    ma: "",
    chucVu: "",
    hoTen: "",
    tenDangNhap: "",
    matKhau: "",
    email: "",
    soDienThoai: "",
    trangThai: 1,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [toast, setToast] = useState({
    visible: false,
    type: "info",
    message: "",
  });

  // Lấy thông tin user hiện tại khi component mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (user) {
      setCurrentUser(user);
      setFormData({
        ma: user.ma || "",
        chucVu: user.chucVu || "",
        hoTen: user.hoTen || "",
        tenDangNhap: user.tenDangNhap || "",
        matKhau: user.matKhau || "",
        email: user.email || "",
        soDienThoai: user.soDienThoai || "",
        trangThai: user.trangThai || 1,
      });
    }
  }, []);

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.hoTen.trim()) {
      newErrors.hoTen = "Họ tên không được để trống";
    }

    if (!formData.tenDangNhap.trim()) {
      newErrors.tenDangNhap = "Tên đăng nhập không được để trống";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.soDienThoai.trim()) {
      newErrors.soDienThoai = "Số điện thoại không được để trống";
    } else if (!/^[0-9]{10,11}$/.test(formData.soDienThoai)) {
      newErrors.soDienThoai = "Số điện thoại không hợp lệ";
    }

    // Validate mật khẩu mới nếu có nhập
    if (newPassword.trim()) {
      if (newPassword.length < 6) {
        newErrors.newPassword = "Mật khẩu mới phải có ít nhất 6 ký tự";
      }
      if (newPassword !== confirmPassword) {
        newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Lấy id user từ currentUser
      const userId = currentUser?.id;
      if (!userId) throw new Error("Không tìm thấy ID người dùng!");

      // Cập nhật mật khẩu: nếu không nhập mới thì giữ mật khẩu cũ
      const updatedData = { ...formData };
      updatedData.matKhau = newPassword.trim()
        ? newPassword
        : currentUser?.matKhau || formData.matKhau;
      updatedData.ngayCapNhat = new Date().toISOString();

      // Gọi API cập nhật
      const updatedUser = await nguoiDungService.updateNguoiDung(
        currentUser.id,
        updatedData
      );
      // Cập nhật lại currentUser trong localStorage
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);

      setToast({
        visible: true,
        type: "success",
        message: "Cập nhật thông tin thành công!",
      });
      setTimeout(() => setToast((t) => ({ ...t, visible: false })), 1500);

      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setToast({
        visible: true,
        type: "error",
        message: "Có lỗi xảy ra khi cập nhật thông tin!",
      });
      console.error("Update error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  // Inline styles
  const containerStyle = {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  };

  const headerStyle = {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "30px",
  };

  const titleStyle = {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333",
    margin: 0,
  };

  const cardStyle = {
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    padding: "30px",
    marginBottom: "20px",
    border: "1px solid #e0e0e0",
  };

  const sectionTitleStyle = {
    fontSize: "18px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  };

  const formStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  };

  const rowStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  };

  const inputGroupStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  };

  const labelStyle = {
    fontSize: "14px",
    fontWeight: "500",
    color: "#555",
  };

  const inputStyle = {
    padding: "12px 16px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "14px",
    outline: "none",
  };

  const errorInputStyle = {
    ...inputStyle,
    borderColor: "#ff4444",
  };

  const passwordInputStyle = {
    ...inputStyle,
    paddingRight: "50px",
  };

  const errorPasswordInputStyle = {
    ...errorInputStyle,
    paddingRight: "50px",
  };

  const passwordToggleStyle = {
    position: "absolute",
    right: "15px",
    top: "50%",
    transform: "translateY(-50%)",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    color: "#007bff",
  };

  const errorStyle = {
    color: "#ff4444",
    fontSize: "12px",
    marginTop: "4px",
  };

  const buttonStyle = {
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "4px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    opacity: isLoading ? 0.7 : 1,
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const backButtonStyle = {
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "4px",
    fontSize: "14px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  };

  const infoStyle = {
    padding: "12px 16px",
    backgroundColor: "#e3f2fd",
    borderRadius: "4px",
    fontSize: "14px",
    color: "#1976d2",
    marginBottom: "20px",
    border: "1px solid #bbdefb",
  };

  if (!currentUser) {
    return (
      <div style={containerStyle}>
        <div style={infoStyle}>
          Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <button onClick={handleBack} style={backButtonStyle}>
          ← Quay lại
        </button>
        <h1 style={titleStyle}>Cài đặt tài khoản</h1>
      </div>

      {/* Thông tin tài khoản */}
      <div style={cardStyle}>
        <div style={sectionTitleStyle}>👤 Thông tin cá nhân</div>

        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={rowStyle}>
            {/* Mã */}
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Mã</label>
              <input
                type="text"
                name="ma"
                value={formData.ma}
                onChange={handleChange}
                style={inputStyle}
                disabled
                placeholder="Mã tài khoản"
              />
            </div>

            {/* Chức vụ */}
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Chức vụ</label>
              <input
                type="text"
                name="chucVu"
                value={formData.chucVu}
                onChange={handleChange}
                style={inputStyle}
                disabled
                placeholder="Chức vụ"
              />
            </div>
          </div>

          <div style={rowStyle}>
            {/* Họ tên */}
            <div style={inputGroupStyle}>
              <label style={labelStyle}>
                Họ tên <span style={{ color: "#ff4444" }}>*</span>
              </label>
              <input
                type="text"
                name="hoTen"
                value={formData.hoTen}
                onChange={handleChange}
                style={errors.hoTen ? errorInputStyle : inputStyle}
                placeholder="Nhập họ tên..."
              />
              {errors.hoTen && <div style={errorStyle}>{errors.hoTen}</div>}
            </div>

            {/* Tên đăng nhập */}
            <div style={inputGroupStyle}>
              <label style={labelStyle}>
                Tên đăng nhập <span style={{ color: "#ff4444" }}>*</span>
              </label>
              <input
                type="text"
                name="tenDangNhap"
                value={formData.tenDangNhap}
                onChange={handleChange}
                style={errors.tenDangNhap ? errorInputStyle : inputStyle}
                placeholder="Nhập tên đăng nhập..."
              />
              {errors.tenDangNhap && (
                <div style={errorStyle}>{errors.tenDangNhap}</div>
              )}
            </div>
          </div>

          <div style={rowStyle}>
            {/* Email */}
            <div style={inputGroupStyle}>
              <label style={labelStyle}>
                Email <span style={{ color: "#ff4444" }}>*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={errors.email ? errorInputStyle : inputStyle}
                placeholder="Nhập email..."
              />
              {errors.email && <div style={errorStyle}>{errors.email}</div>}
            </div>

            {/* Số điện thoại */}
            <div style={inputGroupStyle}>
              <label style={labelStyle}>
                Số điện thoại <span style={{ color: "#ff4444" }}>*</span>
              </label>
              <input
                type="tel"
                name="soDienThoai"
                value={formData.soDienThoai}
                onChange={handleChange}
                style={errors.soDienThoai ? errorInputStyle : inputStyle}
                placeholder="Nhập số điện thoại..."
              />
              {errors.soDienThoai && (
                <div style={errorStyle}>{errors.soDienThoai}</div>
              )}
            </div>
          </div>

          {/* Mật khẩu mới */}
          <div style={sectionTitleStyle}>🔒 Đổi mật khẩu (tùy chọn)</div>

          <div style={rowStyle}>
            {/* Mật khẩu mới */}
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Mật khẩu mới</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={
                    errors.newPassword
                      ? errorPasswordInputStyle
                      : passwordInputStyle
                  }
                  placeholder="Nhập mật khẩu mới..."
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  style={passwordToggleStyle}
                >
                  {showNewPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.newPassword && (
                <div style={errorStyle}>{errors.newPassword}</div>
              )}
            </div>

            {/* Xác nhận mật khẩu */}
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Xác nhận mật khẩu</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={errors.confirmPassword ? errorInputStyle : inputStyle}
                placeholder="Nhập lại mật khẩu mới..."
              />
              {errors.confirmPassword && (
                <div style={errorStyle}>{errors.confirmPassword}</div>
              )}
            </div>
          </div>

          {/* Nút cập nhật */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <button type="submit" style={buttonStyle} disabled={isLoading}>
              💾 {isLoading ? "Đang cập nhật..." : "Cập nhật thông tin"}
            </button>
          </div>
        </form>
      </div>

      {/* Toast notification */}
      {toast.visible && (
        <Toast
          type={toast.type}
          message={toast.message}
          visible={toast.visible}
          onClose={() => setToast((t) => ({ ...t, visible: false }))}
        />
      )}
    </div>
  );
};

export default Settings;
