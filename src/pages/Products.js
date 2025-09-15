import React, { useEffect, useState, useRef } from "react";
import {
  FaEdit,
  FaPlus,
  FaSyncAlt,
  FaTrash,
  FaSearch,
  FaEye,
  FaTimes,
  FaArrowLeft,
} from "react-icons/fa";
import "./Products.css";
import { useNavigate } from "react-router-dom";
import {
  getAllSanPham,
  getAllChiTietSanPham,
  updateSanPhamStatus,
  searchSanPham,
} from "../services/sanPhamService";
import { getAllDanhMuc } from "../services/danhMucService";
import { getAllMauSac } from "../services/mauSacService";
import { getAllKichCo } from "../services/kichCoService";
import { getAllChatLieu } from "../services/chatLieuService";

const statusOptions = [
  { value: "", label: "Tất cả", color: "#6c757d" },
  { value: "1", label: "Đang bán", color: "#28a745" },
  { value: "0", label: "Ngừng bán", color: "#dc3545" },
  { value: "3", label: "Sắp ra mắt", color: "#ffc107" },
  { value: "2", label: "Ẩn", color: "#6c757d" },
];

const PAGE_SIZE = 8;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [allCategories, setAllCategories] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProductDetails, setSelectedProductDetails] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showDetailView, setShowDetailView] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchInputRef = useRef();
  const debounceTimeout = useRef();
  const [pendingSearch, setPendingSearch] = useState("");
  const navigate = useNavigate();

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [spRes, ctspRes, dmRes, msRes, kcRes, clRes] = await Promise.all([
          getAllSanPham(),
          getAllChiTietSanPham(),
          getAllDanhMuc(),
          getAllMauSac(),
          getAllKichCo(),
          getAllChatLieu(),
        ]);

        const categories = (dmRes || []).map((dm) => ({
          id: dm.id,
          label: dm.tenDanhMuc,
          value: dm.id,
          tenDanhMuc: dm.tenDanhMuc,
        }));

        const mappedProducts = (spRes || []).map((p) => ({
          id: p.id,
          maSanPham: p.maSanPham,
          tenSanPham: p.tenSanPham,
          idDanhMuc: p.idDanhMuc,
          tenDanhMuc:
            categories.find((c) => c.id === p.idDanhMuc)?.tenDanhMuc || "",
          trangThai: p.trangThai,
        }));

        setProducts(mappedProducts);
        setAllCategories(categories);
        setColors(msRes || []);
        setSizes(kcRes || []);
        setMaterials(clRes || []);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Search functionality
  const normalizeKeyword = (str) =>
    str.trim().replace(/\s+/g, " ").toLowerCase();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let params = {};
        const normalized = normalizeKeyword(searchText);
        if (normalized) {
          params.keyword = normalized;
        }
        if (status !== "") {
          params.trangThai = status;
        }
        if (category !== "") {
          params.idDanhMuc = category;
        }

        let spRes;
        if (normalized || status !== "" || category !== "") {
          spRes = await searchSanPham(params);
        } else {
          spRes = await getAllSanPham();
        }

        const mappedProducts = (spRes || []).map((p) => ({
          id: p.id,
          maSanPham: p.maSanPham,
          tenSanPham: p.tenSanPham,
          idDanhMuc: p.idDanhMuc,
          tenDanhMuc:
            allCategories.find((c) => c.id === p.idDanhMuc)?.tenDanhMuc || "",
          trangThai: p.trangThai,
        }));

        setProducts(mappedProducts);
        setShowDetailView(false);
        setSelectedProduct(null);
      } catch (err) {
        console.error("Lỗi khi tìm kiếm sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchText, status, category, allCategories]);

  // Search suggestions
  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setPendingSearch(value);
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    const normalized = normalizeKeyword(value);
    if (normalized === "") {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    debounceTimeout.current = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await searchSanPham({ keyword: normalized });
        const unique = [];
        const seen = new Set();
        (res || []).forEach((p) => {
          const key = p.maSanPham + "-" + p.tenSanPham;
          if (!seen.has(key)) {
            unique.push({
              id: p.id,
              maSanPham: p.maSanPham,
              tenSanPham: p.tenSanPham,
            });
            seen.add(key);
          }
        });
        setSuggestions(unique.slice(0, 6));
        setShowSuggestions(true);
      } catch (err) {
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setSearchLoading(false);
      }
    }, 300);
  };

  const handleSuggestionClick = async (suggestion) => {
    setPendingSearch(suggestion.tenSanPham);
    setShowSuggestions(false);
    setSearchText(suggestion.tenSanPham);
    setShowDetailView(true);

    // Load product details
    await handleShowProductDetails(suggestion.id);
  };

  const handleShowProductDetails = async (productId) => {
    try {
      const [ctspRes] = await Promise.all([getAllChiTietSanPham()]);
      const details = (ctspRes || []).filter(
        (d) => Number(d.idSanPham) === Number(productId)
      );
      const product = products.find((p) => p.id === productId);

      setSelectedProduct(product);
      setSelectedProductDetails(details);
    } catch (error) {
      console.error("Error loading product details:", error);
    }
  };

  // Product actions
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn ngừng bán sản phẩm này?"))
      return;

    try {
      const product = products.find((p) => p.id === id);
      if (!product) return;

      const updatedProduct = { ...product, trangThai: 0 };
      await updateSanPhamStatus(id, updatedProduct);

      // Reload data
      const [spRes] = await Promise.all([getAllSanPham()]);
      const mappedProducts = (spRes || []).map((p) => ({
        id: p.id,
        maSanPham: p.maSanPham,
        tenSanPham: p.tenSanPham,
        idDanhMuc: p.idDanhMuc,
        tenDanhMuc:
          allCategories.find((c) => c.id === p.idDanhMuc)?.tenDanhMuc || "",
        trangThai: p.trangThai,
      }));
      setProducts(mappedProducts);
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái sản phẩm:", err);
      alert("Lỗi khi cập nhật trạng thái sản phẩm!");
    }
  };

  const handleToggleStatus = async (productId) => {
    try {
      const product = products.find((p) => p.id === productId);
      if (!product) return;

      let nextStatus;
      switch (product.trangThai) {
        case 3:
          nextStatus = 1;
          break;
        case 1:
          nextStatus = 0;
          break;
        case 0:
          nextStatus = 2;
          break;
        case 2:
          nextStatus = 3;
          break;
        default:
          nextStatus = 1;
      }

      const updatedProduct = { ...product, trangThai: nextStatus };
      await updateSanPhamStatus(productId, updatedProduct);

      const [spRes] = await Promise.all([getAllSanPham()]);
      const mappedProducts = (spRes || []).map((p) => ({
        id: p.id,
        maSanPham: p.maSanPham,
        tenSanPham: p.tenSanPham,
        idDanhMuc: p.idDanhMuc,
        tenDanhMuc:
          allCategories.find((c) => c.id === p.idDanhMuc)?.tenDanhMuc || "",
        trangThai: p.trangThai,
      }));
      setProducts(mappedProducts);
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái:", err);
      alert("Lỗi khi cập nhật trạng thái sản phẩm!");
    }
  };

  // Utility functions
  const getNameById = (list, id, nameField = "label") => {
    const found = list.find((item) => Number(item.id) === Number(id));
    return found ? found[nameField] : "";
  };

  const getStatusBadgeStyle = (status) => {
    const statusOption = statusOptions.find(
      (opt) => opt.value === (status?.toString() || "")
    );
    return {
      backgroundColor: statusOption?.color + "20",
      color: statusOption?.color,
      padding: "4px 12px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: "500",
    };
  };

  const getStatusText = (status) => {
    const statusOption = statusOptions.find(
      (opt) => opt.value === (status?.toString() || "")
    );
    return statusOption?.label || "Không xác định";
  };

  // Pagination
  const totalPages = Math.ceil(products.length / PAGE_SIZE);
  const paginatedProducts = products.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(e.target)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading && products.length === 0) {
    return (
      <div
        className="d-flex justify-content-center align-center"
        style={{ height: "400px" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid products-container">
      {/* Header */}
      <div className="text-center mb-4">
        <h2 className="fw-bold mb-0 text-primary">QUẢN LÝ SẢN PHẨM</h2>
        <p className="text-muted mt-2">
          Quản lý và theo dõi tất cả sản phẩm trong hệ thống
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="card shadow-md-sm mb-4">
        <div className="card-body p-4">
          <div className="row g-3">
            {/* Search Input */}
            <div
              className="col-lg-6"
              ref={searchInputRef}
              style={{ position: "relative" }}
            >
              <label className="form-label fw-semibold">
                🔍 Tìm kiếm sản phẩm
              </label>
              <div className="input-group">
                <input
                  className="form-control border-end-0"
                  placeholder="Nhập mã hoặc tên sản phẩm..."
                  value={pendingSearch}
                  onChange={handleSearchInputChange}
                  onFocus={() =>
                    suggestions.length > 0 && setShowSuggestions(true)
                  }
                  onKeyDown={(e) =>
                    e.key === "Enter" && setSearchText(pendingSearch)
                  }
                />
                <button
                  className="btn btn-outline-secondary border-start-0"
                  onClick={() => setSearchText(pendingSearch)}
                  disabled={searchLoading}
                >
                  {searchLoading ? (
                    <div
                      className="spinner-border spinner-border-sm"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  ) : (
                    <FaSearch />
                  )}
                </button>
              </div>

              {/* Search Suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="suggestions-dropdown">
                  {suggestions.map((s, idx) => (
                    <div
                      key={s.id + "-" + idx}
                      className="suggestion-item"
                      onClick={() => handleSuggestionClick(s)}
                    >
                      <div className="suggestion-code">{s.maSanPham}</div>
                      <div className="suggestion-name">{s.tenSanPham}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Category Filter */}
            <div className="col-lg-3">
              <label className="form-label fw-semibold">📂 Danh mục</label>
              <select
                className="form-control"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Tất cả danh mục</option>
                {allCategories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="col-lg-3">
              <label className="form-label fw-semibold">📊 Trạng thái</label>
              <select
                className="form-control"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Add Product Button */}
            <div className="col-12">
              <button
                className="btn btn-primary d-flex align-center gap-2"
                onClick={() => navigate("/dashboard/products/add")}
              >
                <FaPlus /> Thêm sản phẩm mới
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {!showDetailView ? (
        <>
          {/* Products Grid */}
          <div className="row g-4">
            {paginatedProducts.map((product) => (
              <div key={product.id} className="col-lg-6 col-xl-4">
                <div className="card h-100 shadow-md-sm product-card">
                  <div className="card-body">
                    <div className="d-flex justify-between align-items-start mb-3">
                      <div>
                        <h6 className="card-title mb-1 fw-bold text-primary">
                          {product.maSanPham}
                        </h6>
                        <p className="card-text text-muted small mb-0">
                          {product.tenSanPham}
                        </p>
                      </div>
                      <span
                        className="status-badge"
                        style={getStatusBadgeStyle(product.trangThai)}
                      >
                        {getStatusText(product.trangThai)}
                      </span>
                    </div>

                    <div className="mb-3">
                      <small className="text-muted">
                        <strong>Danh mục:</strong>{" "}
                        {product.tenDanhMuc || "Chưa phân loại"}
                      </small>
                    </div>

                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-outline btn-sm flex-fill"
                        onClick={() => {
                          setShowDetailView(true);
                          handleShowProductDetails(product.id);
                        }}
                        title="Xem chi tiết"
                      >
                        <FaEye className="me-1" />
                        Chi tiết
                      </button>
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() =>
                          navigate(`/dashboard/products/edit/${product.id}`)
                        }
                        title="Chỉnh sửa"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-outline-warning btn-sm"
                        onClick={() => handleToggleStatus(product.id)}
                        title="Đổi trạng thái"
                      >
                        <FaSyncAlt />
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(product.id)}
                        title="Ngừng bán"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {paginatedProducts.length === 0 && !loading && (
            <div className="text-center py-5">
              <div className="mb-3">
                <i
                  className="fas fa-box-open text-muted empty-state-icon"
                  style={{ fontSize: "4rem" }}
                ></i>
              </div>
              <h5 className="text-muted">Không tìm thấy sản phẩm</h5>
              <p className="text-muted">
                Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-between align-center mt-4">
              <div className="text-muted">
                Hiển thị {(page - 1) * PAGE_SIZE + 1} -{" "}
                {Math.min(page * PAGE_SIZE, products.length)}
                trong tổng số {products.length} sản phẩm
              </div>
              <nav>
                <ul className="pagination pagination-sm mb-0">
                  <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => setPage(page - 1)}
                    >
                      &laquo;
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pageNum) => (
                      <li
                        key={pageNum}
                        className={`page-item ${
                          pageNum === page ? "active" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => setPage(pageNum)}
                        >
                          {pageNum}
                        </button>
                      </li>
                    )
                  )}
                  <li
                    className={`page-item ${
                      page === totalPages ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setPage(page + 1)}
                    >
                      &raquo;
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </>
      ) : (
        /* Product Detail View */
        <div className="product-detail-view">
          <div className="d-flex justify-between align-center mb-4">
            <div>
              <h4 className="mb-1">
                <span className="text-primary">
                  {selectedProduct?.maSanPham}
                </span>{" "}
                - {selectedProduct?.tenSanPham}
              </h4>
              <p className="text-muted mb-0">
                Danh mục: {selectedProduct?.tenDanhMuc} | Trạng thái:{" "}
                <span style={getStatusBadgeStyle(selectedProduct?.trangThai)}>
                  {getStatusText(selectedProduct?.trangThai)}
                </span>
              </p>
            </div>
            <button
              className="btn btn-outline-secondary"
              onClick={() => {
                setShowDetailView(false);
                setSelectedProduct(null);
                setSelectedProductDetails([]);
              }}
            >
              <FaArrowLeft className="me-2" />
              Quay lại danh sách
            </button>
          </div>

          {selectedProductDetails.length > 0 ? (
            <div className="row g-4">
              {selectedProductDetails.map((detail, idx) => (
                <div key={idx} className="col-lg-6 col-xl-4">
                  <div className="card h-100 detail-card">
                    <div className="card-header bg-light">
                      <h6 className="mb-0">Chi tiết #{idx + 1}</h6>
                    </div>
                    <div className="card-body">
                      <div className="row g-3">
                        <div className="col-6">
                          <small className="text-muted d-block">Màu sắc</small>
                          <strong>
                            {getNameById(colors, detail.idMauSac, "tenMauSac")}
                          </strong>
                        </div>
                        <div className="col-6">
                          <small className="text-muted d-block">
                            Kích thước
                          </small>
                          <strong>
                            {getNameById(sizes, detail.idKichCo, "tenKichCo")}
                          </strong>
                        </div>
                        <div className="col-6">
                          <small className="text-muted d-block">
                            Chất liệu
                          </small>
                          <strong>
                            {getNameById(
                              materials,
                              detail.idChatLieu,
                              "tenChatLieu"
                            )}
                          </strong>
                        </div>
                        <div className="col-6">
                          <small className="text-muted d-block">Số lượng</small>
                          <strong className="text-primary">
                            {detail.soLuong}
                          </strong>
                        </div>
                        <div className="col-6">
                          <small className="text-muted d-block">Giá nhập</small>
                          <strong className="text-success">
                            {detail.giaNhap?.toLocaleString()} ₫
                          </strong>
                        </div>
                        <div className="col-6">
                          <small className="text-muted d-block">Giá bán</small>
                          <strong className="text-danger">
                            {detail.gia?.toLocaleString()} ₫
                          </strong>
                        </div>
                      </div>
                    </div>
                    <div className="card-footer bg-transparent">
                      <button
                        className="btn btn-primary btn-sm w-100"
                        onClick={() =>
                          navigate(
                            `/dashboard/products/edit/${selectedProduct.id}`
                          )
                        }
                      >
                        <FaEdit className="me-1" />
                        Chỉnh sửa
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <div className="mb-3">
                <i
                  className="fas fa-info-circle text-info empty-state-icon"
                  style={{ fontSize: "4rem" }}
                ></i>
              </div>
              <h5 className="text-muted">Chưa có chi tiết sản phẩm</h5>
              <p className="text-muted mb-4">
                Sản phẩm này chưa có thông tin chi tiết về màu sắc, kích thước,
                giá cả...
              </p>
              <button
                className="btn btn-primary"
                onClick={() =>
                  navigate(`/dashboard/products/edit/${selectedProduct.id}`)
                }
              >
                <FaPlus className="me-2" />
                Thêm chi tiết sản phẩm
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Products;
