import React, { useState } from "react";
import { FaEdit, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const categories = [
  { value: "", label: "Tất cả danh mục" },
  { value: "Nam", label: "Nam" },
  { value: "Nữ", label: "Nữ" },
];

const productsData = [
  {
    id: 1,
    code: "SP006",
    name: "Áo Phông Nam Mùa Đông",
    quantity: 70,
    category: "Nam",
    status: "Đang bán",
  },
  {
    id: 2,
    code: "SP005",
    name: "Áo Phông Nữ Mùa Hè",
    quantity: 62,
    category: "Nữ",
    status: "Đang bán",
  },
  {
    id: 3,
    code: "SP004",
    name: "Áo Phông Luxury",
    quantity: 168,
    category: "Nam",
    status: "Đang bán",
  },
  {
    id: 4,
    code: "SP003",
    name: "Áo Phông Nữ",
    quantity: 786,
    category: "Nữ",
    status: "Đang bán",
  },
  {
    id: 5,
    code: "SP002",
    name: "Áo Phông Nam",
    quantity: 400,
    category: "Nam",
    status: "Đang bán",
  },
];

const statusOptions = [
  { value: "", label: "Tất cả" },
  { value: "Đang bán", label: "Đang bán" },
  { value: "Ngừng bán", label: "Ngừng bán" },
];

const Products = () => {
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // Lọc sản phẩm theo trạng thái, danh mục, tên
  const filteredProducts = productsData.filter(
    (p) =>
      (status === "" || p.status === status) &&
      (category === "" || p.category === category) &&
      p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Title center */}
      <div className="text-center mb-4">
        <h2 className="fw-bold mb-0">QUẢN LÝ SẢN PHẨM</h2>
      </div>
      {/* Search and Add */}
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
              <th>Mã</th>
              <th>Tên</th>
              <th>Số lượng</th>
              <th>Danh mục</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p, idx) => (
              <tr key={p.id}>
                <td>{idx + 1}</td>
                <td>{p.code}</td>
                <td>{p.name}</td>
                <td>{p.quantity}</td>
                <td>{p.category}</td>
                <td>
                  <span
                    className={`product-status-badge ${
                      p.status === "Đang bán" ? "on-sale" : "off-sale"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td>
                  <button className="btn product-edit-btn" title="Chỉnh sửa">
                    <FaEdit />
                  </button>
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
            disabled={page === 2}
            onClick={() => setPage(page + 1)}
          >
            &gt;
          </button>
        </div>
        <div>
          <select
            className="form-select product-page-size"
            style={{ width: 90 }}
          >
            <option>5 / page</option>
            <option>10 / page</option>
          </select>
        </div>
        <div className="d-flex align-items-center gap-1">
          <span>Go to</span>
          <input
            className="form-control product-page-goto"
            style={{ width: 60 }}
          />
          <span>Page</span>
        </div>
      </div>
    </div>
  );
};

export default Products;
