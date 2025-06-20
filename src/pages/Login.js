import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ten_dang_nhap: "",
    mat_khau: ""
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Tạo dữ liệu demo khi component mount
  useEffect(() => {
    const employees = localStorage.getItem("employees");
    const admins = localStorage.getItem("admins");
    
    // Nếu chưa có dữ liệu, tạo dữ liệu demo
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
          ngay_cap_nhat: new Date().toISOString()
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
          ngay_cap_nhat: new Date().toISOString()
        }
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
          ngay_cap_nhat: new Date().toISOString()
        }
      ];
      localStorage.setItem("admins", JSON.stringify(demoAdmins));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.ten_dang_nhap.trim()) {
      newErrors.ten_dang_nhap = "Tên đăng nhập không được để trống";
    }

    if (!formData.mat_khau.trim()) {
      newErrors.mat_khau = "Mật khẩu không được để trống";
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
      const employees = JSON.parse(localStorage.getItem("employees") || "[]");
      const admins = JSON.parse(localStorage.getItem("admins") || "[]");

      const user = [...employees, ...admins].find(
        account => 
          account.ten_dang_nhap === formData.ten_dang_nhap && 
          account.mat_khau === formData.mat_khau &&
          account.trang_thai === 1
      );

      if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user));
        localStorage.setItem("isLoggedIn", "true");
        
        alert("Đăng nhập thành công!");
        navigate("/dashboard");
      } else {
        alert("Tên đăng nhập hoặc mật khẩu không đúng, hoặc tài khoản đã bị khóa!");
      }
    } catch (error) {
      alert("Có lỗi xảy ra khi đăng nhập!");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Modern and beautiful styles
  const containerStyle = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    position: "relative",
    overflow: "hidden"
  };

  const backgroundAnimationStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%), linear-gradient(-45deg, rgba(255,255,255,0.1) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.1) 75%), linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.1) 75%)",
    backgroundSize: "20px 20px",
    backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
    animation: "move 20s linear infinite"
  };

  const cardStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(10px)",
    borderRadius: "20px",
    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
    padding: "50px",
    width: "100%",
    maxWidth: "450px",
    textAlign: "center",
    position: "relative",
    zIndex: 1,
    border: "1px solid rgba(255, 255, 255, 0.2)"
  };

  const logoStyle = {
    fontSize: "4rem",
    marginBottom: "20px",
    background: "linear-gradient(45deg, #667eea, #764ba2)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text"
  };

  const brandStyle = {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "5px",
    letterSpacing: "2px"
  };

  const subtitleStyle = {
    color: "#666",
    marginBottom: "40px",
    fontSize: "16px",
    fontWeight: "300"
  };

  const formStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "25px"
  };

  const inputGroupStyle = {
    position: "relative"
  };

  const inputStyle = {
    width: "100%",
    padding: "18px 20px",
    border: "2px solid #e1e5e9",
    borderRadius: "15px",
    fontSize: "16px",
    transition: "all 0.3s ease",
    boxSizing: "border-box",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    outline: "none"
  };

  const inputFocusStyle = {
    borderColor: "#667eea",
    boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
    transform: "translateY(-2px)"
  };

  const errorInputStyle = {
    ...inputStyle,
    borderColor: "#ff6b6b",
    boxShadow: "0 0 0 3px rgba(255, 107, 107, 0.1)"
  };

  const passwordInputStyle = {
    ...inputStyle,
    paddingRight: "60px"
  };

  const errorPasswordInputStyle = {
    ...errorInputStyle,
    paddingRight: "60px"
  };

  const passwordToggleStyle = {
    position: "absolute",
    right: "20px",
    top: "50%",
    transform: "translateY(-50%)",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: "20px",
    color: "#667eea",
    transition: "all 0.3s ease",
    padding: "5px"
  };

  const errorStyle = {
    color: "#ff6b6b",
    fontSize: "14px",
    marginTop: "8px",
    textAlign: "left",
    fontWeight: "500"
  };

  const buttonStyle = {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    border: "none",
    padding: "18px",
    borderRadius: "15px",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.3s ease",
    opacity: isLoading ? 0.7 : 1,
    boxShadow: "0 10px 30px rgba(102, 126, 234, 0.3)",
    position: "relative",
    overflow: "hidden"
  };

  const buttonHoverStyle = {
    transform: "translateY(-3px)",
    boxShadow: "0 15px 40px rgba(102, 126, 234, 0.4)"
  };

  const demoStyle = {
    marginTop: "30px",
    padding: "20px",
    backgroundColor: "rgba(102, 126, 234, 0.1)",
    borderRadius: "15px",
    fontSize: "14px",
    color: "#667eea",
    border: "1px solid rgba(102, 126, 234, 0.2)"
  };

  const demoTitleStyle = {
    fontWeight: "bold",
    marginBottom: "10px",
    fontSize: "16px"
  };

  const demoAccountStyle = {
    margin: "5px 0",
    fontSize: "13px"
  };

  return (
    <div style={containerStyle}>
      <div style={backgroundAnimationStyle}></div>
      <div style={cardStyle}>
        <div style={logoStyle}>👔</div>
        <div style={brandStyle}>ZMEN</div>
        <div style={subtitleStyle}>Admin Dashboard</div>

        <form onSubmit={handleSubmit} style={formStyle}>
          {/* Tên đăng nhập */}
          <div style={inputGroupStyle}>
            <input
              type="text"
              name="ten_dang_nhap"
              value={formData.ten_dang_nhap}
              onChange={handleChange}
              style={errors.ten_dang_nhap ? errorInputStyle : inputStyle}
              placeholder="Tên đăng nhập"
              disabled={isLoading}
              onFocus={(e) => {
                if (!errors.ten_dang_nhap) {
                  e.target.style.borderColor = "#667eea";
                  e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                  e.target.style.transform = "translateY(-2px)";
                }
              }}
              onBlur={(e) => {
                if (!errors.ten_dang_nhap) {
                  e.target.style.borderColor = "#e1e5e9";
                  e.target.style.boxShadow = "none";
                  e.target.style.transform = "translateY(0)";
                }
              }}
            />
            {errors.ten_dang_nhap && <div style={errorStyle}>{errors.ten_dang_nhap}</div>}
          </div>

          {/* Mật khẩu */}
          <div style={inputGroupStyle}>
            <input
              type={showPassword ? "text" : "password"}
              name="mat_khau"
              value={formData.mat_khau}
              onChange={handleChange}
              style={errors.mat_khau ? errorPasswordInputStyle : passwordInputStyle}
              placeholder="Mật khẩu"
              disabled={isLoading}
              onFocus={(e) => {
                if (!errors.mat_khau) {
                  e.target.style.borderColor = "#667eea";
                  e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                  e.target.style.transform = "translateY(-2px)";
                }
              }}
              onBlur={(e) => {
                if (!errors.mat_khau) {
                  e.target.style.borderColor = "#e1e5e9";
                  e.target.style.boxShadow = "none";
                  e.target.style.transform = "translateY(0)";
                }
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={passwordToggleStyle}
              disabled={isLoading}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-50%) scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(-50%) scale(1)";
              }}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
            {errors.mat_khau && <div style={errorStyle}>{errors.mat_khau}</div>}
          </div>

          {/* Nút đăng nhập */}
          <button
            type="submit"
            style={buttonStyle}
            disabled={isLoading}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.target.style.transform = "translateY(-3px)";
                e.target.style.boxShadow = "0 15px 40px rgba(102, 126, 234, 0.4)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 10px 30px rgba(102, 126, 234, 0.3)";
              }
            }}
          >
            {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        {/* Demo accounts */}
        <div style={demoStyle}>
          <div style={demoTitleStyle}>Tài khoản demo:</div>
          <div style={demoAccountStyle}>
            <strong>Admin:</strong> admin / 123456
          </div>
          <div style={demoAccountStyle}>
            <strong>Nhân viên:</strong> nv001 / 123456
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 