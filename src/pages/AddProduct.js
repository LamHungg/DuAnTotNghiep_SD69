import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaTrash,
  FaImage,
  FaSave,
  FaSpinner,
  FaUpload,
  FaEye,
  FaEdit,
} from "react-icons/fa";
import Select from "react-select";
import {
  createSanPham,
  createChiTietSanPham,
  uploadImageToServer,
  uploadMultipleImages,
} from "../services/sanPhamService";
import { getAllDanhMuc } from "../services/danhMucService";
import { getAllChatLieu } from "../services/chatLieuService";
import { getAllKichCo } from "../services/kichCoService";
import { getAllMauSac } from "../services/mauSacService";
import Toast from "../components/Toast";
import "./AddProduct.css";

const AddProduct = () => {
  const navigate = useNavigate();

  // ===== STATE =====
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // ===== UTILITY FUNCTIONS =====
  const formatCurrency = (value) => {
    if (!value) return "";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const parseCurrency = (value) => {
    if (!value) return 0;
    // Loại bỏ tất cả ký tự không phải số
    const numericValue = value.replace(/[^\d]/g, "");
    return parseInt(numericValue) || 0;
  };

  const handleCurrencyInputChange = (variantId, field, value) => {
    const numericValue = parseCurrency(value);
    handleVariantChange(variantId, field, numericValue);
  };

  const removeImage = (variantId, imageIndex) => {
    // Tìm biến thể để lấy màu sắc
    const targetVariant = variants.find((v) => v.id === variantId);
    if (!targetVariant) return;

    setVariants((prev) =>
      prev.map((variant) => {
        // Xóa ảnh cho tất cả biến thể cùng màu
        if (variant.mauSac.value === targetVariant.mauSac.value) {
          const newImages = [...variant.hinhAnhs];
          newImages.splice(imageIndex, 1);
          return {
            ...variant,
            hinhAnhs: newImages,
          };
        }
        return variant;
      })
    );
  };

  // ===== FORM DATA =====
  const [formData, setFormData] = useState({
    tenSanPham: "",
    danhMuc: null,
    chatLieu: null,
    moTa: "",
    kichCos: [],
    mauSacs: [],
    trangThai: 1,
  });

  // ===== VARIANTS =====
  const [variants, setVariants] = useState([]);
  const [groupedVariants, setGroupedVariants] = useState({});

  // ===== OPTIONS =====
  const [options, setOptions] = useState({
    danhMucs: [],
    chatLieus: [],
    kichCos: [],
    mauSacs: [],
  });

  // ===== ERRORS =====
  const [errors, setErrors] = useState({});

  // ===== MODAL =====
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentVariant, setCurrentVariant] = useState(null);
  const [uploadingImages, setUploadingImages] = useState(false);

  // ===== EFFECTS =====
  useEffect(() => {
    fetchOptions();
  }, []);

  useEffect(() => {
    generateVariants();
  }, [formData.kichCos, formData.mauSacs]);

  useEffect(() => {
    groupVariantsByColor();
  }, [variants]);

  // ===== FUNCTIONS =====
  const fetchOptions = async () => {
    try {
      setLoading(true);
      const [danhMucs, chatLieus, kichCos, mauSacs] = await Promise.all([
        getAllDanhMuc(),
        getAllChatLieu(),
        getAllKichCo(),
        getAllMauSac(),
      ]);

      setOptions({
        danhMucs: (danhMucs || []).map((dm) => ({
          value: dm.id,
          label: dm.tenDanhMuc,
        })),
        chatLieus: (chatLieus || []).map((cl) => ({
          value: cl.id,
          label: cl.tenChatLieu,
        })),
        kichCos: (kichCos || []).map((kc) => ({
          value: kc.id,
          label: kc.tenKichCo,
        })),
        mauSacs: (mauSacs || []).map((ms) => ({
          value: ms.id,
          label: ms.tenMauSac,
        })),
      });
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
      showToast("Lỗi khi tải dữ liệu. Vui lòng thử lại.", "error");
    } finally {
      setLoading(false);
    }
  };

  const generateVariants = () => {
    if (formData.kichCos.length > 0 && formData.mauSacs.length > 0) {
      const newVariants = [];
      formData.kichCos.forEach((kichCo) => {
        formData.mauSacs.forEach((mauSac) => {
          newVariants.push({
            id: `${kichCo.value}-${mauSac.value}`,
            kichCo: kichCo,
            mauSac: mauSac,
            soLuong: 0,
            giaNhap: 0, // This field is not in formData, so it's 0
            giaBan: 0, // This field is not in formData, so it's 0
            giaKhuyenMai: 0, // This field is not in formData, so it's 0
            hinhAnhs: [],
            trangThai: 1,
          });
        });
      });
      setVariants(newVariants);
    } else {
      setVariants([]);
    }
  };

  const groupVariantsByColor = () => {
    const grouped = {};
    variants.forEach((variant) => {
      const colorKey = variant.mauSac.value;
      if (!grouped[colorKey]) {
        grouped[colorKey] = {
          color: variant.mauSac,
          variants: [],
          totalQuantity: 0,
          totalImages: [],
        };
      }
      grouped[colorKey].variants.push(variant);
      grouped[colorKey].totalQuantity += variant.soLuong;
      grouped[colorKey].totalImages = [
        ...new Set([...grouped[colorKey].totalImages, ...variant.hinhAnhs]),
      ];
    });
    setGroupedVariants(grouped);
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleVariantChange = (variantId, field, value) => {
    setVariants((prev) =>
      prev.map((variant) =>
        variant.id === variantId ? { ...variant, [field]: value } : variant
      )
    );
  };

  const handleColorGroupChange = (colorKey, field, value) => {
    setVariants((prev) =>
      prev.map((variant) =>
        variant.mauSac.value === colorKey
          ? { ...variant, [field]: value }
          : variant
      )
    );
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.tenSanPham.trim()) {
      newErrors.tenSanPham = "Vui lòng nhập tên sản phẩm";
    }
    if (!formData.danhMuc) {
      newErrors.danhMuc = "Vui lòng chọn danh mục";
    }
    if (!formData.chatLieu) {
      newErrors.chatLieu = "Vui lòng chọn chất liệu";
    }
    if (formData.kichCos.length === 0) {
      newErrors.kichCos = "Vui lòng chọn ít nhất một kích cỡ";
    }
    if (formData.mauSacs.length === 0) {
      newErrors.mauSacs = "Vui lòng chọn ít nhất một màu sắc";
    }

    // Validate variants
    variants.forEach((variant) => {
      if (variant.soLuong < 0) {
        newErrors[`variant_${variant.id}_soLuong`] = "Số lượng không được âm";
      }
      if (variant.giaNhap <= 0) {
        newErrors[`variant_${variant.id}_giaNhap`] = "Giá nhập phải lớn hơn 0";
      }
      if (variant.giaBan <= 0) {
        newErrors[`variant_${variant.id}_giaBan`] = "Giá bán phải lớn hơn 0";
      }
      if (variant.giaBan < variant.giaNhap) {
        newErrors[`variant_${variant.id}_giaBan`] =
          "Giá bán không được thấp hơn giá nhập";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const openImageModal = (variant) => {
    console.log("Opening image modal for variant:", variant);
    setCurrentVariant(variant);
    setShowImageModal(true);
  };

  const openColorImageModal = (colorKey) => {
    console.log("Opening color image modal for colorKey:", colorKey);
    const colorGroup = groupedVariants[colorKey];
    if (colorGroup && colorGroup.variants.length > 0) {
      setCurrentVariant({
        ...colorGroup.variants[0],
        hinhAnhs: colorGroup.totalImages,
        isColorGroup: true,
        colorKey: colorKey,
      });
      setShowImageModal(true);
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    try {
      setUploadingImages(true);

      // Validate files
      const validFiles = files.filter((file) => {
        if (!file.type.startsWith("image/")) {
          showToast(`File ${file.name} không phải là ảnh hợp lệ`, "error");
          return false;
        }
        if (file.size > 5 * 1024 * 1024) {
          showToast(`File ${file.name} quá lớn (tối đa 5MB)`, "error");
          return false;
        }
        return true;
      });

      if (validFiles.length === 0) {
        showToast("Không có file hợp lệ để upload", "error");
        return;
      }

      console.log(
        "Uploading files:",
        validFiles.map((f) => f.name)
      );

      // Upload tất cả files cùng lúc
      const uploadedUrls = await uploadMultipleImages(validFiles);
      console.log("Upload response:", uploadedUrls);

      if (uploadedUrls && uploadedUrls.length > 0 && currentVariant) {
        if (currentVariant.isColorGroup) {
          // Upload cho cả nhóm màu
          setVariants((prev) =>
            prev.map((variant) =>
              variant.mauSac.value === currentVariant.colorKey
                ? {
                    ...variant,
                    hinhAnhs: [...variant.hinhAnhs, ...uploadedUrls],
                  }
                : variant
            )
          );
        } else {
          // Upload cho một biến thể cụ thể - áp dụng cho tất cả biến thể cùng màu
          setVariants((prev) =>
            prev.map((variant) =>
              variant.mauSac.value === currentVariant.mauSac.value
                ? {
                    ...variant,
                    hinhAnhs: [...variant.hinhAnhs, ...uploadedUrls],
                  }
                : variant
            )
          );
        }
        showToast(
          `Đã upload ${uploadedUrls.length} ảnh thành công cho tất cả biến thể cùng màu`,
          "success"
        );
      }
    } catch (error) {
      console.error("Lỗi upload ảnh:", error);
      let errorMessage = "Lỗi không xác định";

      if (error.response) {
        errorMessage = error.response.data || error.response.statusText;
      } else if (error.request) {
        errorMessage = "Không thể kết nối tới server";
      } else {
        errorMessage = error.message;
      }

      showToast(`Lỗi khi upload ảnh: ${errorMessage}`, "error");
    } finally {
      setUploadingImages(false);
    }
  };

  const saveProduct = async () => {
    if (!validateForm()) return;

    try {
      setSaving(true);
      console.log("Bắt đầu lưu sản phẩm...");

      // Validate dữ liệu trước khi gửi
      if (!formData.danhMuc || !formData.danhMuc.value) {
        throw new Error("Vui lòng chọn danh mục");
      }
      if (!formData.chatLieu || !formData.chatLieu.value) {
        throw new Error("Vui lòng chọn chất liệu");
      }
      if (variants.length === 0) {
        throw new Error("Vui lòng chọn kích cỡ và màu sắc để tạo biến thể");
      }

      // Tạo sản phẩm chính
      const sanPhamData = {
        tenSanPham: formData.tenSanPham.trim(),
        moTa: formData.moTa ? formData.moTa.trim() : "",
        idDanhMuc: parseInt(formData.danhMuc.value),
        trangThai: parseInt(formData.trangThai),
      };

      console.log("Dữ liệu sản phẩm:", sanPhamData);

      const sanPhamResponse = await createSanPham(sanPhamData);
      console.log("Response tạo sản phẩm:", sanPhamResponse);

      if (!sanPhamResponse || !sanPhamResponse.id) {
        throw new Error("Lỗi khi tạo sản phẩm - không nhận được ID");
      }

      console.log("Tạo sản phẩm thành công, ID:", sanPhamResponse.id);

      // Tạo các biến thể sản phẩm
      const chiTietPromises = variants.map((variant) => {
        const chiTietData = {
          idSanPham: parseInt(sanPhamResponse.id),
          idKichCo: parseInt(variant.kichCo.value),
          idMauSac: parseInt(variant.mauSac.value),
          idChatLieu: parseInt(formData.chatLieu.value),
          soLuong: parseInt(variant.soLuong) || 0,
          giaNhap: parseFloat(variant.giaNhap) || 0,
          gia: parseFloat(variant.giaBan) || 0,
          hinhAnh: Array.isArray(variant.hinhAnhs) ? variant.hinhAnhs : [],
          trangThai: parseInt(variant.trangThai) || 1,
        };
        console.log("Dữ liệu chi tiết sản phẩm:", chiTietData);
        return createChiTietSanPham(chiTietData);
      });

      console.log("Đang tạo", chiTietPromises.length, "biến thể...");
      await Promise.all(chiTietPromises);

      showToast("Thêm sản phẩm thành công!", "success");
      setTimeout(() => {
        navigate("/dashboard/products");
      }, 2000);
    } catch (error) {
      console.error("Lỗi khi lưu sản phẩm:", error);

      let errorMessage = "Lỗi khi lưu sản phẩm. Vui lòng thử lại.";

      if (error.response) {
        // Lỗi từ server
        console.error("Server response:", error.response.data);
        console.error("Status:", error.response.status);
        console.error(
          "Full error response:",
          JSON.stringify(error.response.data, null, 2)
        );

        if (error.response.data && error.response.data.message) {
          errorMessage = `Lỗi server: ${error.response.data.message}`;
        } else if (
          error.response.data &&
          typeof error.response.data === "object"
        ) {
          // Nếu response là object, hiển thị tất cả thông tin
          const errorDetails = Object.entries(error.response.data)
            .map(([key, value]) => `${key}: ${value}`)
            .join(", ");
          errorMessage = `Lỗi server: ${errorDetails}`;
        } else if (error.response.status === 400) {
          errorMessage =
            "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.";
        } else if (error.response.status === 404) {
          errorMessage = "Không tìm thấy tài nguyên. Vui lòng thử lại.";
        } else if (error.response.status === 500) {
          errorMessage = "Lỗi server. Vui lòng thử lại sau.";
        }
      } else if (error.request) {
        // Lỗi network
        console.error("Network error:", error.request);
        errorMessage =
          "Không thể kết nối tới server. Vui lòng kiểm tra kết nối.";
      } else {
        // Lỗi khác
        console.error("Other error:", error.message);
        errorMessage = `Lỗi: ${error.message}`;
      }

      showToast(errorMessage, "error");
    } finally {
      setSaving(false);
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type }), 3000);
  };

  // ===== RENDER =====
  if (loading) {
    return (
      <div className="loading-container">
        <FaSpinner className="spinner" />
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="add-product-simple">
      <div className="header">
        <h1>Thêm sản phẩm mới</h1>
        <p>Quản lý sản phẩm với nhiều biến thể dễ dàng</p>
      </div>

      <div className="main-content">
        <div className="two-column-layout">
          {/* Cột trái - Thông tin cơ bản và thuộc tính */}
          <div className="left-column">
            {/* Thông tin cơ bản */}
            <div className="section">
              <h3>Thông tin cơ bản</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Tên sản phẩm *</label>
                  <input
                    type="text"
                    value={formData.tenSanPham}
                    onChange={(e) =>
                      handleFormChange("tenSanPham", e.target.value)
                    }
                    placeholder="Nhập tên sản phẩm..."
                    className={errors.tenSanPham ? "error" : ""}
                  />
                  {errors.tenSanPham && (
                    <span className="error-text">{errors.tenSanPham}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>Danh mục *</label>
                  <Select
                    value={formData.danhMuc}
                    onChange={(option) => handleFormChange("danhMuc", option)}
                    options={options.danhMucs}
                    placeholder="Chọn danh mục..."
                    isClearable
                    className={errors.danhMuc ? "error" : ""}
                  />
                  {errors.danhMuc && (
                    <span className="error-text">{errors.danhMuc}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>Chất liệu *</label>
                  <Select
                    value={formData.chatLieu}
                    onChange={(option) => handleFormChange("chatLieu", option)}
                    options={options.chatLieus}
                    placeholder="Chọn chất liệu..."
                    isClearable
                    className={errors.chatLieu ? "error" : ""}
                  />
                  {errors.chatLieu && (
                    <span className="error-text">{errors.chatLieu}</span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Mô tả</label>
                <textarea
                  value={formData.moTa}
                  onChange={(e) => handleFormChange("moTa", e.target.value)}
                  placeholder="Mô tả sản phẩm..."
                  rows="3"
                />
              </div>
            </div>

            {/* Thuộc tính và giá cả */}
            <div className="section">
              <h3>Thuộc tính sản phẩm</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Kích cỡ *</label>
                  <Select
                    isMulti
                    value={formData.kichCos}
                    onChange={(options) => handleFormChange("kichCos", options)}
                    options={options.kichCos}
                    placeholder="Chọn kích cỡ..."
                    className={errors.kichCos ? "error" : ""}
                  />
                  {errors.kichCos && (
                    <span className="error-text">{errors.kichCos}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>Màu sắc *</label>
                  <Select
                    isMulti
                    value={formData.mauSacs}
                    onChange={(options) => handleFormChange("mauSacs", options)}
                    options={options.mauSacs}
                    placeholder="Chọn màu sắc..."
                    className={errors.mauSacs ? "error" : ""}
                  />
                  {errors.mauSacs && (
                    <span className="error-text">{errors.mauSacs}</span>
                  )}
                </div>
              </div>

              {/* Preview biến thể */}
              {variants.length > 0 && (
                <div className="variants-preview">
                  <h4>Biến thể sản phẩm ({variants.length} biến thể)</h4>
                  <div className="variants-grid">
                    {variants.slice(0, 6).map((variant) => (
                      <div key={variant.id} className="variant-preview">
                        <span>
                          {variant.kichCo.label} - {variant.mauSac.label}
                        </span>
                      </div>
                    ))}
                    {variants.length > 6 && (
                      <div className="variant-preview more">
                        +{variants.length - 6} biến thể khác
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Cột phải - Bảng biến thể */}
          <div className="right-column">
            {Object.keys(groupedVariants).length > 0 ? (
              <div className="section variants-section">
                <h3>Quản lý tồn kho & Hình ảnh</h3>
                <div className="color-groups">
                  {Object.entries(groupedVariants).map(
                    ([colorKey, colorGroup]) => (
                      <div key={colorKey} className="color-group">
                        <div className="color-group-header">
                          <div className="color-info">
                            <h4>{colorGroup.color.label}</h4>
                            <span className="variant-count">
                              {colorGroup.variants.length} kích cỡ
                            </span>
                          </div>
                          <div className="color-actions">
                            <div className="color-summary">
                              <span>Tổng: {colorGroup.totalQuantity} cái</span>
                              <span>{colorGroup.totalImages.length} ảnh</span>
                            </div>
                            <button
                              type="button"
                              className="btn-upload"
                              onClick={() => openColorImageModal(colorKey)}
                            >
                              <FaUpload /> Upload ảnh
                            </button>
                          </div>
                        </div>

                        <div className="color-variants">
                          <table>
                            <thead>
                              <tr>
                                <th>Kích cỡ</th>
                                <th>Số lượng</th>
                                <th>Giá nhập</th>
                                <th>Giá bán</th>
                                <th>Hình ảnh</th>
                                <th>Thao tác</th>
                              </tr>
                            </thead>
                            <tbody>
                              {colorGroup.variants.map((variant) => (
                                <tr key={variant.id}>
                                  <td>
                                    <span className="size-label">
                                      {variant.kichCo.label}
                                    </span>
                                  </td>
                                  <td>
                                    <input
                                      type="number"
                                      value={variant.soLuong}
                                      onChange={(e) =>
                                        handleVariantChange(
                                          variant.id,
                                          "soLuong",
                                          Number(e.target.value)
                                        )
                                      }
                                      min="0"
                                      className={
                                        errors[`variant_${variant.id}_soLuong`]
                                          ? "error"
                                          : ""
                                      }
                                    />
                                    {errors[
                                      `variant_${variant.id}_soLuong`
                                    ] && (
                                      <span className="error-text">
                                        {
                                          errors[
                                            `variant_${variant.id}_soLuong`
                                          ]
                                        }
                                      </span>
                                    )}
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      value={formatCurrency(variant.giaNhap)}
                                      onChange={(e) =>
                                        handleCurrencyInputChange(
                                          variant.id,
                                          "giaNhap",
                                          e.target.value
                                        )
                                      }
                                      placeholder="0 ₫"
                                      className={
                                        errors[`variant_${variant.id}_giaNhap`]
                                          ? "error"
                                          : ""
                                      }
                                    />
                                    {errors[
                                      `variant_${variant.id}_giaNhap`
                                    ] && (
                                      <span className="error-text">
                                        {
                                          errors[
                                            `variant_${variant.id}_giaNhap`
                                          ]
                                        }
                                      </span>
                                    )}
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      value={formatCurrency(variant.giaBan)}
                                      onChange={(e) =>
                                        handleCurrencyInputChange(
                                          variant.id,
                                          "giaBan",
                                          e.target.value
                                        )
                                      }
                                      placeholder="0 ₫"
                                      className={
                                        errors[`variant_${variant.id}_giaBan`]
                                          ? "error"
                                          : ""
                                      }
                                    />
                                    {errors[`variant_${variant.id}_giaBan`] && (
                                      <span className="error-text">
                                        {errors[`variant_${variant.id}_giaBan`]}
                                      </span>
                                    )}
                                  </td>
                                  <td>
                                    <div className="variant-images">
                                      {variant.hinhAnhs
                                        .slice(0, 2)
                                        .map((img, index) => (
                                          <img
                                            key={index}
                                            src={img}
                                            alt={`${variant.kichCo.label} ${variant.mauSac.label}`}
                                          />
                                        ))}
                                      {variant.hinhAnhs.length > 2 && (
                                        <span className="more-images">
                                          +{variant.hinhAnhs.length - 2}
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                  <td>
                                    <button
                                      type="button"
                                      className="btn-upload small"
                                      onClick={() => openImageModal(variant)}
                                    >
                                      <FaUpload />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            ) : (
              <div className="section empty-variants">
                <div className="empty-state">
                  <FaImage className="empty-icon" />
                  <h3>Chưa có biến thể</h3>
                  <p>
                    Vui lòng chọn kích cỡ và màu sắc để tạo biến thể sản phẩm
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Nút lưu */}
        <div className="actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate("/dashboard/products")}
            disabled={saving}
          >
            Hủy
          </button>
          <button
            type="button"
            className="btn-success"
            onClick={saveProduct}
            disabled={saving}
          >
            {saving ? (
              <>
                <FaSpinner className="spinner" /> Đang lưu...
              </>
            ) : (
              <>
                <FaSave /> Lưu sản phẩm
              </>
            )}
          </button>
        </div>
      </div>

      {/* Image Upload Modal - Đơn giản hơn */}
      {showImageModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 99999,
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              width: "90%",
              maxWidth: "600px",
              maxHeight: "80vh",
              overflowY: "auto",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "20px",
                borderBottom: "1px solid #e0e0e0",
                background: "#f8f9fa",
                borderRadius: "12px 12px 0 0",
              }}
            >
              <h3 style={{ margin: 0, color: "#2c3e50", fontSize: "1.2rem" }}>
                {currentVariant?.isColorGroup
                  ? `Upload ảnh cho màu ${currentVariant?.mauSac?.label}`
                  : `Upload ảnh cho ${currentVariant?.kichCo?.label} - ${currentVariant?.mauSac?.label}`}
                <br />
                <small style={{ color: "#7f8c8d", fontSize: "0.9rem" }}>
                  {currentVariant?.isColorGroup
                    ? "Ảnh sẽ được áp dụng cho tất cả kích cỡ của màu này"
                    : "Ảnh sẽ được áp dụng cho tất cả kích cỡ của màu này"}
                </small>
              </h3>
              <button
                onClick={() => setShowImageModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  color: "#7f8c8d",
                  padding: "5px",
                  borderRadius: "50%",
                  width: "30px",
                  height: "30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ×
              </button>
            </div>

            <div style={{ textAlign: "center", padding: "20px" }}>
              <div
                style={{
                  border: "3px dashed #3498db",
                  borderRadius: "10px",
                  padding: "40px",
                  backgroundColor: "#f8f9fa",
                  marginBottom: "20px",
                  position: "relative",
                }}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    console.log("File input changed:", e.target.files);
                    handleImageUpload(e);
                  }}
                  disabled={uploadingImages}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    opacity: 0,
                    cursor: "pointer",
                  }}
                />
                <div style={{ fontSize: "24px", marginBottom: "10px" }}>📁</div>
                <div
                  style={{
                    fontSize: "16px",
                    color: "#7f8c8d",
                    marginBottom: "10px",
                  }}
                >
                  {uploadingImages ? "Đang upload..." : "Click để chọn ảnh"}
                </div>
                <div style={{ fontSize: "14px", color: "#95a5a6" }}>
                  Ảnh sẽ được áp dụng cho tất cả kích cỡ của màu này
                </div>
              </div>

              {/* Nút Xong - luôn hiển thị */}
              <div style={{ marginTop: "20px", textAlign: "center" }}>
                <button
                  onClick={() => {
                    console.log("Closing modal");
                    setShowImageModal(false);
                  }}
                  style={{
                    backgroundColor: "#27ae60",
                    color: "white",
                    border: "none",
                    padding: "12px 30px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "16px",
                    fontWeight: "bold",
                    marginRight: "10px",
                  }}
                >
                  ✅ Xong
                </button>
                <button
                  onClick={() => {
                    console.log("Closing modal");
                    setShowImageModal(false);
                  }}
                  style={{
                    backgroundColor: "#95a5a6",
                    color: "white",
                    border: "none",
                    padding: "12px 30px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "16px",
                    fontWeight: "bold",
                  }}
                >
                  ❌ Hủy
                </button>
              </div>

              {currentVariant && currentVariant.hinhAnhs.length > 0 && (
                <div>
                  <h4>
                    Ảnh hiện tại cho màu {currentVariant.mauSac.label} (
                    {currentVariant.hinhAnhs.length}):
                  </h4>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(80px, 1fr))",
                      gap: "10px",
                    }}
                  >
                    {currentVariant.hinhAnhs.map((img, index) => (
                      <div key={index} style={{ position: "relative" }}>
                        <img
                          src={img}
                          alt={`Ảnh ${index + 1}`}
                          style={{
                            width: "100%",
                            height: "80px",
                            objectFit: "cover",
                            borderRadius: "5px",
                          }}
                        />
                        <button
                          onClick={() => removeImage(currentVariant.id, index)}
                          style={{
                            position: "absolute",
                            top: "2px",
                            right: "2px",
                            background: "#e74c3c",
                            color: "white",
                            border: "none",
                            borderRadius: "50%",
                            width: "20px",
                            height: "20px",
                            cursor: "pointer",
                            fontSize: "12px",
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() =>
            setToast({ show: false, message: "", type: "success" })
          }
        />
      )}
    </div>
  );
};

export default AddProduct;
