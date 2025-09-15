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
  checkVoucherExists,
} from "../services/voucherService";

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
  const [searchLoading, setSearchLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const [formData, setFormData] = useState({
    maVoucher: "", // Sẽ được tự động generate bởi backend
    tenVoucher: "",
    loaiGiamGia: "GIA_TIEN",
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
      // Validation trước khi tìm kiếm
      const hasSearchCriteria =
        searchParams.tenVoucher?.trim() ||
        searchParams.maVoucher?.trim() ||
        (searchParams.trangThai && searchParams.trangThai !== "");

      if (!hasSearchCriteria) {
        window.showToast(
          "Vui lòng nhập ít nhất một điều kiện tìm kiếm",
          "warning"
        );
        return;
      }

      setSearchLoading(true);
      const params = {};
      if (searchParams.tenVoucher && searchParams.tenVoucher.trim()) {
        params.tenVoucher = searchParams.tenVoucher.trim();
      }
      if (searchParams.maVoucher && searchParams.maVoucher.trim()) {
        params.maVoucher = searchParams.maVoucher.trim();
      }
      if (searchParams.trangThai && searchParams.trangThai !== "") {
        params.trangThai = parseInt(searchParams.trangThai);
      }

      console.log("Search params:", params);
      const data = await searchVouchers(params);
      setVouchers(data);
      setHasSearched(true);

      // Xử lý kết quả tìm kiếm
      if (Object.keys(params).length > 0) {
        if (data.length === 0) {
          window.showToast(
            "Không tìm thấy voucher nào phù hợp với điều kiện tìm kiếm",
            "info"
          );
        } else if (data.length === 1) {
          window.showToast(`Tìm thấy 1 voucher`, "success");
        } else {
          window.showToast(`Tìm thấy ${data.length} vouchers`, "success");
        }
      }
    } catch (error) {
      console.error("Error searching vouchers:", error);

      // Xử lý các loại lỗi cụ thể
      if (error.response) {
        const status = error.response.status;
        if (status === 404) {
          window.showToast("Không tìm thấy dữ liệu", "warning");
        } else if (status === 500) {
          window.showToast("Lỗi server, vui lòng thử lại sau", "error");
        } else {
          window.showToast("Có lỗi xảy ra khi tìm kiếm", "error");
        }
      } else if (error.request) {
        window.showToast("Không thể kết nối đến server", "error");
      } else {
        window.showToast("Có lỗi xảy ra khi tìm kiếm", "error");
      }
    } finally {
      setSearchLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchParams({
      tenVoucher: "",
      maVoucher: "",
      trangThai: "",
    });
    setHasSearched(false);
    fetchVouchers();
    window.showToast(
      "Đã xóa bộ lọc tìm kiếm và hiển thị tất cả voucher",
      "success"
    );
  };

  // Validation cho input fields
  const validateSearchInput = (value, fieldName) => {
    if (value && value.trim().length < 2) {
      window.showToast(`${fieldName} phải có ít nhất 2 ký tự`, "warning");
      return false;
    }
    return true;
  };

  // Handle input change với validation
  const handleInputChange = (field, value) => {
    setSearchParams((prev) => ({ ...prev, [field]: value }));
  };

  // Handle search với validation
  const handleSearchWithValidation = async () => {
    // Validate từng field
    if (
      searchParams.tenVoucher &&
      !validateSearchInput(searchParams.tenVoucher, "Tên voucher")
    ) {
      return;
    }
    if (
      searchParams.maVoucher &&
      !validateSearchInput(searchParams.maVoucher, "Mã voucher")
    ) {
      return;
    }

    await handleSearch();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation cơ bản
    if (!formData.tenVoucher.trim()) {
      window.showToast("Vui lòng nhập tên voucher", "error");
      return;
    }

    // Kiểm tra độ dài tên voucher
    if (formData.tenVoucher.trim().length < 3) {
      window.showToast("Tên voucher phải có ít nhất 3 ký tự", "error");
      return;
    }

    if (formData.tenVoucher.trim().length > 255) {
      window.showToast("Tên voucher không được quá 255 ký tự", "error");
      return;
    }

    // Kiểm tra giá trị giảm
    if (!formData.giaTriGiam || parseFloat(formData.giaTriGiam) <= 0) {
      window.showToast("Vui lòng nhập giá trị giảm hợp lệ", "error");
      return;
    }

    if (parseFloat(formData.giaTriGiam) > 999999999) {
      window.showToast("Giá trị giảm không được quá 999,999,999", "error");
      return;
    }

    // Kiểm tra giá trị tối thiểu nếu có
    if (formData.giaTriToiThieu && parseFloat(formData.giaTriToiThieu) <= 0) {
      window.showToast("Giá trị tối thiểu phải lớn hơn 0", "error");
      return;
    }

    if (
      formData.giaTriToiThieu &&
      parseFloat(formData.giaTriToiThieu) > 999999999
    ) {
      window.showToast("Giá trị tối thiểu không được quá 999,999,999", "error");
      return;
    }

    // Kiểm tra giảm tối đa nếu có
    if (formData.giamToiDa && parseFloat(formData.giamToiDa) <= 0) {
      window.showToast("Giá trị giảm tối đa phải lớn hơn 0", "error");
      return;
    }

    if (formData.giamToiDa && parseFloat(formData.giamToiDa) > 999999999) {
      window.showToast(
        "Giá trị giảm tối đa không được quá 999,999,999",
        "error"
      );
      return;
    }

    // Kiểm tra số lượng nếu có
    if (formData.soLuong && parseInt(formData.soLuong) < 0) {
      window.showToast("Số lượng không được âm", "error");
      return;
    }

    if (formData.soLuong && parseInt(formData.soLuong) > 999999) {
      window.showToast("Số lượng không được quá 999,999", "error");
      return;
    }

    // Kiểm tra mô tả nếu có
    if (formData.moTa && formData.moTa.trim().length > 1000) {
      window.showToast("Mô tả không được quá 1000 ký tự", "error");
      return;
    }

    // Kiểm tra ngày
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

    // Kiểm tra ngày bắt đầu không được trong quá khứ (chỉ khi tạo mới)
    if (!editingVoucher) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (new Date(formData.ngayBatDau) < today) {
        window.showToast("Ngày bắt đầu không được trong quá khứ", "error");
        return;
      }
    }

    // Cảnh báo khi cập nhật voucher đã hết hạn
    if (editingVoucher) {
      const endDate = new Date(editingVoucher.ngayKetThuc);
      const today = new Date();
      if (endDate < today) {
        const confirmUpdate = window.confirm(
          "Voucher này đã hết hạn. Bạn có chắc chắn muốn cập nhật không?"
        );
        if (!confirmUpdate) {
          return;
        }
      }
    }

    try {
      // Gửi dữ liệu thô, service sẽ format
      const voucherData = {
        ...formData,
        // Đảm bảo loaiGiamGia hợp lệ trước khi gửi - xử lý tất cả các trường hợp
        loaiGiamGia:
          formData.loaiGiamGia === "TIEN_MAT" || formData.loaiGiamGia === "TIEN"
            ? "GIA_TIEN"
            : formData.loaiGiamGia,
      };

      if (editingVoucher) {
        console.log("Sending update data:", voucherData);
        console.log("Original form data:", formData);
        await updateVoucher(editingVoucher.id, voucherData);
        window.showToast(
          `Đã cập nhật voucher "${voucherData.tenVoucher}" thành công!`,
          "success"
        );
      } else {
        console.log("Sending create data:", voucherData);
        await createVoucher(voucherData);
        window.showToast(
          `Đã tạo voucher "${voucherData.tenVoucher}" thành công!`,
          "success"
        );
      }

      setShowForm(false);
      setEditingVoucher(null);
      resetForm();
      fetchVouchers();
    } catch (error) {
      console.error("Error saving voucher:", error);

      // Xử lý các loại lỗi cụ thể
      let errorMessage =
        "Có lỗi xảy ra khi lưu voucher. Vui lòng kiểm tra lại thông tin.";

      if (error.response && error.response.data) {
        const serverMessage = error.response.data.message || "";
        const status = error.response.status;

        // Xử lý lỗi 400 Bad Request
        if (status === 400) {
          if (
            serverMessage.includes("UNIQUE") ||
            serverMessage.includes("constraint") ||
            serverMessage.includes("UQ__voucher")
          ) {
            errorMessage =
              "Lỗi cập nhật: Có thể do mã voucher trùng lặp hoặc dữ liệu không hợp lệ. Vui lòng thử lại.";
          } else if (
            serverMessage.includes("Cannot insert") ||
            serverMessage.includes("insert the val")
          ) {
            errorMessage =
              "Lỗi cập nhật: Dữ liệu không hợp lệ hoặc thiếu thông tin bắt buộc. Vui lòng kiểm tra lại.";
          } else if (serverMessage.includes("validation")) {
            errorMessage =
              "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.";
          } else if (serverMessage.includes("not found")) {
            errorMessage = "Voucher không tồn tại hoặc đã bị xóa.";
          } else {
            errorMessage = serverMessage || "Dữ liệu không hợp lệ.";
          }
        }
        // Xử lý lỗi 404 Not Found
        else if (status === 404) {
          errorMessage = "Voucher không tồn tại hoặc đã bị xóa.";
        }
        // Xử lý lỗi 500 Internal Server Error
        else if (status === 500) {
          errorMessage = "Lỗi server. Vui lòng thử lại sau.";
        }
        // Xử lý lỗi khác
        else {
          errorMessage = serverMessage || `Lỗi ${status}: Vui lòng thử lại.`;
        }
      }
      // Xử lý lỗi network
      else if (error.request) {
        errorMessage =
          "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.";
      }
      // Xử lý lỗi khác
      else {
        errorMessage = error.message || "Có lỗi xảy ra. Vui lòng thử lại.";
      }

      window.showToast(errorMessage, "error");
    }
  };

  const handleEdit = (voucher) => {
    setEditingVoucher(voucher);

    // Đảm bảo loaiGiamGia được format đúng - xử lý tất cả các trường hợp
    let formattedLoaiGiamGia = voucher.loaiGiamGia;
    if (voucher.loaiGiamGia === "TIEN_MAT" || voucher.loaiGiamGia === "TIEN") {
      formattedLoaiGiamGia = "GIA_TIEN";
    }

    setFormData({
      maVoucher: voucher.maVoucher,
      tenVoucher: voucher.tenVoucher,
      loaiGiamGia: formattedLoaiGiamGia,
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

    console.log("Editing voucher data:", voucher);
    console.log("Form data set:", {
      maVoucher: voucher.maVoucher,
      tenVoucher: voucher.tenVoucher,
      loaiGiamGia: formattedLoaiGiamGia,
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

    // Hiển thị thông báo về trạng thái voucher
    const endDate = new Date(voucher.ngayKetThuc);
    const today = new Date();
    if (endDate < today) {
      window.showToast(
        `Voucher "${voucher.tenVoucher}" đã hết hạn. Bạn có thể cập nhật thông tin.`,
        "warning"
      );
    }
  };

  const handleDelete = async (id) => {
    const voucherToDelete = vouchers.find((v) => v.id === id);
    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa voucher "${voucherToDelete?.tenVoucher}"?`
      )
    ) {
      try {
        await deleteVoucher(id);
        window.showToast(
          `Đã xóa voucher "${voucherToDelete?.tenVoucher}" thành công!`,
          "success"
        );
        fetchVouchers();
      } catch (error) {
        console.error("Error deleting voucher:", error);
        window.showToast(
          "Có lỗi xảy ra khi xóa voucher. Vui lòng thử lại.",
          "error"
        );
      }
    }
  };

  const resetForm = () => {
    setFormData({
      maVoucher: "",
      tenVoucher: "",
      loaiGiamGia: "GIA_TIEN",
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
      (v) => v.loaiGiamGia === "GIA_TIEN" || v.loaiGiamGia === "TIEN_MAT"
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
              <div className="stat-card-icon total">
                <FaGift />
              </div>
              <div className="stat-content">
                <h4>{stats.total}</h4>
                <p>Tổng số voucher</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon active">
                <FaGift />
              </div>
              <div className="stat-content">
                <h4>{stats.active}</h4>
                <p>Đang hoạt động</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon inactive">
                <FaGift />
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
                <FaGift />
              </div>
              <div className="stat-content">
                <h4>{stats.moneyType}</h4>
                <p>Giảm tiền mặt</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon percent">
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
      <div
        className="voucher-management__search"
        style={{ position: "relative" }}
      >
        {searchLoading && (
          <div className="search-loading-overlay">
            <div className="search-loading-text">
              <div className="loading-spinner"></div>
              Đang tìm kiếm...
            </div>
          </div>
        )}
        <div className="search-filters">
          <input
            type="text"
            placeholder="Tìm theo tên voucher (tối thiểu 2 ký tự)..."
            value={searchParams.tenVoucher}
            onChange={(e) => handleInputChange("tenVoucher", e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !searchLoading) {
                handleSearchWithValidation();
              }
            }}
            disabled={searchLoading}
            minLength={2}
          />
          <input
            type="text"
            placeholder="Tìm theo mã voucher (tối thiểu 2 ký tự)..."
            value={searchParams.maVoucher}
            onChange={(e) => handleInputChange("maVoucher", e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !searchLoading) {
                handleSearchWithValidation();
              }
            }}
            disabled={searchLoading}
            minLength={2}
          />
          <select
            value={searchParams.trangThai}
            onChange={(e) => handleInputChange("trangThai", e.target.value)}
            disabled={searchLoading}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="1">Hoạt động</option>
            <option value="0">Vô hiệu hóa</option>
          </select>
          <button
            className={`btn-secondary ${searchLoading ? "btn-loading" : ""}`}
            onClick={handleSearchWithValidation}
            disabled={searchLoading}
          >
            {searchLoading ? (
              <>
                <div className="loading-spinner"></div>
                Đang tìm...
              </>
            ) : (
              <>
                <FaSearch />
                Tìm kiếm
              </>
            )}
          </button>
          <button
            className={`btn-clear ${searchLoading ? "btn-loading" : ""}`}
            onClick={handleClearSearch}
            disabled={searchLoading}
          >
            Xóa bộ lọc
          </button>
        </div>
      </div>

      {/* Voucher List */}
      <div className="voucher-management__content">
        {loading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Đang tải danh sách voucher...</p>
          </div>
        ) : hasSearched && vouchers.length === 0 ? (
          <div className="no-results">
            <div className="no-results__icon">🔍</div>
            <h3>Không tìm thấy voucher nào</h3>
            <p>Không có voucher nào phù hợp với điều kiện tìm kiếm của bạn.</p>
            <div className="no-results__suggestions">
              <p>
                <strong>Gợi ý:</strong>
              </p>
              <ul>
                <li>Kiểm tra lại từ khóa tìm kiếm</li>
                <li>Thử tìm kiếm với từ khóa ngắn hơn</li>
                <li>Chọn trạng thái khác</li>
                <li>Xóa bộ lọc để xem tất cả voucher</li>
              </ul>
            </div>
            <button className="btn-secondary" onClick={handleClearSearch}>
              Xem tất cả voucher
            </button>
          </div>
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

                  {voucher.giamToiDa &&
                    (voucher.loaiGiamGia === "PHAN_TRAM" ||
                      voucher.loaiGiamGia === "TIEN_MAT") && (
                      <div className="voucher-item__max-discount">
                        <span>
                          Tối đa: {voucher.giamToiDa.toLocaleString()}đ
                        </span>
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
                    className="action-btn action-btn-edit"
                    onClick={() => handleEdit(voucher)}
                  >
                    <FaEdit />
                    Sửa
                  </button>
                  <button
                    className="action-btn action-btn-delete"
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
              {editingVoucher && (
                <div className="voucher-status-indicator">
                  {(() => {
                    const endDate = new Date(editingVoucher.ngayKetThuc);
                    const today = new Date();
                    if (endDate < today) {
                      return (
                        <span className="status-expired">
                          ⚠️ Voucher đã hết hạn
                        </span>
                      );
                    } else if (editingVoucher.trangThai === 0) {
                      return (
                        <span className="status-badge status-inactive">
                          ⏸️ Voucher đã vô hiệu hóa
                        </span>
                      );
                    } else {
                      return (
                        <span className="status-badge status-active">
                          ✅ Voucher đang hoạt động
                        </span>
                      );
                    }
                  })()}
                </div>
              )}
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
                  <label>Mã Voucher</label>
                  <div className="auto-generate-notice">
                    <span className="notice-text">
                      🔄 Mã voucher sẽ được tự động tạo
                    </span>
                  </div>
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
                    minLength={3}
                    maxLength={255}
                    placeholder="Nhập tên voucher (3-255 ký tự)"
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
                    <option value="GIA_TIEN">Giảm tiền mặt</option>
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
                    max="999999999"
                    step="0.01"
                    placeholder="Nhập giá trị giảm (0-999,999,999)"
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
                    max="999999999"
                    step="0.01"
                    placeholder="Nhập giá trị tối thiểu (0-999,999,999)"
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
                    max="999999999"
                    step="0.01"
                    placeholder="Nhập giá trị giảm tối đa (0-999,999,999)"
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
                    max="999999"
                    placeholder="Nhập số lượng (0-999,999)"
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
                  maxLength={1000}
                  placeholder="Nhập mô tả (tối đa 1000 ký tự)"
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

// CSS cho auto-generate notice và loading effects
const styles = `
  .auto-generate-notice {
    background: #f8f9fa;
    border: 1px solid #dee2e6;
    border-radius: 4px;
    padding: 10px;
    margin-top: 5px;
  }
  
  .notice-text {
    color: #6c757d;
    font-size: 14px;
    font-style: italic;
  }

  /* Loading animation */
  .loading-spinner {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid #f3f3f3;
    border-top: 2px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-right: 8px;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .btn-loading {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .btn-loading:hover {
    opacity: 0.7;
  }

  /* Search section styling */
  .voucher-management__search {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
    border: 1px solid #e9ecef;
  }

  .search-filters {
    display: flex;
    gap: 15px;
    align-items: center;
    flex-wrap: wrap;
  }

  .search-filters input,
  .search-filters select {
    padding: 10px 15px;
    border: 1px solid #ced4da;
    border-radius: 6px;
    font-size: 14px;
    min-width: 200px;
    transition: border-color 0.3s, box-shadow-md 0.3s;
  }

  .search-filters input:focus,
  .search-filters select:focus {
    outline: none;
    border-color: #007bff;
    box-shadow-md: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }

  .search-filters button {
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .search-filters .btn-secondary {
    background: #007bff;
    color: white;
  }

  .search-filters .btn-secondary:hover {
    background: #0056b3;
    transform: translateY(-1px);
  }

  .search-filters .btn-clear {
    background: #6c757d;
    color: white;
  }

  .search-filters .btn-clear:hover {
    background: #545b62;
    transform: translateY(-1px);
  }

  /* Loading overlay */
  .search-loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    border-radius: 8px;
  }

  .search-loading-text {
    color: #007bff;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  /* Fade in animation for search results */
  .voucher-grid {
    animation: fadeIn 0.5s ease-in-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* General loading styles */
  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px;
    color: #6c757d;
    font-size: 16px;
  }

  .loading p {
    margin-top: 15px;
    font-weight: 500;
  }

  /* Disabled input styles */
  .search-filters input:disabled,
  .search-filters select:disabled {
    background-color: #f8f9fa;
    cursor: not-allowed;
    opacity: 0.6;
  }

  /* No results styles */
  .no-results {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    text-align: center;
    background: #f8f9fa;
    border-radius: 8px;
    border: 2px dashed #dee2e6;
  }

  .no-results__icon {
    font-size: 48px;
    margin-bottom: 20px;
  }

  .no-results h3 {
    color: #495057;
    margin-bottom: 10px;
    font-size: 24px;
  }

  .no-results p {
    color: #6c757d;
    margin-bottom: 20px;
    font-size: 16px;
  }

  .no-results__suggestions {
    background: white;
    padding: 20px;
    border-radius: 6px;
    margin-bottom: 20px;
    max-width: 400px;
    text-align: left;
  }

  .no-results__suggestions p {
    margin-bottom: 10px;
    color: #495057;
  }

  .no-results__suggestions ul {
    margin: 0;
    padding-left: 20px;
    color: #6c757d;
  }

  .no-results__suggestions li {
    margin-bottom: 5px;
  }

  .no-results button {
    margin-top: 10px;
  }

  /* Input validation styles */
  .search-filters input:invalid {
    border-color: #dc3545;
    box-shadow-md: 0 0 0 2px rgba(220, 53, 69, 0.25);
  }

  .search-filters input:valid {
    border-color: #28a745;
  }

  /* Voucher status indicator */
  .voucher-status-indicator {
    margin: 10px 0;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
  }

  .status-expired {
    background-color: #fff3cd;
    color: #856404;
    border: 1px solid #ffeaa7;
  }

  .status-badge status-inactive {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }

  .status-badge status-active {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }

  /* Modal header adjustments */
  .voucher-form-modal__header {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .voucher-form-modal__header h2 {
    margin: 0;
  }
`;

// Inject CSS
const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);
