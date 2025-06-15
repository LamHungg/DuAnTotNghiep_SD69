import React, { useEffect, useState } from "react";
import { FaEdit, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const categories = [
  { value: "", label: "Tất cả danh mục" },
  { value: "Nam", label: "Nam" },
  { value: "Nữ", label: "Nữ" },
];

const statusOptions = [
  { value: "", label: "Tất cả" },
  { value: "Đang bán", label: "Đang bán" },
  { value: "Ngừng bán", label: "Ngừng bán" },
];

const productsData = [
  {
    id: 1,
    code: "SP006",
    name: "Áo Phông Nam Mùa Đông",
    quantity: 70,
    category: "Nam",
    status: "Đang bán",
    brand: "Chanel",
    material: "Cotton",
    sleeve: "Tay bồng",
    collar: "Cổ thuyền",
    createdAt: "2024-01-01T10:00:00Z",
    variants: [
      { color: "Red", size: "XL" },
      { color: "Red", size: "L" },
    ],
  },
  {
    id: 2,
    code: "SP005",
    name: "Áo Phông Nữ Mùa Hè",
    quantity: 62,
    category: "Nữ",
    status: "Đang bán",
    brand: "Gucci",
    material: "Polyester",
    sleeve: "Tay ngắn",
    collar: "Cổ tròn",
    createdAt: "2024-01-02T11:00:00Z",
    variants: [
      { color: "Black", size: "M" },
      { color: "Black", size: "L" },
    ],
  },
  // ... bạn có thể thêm dữ liệu mẫu khác nếu muốn
];

const PAGE_SIZE = 5;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const localProducts = JSON.parse(localStorage.getItem("products") || "[]");
    setProducts([...productsData, ...localProducts]);
  }, []);

  // Lọc sản phẩm theo trạng thái, danh mục, tên
  const filteredProducts = products.filter(
    (p) =>
      (status === "" || p.status === status) &&
      (category === "" || p.category === category) &&
      p.name.toLowerCase().includes(search.toLowerCase())
  );

  // Phân trang
  const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <div>
      <div className="text-center mb-4">
        <h2 className="fw-bold mb-0">QUẢN LÝ SẢN PHẨM</h2>
      </div>
      {/* Search, Add, Filter */}
      <div className="product-search-card mb-3 p-4">
        <div className="row g-3">
          <div className="col-md-9">
            <label className="form-label mb-2">Tên sản phẩm</label>
            <input
              className="form-control product-search-input"
              placeholder="Tìm kiếm sản phẩm theo tên..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ height: 40 }}
            />
          </div>
          <div className="col-md-3 d-flex align-items-end justify-content-end">
            <button
              type="button"
              className="btn btn-add-product d-flex align-items-center gap-2 w-100"
              style={{ height: 40 }}
              onClick={() => navigate("/products/add")}
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
          <div className="col-md-6 mt-3">
            <label className="form-label mb-2">Danh mục</label>
            <select
              className="form-select product-category-select"
              style={{ maxWidth: 300 }}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      {/* Table */}
      <div className="product-table-wrapper">
        <table className="table product-table align-middle mb-0">
          <thead>
            <tr>
              <th>#</th>
              <th>Tên</th>
              <th>Danh mục</th>
              <th>Thương hiệu</th>
              <th>Chất liệu</th>
              <th>Tay áo</th>
              <th>Cổ áo</th>
              <th>Biến thể</th>
              <th>Ngày tạo</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map((p, idx) => (
              <tr key={(p.name || p.code) + idx}>
                <td>{(page - 1) * PAGE_SIZE + idx + 1}</td>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>{p.brand}</td>
                <td>{p.material}</td>
                <td>{p.sleeve}</td>
                <td>{p.collar}</td>
                <td>
                  {p.variants
                    ? p.variants.map((v, i) => (
                        <div key={i}>
                          {v.color} - {v.size}
                        </div>
                      ))
                    : ""}
                </td>
                <td>
                  {p.createdAt ? new Date(p.createdAt).toLocaleString() : ""}
                </td>
              </tr>
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
