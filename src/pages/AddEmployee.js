import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSave,
  FaTimes,
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
} from "react-icons/fa";
import nguoiDungService from "../services/nguoiDungService";
import Toast from "../components/Toast";

const AddEmployee = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    hoTen: "",
    tenDangNhap: "",
    matKhau: "",
    email: "",
    soDienThoai: "",
    chucVu: "Nhân viên",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({
    visible: false,
    type: "info",
    message: "",
  });

  const validateForm = () => {
    const newErrors = {};

    if (!formData.hoTen.trim()) {
      newErrors.hoTen = "Họ tên không được để trống";
    }

    if (!formData.tenDangNhap.trim()) {
      newErrors.tenDangNhap = "Tên đăng nhập không được để trống";
    }

    if (!formData.matKhau.trim()) {
      newErrors.matKhau = "Mật khẩu không được để trống";
    } else if (formData.matKhau.length < 6) {
      newErrors.matKhau = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.soDienThoai.trim()) {
      newErrors.soDienThoai = "Số điện thoại không được để trống";
    } else if (!/^[0-9]{10}$/.test(formData.soDienThoai)) {
      newErrors.soDienThoai = "Số điện thoại phải có 10 chữ số";
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
      // Kiểm tra xem người dùng đã đăng nhập chưa
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      if (!currentUser) {
        setToast({
          visible: true,
          type: "error",
          message: "Vui lòng đăng nhập lại để thực hiện chức năng này!",
        });
        setTimeout(() => setToast((t) => ({ ...t, visible: false })), 1500);
        navigate("/login");
        return;
      }

      const employeeData = {
        ...formData,
        trangThai: true,
      };

      console.log("Sending employee data:", employeeData);

      const response = await nguoiDungService.createNguoiDung(employeeData);
      console.log("Server response:", response);

      setToast({
        visible: true,
        type: "success",
        message: "Thêm nhân viên thành công!",
      });
      setTimeout(() => setToast((t) => ({ ...t, visible: false })), 1500);
      navigate("/dashboard/accounts");
    } catch (error) {
      console.error("Error details:", error.response || error);

      if (error.response?.status === 401) {
        setToast({
          visible: true,
          type: "error",
          message: "Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại!",
        });
        setTimeout(() => setToast((t) => ({ ...t, visible: false })), 1500);
        navigate("/login");
      } else if (error.response?.data?.message) {
        setToast({
          visible: true,
          type: "error",
          message: error.response.data.message,
        });
        setTimeout(() => setToast((t) => ({ ...t, visible: false })), 1500);
      } else {
        setToast({
          visible: true,
          type: "error",
          message: "Có lỗi xảy ra khi thêm nhân viên. Vui lòng thử lại!",
        });
        setTimeout(() => setToast((t) => ({ ...t, visible: false })), 1500);
      }
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "8px",
    border: "1.5px solid #e5e7eb",
    fontSize: "15px",
    backgroundColor: "#fafbfc",
    transition: "all 0.2s",
  };

  const errorInputStyle = {
    ...inputStyle,
    borderColor: "#ef4444",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
  };

  const errorStyle = {
    color: "#ef4444",
    fontSize: "12px",
    marginTop: "4px",
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "24px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button
            onClick={() => navigate("/dashboard/accounts")}
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
              gap: "8px",
            }}
          >
            <FaArrowLeft /> Quay lại
          </button>
          <div>
            <h2 style={{ fontWeight: "700", margin: "0 0 8px 0" }}>
              Thêm Nhân Viên
            </h2>
            <p style={{ margin: "0", color: "#6b7280" }}>
              Điền thông tin để tạo tài khoản nhân viên mới
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "32px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
          }}
        >
          {/* Họ tên */}
          <div>
            <label style={labelStyle}>
              Họ tên <span style={{ color: "#ef4444" }}>*</span>
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
          <div>
            <label style={labelStyle}>
              Tên đăng nhập <span style={{ color: "#ef4444" }}>*</span>
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

          {/* Mật khẩu */}
          <div>
            <label style={labelStyle}>
              Mật khẩu <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="password"
              name="matKhau"
              value={formData.matKhau}
              onChange={handleChange}
              style={errors.matKhau ? errorInputStyle : inputStyle}
              placeholder="Nhập mật khẩu..."
            />
            {errors.matKhau && <div style={errorStyle}>{errors.matKhau}</div>}
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

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "flex-end",
            marginTop: "32px",
            paddingTop: "24px",
            borderTop: "1px solid #e5e7eb",
          }}
        >
          <button
            type="button"
            onClick={() => navigate("/dashboard/accounts")}
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
              gap: "8px",
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
              gap: "8px",
            }}
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Thêm nhân viên"}
          </button>
        </div>
      </form>

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

export default AddEmployee;
