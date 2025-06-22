import React, { useEffect, useState } from "react";
import { FaEdit, FaPlus, FaSyncAlt, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { productsData } from "../data/sampleData";

const statusOptions = [
  { value: "", label: "Tất cả" },
  { value: "1", label: "Đang bán" },
  { value: "0", label: "Ngừng bán" },
  { value: "3", label: "Sắp ra mắt" },
  { value: "2", label: "Ẩn" },
];

const PAGE_SIZE = 5;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [searchCode, setSearchCode] = useState("");
  const [page, setPage] = useState(1);
  const [allCategories, setAllCategories] = useState([
    { value: "", label: "Tất cả danh mục" },
  ]);
  const navigate = useNavigate();
  const [expandedRow, setExpandedRow] = useState(null);
  const [productDetails, setProductDetails] = useState([]);

  useEffect(() => {
    const localProducts = JSON.parse(localStorage.getItem("products") || "[]");

    // Create a Set of IDs from localProducts for efficient lookup
    const localProductIds = new Set(localProducts.map((p) => p.id));

    // Combine localProducts with products from productsData that are not already in localProducts
    const allProducts = [
      ...localProducts,
      ...productsData.filter((p_data) => !localProductIds.has(p_data.id)),
    ];

    setProducts(allProducts);

    // Lấy tất cả danh mục duy nhất từ dữ liệu
    const categorySet = new Set();
    allProducts.forEach((p) => {
      if (p.ten_danh_muc && p.ten_danh_muc.trim() !== "") {
        categorySet.add(p.ten_danh_muc);
      }
    });
    setAllCategories([
      { value: "", label: "Tất cả danh mục" },
      ...Array.from(categorySet).map((cat) => ({ value: cat, label: cat })),
    ]);
    // Lấy chi tiết sản phẩm từ localStorage
    const details = JSON.parse(localStorage.getItem("productDetails") || "[]");
    setProductDetails(details);
  }, []);

  // Lọc sản phẩm theo trạng thái, danh mục, mã sản phẩm, tên sản phẩm
  let filteredProducts = products.filter(
    (p) =>
      (status === "" || p.trang_thai === Number(status)) &&
      (category === "" || p.ten_danh_muc === category) &&
      (searchCode === "" ||
        (p.ma_san_pham &&
          p.ma_san_pham.toLowerCase().includes(searchCode.toLowerCase()))) &&
      (search === "" ||
        (p.ten_san_pham &&
          p.ten_san_pham.toLowerCase().includes(search.toLowerCase())))
  );
  // Nếu có lastSavedProductCode thì đưa sản phẩm đó lên đầu bảng (không tạo bản sao)
  const lastSavedCode = localStorage.getItem("lastSavedProductCode");
  if (lastSavedCode) {
    const idx = filteredProducts.findIndex(
      (p) => p.ma_san_pham === lastSavedCode
    );
    if (idx > 0) {
      const [sp] = filteredProducts.splice(idx, 1);
      filteredProducts.unshift(sp);
    }
  }

  // Phân trang
  const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  // Xóa sản phẩm
  const handleDelete = (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;
    // Xóa khỏi localStorage nếu là sản phẩm do người dùng thêm
    let localProducts = JSON.parse(localStorage.getItem("products") || "[]");
    localProducts = localProducts.filter((p) => p.id !== id);
    localStorage.setItem("products", JSON.stringify(localProducts));
    // Cập nhật lại danh sách
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleToggleStatus = (productId) => {
    const updatedProducts = products.map((p) => {
      if (p.id === productId) {
        let nextStatus;
        switch (p.trang_thai) {
          case 3: // Sắp ra mắt -> Đang bán
            nextStatus = 1;
            break;
          case 1: // Đang bán -> Ngừng bán
            nextStatus = 0;
            break;
          case 0: // Ngừng bán -> Ẩn
            nextStatus = 2;
            break;
          case 2: // Ẩn -> Sắp ra mắt
            nextStatus = 3;
            break;
          default:
            nextStatus = 1; // Trạng thái mặc định nếu không xác định
        }
        return { ...p, trang_thai: nextStatus };
      }
      return p;
    });
    setProducts(updatedProducts);

    // Cập nhật vào localStorage
    const productToUpdate = updatedProducts.find((p) => p.id === productId);
    let localProducts = JSON.parse(localStorage.getItem("products") || "[]");
    const existingProductIndex = localProducts.findIndex(
      (p) => p.id === productId
    );

    if (existingProductIndex > -1) {
      localProducts[existingProductIndex] = productToUpdate;
    } else {
      // Nếu sản phẩm từ dữ liệu mẫu, thêm nó vào localStorage khi trạng thái thay đổi
      localProducts.unshift(productToUpdate);
    }
    localStorage.setItem("products", JSON.stringify(localProducts));
  };

  return (
    <div>
      <div className="text-center mb-4">
        <h2 className="fw-bold mb-0">QUẢN LÝ SẢN PHẨM</h2>
      </div>
      {/* Search, Add, Filter */}
      <div className="product-search-card mb-3 p-4">
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label mb-2">Mã sản phẩm</label>
            <input
              className="form-control product-search-input"
              placeholder="Tìm kiếm theo mã sản phẩm..."
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              style={{ height: 40 }}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label mb-2">Tên sản phẩm</label>
            <input
              className="form-control product-search-input"
              placeholder="Tìm kiếm sản phẩm theo tên..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ height: 40 }}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label mb-2">Danh mục sản phẩm</label>
            <select
              className="form-select product-category-select"
              style={{ height: 40 }}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {allCategories.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-3 d-flex align-items-end justify-content-end mt-3">
            <button
              type="button"
              className="btn btn-add-product d-flex align-items-center gap-2 w-100"
              style={{ height: 40 }}
              onClick={() => navigate("/dashboard/products/add")}
            >
              <FaPlus /> Thêm sản phẩm
            </button>
          </div>
          <div className="col-md-6 mt-3">
            <label className="form-label mb-2">Trạng thái</label>
            <div className="product-status-filter d-flex align-items-center gap-3">
              {statusOptions.map((opt) => (
                <label key={opt.value} className="product-radio-label">
                  <input
                    type="radio"
                    name="status"
                    value={opt.value}
                    checked={status === opt.value}
                    onChange={(e) => setStatus(e.target.value)}
                    className="product-radio-input"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Table */}
      <div className="product-table-wrapper">
        <table className="table product-table align-middle mb-0">
          <thead>
            <tr>
              <th className="text-center">STT</th>
              <th className="text-center">Mã sản phẩm</th>
              <th className="text-center">Tên</th>
              <th className="text-center">Danh mục</th>
              <th className="text-center">Trạng thái</th>
              <th className="text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map((p, idx) => (
              <React.Fragment key={p.id}>
                <tr
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    setExpandedRow(expandedRow === p.id ? null : p.id)
                  }
                >
                  <td className="text-center">{idx + 1}</td>
                  <td className="text-center">{p.ma_san_pham}</td>
                  <td className="text-center">{p.ten_san_pham}</td>
                  <td className="text-center">{p.ten_danh_muc}</td>
                  <td className="text-center">
                    {p.trang_thai === 1 && "Đang bán"}
                    {p.trang_thai === 0 && "Ngừng bán"}
                    {p.trang_thai === 2 && "Ẩn"}
                    {p.trang_thai === 3 && "Sắp ra mắt"}
                  </td>
                  <td className="text-center">
                    <button
                      className="btn btn-sm btn-link text-dark me-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleStatus(p.id);
                      }}
                      title="Đổi trạng thái"
                    >
                      <FaSyncAlt />
                    </button>
                    <button
                      className="btn btn-sm btn-link text-dark me-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/dashboard/products/edit/${p.id}`);
                      }}
                      title="Sửa"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn btn-sm btn-link text-danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(p.id);
                      }}
                      title="Xóa"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
                {expandedRow === p.id && (
                  <tr>
                    <td colSpan={6} style={{ background: "#f8f9fa" }}>
                      <div style={{ padding: 16 }}>
                        <b>Chi tiết sản phẩm:</b>
                        <table className="table table-bordered mt-2 mb-0">
                          <thead>
                            <tr>
                              <th className="text-center">Mã sản phẩm</th>
                              <th className="text-center">Tên</th>
                              <th className="text-center">Danh mục</th>
                              <th className="text-center">Màu sắc</th>
                              <th className="text-center">Kích thước</th>
                              <th className="text-center">Chất liệu</th>
                              <th className="text-center">Giá nhập</th>
                              <th className="text-center">Giá bán</th>
                              <th className="text-center">Số lượng</th>
                            </tr>
                          </thead>
                          <tbody>
                            {productDetails
                              .filter((d) => d.id_san_pham === p.id)
                              .map((d, i) => (
                                <React.Fragment key={d.id || i}>
                                  <tr>
                                    <td className="text-center">
                                      {p.ma_san_pham}
                                    </td>
                                    <td className="text-center">
                                      {p.ten_san_pham}
                                    </td>
                                    <td className="text-center">
                                      {p.ten_danh_muc}
                                    </td>
                                    <td className="text-center">
                                      {d.id_mau_sac}
                                    </td>
                                    <td className="text-center">
                                      {d.id_kich_co}
                                    </td>
                                    <td className="text-center">
                                      {d.id_chat_lieu}
                                    </td>
                                    <td className="text-center">
                                      {d.gia_nhap?.toLocaleString()}
                                    </td>
                                    <td className="text-center">
                                      {d.gia?.toLocaleString()}
                                    </td>
                                    <td className="text-center">
                                      {d.so_luong}
                                    </td>
                                  </tr>
                                  {/* Truy vết lịch sử tạo/sửa */}
                                  {d.auditTrail && d.auditTrail.length > 0 && (
                                    <tr>
                                      <td
                                        colSpan={9}
                                        style={{
                                          background: "#f3f4f6",
                                          padding: 0,
                                        }}
                                      >
                                        <div style={{ padding: 8 }}>
                                          <b>Lịch sử tạo/sửa:</b>
                                          <table className="table table-sm table-bordered mb-0 mt-2">
                                            <thead>
                                              <tr>
                                                <th className="text-center">
                                                  Người tạo
                                                </th>
                                                <th className="text-center">
                                                  Thời gian tạo
                                                </th>
                                                <th className="text-center">
                                                  Người sửa
                                                </th>
                                                <th className="text-center">
                                                  Thời gian sửa
                                                </th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {d.auditTrail.map((a, idx) => (
                                                <tr key={idx}>
                                                  <td className="text-center">
                                                    {a.nguoi_tao || ""}
                                                  </td>
                                                  <td className="text-center">
                                                    {a.thoi_gian_tao
                                                      ? new Date(
                                                          a.thoi_gian_tao
                                                        ).toLocaleString()
                                                      : ""}
                                                  </td>
                                                  <td className="text-center">
                                                    {a.nguoi_sua || ""}
                                                  </td>
                                                  <td className="text-center">
                                                    {a.thoi_gian_sua
                                                      ? new Date(
                                                          a.thoi_gian_sua
                                                        ).toLocaleString()
                                                      : ""}
                                                  </td>
                                                </tr>
                                              ))}
                                            </tbody>
                                          </table>
                                        </div>
                                      </td>
                                    </tr>
                                  )}
                                </React.Fragment>
                              ))}
                            {productDetails.filter(
                              (d) => d.id_san_pham === p.id
                            ).length === 0 && (
                              <tr>
                                <td colSpan={9} className="text-center">
                                  Không có chi tiết
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
        <div className="text-secondary">
          Tổng {filteredProducts.length} sản phẩm
        </div>
        <div className="d-flex align-items-center gap-2">
          <button
            className="btn product-page-btn"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            &lt;
          </button>
          <span className="product-page-current">{page}</span>
          <button
            className="btn product-page-btn"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default Products;
