import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { FaEdit, FaTimes, FaPlus } from "react-icons/fa";
import Select from "react-select";
import ImageCarousel from "../components/ImageCarousel";
import {
  productsData,
  sampleColors,
  sampleMaterials,
  sampleSizes,
} from "../data/sampleData";

const EditProduct = () => {
  const { productId } = useParams();

  const [product, setProduct] = useState(null);
  const [allVariants, setAllVariants] = useState([]);
  const [filteredVariants, setFilteredVariants] = useState([]);
  const [filters, setFilters] = useState({
    category: null,
    color: null,
    size: null,
    material: null,
  });

  // Filter options derived from all variants of this product
  const [colorOptions, setColorOptions] = useState([]);
  const [sizeOptions, setSizeOptions] = useState([]);
  const [materialOptions, setMaterialOptions] = useState([]);

  // State for Edit Modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingVariant, setEditingVariant] = useState(null);
  const [variantForm, setVariantForm] = useState({
    id_mau_sac: null,
    id_kich_co: null,
    id_chat_lieu: null,
    so_luong: 0,
    gia_nhap: 0,
    gia: 0,
    images: [],
  });

  // Options for modal dropdowns
  const [allColorOptions, setAllColorOptions] = useState([]);
  const [allSizeOptions, setAllSizeOptions] = useState([]);
  const [allMaterialOptions, setAllMaterialOptions] = useState([]);

  // Ref for image upload
  const imageInputRef = useRef(null);

  useEffect(() => {
    const localProducts = JSON.parse(localStorage.getItem("products") || "[]");
    const allProducts = [...localProducts, ...productsData];
    const foundProduct = allProducts.find((p) => p.id === Number(productId));
    setProduct(foundProduct);

    const localDetails = JSON.parse(
      localStorage.getItem("productDetails") || "[]"
    );
    if (foundProduct) {
      const variants = localDetails.filter(
        (d) => d.id_san_pham === foundProduct.id
      );
      setAllVariants(variants);
      setFilteredVariants(variants);

      // Derive filter options from the variants
      setColorOptions(
        [...new Set(variants.map((v) => v.id_mau_sac))].map((c) => ({
          value: c,
          label: c,
        }))
      );
      setSizeOptions(
        [...new Set(variants.map((v) => v.id_kich_co))].map((s) => ({
          value: s,
          label: s,
        }))
      );
      setMaterialOptions(
        [...new Set(variants.map((v) => v.id_chat_lieu))].map((m) => ({
          value: m,
          label: m,
        }))
      );
    }

    // Load ALL options for the edit modal dropdowns
    const savedColors = JSON.parse(localStorage.getItem("colors") || "[]");
    setAllColorOptions(
      savedColors.length > 0
        ? savedColors
            .filter((c) => c.trang_thai === 1)
            .map((c) => ({ value: c.ten_mau_sac, label: c.ten_mau_sac }))
        : sampleColors.map((c) => ({ value: c, label: c }))
    );

    const savedSizes = JSON.parse(localStorage.getItem("sizes") || "[]");
    setAllSizeOptions(
      savedSizes.length > 0
        ? savedSizes
            .filter((s) => s.trang_thai === 1)
            .map((s) => ({ value: s.ten_kich_co, label: s.ten_kich_co }))
        : sampleSizes.map((s) => ({ value: s, label: s }))
    );

    const savedMaterials = JSON.parse(
      localStorage.getItem("materials") || "[]"
    );
    setAllMaterialOptions(
      savedMaterials.length > 0
        ? savedMaterials
            .filter((m) => m.trang_thai === 1)
            .map((m) => ({ value: m.ten_chat_lieu, label: m.ten_chat_lieu }))
        : sampleMaterials.map((m) => ({ value: m, label: m }))
    );
  }, [productId]);

  const handleFilterChange = (name, selectedOption) => {
    setFilters((prev) => ({
      ...prev,
      [name]: selectedOption ? selectedOption.value : null,
    }));
  };

  const applyFilters = () => {
    let tempVariants = [...allVariants];

    if (filters.color) {
      tempVariants = tempVariants.filter((v) => v.id_mau_sac === filters.color);
    }
    if (filters.size) {
      tempVariants = tempVariants.filter((v) => v.id_kich_co === filters.size);
    }
    if (filters.material) {
      tempVariants = tempVariants.filter(
        (v) => v.id_chat_lieu === filters.material
      );
    }
    if (filters.category) {
      tempVariants = tempVariants.filter(
        (v) => product.ten_danh_muc === filters.category
      );
    }

    setFilteredVariants(tempVariants);
  };

  const resetFilters = () => {
    setFilters({ category: null, color: null, size: null, material: null });
    setFilteredVariants(allVariants);
  };

  const handleEditVariant = (variant) => {
    setEditingVariant(variant);
    setVariantForm({
      id_mau_sac: { value: variant.id_mau_sac, label: variant.id_mau_sac },
      id_kich_co: { value: variant.id_kich_co, label: variant.id_kich_co },
      id_chat_lieu: {
        value: variant.id_chat_lieu,
        label: variant.id_chat_lieu,
      },
      so_luong: variant.so_luong,
      gia_nhap: variant.gia_nhap,
      gia: variant.gia,
      images: variant.images || [],
    });
    setShowEditModal(true);
  };

  const handleModalFormChange = (e) => {
    const { name, value } = e.target;
    setVariantForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleModalSelectChange = (name, selectedOption) => {
    setVariantForm((prev) => ({ ...prev, [name]: selectedOption }));
  };

  const handleRemoveImage = (index) => {
    setVariantForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newImagesPromises = Array.from(files).map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result);
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(newImagesPromises).then((newImages) => {
        setVariantForm((prev) => ({
          ...prev,
          images: [...prev.images, ...newImages],
        }));
      });
    }
    // Reset file input value to allow re-uploading the same file
    e.target.value = null;
  };

  const handleUpdateVariant = () => {
    if (!editingVariant) return;

    const updatedVariantForState = {
      ...editingVariant,
      id_mau_sac: variantForm.id_mau_sac.value,
      id_kich_co: variantForm.id_kich_co.value,
      id_chat_lieu: variantForm.id_chat_lieu.value,
      so_luong: Number(variantForm.so_luong),
      gia_nhap: Number(variantForm.gia_nhap),
      gia: Number(variantForm.gia),
      images: variantForm.images,
    };

    const newAllVariants = allVariants.map((v) =>
      v.id === updatedVariantForState.id ? updatedVariantForState : v
    );
    setAllVariants(newAllVariants);

    // Re-apply filters after update
    let tempVariants = [...newAllVariants];
    if (filters.color) {
      tempVariants = tempVariants.filter((v) => v.id_mau_sac === filters.color);
    }
    if (filters.size) {
      tempVariants = tempVariants.filter((v) => v.id_kich_co === filters.size);
    }
    if (filters.material) {
      tempVariants = tempVariants.filter(
        (v) => v.id_chat_lieu === filters.material
      );
    }
    setFilteredVariants(tempVariants);

    // Prepare a version for localStorage that doesn't include new Base64 images
    const variantForStorage = {
      ...updatedVariantForState,
      images: updatedVariantForState.images.filter(
        (img) => !img.startsWith("data:image")
      ),
    };

    const localDetails = JSON.parse(
      localStorage.getItem("productDetails") || "[]"
    );
    const updatedLocalDetails = localDetails.map((d) =>
      d.id === variantForStorage.id ? variantForStorage : d
    );

    try {
      localStorage.setItem(
        "productDetails",
        JSON.stringify(updatedLocalDetails)
      );
    } catch (error) {
      console.error("Failed to save to localStorage:", error);
      alert(
        "Lỗi: Không thể lưu dữ liệu. Dữ liệu có thể quá lớn cho localStorage."
      );
    }

    setShowEditModal(false);
    setEditingVariant(null);
  };

  if (!product) {
    return <div>Đang tải thông tin sản phẩm...</div>;
  }

  return (
    <div className="container-fluid p-4">
      {/* Breadcrumb */}
      <div className="mb-4">
        <Link to="/dashboard/products">Danh sách sản phẩm</Link>
        <span className="mx-2">/</span>
        <span className="fw-bold">{product.ten_san_pham}</span>
      </div>

      {/* Product Info */}
      <div className="card mb-4">
        <div className="card-header fw-bold">Thông tin sản phẩm</div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <p>
                <strong>Tên sản phẩm:</strong> {product.ten_san_pham}
              </p>
              <p>
                <strong>Mã sản phẩm:</strong> {product.ma_san_pham}
              </p>
              <p>
                <strong>Danh mục:</strong> {product.ten_danh_muc}
              </p>
            </div>
            <div className="col-md-6">
              <p>
                <strong>Ngày tạo:</strong>{" "}
                {new Date(product.ngay_tao).toLocaleString()}
              </p>
              <p>
                <strong>Cập nhật lần cuối:</strong>{" "}
                {product.ngay_cap_nhat
                  ? new Date(product.ngay_cap_nhat).toLocaleString()
                  : "Chưa có"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-header fw-bold">Chi tiết sản phẩm</div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3">
              <Select
                placeholder="Chọn kích cỡ..."
                options={sizeOptions}
                onChange={(opt) => handleFilterChange("size", opt)}
                isClearable
              />
            </div>
            <div className="col-md-3">
              <Select
                placeholder="Chọn màu sắc..."
                options={colorOptions}
                onChange={(opt) => handleFilterChange("color", opt)}
                isClearable
              />
            </div>
            <div className="col-md-3">
              <Select
                placeholder="Chọn chất liệu..."
                options={materialOptions}
                onChange={(opt) => handleFilterChange("material", opt)}
                isClearable
              />
            </div>
            <div className="col-md-3 d-flex gap-2">
              <button
                className="btn btn-secondary w-100"
                onClick={resetFilters}
              >
                Làm mới
              </button>
              <button className="btn btn-primary w-100" onClick={applyFilters}>
                Tìm kiếm
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Variants Table */}
      <div className="card">
        <div className="card-body">
          <table className="table table-bordered table-hover align-middle">
            <thead>
              <tr>
                <th className="text-center">Mã</th>
                <th className="text-center">Tên</th>
                <th className="text-center">Danh mục</th>
                <th className="text-center">Màu sắc</th>
                <th className="text-center">Kích thước</th>
                <th className="text-center">Chất liệu</th>
                <th className="text-center">Số lượng</th>
                <th className="text-center">Giá nhập</th>
                <th className="text-center">Giá bán</th>
                <th className="text-center">Hình ảnh</th>
                <th className="text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredVariants.length > 0 ? (
                filteredVariants.map((variant) => (
                  <tr key={variant.id}>
                    <td className="text-center">{product.ma_san_pham}</td>
                    <td className="text-center">{product.ten_san_pham}</td>
                    <td className="text-center">{product.ten_danh_muc}</td>
                    <td className="text-center">{variant.id_mau_sac}</td>
                    <td className="text-center">{variant.id_kich_co}</td>
                    <td className="text-center">{variant.id_chat_lieu}</td>
                    <td className="text-center">{variant.so_luong}</td>
                    <td className="text-center">
                      {variant.gia_nhap?.toLocaleString()} VNĐ
                    </td>
                    <td className="text-center">
                      {variant.gia?.toLocaleString()} VNĐ
                    </td>
                    <td className="text-center">
                      {variant.images && variant.images.length > 1 ? (
                        <ImageCarousel
                          images={variant.images}
                          carouselId={`carousel-${variant.id}`}
                        />
                      ) : variant.images && variant.images.length === 1 ? (
                        <img
                          src={variant.images[0]}
                          alt="variant"
                          style={{
                            width: "120px",
                            height: "120px",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        />
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-link p-0"
                        title="Chỉnh sửa"
                        onClick={() => handleEditVariant(variant)}
                      >
                        <FaEdit className="text-dark" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11" className="text-center">
                    Không tìm thấy chi tiết sản phẩm nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Variant Modal */}
      {showEditModal && (
        <div
          className="modal show"
          tabIndex="-1"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Chỉnh sửa chi tiết: {product.ten_san_pham} [
                  {editingVariant.id_mau_sac} - {editingVariant.id_kich_co}]
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label">Màu sắc</label>
                    <Select
                      options={allColorOptions}
                      value={variantForm.id_mau_sac}
                      onChange={(opt) =>
                        handleModalSelectChange("id_mau_sac", opt)
                      }
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Kích thước</label>
                    <Select
                      options={allSizeOptions}
                      value={variantForm.id_kich_co}
                      onChange={(opt) =>
                        handleModalSelectChange("id_kich_co", opt)
                      }
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Chất liệu</label>
                    <Select
                      options={allMaterialOptions}
                      value={variantForm.id_chat_lieu}
                      onChange={(opt) =>
                        handleModalSelectChange("id_chat_lieu", opt)
                      }
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Giá bán (VNĐ)</label>
                    <input
                      type="number"
                      className="form-control"
                      name="gia"
                      value={variantForm.gia}
                      onChange={handleModalFormChange}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Giá nhập (VNĐ)</label>
                    <input
                      type="number"
                      className="form-control"
                      name="gia_nhap"
                      value={variantForm.gia_nhap}
                      onChange={handleModalFormChange}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Số lượng</label>
                    <input
                      type="number"
                      className="form-control"
                      name="so_luong"
                      value={variantForm.so_luong}
                      onChange={handleModalFormChange}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Hình ảnh sản phẩm</label>
                    <div className="d-flex flex-wrap gap-2">
                      {variantForm.images.map((img, index) => (
                        <div key={index} className="position-relative">
                          <img
                            src={img}
                            alt="variant"
                            style={{
                              width: "80px",
                              height: "80px",
                              objectFit: "cover",
                              borderRadius: "8px",
                            }}
                          />
                          <button
                            className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                            style={{ lineHeight: 1, padding: "0.2rem 0.4rem" }}
                            onClick={() => handleRemoveImage(index)}
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ))}
                      {/* Placeholder for adding new images */}
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        style={{ display: "none" }}
                        ref={imageInputRef}
                        onChange={handleImageUpload}
                      />
                      <div
                        className="d-flex align-items-center justify-content-center"
                        style={{
                          width: "80px",
                          height: "80px",
                          border: "2px dashed #ddd",
                          borderRadius: "8px",
                          cursor: "pointer",
                        }}
                        onClick={() => imageInputRef.current.click()}
                      >
                        <FaPlus size={24} color="#ddd" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Hủy
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleUpdateVariant}
                >
                  Cập nhật
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProduct;

// A temporary sampleData file reference. This should be removed if not needed.
// You might need to create `src/data/sampleData.js` and export `productsData` from it
// if it's not already available in this component's scope.
// For example, `src/data/sampleData.js`:
// export const productsData = [ ... ];
