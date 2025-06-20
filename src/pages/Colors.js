import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaToggleOn, FaToggleOff } from "react-icons/fa";

const Colors = () => {
  const navigate = useNavigate();
  const [colors, setColors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newColor, setNewColor] = useState({
    ten_mau_sac: "",
    trang_thai: 1
  });
  const [errors, setErrors] = useState({});

  // Dữ liệu mẫu từ database
  const sampleColors = [
    {
      id: 1,
      ten_mau_sac: "Đen",
      trang_thai: 1
    },
    {
      id: 2,
      ten_mau_sac: "Trắng",
      trang_thai: 1
    },
    {
      id: 3,
      ten_mau_sac: "Xanh dương",
      trang_thai: 1
    },
    {
      id: 4,
      ten_mau_sac: "Đỏ",
      trang_thai: 1
    },
    {
      id: 5,
      ten_mau_sac: "Xanh lá",
      trang_thai: 0
    },
    {
      id: 6,
      ten_mau_sac: "Vàng",
      trang_thai: 1
    },
    {
      id: 7,
      ten_mau_sac: "Cam",
      trang_thai: 1
    },
    {
      id: 8,
      ten_mau_sac: "Tím",
      trang_thai: 0
    }
  ];

  useEffect(() => {
    // Lấy dữ liệu từ localStorage hoặc sử dụng dữ liệu mẫu
    const savedColors = JSON.parse(localStorage.getItem("colors") || "[]");
    console.log("Saved colors:", savedColors);
    if (savedColors.length === 0) {
      localStorage.setItem("colors", JSON.stringify(sampleColors));
      setColors(sampleColors);
      console.log("Set sample colors:", sampleColors);
    } else {
      setColors(savedColors);
      console.log("Set saved colors:", savedColors);
    }
  }, []);

  const filteredColors = colors.filter((color) => {
    const matchesSearch = color.ten_mau_sac.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "" || color.trang_thai === parseInt(statusFilter);
    return matchesSearch && matchesStatus;
  });

  console.log("Filtered colors:", filteredColors);

  const handleAddNew = () => {
    setShowAddForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    const newErrors = {};
    if (!newColor.ten_mau_sac.trim()) {
      newErrors.ten_mau_sac = "Tên màu sắc không được để trống";
    }
    
    // Kiểm tra trùng lặp
    const isDuplicate = colors.some(color => 
      color.ten_mau_sac.toLowerCase() === newColor.ten_mau_sac.toLowerCase()
    );
    if (isDuplicate) {
      newErrors.ten_mau_sac = "Màu sắc này đã tồn tại";
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      const colorToAdd = {
        id: Date.now(),
        ...newColor
      };
      
      const updatedColors = [...colors, colorToAdd];
      setColors(updatedColors);
      localStorage.setItem("colors", JSON.stringify(updatedColors));
      
      setNewColor({
        ten_mau_sac: "",
        trang_thai: 1
      });
      setShowAddForm(false);
      setErrors({});
      
      alert("Thêm màu sắc thành công!");
    }
  };

  const handleToggleStatus = (id) => {
    const updatedColors = colors.map(color => {
      if (color.id === id) {
        return {
          ...color,
          trang_thai: color.trang_thai === 1 ? 0 : 1
        };
      }
      return color;
    });
    
    setColors(updatedColors);
    localStorage.setItem("colors", JSON.stringify(updatedColors));
    
    const color = colors.find(c => c.id === id);
    const statusText = color.trang_thai === 1 ? "tắt" : "bật";
    alert(`Đã ${statusText} trạng thái màu "${color.ten_mau_sac}"!`);
  };

  const getStatusText = (status) => {
    return status === 1 ? "Hoạt động" : "Không hoạt động";
  };

  const getStatusBadgeStyle = (status) => {
    return {
      padding: "4px 8px",
      borderRadius: "12px",
      fontSize: "12px",
      fontWeight: "600",
      backgroundColor: status === 1 ? "#d1fae5" : "#fee2e2",
      color: status === 1 ? "#065f46" : "#991b1b"
    };
  };

  const getColorPreviewStyle = (colorName) => {
    const colorMap = {
      "Đen": "#000000",
      "Trắng": "#FFFFFF",
      "Xanh dương": "#0066CC",
      "Đỏ": "#FF0000",
      "Xanh lá": "#00FF00",
      "Vàng": "#FFFF00",
      "Cam": "#FF6600",
      "Tím": "#6600CC"
    };
    
    return {
      width: "20px",
      height: "20px",
      borderRadius: "50%",
      backgroundColor: colorMap[colorName] || "#CCCCCC",
      border: "1px solid #ddd",
      display: "inline-block",
      marginRight: "8px"
    };
  };

  // Styles
  const containerStyle = {
    padding: "20px"
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px"
  };

  const titleStyle = {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333",
    margin: 0
  };

  const searchSectionStyle = {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    marginBottom: "20px"
  };

  const formStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr auto",
    gap: "15px",
    alignItems: "end"
  };

  const inputStyle = {
    padding: "10px 12px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "14px"
  };

  const selectStyle = {
    padding: "10px 12px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "14px"
  };

  const buttonStyle = {
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px"
  };

  const tableStyle = {
    width: "100%",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    overflow: "hidden"
  };

  const thStyle = {
    backgroundColor: "#f8f9fa",
    padding: "12px",
    textAlign: "left",
    borderBottom: "1px solid #dee2e6",
    fontWeight: "600"
  };

  const tdStyle = {
    padding: "12px",
    borderBottom: "1px solid #dee2e6"
  };

  const toggleButtonStyle = {
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    padding: "4px"
  };

  const addFormStyle = {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    marginBottom: "20px"
  };

  const formGroupStyle = {
    marginBottom: "15px"
  };

  const labelStyle = {
    display: "block",
    marginBottom: "5px",
    fontWeight: "500"
  };

  const errorStyle = {
    color: "#dc3545",
    fontSize: "12px",
    marginTop: "4px"
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h1 style={titleStyle}>Quản lý Màu sắc</h1>
        <button onClick={handleAddNew} style={buttonStyle}>
          + Thêm màu sắc
        </button>
      </div>

      {/* Form thêm mới */}
      {showAddForm && (
        <div style={addFormStyle}>
          <h3 style={{ marginTop: 0, marginBottom: "20px" }}>Thêm màu sắc mới</h3>
          <form onSubmit={handleSubmit}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>
                Tên màu sắc <span style={{ color: "#dc3545" }}>*</span>
              </label>
              <input
                type="text"
                value={newColor.ten_mau_sac}
                onChange={(e) => setNewColor({...newColor, ten_mau_sac: e.target.value})}
                style={errors.ten_mau_sac ? {...inputStyle, borderColor: "#dc3545"} : inputStyle}
                placeholder="Nhập tên màu sắc..."
              />
              {errors.ten_mau_sac && <div style={errorStyle}>{errors.ten_mau_sac}</div>}
            </div>
            
            <div style={formGroupStyle}>
              <label style={labelStyle}>Trạng thái</label>
              <select
                value={newColor.trang_thai}
                onChange={(e) => setNewColor({...newColor, trang_thai: parseInt(e.target.value)})}
                style={selectStyle}
              >
                <option value={1}>Hoạt động</option>
                <option value={0}>Không hoạt động</option>
              </select>
            </div>
            
            <div style={{ display: "flex", gap: "10px" }}>
              <button type="submit" style={buttonStyle}>
                Lưu
              </button>
              <button 
                type="button" 
                onClick={() => setShowAddForm(false)}
                style={{...buttonStyle, backgroundColor: "#6c757d"}}
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tìm kiếm và lọc */}
      <div style={searchSectionStyle}>
        <div style={formStyle}>
          <div>
            <label style={labelStyle}>Tìm kiếm</label>
            <input
              type="text"
              placeholder="Tìm theo tên màu sắc..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Trạng thái</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={selectStyle}
            >
              <option value="">Tất cả</option>
              <option value="1">Hoạt động</option>
              <option value="0">Không hoạt động</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bảng dữ liệu */}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Tên màu</th>
            <th style={thStyle}>Trạng thái</th>
            <th style={thStyle}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filteredColors.map((color) => (
            <tr key={color.id}>
              <td style={tdStyle}>{color.ten_mau_sac}</td>
              <td style={tdStyle}>
                <span style={getStatusBadgeStyle(color.trang_thai)}>
                  {getStatusText(color.trang_thai)}
                </span>
              </td>
              <td style={tdStyle}>
                <button
                  onClick={() => handleToggleStatus(color.id)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "20px",
                    color: color.trang_thai === 1 ? "#10b981" : "#6b7280",
                    transition: "color 0.2s"
                  }}
                  title={color.trang_thai === 1 ? "Tắt hoạt động" : "Bật hoạt động"}
                >
                  {color.trang_thai === 1 ? <FaToggleOn /> : <FaToggleOff />}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredColors.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
          Không tìm thấy màu sắc nào
        </div>
      )}
    </div>
  );
};

export default Colors; 