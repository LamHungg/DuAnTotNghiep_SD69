import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaTrash, FaImage } from "react-icons/fa";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";

const brands = ["Chanel", "Gucci", "LV", "Hermes"];
const materials = ["Cotton", "Polyester", "Linen", "Wool"];
const categories = ["Áo thun", "Áo sơ mi", "Áo khoác", "Áo len"];
const defaultSizes = ["XS", "S", "M", "L", "XL", "XXL"];
const defaultColors = ["Trắng", "Đen", "Xám", "Xanh", "Đỏ", "Vàng"];
const defaultProductNames = [
  {
    value: "Áo Phông Nam Mùa Đông",
    label: "Áo Phông Nam Mùa Đông",
    category: "Áo thun",
  },
  { value: "Áo Polo Nam", label: "Áo Polo Nam", category: "Áo thun" },
  { value: "Áo Sơ Mi Nam", label: "Áo Sơ Mi Nam", category: "Áo sơ mi" },
];
const defaultGallery = [
  "https://images.pexels.com/photos/532220/pexels-photo-532220.jpeg",
  "https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg",
  "https://images.pexels.com/photos/1707828/pexels-photo-1707828.jpeg",
  "https://images.pexels.com/photos/2983463/pexels-photo-2983463.jpeg",
  "https://images.pexels.com/photos/2983462/pexels-photo-2983462.jpeg",
  "https://images.pexels.com/photos/532221/pexels-photo-532221.jpeg",
];

// Dữ liệu mẫu sản phẩm giống Products.js
const productsData = [
  {
    id: 1,
    ma_san_pham: "SP001",
    ten_san_pham: "Áo Thun Nam Basic",
    ten_danh_muc: "Áo thun",
    trang_thai: 1,
    mo_ta: "Áo thun nam chất liệu cotton, thoáng mát.",
    id_nguoi_tao: 1,
    ngay_tao: "2024-01-01T10:00:00Z",
    id_nguoi_cap_nhat: 2,
    ngay_cap_nhat: "2024-01-05T10:00:00Z",
    deleted_at: null,
    id_nguoi_xoa: null,
  },
  {
    id: 2,
    ma_san_pham: "SP002",
    ten_san_pham: "Áo Sơ Mi Nữ Công Sở",
    ten_danh_muc: "Áo sơ mi",
    trang_thai: 0,
    mo_ta: "Áo sơ mi nữ kiểu dáng công sở, vải lụa cao cấp.",
    id_nguoi_tao: 2,
    ngay_tao: "2024-01-02T11:00:00Z",
    id_nguoi_cap_nhat: 2,
    ngay_cap_nhat: "2024-01-06T11:00:00Z",
    deleted_at: null,
    id_nguoi_xoa: null,
  },
  {
    id: 3,
    ma_san_pham: "SP003",
    ten_san_pham: "Áo Khoác Gió Unisex",
    ten_danh_muc: "Áo khoác",
    trang_thai: 1,
    mo_ta: "Áo khoác gió phù hợp cả nam và nữ, chống nước nhẹ.",
    id_nguoi_tao: 1,
    ngay_tao: "2024-01-03T12:00:00Z",
    id_nguoi_cap_nhat: 3,
    ngay_cap_nhat: "2024-01-07T12:00:00Z",
    deleted_at: null,
    id_nguoi_xoa: null,
  },
  {
    id: 4,
    ma_san_pham: "SP004",
    ten_san_pham: "Áo Polo Trẻ Em",
    ten_danh_muc: "Áo polo",
    trang_thai: 2,
    mo_ta: "Áo polo cho trẻ em, nhiều màu sắc.",
    id_nguoi_tao: 3,
    ngay_tao: "2024-01-04T13:00:00Z",
    id_nguoi_cap_nhat: 1,
    ngay_cap_nhat: "2024-01-08T13:00:00Z",
    deleted_at: null,
    id_nguoi_xoa: null,
  },
  {
    id: 5,
    ma_san_pham: "SP005",
    ten_san_pham: "Áo Hoodie Nỉ Dày",
    ten_danh_muc: "Áo thun",
    trang_thai: 3,
    mo_ta: "Áo hoodie nỉ dày, giữ ấm tốt cho mùa đông.",
    id_nguoi_tao: 2,
    ngay_tao: "2024-01-05T14:00:00Z",
    id_nguoi_cap_nhat: 2,
    ngay_cap_nhat: "2024-01-09T14:00:00Z",
    deleted_at: null,
    id_nguoi_xoa: null,
  },
];

const AddProduct = () => {
  // State cho form chính
  const [productName, setProductName] = useState(null); // {value, label}
  const [productNameOptions, setProductNameOptions] = useState([]);
  const [category, setCategory] = useState("");
  const [material, setMaterial] = useState(materials[0]);
  const [sizes, setSizes] = useState([]); // array of {value, label}
  const [sizeOptions, setSizeOptions] = useState(
    defaultSizes.map((s) => ({ value: s, label: s }))
  );
  const [newSize, setNewSize] = useState("");
  const [colors, setColors] = useState([]); // array of {value, label}
  const [colorOptions, setColorOptions] = useState(
    defaultColors.map((c) => ({ value: c, label: c }))
  );
  const [newColor, setNewColor] = useState("");
  const [quantity, setQuantity] = useState(10);

  // State cho validation errors
  const [errors, setErrors] = useState({
    productName: "",
    category: "",
    material: "",
    sizes: "",
    colors: "",
    variants: {},
  });

  // State cho modal thêm nhanh
  const [showModal, setShowModal] = useState(false);
  const [quickForm, setQuickForm] = useState({ name: "", category: "" });
  const [quickFormErrors, setQuickFormErrors] = useState({
    name: "",
    category: "",
  });
  const closeBtnRef = useRef();

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
  }, []);

  // Xử lý CreatableSelect cho tên sản phẩm
  const handleProductNameChange = (option) => {
    setProductName(option);
    if (option && option.category) {
      setCategory(option.category);
    }
    if (
      option &&
      !productNameOptions.some((opt) => opt.value === option.value)
    ) {
      setProductNameOptions([...productNameOptions, option]);
    }
  };

  // Thêm kích cỡ mới vào danh sách
  const handleAddSize = () => {
    const val = newSize.trim().toUpperCase();
    if (val && !sizeOptions.some((opt) => opt.value === val)) {
      setSizeOptions([...sizeOptions, { value: val, label: val }]);
      setSizes([...sizes, { value: val, label: val }]);
      setNewSize("");
    }
  };

  // Thêm màu mới vào danh sách
  const handleAddColor = () => {
    const val = newColor.trim();
    if (
      val &&
      !colorOptions.some((opt) => opt.value.toLowerCase() === val.toLowerCase())
    ) {
      setColorOptions([...colorOptions, { value: val, label: val }]);
      setColors([...colors, { value: val, label: val }]);
      setNewColor("");
    }
  };

  // Sinh bảng sản phẩm khi đủ trường
  React.useEffect(() => {
    if (productName && material && sizes.length > 0 && colors.length > 0) {
      // Sinh các biến thể sản phẩm (mỗi màu - mỗi size là 1 dòng)
      let variants = [];
      colors.forEach((color) => {
        sizes.forEach((size) => {
          variants.push({
            name: productName.value,
            color: color.value,
            size: size.value,
            quantity: quantity,
            price: 100000,
            weight: 60,
            material,
            images: [],
          });
        });
      });
      setProductVariants(variants);
      setShowVariants(true);
    } else {
      setShowVariants(false);
      setProductVariants([]);
    }
  }, [productName, material, sizes, colors, quantity]);

  // Xử lý thay đổi số lượng, giá, cân nặng
  const handleVariantChange = (idx, field, value) => {
    setProductVariants((prev) =>
      prev.map((v, i) => (i === idx ? { ...v, [field]: value } : v))
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
    const groups = {};
    variants.forEach((v) => {
      if (!groups[v.color]) groups[v.color] = [];
      groups[v.color].push(v);
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

    // Thêm sản phẩm mới vào danh sách chọn tên sản phẩm
    const newOption = {
      value: quickForm.name,
      label: quickForm.name,
      category: quickForm.category,
    };
    setProductNameOptions((prev) => [...prev, newOption]);
    setProductName(newOption);
    setCategory(quickForm.category);
    setShowModal(false);
    setQuickForm({ name: "", category: "" });
    setQuickFormErrors({ name: "", category: "" });
  };

  const galleryFileInput = useRef();

  // Validation rules
  const validateForm = () => {
    const newErrors = {
      productName: "",
      category: "",
      material: "",
      sizes: "",
      colors: "",
      variants: {},
    };

    // Validate product name
    if (!productName) {
      newErrors.productName = "Vui lòng nhập tên sản phẩm";
    }

    // Validate category
    if (!category) {
      newErrors.category = "Vui lòng chọn danh mục";
    }

    // Validate material
    if (!material) {
      newErrors.material = "Vui lòng chọn chất liệu";
    }

    // Validate sizes
    if (sizes.length === 0) {
      newErrors.sizes = "Vui lòng chọn ít nhất một kích cỡ";
    }

    // Validate colors
    if (colors.length === 0) {
      newErrors.colors = "Vui lòng chọn ít nhất một màu sắc";
    }

    // Validate variants
    productVariants.forEach((variant, index) => {
      const variantErrors = {};

      if (variant.quantity <= 0) {
        variantErrors.quantity = "Số lượng phải lớn hơn 0";
      }

      if (variant.price <= 0) {
        variantErrors.price = "Giá phải lớn hơn 0";
      }

      if (Object.keys(variantErrors).length > 0) {
        newErrors.variants[index] = variantErrors;
      }
    });

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) =>
      typeof error === "string" ? error : Object.keys(error).length > 0
    );
  };

  // Lưu sản phẩm vào localStorage và chuyển hướng (chỉ gọi khi xác nhận)
  const handleConfirmSave = () => {
    const products = JSON.parse(localStorage.getItem("products") || "[]");
    const allProducts = [...products, ...productsData];
    let ma_san_pham = "";
    const found = allProducts.find(
      (p) => p.ten_san_pham === productName?.value
    );
    if (!found) {
      // Sinh mã không trùng
      let i = 1;
      do {
        ma_san_pham =
          "SP" +
          Math.floor(Math.random() * 1000000)
            .toString()
            .padStart(6, "0");
        i++;
      } while (allProducts.some((p) => p.ma_san_pham === ma_san_pham));
      // Lưu sản phẩm mới vào localStorage
      const sanPham = {
        id: Date.now(),
        ma_san_pham,
        ten_san_pham: productName?.value,
        ten_danh_muc: category,
        mo_ta: "",
        trang_thai: 1,
        id_nguoi_tao: 1,
        ngay_tao: new Date().toISOString(),
        id_nguoi_cap_nhat: null,
        ngay_cap_nhat: null,
        deleted_at: null,
        id_nguoi_xoa: null,
      };
      products.unshift(sanPham);
      localStorage.setItem("products", JSON.stringify(products));
      localStorage.setItem("lastSavedProductCode", ma_san_pham);
    } else {
      // Nếu sản phẩm đã có trong localStorage thì đẩy lên đầu, nếu chỉ có trong productsData thì không thêm vào localStorage
      ma_san_pham = found.ma_san_pham;
      const idx = products.findIndex(
        (p) => p.ma_san_pham === found.ma_san_pham
      );
      if (idx !== -1) {
        const [sp] = products.splice(idx, 1);
        products.unshift(sp);
        localStorage.setItem("products", JSON.stringify(products));
      }
      // Lưu mã sản phẩm vừa thao tác để trang quản lý biết đẩy lên đầu
      localStorage.setItem("lastSavedProductCode", ma_san_pham);
    }
    setShowConfirmModal(false);
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
      navigate("/products");
    }, 1500);
  };

  // Sửa lại handleSaveProduct: chỉ mở modal xác nhận nếu validate thành công
  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setShowConfirmModal(true);
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
            />
          </div>
          {errors.productName && (
            <div className="invalid-feedback d-block">{errors.productName}</div>
          )}
        </div>
        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <label className="form-label">Chất liệu</label>
            <select
              className={`form-select ${errors.material ? "is-invalid" : ""}`}
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
            >
              <option value="">Chọn chất liệu...</option>
              {materials.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
            {errors.material && (
              <div className="invalid-feedback d-block">{errors.material}</div>
            )}
          </div>
          <div className="col-md-6">
            <label className="form-label">Số lượng</label>
            <input
              type="number"
              className="form-control"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </div>
        </div>
        {/* Kích cỡ với react-select và nút Thêm */}
        <div className="row g-3 mb-3 align-items-end">
          <div className="col-md-10">
            <label className="form-label">Kích cỡ</label>
            <div className={errors.sizes ? "is-invalid" : ""}>
              <Select
                isMulti
                name="sizes"
                options={sizeOptions}
                value={sizes}
                onChange={setSizes}
                classNamePrefix="select"
                placeholder="Chọn hoặc nhập kích cỡ..."
              />
            </div>
            {errors.sizes && (
              <div className="invalid-feedback d-block">{errors.sizes}</div>
            )}
          </div>
          <div className="col-md-2 d-flex align-items-end">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Thêm kích cỡ"
              value={newSize}
              onChange={(e) => setNewSize(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddSize();
                }
              }}
            />
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={handleAddSize}
            >
              <FaPlus />
            </button>
          </div>
        </div>
        {/* Màu sắc với react-select và nút Thêm */}
        <div className="row g-3 mb-3 align-items-end">
          <div className="col-md-10">
            <label className="form-label">Màu sắc</label>
            <div className={errors.colors ? "is-invalid" : ""}>
              <Select
                isMulti
                name="colors"
                options={colorOptions}
                value={colors}
                onChange={setColors}
                classNamePrefix="select"
                placeholder="Chọn hoặc nhập màu sắc..."
              />
            </div>
            {errors.colors && (
              <div className="invalid-feedback d-block">{errors.colors}</div>
            )}
          </div>
          <div className="col-md-2 d-flex align-items-end">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Thêm màu sắc"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddColor();
                }
              }}
            />
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={handleAddColor}
            >
              <FaPlus />
            </button>
          </div>
        </div>
      </form>

      {/* Bảng sản phẩm cùng loại */}
      {showVariants && (
        <div className="mt-5">
          <div className="bg-light p-3 rounded mb-3 fw-bold">
            Danh sách các sản phẩm cùng loại
          </div>
          {Object.entries(groupByColor(productVariants)).map(
            ([color, items]) => (
              <div key={color} className="mb-4">
                <div className="fw-bold bg-secondary text-white px-3 py-2 rounded-top">
                  Các sản phẩm màu {color}
                </div>
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
                    {items.map((v, idx) => {
                      const globalIdx = productVariants.findIndex(
                        (pv) => pv.color === v.color && pv.size === v.size
                      );
                      const variantErrors = errors.variants[globalIdx] || {};
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
                                  className="form-control"
                                  style={{ width: 100 }}
                                  value={v.gia_ban || v.price}
                                  min={0}
                                  onChange={(e) =>
                                    handleVariantChange(
                                      globalIdx,
                                      "gia_ban",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                            </td>
                            <td>
                              <div className="position-relative">
                                <input
                                  type="number"
                                  className="form-control"
                                  style={{ width: 100 }}
                                  value={v.gia_nhap || v.price}
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
                            <td>
                              {categories.includes(category) ? category : ""}
                            </td>
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
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
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
          style={{ display: "block", background: "rgba(0,0,0,0.2)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-0 pb-0">
                <span
                  style={{ fontSize: 22, color: "#f59e42", marginRight: 8 }}
                >
                  <b>!</b>
                </span>
                <h5 className="modal-title fw-bold">Xác nhận</h5>
              </div>
              <div className="modal-body">
                <div>Xác nhận thêm sản phẩm?</div>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowConfirmModal(false)}
                >
                  Hủy
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ minWidth: 80, fontWeight: 600 }}
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
