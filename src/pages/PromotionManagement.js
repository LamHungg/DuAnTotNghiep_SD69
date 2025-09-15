import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaPercent,
  FaCalendar,
  FaTag,
  FaChartBar,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import {
  getAllPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion,
  searchPromotions,
} from "../services/voucherService";

const PromotionManagement = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [searchParams, setSearchParams] = useState({
    tenKhuyenMai: "",
    maKhuyenMai: "",
    trangThai: "",
  });
  const [showStats, setShowStats] = useState(true);

  const [formData, setFormData] = useState({
    maKhuyenMai: "",
    tenKhuyenMai: "",
    phanTramGiam: "",
    ngayBatDau: "",
    ngayKetThuc: "",
    trangThai: 1,
    moTa: "",
  });

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const data = await getAllPromotions();
      setPromotions(data);
    } catch (error) {
      console.error("Error fetching promotions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchParams.tenKhuyenMai)
        params.tenKhuyenMai = searchParams.tenKhuyenMai;
      if (searchParams.maKhuyenMai)
        params.maKhuyenMai = searchParams.maKhuyenMai;
      if (searchParams.trangThai)
        params.trangThai = parseInt(searchParams.trangThai);

      const data = await searchPromotions(params);
      setPromotions(data);
    } catch (error) {
      console.error("Error searching promotions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation cơ bản
    if (!formData.maKhuyenMai.trim()) {
      window.showToast("Vui lòng nhập mã khuyến mãi", "error");
      return;
    }
    if (!formData.tenKhuyenMai.trim()) {
      window.showToast("Vui lòng nhập tên khuyến mãi", "error");
      return;
    }
    if (
      !formData.phanTramGiam ||
      parseFloat(formData.phanTramGiam) <= 0 ||
      parseFloat(formData.phanTramGiam) > 100
    ) {
      window.showToast("Vui lòng nhập phần trăm giảm hợp lệ (0-100%)", "error");
      return;
    }
    if (!formData.ngayBatDau) {
      window.showToast("Vui lòng chọn ngày bắt đầu", "error");
      return;
    }
    if (!formData.ngayKetThuc) {
      window.showToast("Vui lòng chọn ngày kết thúc", "error");
      return;
    }
    if (new Date(formData.ngayKetThuc) <= new Date(formData.ngayBatDau)) {
      window.showToast("Ngày kết thúc phải sau ngày bắt đầu", "error");
      return;
    }

    try {
      // Gửi dữ liệu thô, service sẽ format
      const promotionData = {
        ...formData,
      };

      if (editingPromotion) {
        await updatePromotion(editingPromotion.id, promotionData);
        window.showToast(
          `Đã cập nhật khuyến mãi "${promotionData.tenKhuyenMai}" thành công!`,
          "success"
        );
      } else {
        await createPromotion(promotionData);
        window.showToast(
          `Đã tạo khuyến mãi "${promotionData.tenKhuyenMai}" thành công!`,
          "success"
        );
      }

      setShowForm(false);
      setEditingPromotion(null);
      resetForm();
      fetchPromotions();
    } catch (error) {
      console.error("Error saving promotion:", error);
      // Hiển thị thông báo lỗi cho user
      alert(
        "Có lỗi xảy ra khi lưu khuyến mãi. Vui lòng kiểm tra lại thông tin."
      );
    }
  };

  const handleEdit = (promotion) => {
    setEditingPromotion(promotion);
    setFormData({
      maKhuyenMai: promotion.maKhuyenMai,
      tenKhuyenMai: promotion.tenKhuyenMai,
      phanTramGiam: promotion.phanTramGiam?.toString() || "",
      ngayBatDau: promotion.ngayBatDau
        ? new Date(promotion.ngayBatDau).toISOString().split("T")[0]
        : "",
      ngayKetThuc: promotion.ngayKetThuc
        ? new Date(promotion.ngayKetThuc).toISOString().split("T")[0]
        : "",
      trangThai: promotion.trangThai?.toString() || "1",
      moTa: promotion.moTa || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const promotionToDelete = promotions.find((p) => p.id === id);
    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa khuyến mãi "${promotionToDelete?.tenKhuyenMai}"?`
      )
    ) {
      try {
        await deletePromotion(id);
        window.showToast(
          `Đã xóa khuyến mãi "${promotionToDelete?.tenKhuyenMai}" thành công!`,
          "success"
        );
        fetchPromotions();
      } catch (error) {
        console.error("Error deleting promotion:", error);
        window.showToast(
          "Có lỗi xảy ra khi xóa khuyến mãi. Vui lòng thử lại.",
          "error"
        );
      }
    }
  };

  const resetForm = () => {
    setFormData({
      maKhuyenMai: "",
      tenKhuyenMai: "",
      phanTramGiam: "",
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
    const total = promotions.length;
    const active = promotions.filter((p) => p.trangThai === 1).length;
    const inactive = promotions.filter((p) => p.trangThai === 0).length;
    const expired = promotions.filter((p) => {
      const endDate = new Date(p.ngayKetThuc);
      const today = new Date();
      return endDate < today;
    }).length;
    const upcoming = promotions.filter((p) => {
      const startDate = new Date(p.ngayBatDau);
      const today = new Date();
      return startDate > today;
    }).length;
    const ongoing = promotions.filter((p) => {
      const startDate = new Date(p.ngayBatDau);
      const endDate = new Date(p.ngayKetThuc);
      const today = new Date();
      return startDate <= today && endDate >= today;
    }).length;

    return { total, active, inactive, expired, upcoming, ongoing };
  };

  const stats = getStats();

  return (
    <div className="promotion-management">
      <div className="promotion-management__header">
        <div className="header-content">
          <h1>Quản Lý Khuyến Mãi</h1>
          <p>Quản lý và tạo các chương trình khuyến mãi cho khách hàng</p>
        </div>
        <button
          className="btn-primary"
          onClick={() => {
            setShowForm(true);
            setEditingPromotion(null);
            resetForm();
          }}
        >
          <FaPlus />
          Thêm Khuyến Mãi
        </button>
      </div>

      {/* Statistics Section */}
      {showStats && (
        <div className="voucher-stats">
          <div className="stats-header">
            <h3>
              <FaChartBar />
              Thống Kê Khuyến Mãi
            </h3>
            <button className="btn-toggle" onClick={() => setShowStats(false)}>
              <FaEyeSlash />
            </button>
          </div>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-card-icon total">
                <FaTag />
              </div>
              <div className="stat-content">
                <h4>{stats.total}</h4>
                <p>Tổng số khuyến mãi</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon active">
                <FaTag />
              </div>
              <div className="stat-content">
                <h4>{stats.active}</h4>
                <p>Đang hoạt động</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon inactive">
                <FaTag />
              </div>
              <div className="stat-content">
                <h4>{stats.inactive}</h4>
                <p>Vô hiệu hóa</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon expired">
                <FaCalendar />
              </div>
              <div className="stat-content">
                <h4>{stats.expired}</h4>
                <p>Đã hết hạn</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon money">
                <FaTag />
              </div>
              <div className="stat-content">
                <h4>{stats.upcoming}</h4>
                <p>Sắp diễn ra</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon percent">
                <FaTag />
              </div>
              <div className="stat-content">
                <h4>{stats.ongoing}</h4>
                <p>Đang diễn ra</p>
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
      <div className="promotion-management__search">
        <div className="search-filters">
          <input
            type="text"
            placeholder="Tìm theo tên khuyến mãi..."
            value={searchParams.tenKhuyenMai}
            onChange={(e) =>
              setSearchParams({ ...searchParams, tenKhuyenMai: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Tìm theo mã khuyến mãi..."
            value={searchParams.maKhuyenMai}
            onChange={(e) =>
              setSearchParams({ ...searchParams, maKhuyenMai: e.target.value })
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

      {/* Promotion List */}
      <div className="promotion-management__content">
        {loading ? (
          <div className="loading">Đang tải...</div>
        ) : (
          <div className="promotion-grid">
            {promotions.map((promotion) => (
              <div key={promotion.id} className="promotion-item">
                <div className="promotion-item__header">
                  <div className="promotion-item__code">
                    <FaTag />
                    {promotion.maKhuyenMai}
                  </div>
                  <div
                    className="promotion-item__status"
                    style={{ color: getStatusColor(promotion.trangThai) }}
                  >
                    {getStatusText(promotion.trangThai)}
                  </div>
                </div>

                <div className="promotion-item__content">
                  <h3 className="promotion-item__title">
                    {promotion.tenKhuyenMai}
                  </h3>

                  <div className="promotion-item__discount">
                    <span className="discount-label">Giảm giá:</span>
                    <span className="discount-value">
                      <FaPercent />
                      {promotion.phanTramGiam}%
                    </span>
                  </div>

                  <div className="promotion-item__dates">
                    <div className="date-item">
                      <FaCalendar />
                      <span>
                        Từ:{" "}
                        {new Date(promotion.ngayBatDau).toLocaleDateString(
                          "vi-VN"
                        )}
                      </span>
                    </div>
                    <div className="date-item">
                      <FaCalendar />
                      <span>
                        Đến:{" "}
                        {new Date(promotion.ngayKetThuc).toLocaleDateString(
                          "vi-VN"
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="promotion-item__remaining">
                    <span className="remaining-text">
                      {getRemainingDays(promotion.ngayKetThuc)}
                    </span>
                  </div>

                  {promotion.moTa && (
                    <p className="promotion-item__description">
                      {promotion.moTa}
                    </p>
                  )}
                </div>

                <div className="promotion-item__actions">
                  <button
                    className="action-btn action-btn-edit"
                    onClick={() => handleEdit(promotion)}
                  >
                    <FaEdit />
                    Sửa
                  </button>
                  <button
                    className="action-btn action-btn-delete"
                    onClick={() => handleDelete(promotion.id)}
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

      {/* Promotion Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="promotion-form-modal">
            <div className="promotion-form-modal__header">
              <h2>
                {editingPromotion ? "Sửa Khuyến Mãi" : "Thêm Khuyến Mãi Mới"}
              </h2>
              <button
                className="modal-close"
                onClick={() => {
                  setShowForm(false);
                  setEditingPromotion(null);
                  resetForm();
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="promotion-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Mã Khuyến Mãi *</label>
                  <input
                    type="text"
                    value={formData.maKhuyenMai}
                    onChange={(e) =>
                      setFormData({ ...formData, maKhuyenMai: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Tên Khuyến Mãi *</label>
                  <input
                    type="text"
                    value={formData.tenKhuyenMai}
                    onChange={(e) =>
                      setFormData({ ...formData, tenKhuyenMai: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phần Trăm Giảm *</label>
                  <div className="input-with-icon">
                    <input
                      type="number"
                      value={formData.phanTramGiam}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phanTramGiam: e.target.value,
                        })
                      }
                      required
                      min="0"
                      max="100"
                      step="0.01"
                    />
                    <FaPercent className="input-icon" />
                  </div>
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
                    setEditingPromotion(null);
                    resetForm();
                  }}
                >
                  Hủy
                </button>
                <button type="submit" className="btn-primary">
                  {editingPromotion ? "Cập nhật" : "Thêm mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromotionManagement;
