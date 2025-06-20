import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaToggleOn, FaToggleOff } from "react-icons/fa";

const Materials = () => {
  const navigate = useNavigate();
  const [materials, setMaterials] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMaterial, setNewMaterial] = useState({
    ten_chat_lieu: "",
    trang_thai: 1
  });
  const [errors, setErrors] = useState({});

  // Dữ liệu mẫu từ database
  const sampleMaterials = [
    {
      id: 1,
      ten_chat_lieu: "Cotton",
      trang_thai: 1
    },
    {
      id: 2,
      ten_chat_lieu: "Polyester",
      trang_thai: 1
    },
    {
      id: 3,
      ten_chat_lieu: "Lụa",
      trang_thai: 1
    },
    {
      id: 4,
      ten_chat_lieu: "Nỉ",
      trang_thai: 1
    },
    {
      id: 5,
      ten_chat_lieu: "Denim",
      trang_thai: 1
    },
    {
      id: 6,
      ten_chat_lieu: "Len",
      trang_thai: 0
    },
    {
      id: 7,
      ten_chat_lieu: "Vải lanh",
      trang_thai: 1
    },
    {
      id: 8,
      ten_chat_lieu: "Vải thun",
      trang_thai: 1
    },
    {
      id: 9,
      ten_chat_lieu: "Vải kaki",
      trang_thai: 0
    },
    {
      id: 10,
      ten_chat_lieu: "Vải voan",
      trang_thai: 1
    }
  ];

  useEffect(() => {
    // Lấy dữ liệu từ localStorage hoặc sử dụng dữ liệu mẫu
    const savedMaterials = JSON.parse(localStorage.getItem("materials") || "[]");
    console.log("Saved materials:", savedMaterials);
    if (savedMaterials.length === 0) {
      localStorage.setItem("materials", JSON.stringify(sampleMaterials));
      setMaterials(sampleMaterials);
      console.log("Set sample materials:", sampleMaterials);
    } else {
      setMaterials(savedMaterials);
      console.log("Set saved materials:", savedMaterials);
    }
  }, []);

  const filteredMaterials = materials.filter((material) => {
    const matchesSearch = material.ten_chat_lieu.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "" || material.trang_thai === parseInt(statusFilter);
    return matchesSearch && matchesStatus;
  });

  console.log("Filtered materials:", filteredMaterials);

  const handleAddNew = () => {
    setShowAddForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    const newErrors = {};
    if (!newMaterial.ten_chat_lieu.trim()) {
      newErrors.ten_chat_lieu = "Tên chất liệu không được để trống";
    }
    
    // Kiểm tra trùng lặp
    const isDuplicate = materials.some(material => 
      material.ten_chat_lieu.toLowerCase() === newMaterial.ten_chat_lieu.toLowerCase()
    );
    if (isDuplicate) {
      newErrors.ten_chat_lieu = "Chất liệu này đã tồn tại";
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      const materialToAdd = {
        id: Date.now(),
        ...newMaterial
      };
      
      const updatedMaterials = [...materials, materialToAdd];
      setMaterials(updatedMaterials);
      localStorage.setItem("materials", JSON.stringify(updatedMaterials));
      
      setNewMaterial({
        ten_chat_lieu: "",
        trang_thai: 1
      });
      setShowAddForm(false);
      setErrors({});
      
      alert("Thêm chất liệu thành công!");
    }
  };

  const handleToggleStatus = (id) => {
    const updatedMaterials = materials.map(material => {
      if (material.id === id) {
        return {
          ...material,
          trang_thai: material.trang_thai === 1 ? 0 : 1
        };
      }
      return material;
    });
    
    setMaterials(updatedMaterials);
    localStorage.setItem("materials", JSON.stringify(updatedMaterials));
    
    const material = materials.find(m => m.id === id);
    const statusText = material.trang_thai === 1 ? "tắt" : "bật";
    alert(`Đã ${statusText} trạng thái chất liệu "${material.ten_chat_lieu}"!`);
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
        <h1 style={titleStyle}>Quản lý Chất liệu</h1>
        <button onClick={handleAddNew} style={buttonStyle}>
          + Thêm chất liệu
        </button>
      </div>

      {/* Form thêm mới */}
      {showAddForm && (
        <div style={addFormStyle}>
          <h3 style={{ marginTop: 0, marginBottom: "20px" }}>Thêm chất liệu mới</h3>
          <form onSubmit={handleSubmit}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>
                Tên chất liệu <span style={{ color: "#dc3545" }}>*</span>
              </label>
              <input
                type="text"
                value={newMaterial.ten_chat_lieu}
                onChange={(e) => setNewMaterial({...newMaterial, ten_chat_lieu: e.target.value})}
                style={errors.ten_chat_lieu ? {...inputStyle, borderColor: "#dc3545"} : inputStyle}
                placeholder="Nhập tên chất liệu..."
              />
              {errors.ten_chat_lieu && <div style={errorStyle}>{errors.ten_chat_lieu}</div>}
            </div>
            
            <div style={formGroupStyle}>
              <label style={labelStyle}>Trạng thái</label>
              <select
                value={newMaterial.trang_thai}
                onChange={(e) => setNewMaterial({...newMaterial, trang_thai: parseInt(e.target.value)})}
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
              placeholder="Tìm theo tên chất liệu..."
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
            <th style={thStyle}>Tên chất liệu</th>
            <th style={thStyle}>Trạng thái</th>
            <th style={thStyle}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filteredMaterials.map((material) => (
            <tr key={material.id}>
              <td style={tdStyle}>{material.ten_chat_lieu}</td>
              <td style={tdStyle}>
                <span style={getStatusBadgeStyle(material.trang_thai)}>
                  {getStatusText(material.trang_thai)}
                </span>
              </td>
              <td style={tdStyle}>
                <button
                  onClick={() => handleToggleStatus(material.id)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "20px",
                    color: material.trang_thai === 1 ? "#10b981" : "#6b7280",
                    transition: "color 0.2s"
                  }}
                  title={material.trang_thai === 1 ? "Tắt hoạt động" : "Bật hoạt động"}
                >
                  {material.trang_thai === 1 ? <FaToggleOn /> : <FaToggleOff />}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredMaterials.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
          Không tìm thấy chất liệu nào
        </div>
      )}
    </div>
  );
};

export default Materials; 