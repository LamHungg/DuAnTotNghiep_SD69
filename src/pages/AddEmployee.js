import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSave, FaTimes, FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";

const AddEmployee = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ma: "",
    chuc_vu: "Nhân viên",
    ho_ten: "",
    ten_dang_nhap: "",
    mat_khau: "",
    email: "",
    so_dien_thoai: "",
    trang_thai: 1
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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

    if (!formData.ma.trim()) {
      newErrors.ma = "Mã nhân viên không được để trống";
    }

    if (!formData.ho_ten.trim()) {
      newErrors.ho_ten = "Họ tên không được để trống";
    }

    if (!formData.ten_dang_nhap.trim()) {
      newErrors.ten_dang_nhap = "Tên đăng nhập không được để trống";
    }

    if (!formData.mat_khau.trim()) {
      newErrors.mat_khau = "Mật khẩu không được để trống";
    } else if (formData.mat_khau.length < 6) {
      newErrors.mat_khau = "Mật khẩu phải có ít nhất 6 ký tự";
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        setIsLoading(true);
        // Xử lý lưu dữ liệu
        console.log("Dữ liệu nhân viên:", formData);
        alert("Thêm nhân viên thành công!");
        navigate("/dashboard/accounts");
      } catch (error) {
        alert("Có lỗi xảy ra khi thêm nhân viên!");
        console.error("Add employee error:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBack = () => {
    navigate("/dashboard/accounts");
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "8px",
    border: "1.5px solid #e5e7eb",
    fontSize: "15px",
    backgroundColor: "#fafbfc",
    transition: "all 0.2s"
  };

  const errorInputStyle = {
    ...inputStyle,
    borderColor: "#ef4444"
  };

  const labelStyle = {
    display: "block",
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151"
  };

  const errorStyle = {
    color: "#ef4444",
    fontSize: "12px",
    marginTop: "4px"
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "24px" }}>
      {/* Header */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: "32px" 
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button
            onClick={handleBack}
            style={{
              padding: "8px 12px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              backgroundColor: "white",
              color: "#374151",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <FaArrowLeft /> Quay lại
          </button>
          <div>
            <h2 style={{ fontWeight: "700", margin: "0 0 8px 0" }}>Thêm Nhân Viên</h2>
            <p style={{ margin: "0", color: "#6b7280" }}>
              Điền thông tin để tạo tài khoản nhân viên mới
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{
        backgroundColor: "white",
        borderRadius: "12px",
        padding: "32px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
      }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          {/* Mã nhân viên */}
          <div>
            <label style={labelStyle}>
              Mã nhân viên <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="text"
              name="ma"
              value={formData.ma}
              onChange={handleChange}
              style={errors.ma ? errorInputStyle : inputStyle}
              placeholder="Nhập mã nhân viên..."
            />
            {errors.ma && <div style={errorStyle}>{errors.ma}</div>}
          </div>

          {/* Họ tên */}
          <div>
            <label style={labelStyle}>
              Họ tên <span style={{ color: "#ef4444" }}>*</span>
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
          <div>
            <label style={labelStyle}>
              Tên đăng nhập <span style={{ color: "#ef4444" }}>*</span>
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

          {/* Mật khẩu */}
          <div>
            <label style={labelStyle}>
              Mật khẩu <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                name="mat_khau"
                value={formData.mat_khau}
                onChange={handleChange}
                style={errors.mat_khau ? errorInputStyle : inputStyle}
                placeholder="Nhập mật khẩu..."
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#6b7280"
                }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.mat_khau && <div style={errorStyle}>{errors.mat_khau}</div>}
          </div>

          {/* Email */}
          <div>
            <label style={labelStyle}>
              Email <span style={{ color: "#ef4444" }}>*</span>
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
          <div>
            <label style={labelStyle}>
              Số điện thoại <span style={{ color: "#ef4444" }}>*</span>
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

        {/* Buttons */}
        <div style={{ 
          display: "flex", 
          gap: "12px", 
          justifyContent: "flex-end", 
          marginTop: "32px",
          paddingTop: "24px",
          borderTop: "1px solid #e5e7eb"
        }}>
          <button
            type="button"
            onClick={handleBack}
            style={{
              padding: "12px 24px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              backgroundColor: "white",
              color: "#374151",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <FaTimes /> Hủy
          </button>
          <button
            type="submit"
            style={{
              padding: "12px 24px",
              border: "none",
              borderRadius: "8px",
              backgroundColor: "#7c3aed",
              color: "white",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <FaSave /> Lưu
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEmployee; 