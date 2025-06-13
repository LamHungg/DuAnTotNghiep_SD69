import React, { useState } from "react";

const brands = ["Chanel", "Gucci", "LV", "Hermes"];
const materials = ["Cotton", "Polyester", "Linen", "Wool"];
const sleeveTypes = ["Tay ngắn", "Tay dài", "Tay lửng", "Tay bồng"];
const collarTypes = ["Cổ tròn", "Cổ tim", "Cổ thuyền", "Cổ bẻ"];

const AddProduct = () => {
  const [name, setName] = useState("");
  const [brand, setBrand] = useState(brands[0]);
  const [material, setMaterial] = useState(materials[0]);
  const [sleeve, setSleeve] = useState(sleeveTypes[0]);
  const [collar, setCollar] = useState(collarTypes[0]);
  const [sizes, setSizes] = useState("");
  const [colors, setColors] = useState("");

  return (
    <div className="container mt-4" style={{ maxWidth: 800 }}>
      <h3 className="fw-bold mb-4 text-center">Thêm sản phẩm</h3>
      <form className="p-4 border rounded bg-white shadow-sm">
        <div className="mb-3">
          <label className="form-label fw-semibold">Tên sản phẩm</label>
          <input
            type="text"
            className="form-control"
            placeholder="Nhập tên áo..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="row g-3 mb-3">
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
        </div>
        <div className="row g-3 mb-3">
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
        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <label className="form-label">Kích cỡ</label>
            <input
              type="text"
              className="form-control"
              placeholder="Nhập kích cỡ..."
              value={sizes}
              onChange={(e) => setSizes(e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Màu sắc</label>
            <input
              type="text"
              className="form-control"
              placeholder="Nhập màu sắc..."
              value={colors}
              onChange={(e) => setColors(e.target.value)}
            />
          </div>
        </div>
        <div className="text-end mt-4">
          <button type="submit" className="btn btn-primary px-4 fw-bold">
            Lưu sản phẩm
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
