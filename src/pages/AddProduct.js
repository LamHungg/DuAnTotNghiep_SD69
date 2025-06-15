import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaTrash, FaImage } from "react-icons/fa";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";

const brands = ["Chanel", "Gucci", "LV", "Hermes"];
const materials = ["Cotton", "Polyester", "Linen", "Wool"];
const sleeveTypes = ["Tay ngắn", "Tay dài", "Tay lửng", "Tay bồng"];
const collarTypes = ["Cổ tròn", "Cổ tim", "Cổ thuyền", "Cổ bẻ"];
const categories = ["Áo thun", "Áo sơ mi", "Áo khoác", "Áo len"];
const defaultSizes = ["XS", "S", "M", "L", "XL", "XXL"];
const defaultColors = ["Trắng", "Đen", "Xám", "Xanh", "Đỏ", "Vàng"];
const defaultProductNames = [
  "Áo Phông Nam Mùa Đông",
  "Áo Polo Nam",
  "Áo Sơ Mi Nam",
];
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
  const [productName, setProductName] = useState(null); // {value, label}
  const [productNameOptions, setProductNameOptions] = useState(
    defaultProductNames.map((n) => ({ value: n, label: n }))
  );
  const [category, setCategory] = useState(categories[0]);
  const [brand, setBrand] = useState(brands[0]);
  const [material, setMaterial] = useState(materials[0]);
  const [sleeve, setSleeve] = useState(sleeveTypes[0]);
  const [collar, setCollar] = useState(collarTypes[0]);
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

  // State cho modal thêm nhanh
  const [showModal, setShowModal] = useState(false);
  const [quickForm, setQuickForm] = useState({ name: "", category: "" });
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

  const navigate = useNavigate();

  // Xử lý CreatableSelect cho tên sản phẩm
  const handleProductNameChange = (option) => {
    setProductName(option);
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
    if (
      productName &&
      category &&
      brand &&
      material &&
      sleeve &&
      collar &&
      sizes.length > 0 &&
      colors.length > 0
    ) {
      // Sinh các biến thể sản phẩm (mỗi màu - mỗi size là 1 dòng)
      let variants = [];
      colors.forEach((color) => {
        sizes.forEach((size) => {
          variants.push({
            name: productName.value,
            color: color.value,
            size: size.value,
            quantity: 10,
            price: 100000,
            weight: 60,
            category,
            brand,
            material,
            sleeve,
            collar,
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
  }, [productName, category, brand, material, sleeve, collar, sizes, colors]);

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
  const handleQuickSubmit = (e) => {
    e.preventDefault();
    // Thêm sản phẩm mới vào danh sách chọn tên sản phẩm
    const newOption = {
      value: quickForm.name,
      label: quickForm.name,
      category: quickForm.category,
    };
    setProductNameOptions((prev) => [...prev, newOption]);
    setProductName(newOption);
    setShowModal(false);
    setQuickForm({ name: "", category: "" });
  };

  const galleryFileInput = useRef();

  // Lưu sản phẩm vào localStorage và chuyển hướng
  const handleSaveProduct = (e) => {
    e.preventDefault();
    const product = {
      name: productName?.value,
      category,
      brand,
      material,
      sleeve,
      collar,
      sizes: sizes.map((s) => s.value),
      colors: colors.map((c) => c.value),
      variants: productVariants,
      createdAt: new Date().toISOString(),
    };
    const products = JSON.parse(localStorage.getItem("products") || "[]");
    products.push(product);
    localStorage.setItem("products", JSON.stringify(products));
    navigate("/products");
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
          <CreatableSelect
            isClearable
            options={productNameOptions}
            value={productName}
            onChange={handleProductNameChange}
            placeholder="Chọn hoặc nhập tên sản phẩm..."
            classNamePrefix="select"
          />
        </div>
        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <label className="form-label">Danh mục</label>
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Thương hiệu</label>
            <select
              className="form-select"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            >
              {brands.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <label className="form-label">Chất liệu</label>
            <select
              className="form-select"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
            >
              {materials.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Tay áo</label>
            <select
              className="form-select"
              value={sleeve}
              onChange={(e) => setSleeve(e.target.value)}
            >
              {sleeveTypes.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <label className="form-label">Cổ áo</label>
            <select
              className="form-select"
              value={collar}
              onChange={(e) => setCollar(e.target.value)}
            >
              {collarTypes.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
        {/* Kích cỡ với react-select và nút Thêm */}
        <div className="row g-3 mb-3 align-items-end">
          <div className="col-md-10">
            <label className="form-label">Kích cỡ</label>
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
                      <th>Đơn giá</th>
                      <th>Cân nặng</th>
                      <th>Danh mục</th>
                      <th>Thương hiệu</th>
                      <th>Chất liệu</th>
                      <th>Tay áo</th>
                      <th>Cổ áo</th>
                      <th>Hành Động</th>
                      <th>Ảnh</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((v, idx) => {
                      const globalIdx = productVariants.findIndex(
                        (pv) => pv.color === v.color && pv.size === v.size
                      );
                      return (
                        <React.Fragment key={v.color + v.size}>
                          <tr>
                            <td>{`${v.name} [${v.color} - ${v.size}]`}</td>
                            <td>
                              <input
                                type="number"
                                className="form-control"
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
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-control"
                                style={{ width: 100 }}
                                value={v.price}
                                min={0}
                                onChange={(e) =>
                                  handleVariantChange(
                                    globalIdx,
                                    "price",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-control"
                                style={{ width: 70 }}
                                value={v.weight}
                                min={0}
                                onChange={(e) =>
                                  handleVariantChange(
                                    globalIdx,
                                    "weight",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td>{v.category}</td>
                            <td>{v.brand}</td>
                            <td>{v.material}</td>
                            <td>{v.sleeve}</td>
                            <td>{v.collar}</td>
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
                  onClick={() => setShowModal(false)}
                  ref={closeBtnRef}
                ></button>
              </div>
              <form onSubmit={handleQuickSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Tên áo</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      placeholder="Nhập tên áo..."
                      value={quickForm.name}
                      onChange={handleQuickChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Danh mục <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      name="category"
                      value={quickForm.category}
                      onChange={handleQuickChange}
                      required
                    >
                      <option value="">Chọn danh mục...</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
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
    </div>
  );
};

export default AddProduct;
