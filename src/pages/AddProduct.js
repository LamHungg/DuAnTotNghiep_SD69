import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaTrash, FaImage } from "react-icons/fa";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { productsData } from "../data/sampleData";

// Dữ liệu mặc định để fallback nếu localStorage trống
const defaultCategories = ["Áo thun", "Áo sơ mi", "Áo khoác", "Áo len"];
const defaultMaterials = ["Cotton", "Polyester", "Linen", "Wool"];
const defaultSizes = ["XS", "S", "M", "L", "XL", "XXL"];
const defaultColors = ["Trắng", "Đen", "Xám", "Xanh", "Đỏ", "Vàng"];

const defaultGallery = [
  "https://images.pexels.com/photos/532220/pexels-photo-532220.jpeg",
  "https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg",
  "https://images.pexels.com/photos/1707828/pexels-photo-1707828.jpeg",
  "https://images.pexels.com/photos/2983463/pexels-photo-2983463.jpeg",
  "https://images.pexels.com/photos/2983462/pexels-photo-2983462.jpeg",
  "https://images.pexels.com/photos/532221/pexels-photo-532221.jpeg",
];

const AddProduct = () => {
  // State cho form chính
  const [productName, setProductName] = useState(null); // {value, label, category}
  const [productNameOptions, setProductNameOptions] = useState([]);
  const [category, setCategory] = useState("");
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [material, setMaterial] = useState("");
  const [materialOptions, setMaterialOptions] = useState([]); // Dữ liệu từ màn chất liệu
  const [sizes, setSizes] = useState([]); // array of {value, label}
  const [sizeOptions, setSizeOptions] = useState([]);
  const [colors, setColors] = useState([]); // array of {value, label}
  const [colorOptions, setColorOptions] = useState([]);
  const [quantity, setQuantity] = useState(0);
  const [importPrice, setImportPrice] = useState(0); // Giá nhập
  const [sellPrice, setSellPrice] = useState(0); // Giá bán

  // State cho bảng sản phẩm sinh ra
  const [productVariants, setProductVariants] = useState([]); // [{color, size, quantity, price, weight, ...}]
  const [showVariants, setShowVariants] = useState(false);

  // Gallery modal state
  const [gallery, setGallery] = useState(defaultGallery); // Danh sách ảnh gallery (url)
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [galleryColor, setGalleryColor] = useState(null); // màu của biến thể đang chọn ảnh
  const [gallerySize, setGallerySize] = useState(null); // size của biến thể đang chọn ảnh
  const [selectedGalleryImgs, setSelectedGalleryImgs] = useState([]); // mảng url ảnh được chọn trong modal
  const [uploadingGallery, setUploadingGallery] = useState(false);

  // State cho validation errors
  const [errors, setErrors] = useState({
    productName: "",
    category: "",
    material: "",
    sizes: "",
    colors: "",
  });

  // State cho modal thêm nhanh
  const [showModal, setShowModal] = useState(false);
  const [quickForm, setQuickForm] = useState({ name: "", category: "" });
  const [quickFormErrors, setQuickFormErrors] = useState({
    name: "",
    category: "",
  });
  const closeBtnRef = useRef();

  // State cho modal xác nhận lưu sản phẩm
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // State cho toast thông báo thành công
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const navigate = useNavigate();

  // Đồng bộ danh sách tên sản phẩm với localStorage và productsData
  useEffect(() => {
    const localProducts = JSON.parse(localStorage.getItem("products") || "[]");
    const allProducts = [...localProducts, ...productsData];
    const uniqueNames = [];
    const nameSet = new Set();
    allProducts.forEach((p) => {
      if (p.ten_san_pham && !nameSet.has(p.ten_san_pham)) {
        uniqueNames.push({
          value: p.ten_san_pham,
          label: p.ten_san_pham,
          category: p.ten_danh_muc,
        });
        nameSet.add(p.ten_san_pham);
      }
    });
    setProductNameOptions(uniqueNames);

    // Load materials from localStorage or use default
    const savedMaterials = JSON.parse(
      localStorage.getItem("materials") || "[]"
    );
    const activeMaterials =
      savedMaterials.length > 0
        ? savedMaterials
            .filter((m) => m.trang_thai === 1)
            .map((m) => ({ value: m.ten_chat_lieu, label: m.ten_chat_lieu }))
        : defaultMaterials.map((m) => ({ value: m, label: m }));
    setMaterialOptions(activeMaterials);

    // Load categories from localStorage or use default
    const savedCategories = JSON.parse(
      localStorage.getItem("categories") || "[]"
    );
    const activeCategories =
      savedCategories.length > 0
        ? savedCategories
            .filter((c) => c.trang_thai === 1)
            .map((c) => ({ value: c.ten_danh_muc, label: c.ten_danh_muc }))
        : defaultCategories.map((c) => ({ value: c, label: c }));
    setCategoryOptions(activeCategories);

    // Load sizes from localStorage or use default
    const savedSizes = JSON.parse(localStorage.getItem("sizes") || "[]");
    const activeSizes =
      savedSizes.length > 0
        ? savedSizes
            .filter((s) => s.trang_thai === 1)
            .map((s) => ({ value: s.ten_kich_co, label: s.ten_kich_co }))
        : defaultSizes.map((s) => ({ value: s, label: s }));
    setSizeOptions(activeSizes);

    // Load colors from localStorage or use default
    const savedColors = JSON.parse(localStorage.getItem("colors") || "[]");
    const activeColors =
      savedColors.length > 0
        ? savedColors
            .filter((c) => c.trang_thai === 1)
            .map((c) => ({ value: c.ten_mau_sac, label: c.ten_mau_sac }))
        : defaultColors.map((c) => ({ value: c, label: c }));
    setColorOptions(activeColors);
  }, []);

  const handleProductNameChange = (option, actionMeta) => {
    setProductName(option);
    if (actionMeta.action === "create-option") {
      setIsNewProduct(true);
      setCategory(""); // Reset category for new product
      setErrors((p) => ({ ...p, category: "" }));
    } else if (option) {
      setIsNewProduct(false);
      setCategory(option.category || "");
    } else {
      setIsNewProduct(false);
      setCategory("");
    }
  };

  // Đồng bộ form và validation
  useEffect(() => {
    // Logic để tạo các biến thể sản phẩm (productVariants)
    if (
      productName &&
      (isNewProduct ? category : true) &&
      sizes.length > 0 &&
      colors.length > 0
    ) {
      const variants = [];
      colors.forEach((color) => {
        sizes.forEach((size) => {
          variants.push({
            name: productName.value,
            category: category,
            material: material,
            color: color.value,
            size: size.value,
            quantity: quantity,
            gia_nhap: importPrice,
            gia_ban: sellPrice,
            images: [],
          });
        });
      });
      setProductVariants(variants);
      setShowVariants(true);
    } else {
      setProductVariants([]);
      setShowVariants(false);
    }
  }, [
    productName,
    isNewProduct,
    category,
    sizes,
    colors,
    material,
    quantity,
    importPrice,
    sellPrice,
  ]);

  // Xử lý thay đổi số lượng, giá, cân nặng
  const handleVariantChange = (idx, field, value) => {
    setProductVariants((prev) =>
      prev.map((v, i) =>
        i === idx
          ? {
              ...v,
              [field]:
                field === "quantity" ||
                field === "gia_nhap" ||
                field === "gia_ban"
                  ? Number(value)
                  : value,
            }
          : v
      )
    );
  };

  // Xóa 1 biến thể
  const handleDeleteVariant = (idx) => {
    setProductVariants((prev) => prev.filter((_, i) => i !== idx));
  };

  // Mở modal gallery để chọn ảnh cho biến thể
  const openGalleryModal = (color, size, currentImgs) => {
    setGalleryColor(color);
    setGallerySize(size);
    setSelectedGalleryImgs(currentImgs || []);
    setShowGalleryModal(true);
  };

  // Tick chọn/bỏ chọn ảnh trong gallery
  const handleToggleGalleryImg = (url) => {
    setSelectedGalleryImgs((prev) =>
      prev.includes(url) ? prev.filter((img) => img !== url) : [...prev, url]
    );
  };

  // Xác nhận chọn nhiều ảnh cho biến thể
  const handleConfirmGalleryImgs = () => {
    setProductVariants((prev) =>
      prev.map((v) =>
        v.color === galleryColor && v.size === gallerySize
          ? { ...v, images: selectedGalleryImgs }
          : v
      )
    );
    setShowGalleryModal(false);
    setGalleryColor(null);
    setGallerySize(null);
    setSelectedGalleryImgs([]);
  };

  // Upload ảnh mới vào gallery
  const handleUploadGalleryImg = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadingGallery(true);
      const url = URL.createObjectURL(file);
      setGallery((prev) => [url, ...prev]);
      setSelectedGalleryImgs((prev) => [url, ...prev]);
      setTimeout(() => setUploadingGallery(false), 500); // giả lập upload
    }
  };

  // Group theo màu
  const groupByColor = (variants) => {
    if (!variants || !Array.isArray(variants)) {
      return {};
    }
    const groups = {};
    variants.forEach((v) => {
      if (v && v.color) {
        if (!groups[v.color]) groups[v.color] = [];
        groups[v.color].push(v);
      }
    });
    return groups;
  };

  // Modal thêm nhanh giữ nguyên
  const handleQuickChange = (e) => {
    setQuickForm({ ...quickForm, [e.target.name]: e.target.value });
  };

  // Validate quick form
  const validateQuickForm = () => {
    const errors = {
      name: "",
      category: "",
    };

    if (!quickForm.name.trim()) {
      errors.name = "Vui lòng nhập tên áo";
    }

    if (!quickForm.category) {
      errors.category = "Vui lòng chọn danh mục";
    }

    setQuickFormErrors(errors);
    return !errors.name && !errors.category;
  };

  // Update handleQuickSubmit
  const handleQuickSubmit = (e) => {
    e.preventDefault();

    if (!validateQuickForm()) {
      return;
    }

    const newProductOption = {
      value: quickForm.name,
      label: quickForm.name,
      category: quickForm.category,
    };

    // Add to options list if not already there
    if (
      !productNameOptions.some((opt) => opt.value === newProductOption.value)
    ) {
      setProductNameOptions((prev) => [...prev, newProductOption]);
    }

    // Select it in the main form
    setProductName(newProductOption);
    setIsNewProduct(false);
    setCategory(newProductOption.category);

    // Reset and close modal
    setQuickForm({ name: "", category: "" });
    setShowModal(false);
  };

  const galleryFileInput = useRef();

  // Validate các biến thể sản phẩm
  const validateVariants = (variants) => {
    const errors = [];
    variants.forEach((v, idx) => {
      const err = {};
      if (
        v.gia_ban !== undefined &&
        v.gia_nhap !== undefined &&
        v.gia_ban !== "" &&
        v.gia_nhap !== ""
      ) {
        if (Number(v.gia_ban) <= Number(v.gia_nhap)) {
          err.gia_ban = "Giá bán phải lớn hơn giá nhập";
        }
      }
      errors.push(err);
    });
    return errors;
  };

  // Validate form (bổ sung validate cho variants)
  const validateForm = () => {
    const newErrors = {
      productName: "",
      category: "",
      material: "",
      sizes: "",
      colors: "",
      variants: [],
    };

    if (!productName) {
      newErrors.productName = "Vui lòng chọn hoặc nhập tên sản phẩm";
    }

    if (isNewProduct && !category) {
      newErrors.category = "Vui lòng chọn danh mục cho sản phẩm mới";
    }

    if (!material) {
      newErrors.material = "Vui lòng chọn chất liệu";
    }

    if (sizes.length === 0) {
      newErrors.sizes = "Vui lòng chọn ít nhất một kích cỡ";
    }

    if (colors.length === 0) {
      newErrors.colors = "Vui lòng chọn ít nhất một màu sắc";
    }

    // Validate variants
    newErrors.variants = validateVariants(productVariants);
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) =>
      Array.isArray(error)
        ? error.some((e) => Object.keys(e).length > 0)
        : typeof error === "string"
        ? error
        : Object.keys(error).length > 0
    );
  };

  const handleConfirmSave = () => {
    const localProducts = JSON.parse(localStorage.getItem("products") || "[]");
    const allKnownProducts = [...localProducts, ...productsData];

    const foundProduct = allKnownProducts.find(
      (p) => p.ten_san_pham === productName.value
    );

    if (!foundProduct) {
      // Find the max ID from all products (local storage + initial data)
      const maxId = allKnownProducts.reduce(
        (max, p) => (p.id > max ? p.id : max),
        0
      );
      const newId = maxId + 1;

      // Generate ma_san_pham based on the new ID
      const ma_san_pham = "SP" + String(newId).padStart(3, "0");

      const sanPham = {
        id: newId, // The new auto-incrementing ID
        ma_san_pham,
        ten_san_pham: productName.value,
        ten_danh_muc: category,
        mo_ta: "",
        trang_thai: 3, // Mặc định là Sắp ra mắt
        id_nguoi_tao: JSON.parse(localStorage.getItem("currentUser"))?.id || 1,
        ngay_tao: new Date().toISOString(),
        id_nguoi_cap_nhat: null,
        ngay_cap_nhat: null,
        deleted_at: null,
        id_nguoi_xoa: null,
      };

      const updatedLocalProducts = [sanPham, ...localProducts];
      localStorage.setItem("products", JSON.stringify(updatedLocalProducts));

      // Lưu chi tiết sản phẩm (biến thể) với ID tự tăng
      const existingDetails = JSON.parse(
        localStorage.getItem("productDetails") || "[]"
      );
      let maxDetailId = existingDetails.reduce(
        (max, d) => (d.id > max ? d.id : max),
        0
      );

      const productVariantsToSave = productVariants.map((variant) => {
        maxDetailId++;
        return {
          id: maxDetailId,
          id_san_pham: sanPham.id,
          id_kich_co: variant.size,
          id_mau_sac: variant.color,
          id_chat_lieu: variant.material,
          so_luong: variant.quantity,
          gia: variant.gia_ban,
          gia_nhap: variant.gia_nhap,
          images: variant.images,
          id_nguoi_tao:
            JSON.parse(localStorage.getItem("currentUser"))?.id || 1,
          ngay_tao: new Date().toISOString(),
          id_nguoi_cap_nhat: null,
          ngay_cap_nhat: null,
        };
      });

      existingDetails.push(...productVariantsToSave);
      localStorage.setItem("productDetails", JSON.stringify(existingDetails));

      localStorage.setItem("lastSavedProductCode", ma_san_pham);
    } else {
      // Logic for adding variants to an EXISTING product
      const sanPham = foundProduct;
      const existingDetails = JSON.parse(
        localStorage.getItem("productDetails") || "[]"
      );
      let maxDetailId = existingDetails.reduce(
        (max, d) => (d.id > max ? d.id : max),
        0
      );

      // Filter out variants that might already exist for this product, color, and size to avoid duplicates
      const newProductVariantsToSave = productVariants
        .filter(
          (variant) =>
            !existingDetails.some(
              (detail) =>
                detail.id_san_pham === sanPham.id &&
                detail.id_mau_sac === variant.color &&
                detail.id_kich_co === variant.size
            )
        )
        .map((variant) => {
          maxDetailId++;
          return {
            id: maxDetailId,
            id_san_pham: sanPham.id,
            id_kich_co: variant.size,
            id_mau_sac: variant.color,
            id_chat_lieu: variant.material,
            so_luong: variant.quantity,
            gia: variant.gia_ban,
            gia_nhap: variant.gia_nhap,
            images: variant.images,
            id_nguoi_tao:
              JSON.parse(localStorage.getItem("currentUser"))?.id || 1,
            ngay_tao: new Date().toISOString(),
            id_nguoi_cap_nhat: null,
            ngay_cap_nhat: null,
          };
        });

      if (newProductVariantsToSave.length > 0) {
        existingDetails.push(...newProductVariantsToSave);
        localStorage.setItem("productDetails", JSON.stringify(existingDetails));
      }

      const localProductsToUpdate = [...localProducts];
      const isInLocal = localProductsToUpdate.some((p) => p.id === sanPham.id);

      if (!isInLocal) {
        localProductsToUpdate.unshift(sanPham);
        localStorage.setItem("products", JSON.stringify(localProductsToUpdate));
      }

      localStorage.setItem("lastSavedProductCode", sanPham.ma_san_pham);
    }

    // Đóng modal xác nhận và hiện toast
    setShowConfirmModal(false);
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
      navigate("/dashboard/products");
    }, 1500);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setShowConfirmModal(true);
    }
  };

  return (
    <div className="container py-4">
      {/* Breadcrumb */}
      <div className="mb-3">
        <span className="text-secondary">Danh sách sản phẩm</span>
        <span className="mx-2">/</span>
        <span className="fw-bold">Thêm sản phẩm</span>
      </div>

      {/* Nút + để mở modal thêm nhanh */}
      <div className="text-end mb-4">
        <button
          type="button"
          className="btn btn-primary rounded-circle"
          style={{
            width: 48,
            height: 48,
            background: "#7c3aed",
            border: "none",
          }}
          onClick={() => setShowModal(true)}
        >
          <FaPlus />
        </button>
      </div>

      {/* Form chính đầy đủ */}
      <form
        className="p-4 border rounded bg-white shadow-sm"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="mb-3">
          <label className="form-label fw-semibold">Tên sản phẩm</label>
          <div className={errors.productName ? "is-invalid" : ""}>
            <CreatableSelect
              isClearable
              options={productNameOptions}
              value={productName}
              onChange={handleProductNameChange}
              placeholder="Chọn hoặc nhập tên sản phẩm..."
              classNamePrefix="select"
              formatCreateLabel={(inputValue) => `Thêm mới "${inputValue}"`}
            />
          </div>
          {errors.productName && (
            <div className="invalid-feedback d-block">{errors.productName}</div>
          )}
        </div>

        {isNewProduct && (
          <div className="mb-3">
            <label className="form-label fw-semibold">
              Danh mục cho sản phẩm mới
            </label>
            <Select
              options={categoryOptions}
              value={categoryOptions.find((c) => c.value === category)}
              onChange={(option) => setCategory(option.value)}
              placeholder="Chọn danh mục..."
              classNamePrefix="select"
            />
            {errors.category && (
              <div className="text-danger mt-1" style={{ fontSize: "0.875em" }}>
                {errors.category}
              </div>
            )}
          </div>
        )}

        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <label className="form-label">Chất liệu</label>
            <div className={errors.material ? "is-invalid" : ""}>
              <Select
                options={materialOptions}
                value={materialOptions.find((o) => o.value === material)}
                onChange={(option) => setMaterial(option ? option.value : "")}
                placeholder="Chọn chất liệu..."
                classNamePrefix="select"
                isClearable
              />
            </div>
            {errors.material && (
              <div className="invalid-feedback d-block">{errors.material}</div>
            )}
          </div>
          <div className="col-md-6">
            <label className="form-label">Số lượng</label>
            <input
              type="number"
              className={`form-control ${errors.quantity ? "is-invalid" : ""}`}
              min={0}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
            {errors.quantity && (
              <div className="invalid-feedback d-block">{errors.quantity}</div>
            )}
          </div>
        </div>
        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <label className="form-label">Giá nhập (VNĐ)</label>
            <input
              type="number"
              className={`form-control ${
                errors.importPrice ? "is-invalid" : ""
              }`}
              min={0}
              step={1000}
              value={importPrice}
              onChange={(e) => setImportPrice(Number(e.target.value))}
              placeholder="Nhập giá nhập..."
            />
            {errors.importPrice && (
              <div className="invalid-feedback d-block">
                {errors.importPrice}
              </div>
            )}
          </div>
          <div className="col-md-6">
            <label className="form-label">Giá bán (VNĐ)</label>
            <input
              type="number"
              className={`form-control ${errors.sellPrice ? "is-invalid" : ""}`}
              min={0}
              step={1000}
              value={sellPrice}
              onChange={(e) => setSellPrice(Number(e.target.value))}
              placeholder="Nhập giá bán..."
            />
            {errors.sellPrice && (
              <div className="invalid-feedback d-block">{errors.sellPrice}</div>
            )}
          </div>
        </div>
        {/* Kích cỡ với react-select */}
        <div className="row g-3 mb-3 align-items-end">
          <div className="col-md-12">
            <label className="form-label">Kích cỡ</label>
            <div className={errors.sizes ? "is-invalid" : ""}>
              <Select
                isMulti
                name="sizes"
                options={sizeOptions}
                value={sizes}
                onChange={setSizes}
                classNamePrefix="select"
                placeholder="Chọn kích cỡ..."
              />
            </div>
            {errors.sizes && (
              <div className="invalid-feedback d-block">{errors.sizes}</div>
            )}
          </div>
        </div>
        {/* Màu sắc với react-select */}
        <div className="row g-3 mb-3 align-items-end">
          <div className="col-md-12">
            <label className="form-label">Màu sắc</label>
            <div className={errors.colors ? "is-invalid" : ""}>
              <Select
                isMulti
                name="colors"
                options={colorOptions}
                value={colors}
                onChange={setColors}
                classNamePrefix="select"
                placeholder="Chọn màu sắc..."
              />
            </div>
            {errors.colors && (
              <div className="invalid-feedback d-block">{errors.colors}</div>
            )}
          </div>
        </div>
      </form>

      {/* Bảng sản phẩm cùng loại */}
      {showVariants && productVariants && productVariants.length > 0 && (
        <div className="mt-5">
          <div className="bg-light p-3 rounded mb-3 fw-bold">
            Chi tiết sản phẩm
          </div>
          {Object.entries(groupByColor(productVariants)).map(
            ([color, items]) => (
              <div key={color} className="mb-4">
                <div className="fw-bold bg-secondary text-white px-3 py-2 rounded-top"></div>
                <table className="table table-bordered align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Sản phẩm</th>
                      <th>Số lượng</th>
                      <th>Giá bán/sản phẩm</th>
                      <th>Giá nhập/sản phẩm</th>
                      <th>Danh mục</th>
                      <th>Chất liệu</th>
                      <th>Màu sắc</th>
                      <th>Kích cỡ</th>
                      <th>Hành Động</th>
                      <th>Ảnh</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items &&
                      items.map((v, idx) => {
                        const globalIdx = productVariants.findIndex(
                          (pv) => pv.color === v.color && pv.size === v.size
                        );
                        const variantErrors =
                          errors.variants && errors.variants[globalIdx]
                            ? errors.variants[globalIdx]
                            : {};
                        return (
                          <React.Fragment key={v.color + v.size}>
                            <tr>
                              <td>{`${v.name} [${v.color} - ${v.size}]`}</td>
                              <td>
                                <div className="position-relative">
                                  <input
                                    type="number"
                                    className={`form-control ${
                                      variantErrors.quantity ? "is-invalid" : ""
                                    }`}
                                    style={{ width: 70 }}
                                    value={v.quantity}
                                    min={0}
                                    onChange={(e) =>
                                      handleVariantChange(
                                        globalIdx,
                                        "quantity",
                                        e.target.value
                                      )
                                    }
                                  />
                                  {variantErrors.quantity && (
                                    <div className="invalid-feedback d-block">
                                      {variantErrors.quantity}
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td>
                                <div className="position-relative">
                                  <input
                                    type="number"
                                    className={`form-control ${
                                      variantErrors.gia_ban ? "is-invalid" : ""
                                    }`}
                                    style={{ width: 100 }}
                                    value={v.gia_ban}
                                    min={0}
                                    onChange={(e) =>
                                      handleVariantChange(
                                        globalIdx,
                                        "gia_ban",
                                        e.target.value
                                      )
                                    }
                                  />
                                  {variantErrors.gia_ban && (
                                    <div className="invalid-feedback d-block">
                                      {variantErrors.gia_ban}
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td>
                                <div className="position-relative">
                                  <input
                                    type="number"
                                    className="form-control"
                                    style={{ width: 100 }}
                                    value={v.gia_nhap}
                                    min={0}
                                    onChange={(e) =>
                                      handleVariantChange(
                                        globalIdx,
                                        "gia_nhap",
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>
                              </td>
                              <td>{v.category}</td>
                              <td>{v.material}</td>
                              <td>{v.color}</td>
                              <td>{v.size}</td>
                              <td>
                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={() => handleDeleteVariant(globalIdx)}
                                >
                                  <FaTrash />
                                </button>
                              </td>
                              <td className="text-center">
                                <span
                                  style={{
                                    cursor: "pointer",
                                    display: "inline-block",
                                    minWidth: 48,
                                  }}
                                  onClick={() =>
                                    openGalleryModal(v.color, v.size, v.images)
                                  }
                                >
                                  <FaImage
                                    style={{ fontSize: 20, color: "#888" }}
                                  />
                                  {v.images && v.images.length > 0 && (
                                    <span
                                      style={{
                                        fontSize: 12,
                                        marginLeft: 4,
                                        color: "#7c3aed",
                                      }}
                                    >
                                      ({v.images.length})
                                    </span>
                                  )}
                                </span>
                              </td>
                            </tr>
                            {/* Hiển thị thumbnail ảnh bên dưới dòng sản phẩm */}
                            {v.images && v.images.length > 0 && (
                              <tr>
                                <td colSpan={11}>
                                  <div
                                    style={{
                                      display: "flex",
                                      gap: 16,
                                      padding: "16px 0",
                                      borderBottom: "1px solid #eee",
                                      justifyContent: "center",
                                      alignItems: "center",
                                    }}
                                  >
                                    {v.images.map((img, i) => (
                                      <img
                                        key={img + i}
                                        src={img}
                                        alt="Ảnh sản phẩm"
                                        style={{
                                          width: 100,
                                          height: 100,
                                          objectFit: "cover",
                                          borderRadius: 8,
                                          border: "1px solid #ccc",
                                        }}
                                      />
                                    ))}
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            )
          )}
        </div>
      )}

      {/* Nút Lưu sản phẩm ở dưới cùng */}
      <div className="text-end mt-4 mb-5">
        <button
          type="button"
          className="btn btn-primary px-4 fw-bold"
          onClick={handleSaveProduct}
        >
          Lưu sản phẩm
        </button>
      </div>

      {/* Modal chọn ảnh gallery */}
      {showGalleryModal && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.2)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">
                  Danh sách ảnh của sản phẩm
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setShowGalleryModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3 text-center">
                  {selectedGalleryImgs && selectedGalleryImgs.length > 0 ? (
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        justifyContent: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      {selectedGalleryImgs.map((img, i) => (
                        <img
                          key={img + i}
                          src={img}
                          alt="Chọn ảnh"
                          style={{
                            width: 120,
                            height: 120,
                            objectFit: "cover",
                            borderRadius: 8,
                            border: "2px solid #7c3aed",
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <span className="text-secondary">Chưa chọn ảnh</span>
                  )}
                </div>
                <div className="mb-2 fw-bold">
                  Danh sách ảnh các sản phẩm màu {galleryColor}
                </div>
                <div
                  className="d-flex flex-wrap gap-3 align-items-center mb-3"
                  style={{ maxHeight: 220, overflowY: "auto" }}
                >
                  {gallery.map((img, idx) => (
                    <div key={img} style={{ position: "relative" }}>
                      <input
                        type="checkbox"
                        checked={selectedGalleryImgs.includes(img)}
                        onChange={() => handleToggleGalleryImg(img)}
                        style={{
                          position: "absolute",
                          top: 6,
                          left: 6,
                          zIndex: 2,
                        }}
                      />
                      <img
                        src={img}
                        alt="gallery"
                        style={{
                          width: 100,
                          height: 100,
                          objectFit: "cover",
                          borderRadius: 6,
                          border: selectedGalleryImgs.includes(img)
                            ? "2px solid #7c3aed"
                            : "1px solid #ccc",
                        }}
                        onClick={() => handleToggleGalleryImg(img)}
                      />
                    </div>
                  ))}
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      ref={galleryFileInput}
                      onChange={handleUploadGalleryImg}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      style={{
                        width: 100,
                        height: 100,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onClick={() => galleryFileInput.current.click()}
                      disabled={uploadingGallery}
                    >
                      {uploadingGallery ? (
                        "Đang tải..."
                      ) : (
                        <FaPlus style={{ fontSize: 32 }} />
                      )}
                    </button>
                  </div>
                </div>
                <div className="text-end">
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{
                      background: "#7c3aed",
                      minWidth: 180,
                      fontWeight: 600,
                    }}
                    disabled={selectedGalleryImgs.length === 0}
                    onClick={handleConfirmGalleryImgs}
                  >
                    Chọn ảnh này
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary ms-2"
                    onClick={() => setShowGalleryModal(false)}
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal thêm nhanh sản phẩm */}
      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.2)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">Thêm áo</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => {
                    setShowModal(false);
                    setQuickFormErrors({ name: "", category: "" });
                  }}
                  ref={closeBtnRef}
                ></button>
              </div>
              <form onSubmit={handleQuickSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Tên áo</label>
                    <input
                      type="text"
                      className={`form-control ${
                        quickFormErrors.name ? "is-invalid" : ""
                      }`}
                      name="name"
                      placeholder="Nhập tên áo..."
                      value={quickForm.name}
                      onChange={handleQuickChange}
                    />
                    {quickFormErrors.name && (
                      <div className="invalid-feedback d-block">
                        {quickFormErrors.name}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Danh mục <span className="text-danger">*</span>
                    </label>
                    <select
                      className={`form-select ${
                        quickFormErrors.category ? "is-invalid" : ""
                      }`}
                      name="category"
                      value={quickForm.category}
                      onChange={handleQuickChange}
                    >
                      <option value="">Chọn danh mục...</option>
                      {categoryOptions.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                    {quickFormErrors.category && (
                      <div className="invalid-feedback d-block">
                        {quickFormErrors.category}
                      </div>
                    )}
                  </div>
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button
                    type="submit"
                    className="btn"
                    style={{
                      background: "#7c3aed",
                      color: "#fff",
                      minWidth: 80,
                      fontWeight: 600,
                    }}
                  >
                    <FaPlus className="me-1" /> Thêm
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal xác nhận lưu sản phẩm */}
      {showConfirmModal && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            background: "rgba(0,0,0,0.25)",
            zIndex: 9999,
          }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div
              className="modal-content"
              style={{
                borderRadius: 16,
                boxShadow: "0 8px 32px 0 rgba(31,38,135,0.18)",
                border: "none",
                minWidth: 380,
              }}
            >
              <div
                className="modal-header border-0 pb-0"
                style={{ alignItems: "center", background: "transparent" }}
              >
                <span
                  style={{
                    fontSize: 28,
                    color: "#f59e42",
                    marginRight: 10,
                    marginLeft: 4,
                    lineHeight: 1,
                  }}
                >
                  <b>!</b>
                </span>
                <h5
                  className="modal-title fw-bold"
                  style={{ fontSize: 20, color: "#222", flex: 1 }}
                >
                  Xác nhận
                </h5>
              </div>
              <div
                className="modal-body"
                style={{ fontSize: 17, color: "#333", paddingTop: 8 }}
              >
                <div style={{ marginLeft: 32 }}>Xác nhận thêm sản phẩm?</div>
              </div>
              <div
                className="modal-footer border-0 pt-0"
                style={{
                  justifyContent: "flex-end",
                  background: "transparent",
                }}
              >
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{
                    borderRadius: 8,
                    minWidth: 80,
                    fontWeight: 500,
                    marginRight: 8,
                    background: "#f5f5f5",
                    color: "#444",
                    border: "none",
                  }}
                  onClick={() => setShowConfirmModal(false)}
                >
                  Hủy
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{
                    borderRadius: 8,
                    minWidth: 90,
                    fontWeight: 600,
                    background: "#1976d2",
                    border: "none",
                    boxShadow: "0 2px 8px rgba(25,118,210,0.08)",
                  }}
                  onClick={handleConfirmSave}
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSuccessToast && (
        <div
          style={{
            position: "fixed",
            top: 24,
            right: 24,
            zIndex: 9999,
            minWidth: 320,
            background: "#fff",
            border: "1px solid #198754",
            borderRadius: 8,
            boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
            padding: "16px 24px 8px 24px",
            color: "#198754",
            fontWeight: 500,
            animation: "fadeIn 0.3s",
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", marginBottom: 4 }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "#198754",
                marginRight: 16,
              }}
            >
              <svg width="20" height="20" viewBox="0 0 16 16" fill="#fff">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.97 11.03a.75.75 0 0 0 1.07 0l3-3a.75.75 0 1 0-1.06-1.06L7.5 9.44 6.03 7.97a.75.75 0 1 0-1.06 1.06l2 2z" />
              </svg>
            </span>
            <span>
              <b>Thêm thành công!</b>
            </span>
            <span
              style={{
                marginLeft: "auto",
                cursor: "pointer",
                fontSize: 18,
                color: "#198754",
                opacity: 0.7,
              }}
              onClick={() => setShowSuccessToast(false)}
              title="Đóng"
            >
              ×
            </span>
          </div>
          {/* Progress bar */}
          <div
            style={{
              width: "100%",
              height: 4,
              background: "#e9ecef",
              borderRadius: 2,
              overflow: "hidden",
              marginTop: 4,
            }}
          >
            <div
              style={{
                height: "100%",
                width: "100%",
                background: "#22c55e",
                transform: "translateX(-100%)",
                animation: "toast-progress 1.5s linear forwards",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProduct;
