import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { FaEdit, FaTimes, FaPlus } from "react-icons/fa";
import Select from "react-select";
import ImageCarousel from "../components/ImageCarousel";
import {
  getAllSanPham,
  getAllChiTietSanPham,
  updateChiTietSanPham,
  uploadHinhAnh,
} from "../services/sanPhamService";
import { getAllDanhMuc } from "../services/danhMucService";
import { getAllMauSac } from "../services/mauSacService";
import { getAllKichCo } from "../services/kichCoService";
import { getAllChatLieu } from "../services/chatLieuService";

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
    idMauSac: null,
    idKichCo: null,
    idChatLieu: null,
    soLuong: 0,
    giaNhap: 0,
    gia: 0,
    images: [],
  });

  // Options for modal dropdowns
  const [allColorOptions, setAllColorOptions] = useState([]);
  const [allSizeOptions, setAllSizeOptions] = useState([]);
  const [allMaterialOptions, setAllMaterialOptions] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [allColors, setAllColors] = useState([]);
  const [allSizes, setAllSizes] = useState([]);
  const [allMaterials, setAllMaterials] = useState([]);

  // Ref for image upload
  const imageInputRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [spRes, ctspRes, dmRes, msRes, kcRes, clRes] = await Promise.all([
          getAllSanPham(),
          getAllChiTietSanPham(),
          getAllDanhMuc(),
          getAllMauSac(),
          getAllKichCo(),
          getAllChatLieu(),
        ]);

        console.log("API Responses:", {
          spRes,
          ctspRes,
          dmRes,
          msRes,
          kcRes,
          clRes,
        });

        // Tìm sản phẩm theo ID
        const foundProduct = (spRes || []).find(
          (p) => p.id === Number(productId)
        );
        setProduct(foundProduct);

        // Lấy chi tiết sản phẩm cho sản phẩm này
        const variants = (ctspRes || []).filter(
          (d) => d.idSanPham === Number(productId)
        );
        console.log("Variants for product:", variants);
        setAllVariants(variants);
        setFilteredVariants(variants);

        // Tạo options cho filter từ variants
        const uniqueColors = [...new Set(variants.map((v) => v.idMauSac))];
        const uniqueSizes = [...new Set(variants.map((v) => v.idKichCo))];
        const uniqueMaterials = [...new Set(variants.map((v) => v.idChatLieu))];

        console.log("Unique IDs:", {
          uniqueColors,
          uniqueSizes,
          uniqueMaterials,
        });

        // Map tên từ ID
        const colorNames = uniqueColors.map((id) => {
          const color = (msRes || []).find((c) => c.id === id);
          console.log(`Color ID ${id}:`, color);
          return { value: id, label: color ? color.tenMauSac : `ID: ${id}` };
        });
        const sizeNames = uniqueSizes.map((id) => {
          const size = (kcRes || []).find((s) => s.id === id);
          console.log(`Size ID ${id}:`, size);
          return { value: id, label: size ? size.tenKichCo : `ID: ${id}` };
        });
        const materialNames = uniqueMaterials.map((id) => {
          const material = (clRes || []).find((m) => m.id === id);
          console.log(`Material ID ${id}:`, material);
          return {
            value: id,
            label: material ? material.tenChatLieu : `ID: ${id}`,
          };
        });

        setColorOptions(colorNames);
        setSizeOptions(sizeNames);
        setMaterialOptions(materialNames);

        // Tạo options cho modal dropdowns
        setAllColorOptions(
          (msRes || [])
            .filter((c) => c.trangThai === 1)
            .map((c) => ({ value: c.id, label: c.tenMauSac }))
        );

        setAllSizeOptions(
          (kcRes || [])
            .filter((s) => s.trangThai === 1)
            .map((s) => ({ value: s.id, label: s.tenKichCo }))
        );

        setAllMaterialOptions(
          (clRes || [])
            .filter((m) => m.trangThai === 1)
            .map((m) => ({ value: m.id, label: m.tenChatLieu }))
        );

        setAllCategories(dmRes || []);
        setAllColors(msRes || []);
        setAllSizes(kcRes || []);
        setAllMaterials(clRes || []);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        alert("Lỗi khi tải dữ liệu sản phẩm!");
      }
    };

    fetchData();
  }, [productId]);

  const getNameById = (id, list, fieldName) => {
    if (!id || !list || list.length === 0) return "";
    const item = list.find((item) => item.id === id);
    console.log(`getNameById: ID=${id}, fieldName=${fieldName}, found:`, item);
    return item ? item[fieldName] : `ID: ${id}`;
  };

  const handleFilterChange = (name, selectedOption) => {
    setFilters((prev) => ({
      ...prev,
      [name]: selectedOption ? selectedOption.value : null,
    }));
  };

  const applyFilters = () => {
    let tempVariants = [...allVariants];

    if (filters.color) {
      tempVariants = tempVariants.filter((v) => v.idMauSac === filters.color);
    }
    if (filters.size) {
      tempVariants = tempVariants.filter((v) => v.idKichCo === filters.size);
    }
    if (filters.material) {
      tempVariants = tempVariants.filter(
        (v) => v.idChatLieu === filters.material
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

    // Tìm tên từ ID để hiển thị trong dropdown
    const colorName = getNameById(variant.idMauSac, allColors, "tenMauSac");
    const sizeName = getNameById(variant.idKichCo, allSizes, "tenKichCo");
    const materialName = getNameById(
      variant.idChatLieu,
      allMaterials,
      "tenChatLieu"
    );

    setVariantForm({
      idMauSac: {
        value: variant.idMauSac,
        label: colorName,
      },
      idKichCo: {
        value: variant.idKichCo,
        label: sizeName,
      },
      idChatLieu: {
        value: variant.idChatLieu,
        label: materialName,
      },
      soLuong: variant.soLuong,
      giaNhap: variant.giaNhap,
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

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !editingVariant) return;

    try {
      // Tạo FormData để gửi file
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append("files", file);
      });

      // Upload hình ảnh
      await uploadHinhAnh(editingVariant.id, formData);

      // Sau khi upload thành công, load lại dữ liệu
      const [spRes, ctspRes] = await Promise.all([
        getAllSanPham(),
        getAllChiTietSanPham(),
      ]);

      // Cập nhật state
      const variants = (ctspRes || []).filter(
        (d) => d.idSanPham === Number(productId)
      );
      setAllVariants(variants);
      setFilteredVariants(variants);

      // Tìm variant vừa upload để cập nhật form
      const updatedVariant = variants.find((v) => v.id === editingVariant.id);
      if (updatedVariant) {
        setVariantForm((prev) => ({
          ...prev,
          images: updatedVariant.images || [],
        }));
      }

      alert("Upload hình ảnh thành công!");
    } catch (error) {
      console.error("Lỗi khi upload hình ảnh:", error);
      alert("Lỗi khi upload hình ảnh!");
    }

    // Reset file input
    e.target.value = null;
  };

  const handleUpdateVariant = async () => {
    if (!editingVariant) return;

    try {
      // Chuẩn bị dữ liệu để gửi lên API
      const updatedVariantForState = {
        id: editingVariant.id,
        idSanPham: editingVariant.idSanPham,
        idMauSac: variantForm.idMauSac.value,
        idKichCo: variantForm.idKichCo.value,
        idChatLieu: variantForm.idChatLieu.value,
        soLuong: Number(variantForm.soLuong),
        giaNhap: Number(variantForm.giaNhap),
        gia: Number(variantForm.gia),
        trangThai: editingVariant.trangThai || 1,
      };

      console.log("Sending update with:", updatedVariantForState);

      // Gọi API để cập nhật
      await updateChiTietSanPham(editingVariant.id, updatedVariantForState);

      // Sau khi cập nhật thành công, load lại dữ liệu
      const [spRes, ctspRes, dmRes, msRes, kcRes, clRes] = await Promise.all([
        getAllSanPham(),
        getAllChiTietSanPham(),
        getAllDanhMuc(),
        getAllMauSac(),
        getAllKichCo(),
        getAllChatLieu(),
      ]);

      // Tìm sản phẩm theo ID
      const foundProduct = (spRes || []).find(
        (p) => p.id === Number(productId)
      );
      setProduct(foundProduct);

      // Lấy chi tiết sản phẩm cho sản phẩm này
      const variants = (ctspRes || []).filter(
        (d) => d.idSanPham === Number(productId)
      );
      setAllVariants(variants);
      setFilteredVariants(variants);

      // Cập nhật các options
      setAllCategories(dmRes || []);
      setAllColors(msRes || []);
      setAllSizes(kcRes || []);
      setAllMaterials(clRes || []);

      setShowEditModal(false);
      setEditingVariant(null);
      alert("Cập nhật chi tiết sản phẩm thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error.response?.data || error);
      alert("Lỗi khi cập nhật chi tiết sản phẩm!");
    }
  };

  // Helper để build URL ảnh đúng
  const getImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    if (url.startsWith("/uploads/")) return `http://localhost:8080${url}`;
    return url;
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
        <span className="fw-bold">{product.tenSanPham}</span>
      </div>

      {/* Product Info */}
      <div className="card mb-4">
        <div className="card-header fw-bold">Thông tin sản phẩm</div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <p>
                <strong>Tên sản phẩm:</strong> {product.tenSanPham}
              </p>
              <p>
                <strong>Mã sản phẩm:</strong> {product.maSanPham}
              </p>
              <p>
                <strong>Danh mục:</strong>{" "}
                {getNameById(product.idDanhMuc, allCategories, "tenDanhMuc")}
              </p>
            </div>
            <div className="col-md-6">
              <p>
                <strong>Ngày tạo:</strong>{" "}
                {product.ngayTao
                  ? new Date(product.ngayTao).toLocaleString()
                  : "Invalid Date"}
              </p>
              <p>
                <strong>Cập nhật lần cuối:</strong>{" "}
                {product.ngayCapNhat
                  ? new Date(product.ngayCapNhat).toLocaleString()
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
                    <td className="text-center">{product.maSanPham}</td>
                    <td className="text-center">{product.tenSanPham}</td>
                    <td className="text-center">
                      {getNameById(
                        product.idDanhMuc,
                        allCategories,
                        "tenDanhMuc"
                      )}
                    </td>
                    <td className="text-center">
                      {getNameById(variant.idMauSac, allColors, "tenMauSac")}
                    </td>
                    <td className="text-center">
                      {getNameById(variant.idKichCo, allSizes, "tenKichCo")}
                    </td>
                    <td className="text-center">
                      {getNameById(
                        variant.idChatLieu,
                        allMaterials,
                        "tenChatLieu"
                      )}
                    </td>
                    <td className="text-center">{variant.soLuong}</td>
                    <td className="text-center">
                      {variant.giaNhap?.toLocaleString()} VNĐ
                    </td>
                    <td className="text-center">
                      {variant.gia?.toLocaleString()} VNĐ
                    </td>
                    <td className="text-center">
                      {variant.images && variant.images.length > 1 ? (
                        <ImageCarousel
                          images={variant.images.map(getImageUrl)}
                          carouselId={`carousel-${variant.id}`}
                        />
                      ) : variant.images && variant.images.length === 1 ? (
                        <img
                          src={getImageUrl(variant.images[0])}
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
                  Chỉnh sửa chi tiết: {product.tenSanPham} [
                  {getNameById(editingVariant.idMauSac, allColors, "tenMauSac")}{" "}
                  -{" "}
                  {getNameById(editingVariant.idKichCo, allSizes, "tenKichCo")}]
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
                      value={variantForm.idMauSac}
                      onChange={(opt) =>
                        handleModalSelectChange("idMauSac", opt)
                      }
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Kích thước</label>
                    <Select
                      options={allSizeOptions}
                      value={variantForm.idKichCo}
                      onChange={(opt) =>
                        handleModalSelectChange("idKichCo", opt)
                      }
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Chất liệu</label>
                    <Select
                      options={allMaterialOptions}
                      value={variantForm.idChatLieu}
                      onChange={(opt) =>
                        handleModalSelectChange("idChatLieu", opt)
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
                      name="giaNhap"
                      value={variantForm.giaNhap}
                      onChange={handleModalFormChange}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Số lượng</label>
                    <input
                      type="number"
                      className="form-control"
                      name="soLuong"
                      value={variantForm.soLuong}
                      onChange={handleModalFormChange}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Hình ảnh sản phẩm</label>
                    <div className="d-flex flex-wrap gap-2">
                      {variantForm.images.map((img, index) => (
                        <div key={index} className="position-relative">
                          <img
                            src={getImageUrl(img)}
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
