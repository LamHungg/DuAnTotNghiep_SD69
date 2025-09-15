import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaGift,
  FaCalendar,
  FaUsers,
  FaChartBar,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import {
  getAllVouchers,
  createVoucher,
  updateVoucher,
  deleteVoucher,
  searchVouchers,
} from "../services/voucherService";
import "../styles/main.css";

const VoucherManagement = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState(null);
  const [searchParams, setSearchParams] = useState({
    tenVoucher: "",
    maVoucher: "",
    trangThai: "",
  });
  const [showStats, setShowStats] = useState(true);

  const [formData, setFormData] = useState({
    maVoucher: "",
    tenVoucher: "",
    loaiGiamGia: "TIEN_MAT",
    giaTriGiam: "",
    giaTriToiThieu: "",
    giamToiDa: "",
    soLuong: "",
    ngayBatDau: "",
    ngayKetThuc: "",
    trangThai: 1,
    moTa: "",
  });

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      setLoading(true);
      const data = await getAllVouchers();
      setVouchers(data);
    } catch (error) {
      console.error("Error fetching vouchers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchParams.tenVoucher) params.tenVoucher = searchParams.tenVoucher;
      if (searchParams.maVoucher) params.maVoucher = searchParams.maVoucher;
      if (searchParams.trangThai)
        params.trangThai = parseInt(searchParams.trangThai);

      const data = await searchVouchers(params);
      setVouchers(data);
    } catch (error) {
      console.error("Error searching vouchers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const voucherData = {
        ...formData,
        giaTriGiam: parseFloat(formData.giaTriGiam),
        giaTriToiThieu: formData.giaTriToiThieu
          ? parseFloat(formData.giaTriToiThieu)
          : null,
        giamToiDa: formData.giamToiDa ? parseFloat(formData.giamToiDa) : null,
        soLuong: formData.soLuong ? parseInt(formData.soLuong) : null,
        trangThai: parseInt(formData.trangThai),
      };

      if (editingVoucher) {
        await updateVoucher(editingVoucher.id, voucherData);
      } else {
        await createVoucher(voucherData);
      }

      setShowForm(false);
      setEditingVoucher(null);
      resetForm();
      fetchVouchers();
    } catch (error) {
      console.error("Error saving voucher:", error);
    }
  };

  const handleEdit = (voucher) => {
    setEditingVoucher(voucher);
    setFormData({
      maVoucher: voucher.maVoucher,
      tenVoucher: voucher.tenVoucher,
      loaiGiamGia: voucher.loaiGiamGia,
      giaTriGiam: voucher.giaTriGiam?.toString() || "",
      giaTriToiThieu: voucher.giaTriToiThieu?.toString() || "",
      giamToiDa: voucher.giamToiDa?.toString() || "",
      soLuong: voucher.soLuong?.toString() || "",
      ngayBatDau: voucher.ngayBatDau
        ? new Date(voucher.ngayBatDau).toISOString().split("T")[0]
        : "",
      ngayKetThuc: voucher.ngayKetThuc
        ? new Date(voucher.ngayKetThuc).toISOString().split("T")[0]
        : "",
      trangThai: voucher.trangThai?.toString() || "1",
      moTa: voucher.moTa || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa voucher này?")) {
      try {
        await deleteVoucher(id);
        fetchVouchers();
      } catch (error) {
        console.error("Error deleting voucher:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      maVoucher: "",
      tenVoucher: "",
      loaiGiamGia: "TIEN_MAT",
      giaTriGiam: "",
      giaTriToiThieu: "",
      giamToiDa: "",
      soLuong: "",
      ngayBatDau: "",
      ngayKetThuc: "",
      trangThai: 1,
      moTa: "",
    });
  };

  const getStatusText = (trangThai) => {
    switch (trangThai) {
      case 1:
        return "Hoạt động";
      case 0:
        return "Vô hiệu hóa";
      default:
        return "Không xác định";
    }
  };

  const getStatusColor = (trangThai) => {
    switch (trangThai) {
      case 1:
        return "#28a745";
      case 0:
        return "#dc3545";
      default:
        return "#6c757d";
    }
  };

  const getDiscountText = (voucher) => {
    if (voucher.loaiGiamGia === "PHAN_TRAM") {
      return `${voucher.giaTriGiam}%`;
    } else {
      return `${voucher.giaTriGiam?.toLocaleString()}đ`;
    }
  };

  const getRemainingDays = (ngayKetThuc) => {
    const endDate = new Date(ngayKetThuc);
    const today = new Date();
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return "Đã hết hạn";
    } else if (diffDays === 0) {
      return "Hết hạn hôm nay";
    } else {
      return `Còn ${diffDays} ngày`;
    }
  };

  // Thống kê
  const getStats = () => {
    const total = vouchers.length;
    const active = vouchers.filter((v) => v.trangThai === 1).length;
    const inactive = vouchers.filter((v) => v.trangThai === 0).length;
    const expired = vouchers.filter((v) => {
      const endDate = new Date(v.ngayKetThuc);
      const today = new Date();
      return endDate < today;
    }).length;
    const moneyType = vouchers.filter(
      (v) => v.loaiGiamGia === "TIEN_MAT"
    ).length;
    const percentType = vouchers.filter(
      (v) => v.loaiGiamGia === "PHAN_TRAM"
    ).length;

    return { total, active, inactive, expired, moneyType, percentType };
  };

  const stats = getStats();

  return (
    <div className="voucher-management">
      <div className="voucher-management__header">
        <div className="header-content">
          <h1>Quản Lý Voucher</h1>
          <p>Quản lý và tạo các voucher khuyến mãi cho khách hàng</p>
        </div>
        <button
          className="btn-primary"
          onClick={() => {
            setShowForm(true);
            setEditingVoucher(null);
            resetForm();
          }}
        >
          <FaPlus />
          Thêm Voucher
        </button>
      </div>

      {/* Statistics Section */}
      {showStats && (
        <div className="voucher-stats">
          <div className="stats-header">
            <h3>
              <FaChartBar />
              Thống Kê Voucher
            </h3>
            <button className="btn-toggle" onClick={() => setShowStats(false)}>
              <FaEyeSlash />
            </button>
          </div>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon total">
                <FaGift />
              </div>
              <div className="stat-content">
                <h4>{stats.total}</h4>
                <p>Tổng số voucher</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon active">
                <FaGift />
              </div>
              <div className="stat-content">
                <h4>{stats.active}</h4>
                <p>Đang hoạt động</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon inactive">
                <FaGift />
              </div>
              <div className="stat-content">
                <h4>{stats.inactive}</h4>
                <p>Vô hiệu hóa</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon expired">
                <FaCalendar />
              </div>
              <div className="stat-content">
                <h4>{stats.expired}</h4>
                <p>Đã hết hạn</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon money">
                <FaGift />
              </div>
              <div className="stat-content">
                <h4>{stats.moneyType}</h4>
                <p>Giảm tiền mặt</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon percent">
                <FaGift />
              </div>
              <div className="stat-content">
                <h4>{stats.percentType}</h4>
                <p>Giảm phần trăm</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {!showStats && (
        <div className="stats-toggle">
          <button className="btn-toggle" onClick={() => setShowStats(true)}>
            <FaEye />
            Hiển thị thống kê
          </button>
        </div>
      )}

      {/* Search Section */}
      <div className="voucher-management__search">
        <div className="search-filters">
          <input
            type="text"
            placeholder="Tìm theo tên voucher..."
            value={searchParams.tenVoucher}
            onChange={(e) =>
              setSearchParams({ ...searchParams, tenVoucher: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Tìm theo mã voucher..."
            value={searchParams.maVoucher}
            onChange={(e) =>
              setSearchParams({ ...searchParams, maVoucher: e.target.value })
            }
          />
          <select
            value={searchParams.trangThai}
            onChange={(e) =>
              setSearchParams({ ...searchParams, trangThai: e.target.value })
            }
          >
            <option value="">Tất cả trạng thái</option>
            <option value="1">Hoạt động</option>
            <option value="0">Vô hiệu hóa</option>
          </select>
          <button className="btn-secondary" onClick={handleSearch}>
            <FaSearch />
            Tìm kiếm
          </button>
        </div>
      </div>

      {/* Voucher List */}
      <div className="voucher-management__content">
        {loading ? (
          <div className="loading">Đang tải...</div>
        ) : (
          <div className="voucher-grid">
            {vouchers.map((voucher) => (
              <div key={voucher.id} className="voucher-item">
                <div className="voucher-item__header">
                  <div className="voucher-item__code">
                    <FaGift />
                    {voucher.maVoucher}
                  </div>
                  <div
                    className="voucher-item__status"
                    style={{ color: getStatusColor(voucher.trangThai) }}
                  >
                    {getStatusText(voucher.trangThai)}
                  </div>
                </div>

                <div className="voucher-item__content">
                  <h3 className="voucher-item__title">{voucher.tenVoucher}</h3>

                  <div className="voucher-item__discount">
                    <span className="discount-label">Giảm giá:</span>
                    <span className="discount-value">
                      {getDiscountText(voucher)}
                    </span>
                  </div>

                  {voucher.giaTriToiThieu && (
                    <div className="voucher-item__min-order">
                      <span>
                        Đơn tối thiểu: {voucher.giaTriToiThieu.toLocaleString()}
                        đ
                      </span>
                    </div>
                  )}

                  {voucher.giamToiDa && voucher.loaiGiamGia === "PHAN_TRAM" && (
                    <div className="voucher-item__max-discount">
                      <span>Tối đa: {voucher.giamToiDa.toLocaleString()}đ</span>
                    </div>
                  )}

                  <div className="voucher-item__dates">
                    <div className="date-item">
                      <FaCalendar />
                      <span>
                        Từ:{" "}
                        {new Date(voucher.ngayBatDau).toLocaleDateString(
                          "vi-VN"
                        )}
                      </span>
                    </div>
                    <div className="date-item">
                      <FaCalendar />
                      <span>
                        Đến:{" "}
                        {new Date(voucher.ngayKetThuc).toLocaleDateString(
                          "vi-VN"
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="voucher-item__remaining">
                    <span className="remaining-text">
                      {getRemainingDays(voucher.ngayKetThuc)}
                    </span>
                  </div>

                  {voucher.soLuong !== null && (
                    <div className="voucher-item__quantity">
                      <FaUsers />
                      <span>Còn lại: {voucher.soLuong}</span>
                    </div>
                  )}

                  {voucher.moTa && (
                    <p className="voucher-item__description">{voucher.moTa}</p>
                  )}
                </div>

                <div className="voucher-item__actions">
                  <button
                    className="btn-edit"
                    onClick={() => handleEdit(voucher)}
                  >
                    <FaEdit />
                    Sửa
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(voucher.id)}
                  >
                    <FaTrash />
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Voucher Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="voucher-form-modal">
            <div className="voucher-form-modal__header">
              <h2>{editingVoucher ? "Sửa Voucher" : "Thêm Voucher Mới"}</h2>
              <button
                className="modal-close"
                onClick={() => {
                  setShowForm(false);
                  setEditingVoucher(null);
                  resetForm();
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="voucher-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Mã Voucher *</label>
                  <input
                    type="text"
                    value={formData.maVoucher}
                    onChange={(e) =>
                      setFormData({ ...formData, maVoucher: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Tên Voucher *</label>
                  <input
                    type="text"
                    value={formData.tenVoucher}
                    onChange={(e) =>
                      setFormData({ ...formData, tenVoucher: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Loại Giảm Giá *</label>
                  <select
                    value={formData.loaiGiamGia}
                    onChange={(e) =>
                      setFormData({ ...formData, loaiGiamGia: e.target.value })
                    }
                  >
                    <option value="TIEN_MAT">Giảm tiền mặt</option>
                    <option value="PHAN_TRAM">Giảm phần trăm</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Giá Trị Giảm *</label>
                  <input
                    type="number"
                    value={formData.giaTriGiam}
                    onChange={(e) =>
                      setFormData({ ...formData, giaTriGiam: e.target.value })
                    }
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Giá Trị Tối Thiểu</label>
                  <input
                    type="number"
                    value={formData.giaTriToiThieu}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        giaTriToiThieu: e.target.value,
                      })
                    }
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="form-group">
                  <label>Giảm Tối Đa</label>
                  <input
                    type="number"
                    value={formData.giamToiDa}
                    onChange={(e) =>
                      setFormData({ ...formData, giamToiDa: e.target.value })
                    }
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Số Lượng</label>
                  <input
                    type="number"
                    value={formData.soLuong}
                    onChange={(e) =>
                      setFormData({ ...formData, soLuong: e.target.value })
                    }
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>Trạng Thái</label>
                  <select
                    value={formData.trangThai}
                    onChange={(e) =>
                      setFormData({ ...formData, trangThai: e.target.value })
                    }
                  >
                    <option value="1">Hoạt động</option>
                    <option value="0">Vô hiệu hóa</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Ngày Bắt Đầu *</label>
                  <input
                    type="date"
                    value={formData.ngayBatDau}
                    onChange={(e) =>
                      setFormData({ ...formData, ngayBatDau: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Ngày Kết Thúc *</label>
                  <input
                    type="date"
                    value={formData.ngayKetThuc}
                    onChange={(e) =>
                      setFormData({ ...formData, ngayKetThuc: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Mô Tả</label>
                <textarea
                  value={formData.moTa}
                  onChange={(e) =>
                    setFormData({ ...formData, moTa: e.target.value })
                  }
                  rows="3"
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setShowForm(false);
                    setEditingVoucher(null);
                    resetForm();
                  }}
                >
                  Hủy
                </button>
                <button type="submit" className="btn-primary">
                  {editingVoucher ? "Cập nhật" : "Thêm mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoucherManagement;
