import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaToggleOn, FaToggleOff } from "react-icons/fa";

const Sizes = () => {
  const navigate = useNavigate();
  const [sizes, setSizes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSize, setNewSize] = useState({
    ten_kich_co: "",
    trang_thai: 1
  });
  const [errors, setErrors] = useState({});

  // Dữ liệu mẫu từ database
  const sampleSizes = [
    {
      id: 1,
      ten_kich_co: "XS",
      trang_thai: 1
    },
    {
      id: 2,
      ten_kich_co: "S",
      trang_thai: 1
    },
    {
      id: 3,
      ten_kich_co: "M",
      trang_thai: 1
    },
    {
      id: 4,
      ten_kich_co: "L",
      trang_thai: 1
    },
    {
      id: 5,
      ten_kich_co: "XL",
      trang_thai: 1
    },
    {
      id: 6,
      ten_kich_co: "XXL",
      trang_thai: 1
    },
    {
      id: 7,
      ten_kich_co: "XXXL",
      trang_thai: 0
    },
    {
      id: 8,
      ten_kich_co: "28",
      trang_thai: 1
    },
    {
      id: 9,
      ten_kich_co: "29",
      trang_thai: 1
    },
    {
      id: 10,
      ten_kich_co: "30",
      trang_thai: 1
    },
    {
      id: 11,
      ten_kich_co: "31",
      trang_thai: 1
    },
    {
      id: 12,
      ten_kich_co: "32",
      trang_thai: 1
    },
    {
      id: 13,
      ten_kich_co: "33",
      trang_thai: 0
    },
    {
      id: 14,
      ten_kich_co: "34",
      trang_thai: 1
    },
    {
      id: 15,
      ten_kich_co: "35",
      trang_thai: 1
    },
    {
      id: 16,
      ten_kich_co: "36",
      trang_thai: 1
    },
    {
      id: 17,
      ten_kich_co: "37",
      trang_thai: 1
    },
    {
      id: 18,
      ten_kich_co: "38",
      trang_thai: 1
    },
    {
      id: 19,
      ten_kich_co: "39",
      trang_thai: 1
    },
    {
      id: 20,
      ten_kich_co: "40",
      trang_thai: 1
    },
    {
      id: 21,
      ten_kich_co: "41",
      trang_thai: 1
    },
    {
      id: 22,
      ten_kich_co: "42",
      trang_thai: 1
    },
    {
      id: 23,
      ten_kich_co: "43",
      trang_thai: 1
    },
    {
      id: 24,
      ten_kich_co: "44",
      trang_thai: 1
    },
    {
      id: 25,
      ten_kich_co: "45",
      trang_thai: 0
    }
  ];

  useEffect(() => {
    // Lấy dữ liệu từ localStorage hoặc sử dụng dữ liệu mẫu
    const savedSizes = JSON.parse(localStorage.getItem("sizes") || "[]");
    console.log("Saved sizes:", savedSizes);
    if (savedSizes.length === 0) {
      localStorage.setItem("sizes", JSON.stringify(sampleSizes));
      setSizes(sampleSizes);
      console.log("Set sample sizes:", sampleSizes);
    } else {
      setSizes(savedSizes);
      console.log("Set saved sizes:", savedSizes);
    }
  }, []);

  const filteredSizes = sizes.filter((size) => {
    const matchesSearch = size.ten_kich_co.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "" || size.trang_thai === parseInt(statusFilter);
    return matchesSearch && matchesStatus;
  });

  console.log("Filtered sizes:", filteredSizes);

  const handleAddNew = () => {
    setShowAddForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    const newErrors = {};
    if (!newSize.ten_kich_co.trim()) {
      newErrors.ten_kich_co = "Tên kích cỡ không được để trống";
    }
    
    // Kiểm tra trùng lặp
    const isDuplicate = sizes.some(size => 
      size.ten_kich_co.toLowerCase() === newSize.ten_kich_co.toLowerCase()
    );
    if (isDuplicate) {
      newErrors.ten_kich_co = "Kích cỡ này đã tồn tại";
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      const sizeToAdd = {
        id: Date.now(),
        ...newSize
      };
      
      const updatedSizes = [...sizes, sizeToAdd];
      setSizes(updatedSizes);
      localStorage.setItem("sizes", JSON.stringify(updatedSizes));
      
      setNewSize({
        ten_kich_co: "",
        trang_thai: 1
      });
      setShowAddForm(false);
      setErrors({});
      
      alert("Thêm kích cỡ thành công!");
    }
  };

  const handleToggleStatus = (id) => {
    const updatedSizes = sizes.map(size => {
      if (size.id === id) {
        return {
          ...size,
          trang_thai: size.trang_thai === 1 ? 0 : 1
        };
      }
      return size;
    });
    
    setSizes(updatedSizes);
    localStorage.setItem("sizes", JSON.stringify(updatedSizes));
    
    const size = sizes.find(s => s.id === id);
    const statusText = size.trang_thai === 1 ? "tắt" : "bật";
    alert(`Đã ${statusText} trạng thái kích cỡ "${size.ten_kich_co}"!`);
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

  const getSizeType = (sizeName) => {
    const letterSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
    return letterSizes.includes(sizeName.toUpperCase()) ? 'Chữ' : 'Số';
  };

  const getSizeTypeStyle = (type) => {
    return {
      padding: "2px 6px",
      borderRadius: "4px",
      fontSize: "10px",
      fontWeight: "500",
      backgroundColor: type === 'Chữ' ? "#e3f2fd" : "#f3e5f5",
      color: type === 'Chữ' ? "#1976d2" : "#7b1fa2"
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
        <h1 style={titleStyle}>Quản lý Kích cỡ</h1>
        <button onClick={handleAddNew} style={buttonStyle}>
          + Thêm kích cỡ
        </button>
      </div>

      {/* Form thêm mới */}
      {showAddForm && (
        <div style={addFormStyle}>
          <h3 style={{ marginTop: 0, marginBottom: "20px" }}>Thêm kích cỡ mới</h3>
          <form onSubmit={handleSubmit}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>
                Tên kích cỡ <span style={{ color: "#dc3545" }}>*</span>
              </label>
              <input
                type="text"
                value={newSize.ten_kich_co}
                onChange={(e) => setNewSize({...newSize, ten_kich_co: e.target.value})}
                style={errors.ten_kich_co ? {...inputStyle, borderColor: "#dc3545"} : inputStyle}
                placeholder="Nhập tên kích cỡ (VD: S, M, L, 40, 41...)"
              />
              {errors.ten_kich_co && <div style={errorStyle}>{errors.ten_kich_co}</div>}
            </div>
            
            <div style={formGroupStyle}>
              <label style={labelStyle}>Trạng thái</label>
              <select
                value={newSize.trang_thai}
                onChange={(e) => setNewSize({...newSize, trang_thai: parseInt(e.target.value)})}
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
              placeholder="Tìm theo tên kích cỡ..."
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
            <th style={thStyle}>Kích cỡ</th>
            <th style={thStyle}>Trạng thái</th>
            <th style={thStyle}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filteredSizes.map((size) => (
            <tr key={size.id}>
              <td style={tdStyle}>
                <strong>{size.ten_kich_co}</strong>
              </td>
              <td style={tdStyle}>
                <span style={getStatusBadgeStyle(size.trang_thai)}>
                  {getStatusText(size.trang_thai)}
                </span>
              </td>
              <td style={tdStyle}>
                <button
                  onClick={() => handleToggleStatus(size.id)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "20px",
                    color: size.trang_thai === 1 ? "#10b981" : "#6b7280",
                    transition: "color 0.2s"
                  }}
                  title={size.trang_thai === 1 ? "Tắt hoạt động" : "Bật hoạt động"}
                >
                  {size.trang_thai === 1 ? <FaToggleOn /> : <FaToggleOff />}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredSizes.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
          Không tìm thấy kích cỡ nào
        </div>
      )}
    </div>
  );
};

export default Sizes; 