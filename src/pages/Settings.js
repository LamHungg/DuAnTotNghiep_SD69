import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    ma: "",
    chuc_vu: "",
    ho_ten: "",
    ten_dang_nhap: "",
    mat_khau: "",
    email: "",
    so_dien_thoai: "",
    trang_thai: 1
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Lấy thông tin user hiện tại khi component mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (user) {
      setCurrentUser(user);
      setFormData({
        ma: user.ma || "",
        chuc_vu: user.chuc_vu || "",
        ho_ten: user.ho_ten || "",
        ten_dang_nhap: user.ten_dang_nhap || "",
        mat_khau: user.mat_khau || "",
        email: user.email || "",
        so_dien_thoai: user.so_dien_thoai || "",
        trang_thai: user.trang_thai || 1
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.ho_ten.trim()) {
      newErrors.ho_ten = "Họ tên không được để trống";
    }

    if (!formData.ten_dang_nhap.trim()) {
      newErrors.ten_dang_nhap = "Tên đăng nhập không được để trống";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.so_dien_thoai.trim()) {
      newErrors.so_dien_thoai = "Số điện thoại không được để trống";
    } else if (!/^[0-9]{10,11}$/.test(formData.so_dien_thoai)) {
      newErrors.so_dien_thoai = "Số điện thoại không hợp lệ";
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
      // Cập nhật mật khẩu nếu có nhập mật khẩu mới
      const updatedData = { ...formData };
      if (newPassword.trim()) {
        updatedData.mat_khau = newPassword;
      }

      // Cập nhật ngày cập nhật
      updatedData.ngay_cap_nhat = new Date().toISOString();

      // Cập nhật trong localStorage
      const employees = JSON.parse(localStorage.getItem("employees") || "[]");
      const admins = JSON.parse(localStorage.getItem("admins") || "[]");

      let updated = false;

      // Tìm và cập nhật trong employees
      const updatedEmployees = employees.map(emp => {
        if (emp.ten_dang_nhap === currentUser.ten_dang_nhap) {
          updated = true;
          return { ...emp, ...updatedData };
        }
        return emp;
      });

      // Tìm và cập nhật trong admins
      const updatedAdmins = admins.map(admin => {
        if (admin.ten_dang_nhap === currentUser.ten_dang_nhap) {
          updated = true;
          return { ...admin, ...updatedData };
        }
        return admin;
      });

      if (updated) {
        // Lưu lại vào localStorage
        localStorage.setItem("employees", JSON.stringify(updatedEmployees));
        localStorage.setItem("admins", JSON.stringify(updatedAdmins));
        
        // Cập nhật currentUser
        const updatedUser = { ...currentUser, ...updatedData };
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);
        
        alert("Cập nhật thông tin thành công!");
        
        // Reset form mật khẩu
        setNewPassword("");
        setConfirmPassword("");
      } else {
        alert("Không tìm thấy tài khoản để cập nhật!");
      }
    } catch (error) {
      alert("Có lỗi xảy ra khi cập nhật thông tin!");
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
    fontFamily: "Arial, sans-serif"
  };

  const headerStyle = {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "30px"
  };

  const titleStyle = {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333",
    margin: 0
  };

  const cardStyle = {
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    padding: "30px",
    marginBottom: "20px",
    border: "1px solid #e0e0e0"
  };

  const sectionTitleStyle = {
    fontSize: "18px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    gap: "10px"
  };

  const formStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  };

  const rowStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px"
  };

  const inputGroupStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  };

  const labelStyle = {
    fontSize: "14px",
    fontWeight: "500",
    color: "#555"
  };

  const inputStyle = {
    padding: "12px 16px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "14px",
    outline: "none"
  };

  const errorInputStyle = {
    ...inputStyle,
    borderColor: "#ff4444"
  };

  const passwordInputStyle = {
    ...inputStyle,
    paddingRight: "50px"
  };

  const errorPasswordInputStyle = {
    ...errorInputStyle,
    paddingRight: "50px"
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
    color: "#007bff"
  };

  const errorStyle = {
    color: "#ff4444",
    fontSize: "12px",
    marginTop: "4px"
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
    gap: "8px"
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
    gap: "6px"
  };

  const infoStyle = {
    padding: "12px 16px",
    backgroundColor: "#e3f2fd",
    borderRadius: "4px",
    fontSize: "14px",
    color: "#1976d2",
    marginBottom: "20px",
    border: "1px solid #bbdefb"
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
        <div style={sectionTitleStyle}>
          👤 Thông tin cá nhân
        </div>
        
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
                name="chuc_vu"
                value={formData.chuc_vu}
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
                name="ho_ten"
                value={formData.ho_ten}
                onChange={handleChange}
                style={errors.ho_ten ? errorInputStyle : inputStyle}
                placeholder="Nhập họ tên..."
              />
              {errors.ho_ten && <div style={errorStyle}>{errors.ho_ten}</div>}
            </div>

            {/* Tên đăng nhập */}
            <div style={inputGroupStyle}>
              <label style={labelStyle}>
                Tên đăng nhập <span style={{ color: "#ff4444" }}>*</span>
              </label>
              <input
                type="text"
                name="ten_dang_nhap"
                value={formData.ten_dang_nhap}
                onChange={handleChange}
                style={errors.ten_dang_nhap ? errorInputStyle : inputStyle}
                placeholder="Nhập tên đăng nhập..."
              />
              {errors.ten_dang_nhap && <div style={errorStyle}>{errors.ten_dang_nhap}</div>}
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
                name="so_dien_thoai"
                value={formData.so_dien_thoai}
                onChange={handleChange}
                style={errors.so_dien_thoai ? errorInputStyle : inputStyle}
                placeholder="Nhập số điện thoại..."
              />
              {errors.so_dien_thoai && <div style={errorStyle}>{errors.so_dien_thoai}</div>}
            </div>
          </div>

          {/* Mật khẩu hiện tại */}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Mật khẩu hiện tại</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={formData.mat_khau}
                style={passwordInputStyle}
                disabled
                placeholder="Mật khẩu hiện tại"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={passwordToggleStyle}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Mật khẩu mới */}
          <div style={sectionTitleStyle}>
            🔒 Đổi mật khẩu (tùy chọn)
          </div>

          <div style={rowStyle}>
            {/* Mật khẩu mới */}
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Mật khẩu mới</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={errors.newPassword ? errorPasswordInputStyle : passwordInputStyle}
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
              {errors.newPassword && <div style={errorStyle}>{errors.newPassword}</div>}
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
              {errors.confirmPassword && <div style={errorStyle}>{errors.confirmPassword}</div>}
            </div>
          </div>

          {/* Nút cập nhật */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
            <button
              type="submit"
              style={buttonStyle}
              disabled={isLoading}
            >
              💾 {isLoading ? "Đang cập nhật..." : "Cập nhật thông tin"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings; 