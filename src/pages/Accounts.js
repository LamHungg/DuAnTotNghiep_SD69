import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaEdit, FaTrash, FaPlus, FaEye, FaEyeSlash, FaUserTie, FaUserShield, FaToggleOn, FaToggleOff } from "react-icons/fa";

const employees = [
  {
    id: 1,
    ma: "NV001",
    chuc_vu: "Nhân viên",
    ten_dang_nhap: "an.nguyen",
    mat_khau: "********",
    ho_ten: "Nguyễn Văn An",
    email: "an.nguyen@example.com",
    so_dien_thoai: "0123456789",
    trang_thai: 1,
    ngay_tao: "2023-01-15T08:00:00",
    ngay_cap_nhat: "2024-01-15T10:30:00"
  },
  {
    id: 2,
    ma: "NV002",
    chuc_vu: "Nhân viên",
    ten_dang_nhap: "binh.tran",
    mat_khau: "********",
    ho_ten: "Trần Thị Bình",
    email: "binh.tran@example.com",
    so_dien_thoai: "0987654321",
    trang_thai: 1,
    ngay_tao: "2022-08-20T09:00:00",
    ngay_cap_nhat: "2024-01-10T14:20:00"
  },
  {
    id: 3,
    ma: "NV003",
    chuc_vu: "Nhân viên",
    ten_dang_nhap: "cuong.le",
    mat_khau: "********",
    ho_ten: "Lê Văn Cường",
    email: "cuong.le@example.com",
    so_dien_thoai: "0369852147",
    trang_thai: 0,
    ngay_tao: "2021-12-10T07:30:00",
    ngay_cap_nhat: "2023-12-01T16:45:00"
  },
  {
    id: 4,
    ma: "NV004",
    chuc_vu: "Nhân viên",
    ten_dang_nhap: "dung.pham",
    mat_khau: "********",
    ho_ten: "Phạm Thị Dung",
    email: "dung.pham@example.com",
    so_dien_thoai: "0521478963",
    trang_thai: 1,
    ngay_tao: "2023-03-05T10:15:00",
    ngay_cap_nhat: "2024-01-12T11:30:00"
  }
];

const admins = [
  {
    id: 1,
    ma: "AD001",
    chuc_vu: "Admin",
    ten_dang_nhap: "admin.system",
    ho_ten: "Nguyễn Văn Admin",
    email: "admin@example.com",
    so_dien_thoai: "0901234567",
    trang_thai: 1,
    ngay_tao: "2022-01-01T00:00:00",
    ngay_cap_nhat: "2024-01-15T15:30:00"
  },
  {
    id: 2,
    ma: "AD002",
    chuc_vu: "Admin",
    ten_dang_nhap: "manager.senior",
    ho_ten: "Trần Thị Manager",
    email: "manager@example.com",
    so_dien_thoai: "0912345678",
    trang_thai: 1,
    ngay_tao: "2022-06-15T10:00:00",
    ngay_cap_nhat: "2024-01-10T09:15:00"
  },
  {
    id: 3,
    ma: "AD003",
    chuc_vu: "Admin",
    ten_dang_nhap: "security.admin",
    ho_ten: "Lê Văn Security",
    email: "security@example.com",
    so_dien_thoai: "0923456789",
    trang_thai: 0,
    ngay_tao: "2021-09-20T14:30:00",
    ngay_cap_nhat: "2023-11-30T16:45:00"
  }
];

const Accounts = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("employees");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showPassword, setShowPassword] = useState({});
  
  // State để quản lý dữ liệu động
  const [employeesData, setEmployeesData] = useState(employees);
  const [adminsData, setAdminsData] = useState(admins);

  const currentData = activeTab === "employees" ? employeesData : adminsData;
  const showPasswordField = false; // Ẩn trường mật khẩu ở cả 2 tab

  const filteredData = currentData.filter((item) => {
    const matchesSearch = 
      item.ho_ten?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ma?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ten_dang_nhap?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "" || item.trang_thai === parseInt(statusFilter);
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (id) => {
    const accountType = activeTab === "employees" ? "nhân viên" : "admin";
    if (window.confirm(`Bạn có chắc chắn muốn xóa ${accountType} này?`)) {
      console.log("Xóa account:", id);
    }
  };

  const handleAddNew = () => {
    if (activeTab === "employees") {
      navigate("/dashboard/accounts/add-employee");
    } else {
      navigate("/dashboard/accounts/add-admin");
    }
  };

  const handleToggleStatus = (id) => {
    const accountType = activeTab === "employees" ? "nhân viên" : "admin";
    const currentStatus = currentData.find(item => item.id === id)?.trang_thai;
    const newStatus = currentStatus === 1 ? 0 : 1;
    const statusText = newStatus === 1 ? "bật" : "tắt";
    
    if (window.confirm(`Bạn có chắc chắn muốn ${statusText} trạng thái ${accountType} này?`)) {
      console.log(`Chuyển trạng thái ${accountType} ID ${id} từ ${currentStatus} sang ${newStatus}`);
      
      // Cập nhật state tương ứng
      if (activeTab === "employees") {
        setEmployeesData(prevData => 
          prevData.map(item => 
            item.id === id 
              ? { ...item, trang_thai: newStatus, ngay_cap_nhat: new Date().toISOString() }
              : item
          )
        );
      } else {
        setAdminsData(prevData => 
          prevData.map(item => 
            item.id === id 
              ? { ...item, trang_thai: newStatus, ngay_cap_nhat: new Date().toISOString() }
              : item
          )
        );
      }
      
      // Hiển thị thông báo thành công
      const statusMessage = newStatus === 1 ? "Đang làm việc" : "Đã nghỉ việc";
      alert(`Đã ${statusText} trạng thái ${accountType} thành công! Trạng thái hiện tại: ${statusMessage}`);
    }
  };

  const togglePasswordVisibility = (id) => {
    setShowPassword(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const getStatusText = (status) => {
    return status === 1 ? "Đang làm việc" : "Đã nghỉ việc";
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

  const getTabStyle = (tabName) => ({
    padding: "12px 24px",
    border: "none",
    backgroundColor: activeTab === tabName ? "#7c3aed" : "transparent",
    color: activeTab === tabName ? "white" : "#6b7280",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.2s"
  });

  return (
    <div>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: "24px",
        flexWrap: "wrap",
        gap: "8px"
      }}>
        <h2 style={{ fontWeight: "700", margin: "0" }}>Quản lý Account</h2>
        <div style={{ display: "flex", gap: "8px" }}>
          <button style={{
            backgroundColor: "#7c3aed",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "8px 16px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontWeight: "600"
          }} onClick={handleAddNew}>
            <FaPlus /> Thêm {activeTab === "employees" ? "nhân viên" : "admin"}
          </button>
          <div style={{ position: "relative", minWidth: "240px" }}>
            <input
              style={{
                width: "100%",
                padding: "8px 40px 8px 12px",
                borderRadius: "10px",
                border: "1.5px solid #e5e7eb",
                fontSize: "15px",
                backgroundColor: "#fafbfc"
              }}
              placeholder={`Tìm kiếm ${activeTab === "employees" ? "nhân viên" : "admin"}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch style={{
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#bdb4fe",
              fontSize: "16px"
            }} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ 
        display: "flex", 
        gap: "8px", 
        marginBottom: "24px",
        backgroundColor: "#f6f8fa",
        padding: "4px",
        borderRadius: "12px",
        width: "fit-content"
      }}>
        <button
          style={getTabStyle("employees")}
          onClick={() => setActiveTab("employees")}
        >
          <FaUserTie />
          Account Nhân viên
        </button>
        <button
          style={getTabStyle("admins")}
          onClick={() => setActiveTab("admins")}
        >
          <FaUserShield />
          Account Admin
        </button>
      </div>

      {/* Filter */}
      <div style={{ marginBottom: "16px" }}>
        <select
          style={{
            padding: "8px 12px",
            borderRadius: "8px",
            border: "1.5px solid #e5e7eb",
            maxWidth: "200px",
            backgroundColor: "#fafbfc"
          }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="1">Đang làm việc</option>
          <option value="0">Đã nghỉ việc</option>
        </select>
      </div>

      {/* Table */}
      <div style={{
        backgroundColor: "white",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        overflow: "hidden"
      }}>
        <div style={{ padding: "20px" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{
              width: "100%",
              borderCollapse: "collapse"
            }}>
              <thead>
                <tr style={{
                  backgroundColor: "#fafbfc",
                  borderBottom: "1.5px solid #e5e7eb"
                }}>
                  <th style={{
                    padding: "12px",
                    textAlign: "left",
                    fontSize: "13px",
                    fontWeight: "700",
                    color: "#7b809a",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                  }}>MÃ</th>
                  <th style={{
                    padding: "12px",
                    textAlign: "left",
                    fontSize: "13px",
                    fontWeight: "700",
                    color: "#7b809a",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                  }}>HỌ TÊN</th>
                  <th style={{
                    padding: "12px",
                    textAlign: "left",
                    fontSize: "13px",
                    fontWeight: "700",
                    color: "#7b809a",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                  }}>TÊN ĐĂNG NHẬP</th>
                  {showPasswordField && (
                    <th style={{
                      padding: "12px",
                      textAlign: "left",
                      fontSize: "13px",
                      fontWeight: "700",
                      color: "#7b809a",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px"
                    }}>MẬT KHẨU</th>
                  )}
                  <th style={{
                    padding: "12px",
                    textAlign: "left",
                    fontSize: "13px",
                    fontWeight: "700",
                    color: "#7b809a",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                  }}>CHỨC VỤ</th>
                  <th style={{
                    padding: "12px",
                    textAlign: "left",
                    fontSize: "13px",
                    fontWeight: "700",
                    color: "#7b809a",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                  }}>EMAIL</th>
                  <th style={{
                    padding: "12px",
                    textAlign: "left",
                    fontSize: "13px",
                    fontWeight: "700",
                    color: "#7b809a",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                  }}>SỐ ĐT</th>
                  <th style={{
                    padding: "12px",
                    textAlign: "left",
                    fontSize: "13px",
                    fontWeight: "700",
                    color: "#7b809a",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                  }}>TRẠNG THÁI</th>
                  <th style={{
                    padding: "12px",
                    textAlign: "left",
                    fontSize: "13px",
                    fontWeight: "700",
                    color: "#7b809a",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                  }}>NGÀY TẠO</th>
                  <th style={{
                    padding: "12px",
                    textAlign: "left",
                    fontSize: "13px",
                    fontWeight: "700",
                    color: "#7b809a",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                  }}>THAO TÁC</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
                  <tr key={item.id} style={{
                    borderBottom: "1.5px solid #f0f1f2",
                    transition: "background 0.2s"
                  }}>
                    <td style={{
                      padding: "12px",
                      fontSize: "15px",
                      color: "#222b45"
                    }}>{item.ma}</td>
                    <td style={{
                      padding: "12px",
                      fontSize: "15px",
                      color: "#222b45",
                      fontWeight: "600"
                    }}>{item.ho_ten}</td>
                    <td style={{
                      padding: "12px",
                      fontSize: "15px",
                      color: "#222b45"
                    }}>{item.ten_dang_nhap}</td>
                    {showPasswordField && (
                      <td style={{
                        padding: "12px",
                        fontSize: "15px",
                        color: "#222b45",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                      }}>
                        <span>{showPassword[item.id] ? item.mat_khau : "********"}</span>
                        <button
                          onClick={() => togglePasswordVisibility(item.id)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "#6b7280"
                          }}
                        >
                          {showPassword[item.id] ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </td>
                    )}
                    <td style={{
                      padding: "12px",
                      fontSize: "15px",
                      color: "#222b45"
                    }}>{item.chuc_vu}</td>
                    <td style={{
                      padding: "12px",
                      fontSize: "15px",
                      color: "#222b45"
                    }}>{item.email}</td>
                    <td style={{
                      padding: "12px",
                      fontSize: "15px",
                      color: "#222b45"
                    }}>{item.so_dien_thoai}</td>
                    <td style={{
                      padding: "12px"
                    }}>
                      <span style={getStatusBadgeStyle(item.trang_thai)}>
                        {getStatusText(item.trang_thai)}
                      </span>
                    </td>
                    <td style={{
                      padding: "12px",
                      fontSize: "15px",
                      color: "#222b45"
                    }}>{formatDate(item.ngay_tao)}</td>
                    <td style={{
                      padding: "12px"
                    }}>
                      <button
                        onClick={() => handleToggleStatus(item.id)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "20px",
                          color: item.trang_thai === 1 ? "#10b981" : "#6b7280",
                          transition: "color 0.2s"
                        }}
                        title={item.trang_thai === 1 ? "Tắt hoạt động" : "Bật hoạt động"}
                      >
                        {item.trang_thai === 1 ? <FaToggleOn /> : <FaToggleOff />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accounts; 