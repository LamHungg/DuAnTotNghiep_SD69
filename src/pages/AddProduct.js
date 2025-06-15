import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";

const brands = ["Chanel", "Gucci", "LV", "Hermes"];
const materials = ["Cotton", "Polyester", "Linen", "Wool"];
const sleeveTypes = ["Tay ngắn", "Tay dài", "Tay lửng", "Tay bồng"];
const collarTypes = ["Cổ tròn", "Cổ tim", "Cổ thuyền", "Cổ bẻ"];

const AddProduct = () => {
  const [form, setForm] = useState({
    name: "",
    brand: brands[0],
    material: materials[0],
    sleeve: sleeveTypes[0],
    collar: collarTypes[0],
    size: "",
    color: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý thêm sản phẩm ở đây
  };

  return (
    <div className="container py-4">
      {/* Breadcrumb */}
      <div className="mb-3">
        <span className="text-secondary">Danh sách sản phẩm</span>
        <span className="mx-2">/</span>
        <span className="fw-bold">Thêm sản phẩm</span>
      </div>

      <form className="bg-white p-4 rounded shadow-sm" onSubmit={handleSubmit}>
        {/* Tên sản phẩm */}
        <div className="mb-4">
          <label className="form-label fw-semibold">Tên sản phẩm</label>
          <input
            type="text"
            className="form-control"
            name="name"
            placeholder="Nhập tên áo..."
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Thuộc tính */}
        <div className="mb-4">
          <div className="fw-semibold mb-2">Thuộc tính</div>
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label">Thương hiệu</label>
              <select
                className="form-select"
                name="brand"
                value={form.brand}
                onChange={handleChange}
              >
                {brands.map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Chất liệu</label>
              <select
                className="form-select"
                name="material"
                value={form.material}
                onChange={handleChange}
              >
                {materials.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Tay áo</label>
              <select
                className="form-select"
                name="sleeve"
                value={form.sleeve}
                onChange={handleChange}
              >
                {sleeveTypes.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Cổ áo</label>
              <select
                className="form-select"
                name="collar"
                value={form.collar}
                onChange={handleChange}
              >
                {collarTypes.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Kích cỡ và màu sắc */}
        <div className="mb-4">
          <div className="fw-semibold mb-2">Kích cỡ và Màu sắc</div>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Kích cỡ</label>
              <input
                type="text"
                className="form-control"
                name="size"
                placeholder="Nhập kích cỡ..."
                value={form.size}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Màu sắc</label>
              <input
                type="text"
                className="form-control"
                name="color"
                placeholder="Nhập màu sắc..."
                value={form.color}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Nút thêm sản phẩm */}
        <div className="text-end">
          <button
            type="submit"
            className="btn btn-primary rounded-circle"
            style={{ width: 48, height: 48 }}
          >
            <FaPlus />
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
