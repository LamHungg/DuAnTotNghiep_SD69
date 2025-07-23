import React, { useEffect, useState } from "react";
import { FaEdit, FaPlus, FaSyncAlt, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { productsData } from "../data/sampleData";
import {
  getAllSanPham,
  getAllChiTietSanPham,
  updateSanPhamStatus,
} from "../services/sanPhamService";
import { getAllDanhMuc } from "../services/danhMucService";
import { getAllMauSac } from "../services/mauSacService";
import { getAllKichCo } from "../services/kichCoService";
import { getAllChatLieu } from "../services/chatLieuService";

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
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [allCategories, setAllCategories] = useState([
    { value: "", label: "Tất cả danh mục" },
  ]);
  const navigate = useNavigate();
  const [expandedRow, setExpandedRow] = useState(null);
  const [productDetails, setProductDetails] = useState([]);
  const [danhMucMap, setDanhMucMap] = useState({});
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedProductDetails, setSelectedProductDetails] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching data...");
        const [spRes, ctspRes, dmRes] = await Promise.all([
          getAllSanPham(),
          getAllChiTietSanPham(),
          getAllDanhMuc(),
        ]);

        console.log("API Response:", {
          products: spRes,
          details: ctspRes,
          categories: dmRes,
        });
        console.log("Sản phẩm từ API:", spRes);

        // Map lại danh mục để có id và tên
        const categories = (dmRes || []).map((dm) => ({
          id: dm.id,
          label: dm.tenDanhMuc,
          value: dm.id,
          tenDanhMuc: dm.tenDanhMuc,
        }));
        setAllCategories([
          { value: "", label: "Tất cả danh mục" },
          ...categories,
        ]);

        // Map lại sản phẩm cho đúng format giao diện
        const mappedProducts = (spRes || []).map((p) => ({
          id: p.id,
          maSanPham: p.maSanPham,
          tenSanPham: p.tenSanPham,
          idDanhMuc: p.idDanhMuc,
          tenDanhMuc:
            categories.find((c) => c.id === p.idDanhMuc)?.tenDanhMuc || "",
          trangThai: p.trangThai,
        }));
        console.log("Mapped Products:", mappedProducts);
        setProducts(mappedProducts);
        setProductDetails(ctspRes || []);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu:", err);
        setProducts([]);
        setAllCategories([{ value: "", label: "Tất cả danh mục" }]);
        setProductDetails([]);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [mauSac, kichCo, chatLieu] = await Promise.all([
          getAllMauSac(),
          getAllKichCo(),
          getAllChatLieu(),
        ]);
        setColors(mauSac || []);
        setSizes(kichCo || []);
        setMaterials(chatLieu || []);
      } catch (err) {
        setColors([]);
        setSizes([]);
        setMaterials([]);
        console.error("Lỗi khi lấy thuộc tính sản phẩm:", err);
      }
    };
    fetchOptions();
  }, []);

  // Lọc sản phẩm theo trạng thái, danh mục, mã sản phẩm, tên sản phẩm
  let filteredProducts = products.filter(
    (p) =>
      (status === "" || p.trangThai === Number(status)) &&
      (category === "" || p.tenDanhMuc === category) &&
      (searchText === "" ||
        (p.maSanPham &&
          p.maSanPham.toLowerCase().includes(searchText.toLowerCase())) ||
        (p.tenSanPham &&
          p.tenSanPham.toLowerCase().includes(searchText.toLowerCase())))
  );
  // Nếu có lastSavedProductCode thì đưa sản phẩm đó lên đầu bảng (không tạo bản sao)
  const lastSavedCode = localStorage.getItem("lastSavedProductCode");
  if (lastSavedCode) {
    const idx = filteredProducts.findIndex(
      (p) => p.maSanPham === lastSavedCode
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

  const handleToggleStatus = async (productId) => {
    try {
      const product = products.find((p) => p.id === productId);
      if (!product) return;

      let nextStatus;
      switch (product.trangThai) {
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
          nextStatus = 1;
      }

      // Cập nhật lên backend
      const updatedProduct = {
        ...product,
        trangThai: nextStatus,
      };
      await updateSanPhamStatus(productId, updatedProduct);

      // Reload lại danh sách sau khi cập nhật
      const [spRes, ctspRes] = await Promise.all([
        getAllSanPham(),
        getAllChiTietSanPham(),
      ]);

      // Map lại sản phẩm và cập nhật state
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
      setProductDetails(ctspRes || []);
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái:", err);
      alert("Lỗi khi cập nhật trạng thái sản phẩm!");
    }
  };

  const handleShowDetails = async (productId) => {
    try {
      setSelectedProductId(productId);
      console.log("Showing details for product ID:", productId);

      // Load lại tất cả dữ liệu từ API
      const [spRes, ctspRes, dmRes, msRes, kcRes, clRes] = await Promise.all([
        getAllSanPham(),
        getAllChiTietSanPham(),
        getAllDanhMuc(),
        getAllMauSac(),
        getAllKichCo(),
        getAllChatLieu(),
      ]);

      console.log("API Response:", {
        products: spRes,
        details: ctspRes,
        categories: dmRes,
        colors: msRes,
        sizes: kcRes,
        materials: clRes,
      });

      // Lọc chi tiết cho sản phẩm được chọn
      const details = (ctspRes || []).filter(
        (d) => Number(d.idSanPham) === Number(productId)
      );

      console.log("Filtered details:", details);

      // Cập nhật tất cả state
      setProducts(spRes || []);
      setProductDetails(ctspRes || []);
      setSelectedProductDetails(details);
      setAllCategories(dmRes || []);
      setColors(msRes || []);
      setSizes(kcRes || []);
      setMaterials(clRes || []);

      // Nếu không có chi tiết, hiển thị thông báo
      if (details.length === 0) {
        alert(
          "Sản phẩm này chưa có chi tiết. Vui lòng thêm chi tiết sản phẩm bằng cách click vào nút Sửa (bút chì)."
        );
      }
    } catch (error) {
      console.error("Error loading product details:", error);
      alert("Có lỗi khi tải chi tiết sản phẩm");
    }
  };

  // Hàm map id sang tên
  const getNameById = (list, id, nameField = "label") => {
    console.log(`Finding ${nameField} for ID:${id} in list:`, list);
    const found = list.find((item) => Number(item.id) === Number(id));
    console.log("Found item:", found);
    return found ? found[nameField] : "";
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 1:
        return { backgroundColor: "#e0f2f7", color: "#007bff" };
      case 0:
        return { backgroundColor: "#f8d7da", color: "#721c24" };
      case 2:
        return { backgroundColor: "#e2e3e5", color: "#383d41" };
      case 3:
        return { backgroundColor: "#d4edda", color: "#155724" };
      default:
        return { backgroundColor: "#e9ecef", color: "#495057" };
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 1:
        return "Đang bán";
      case 0:
        return "Ngừng bán";
      case 2:
        return "Ẩn";
      case 3:
        return "Sắp ra mắt";
      default:
        return "Tất cả";
    }
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
            <label className="form-label mb-2">Tìm kiếm sản phẩm</label>
            <input
              className="form-control product-search-input"
              placeholder="Tìm kiếm theo mã hoặc tên sản phẩm..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
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
                  key={p.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleShowDetails(p.id)}
                >
                  <td className="text-center">{idx + 1}</td>
                  <td className="text-center">{p.maSanPham}</td>
                  <td className="text-center">{p.tenSanPham}</td>
                  <td className="text-center">{p.tenDanhMuc}</td>
                  <td className="text-center">
                    <span style={getStatusBadgeStyle(p.trangThai)}>
                      {getStatusText(p.trangThai)}
                    </span>
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
                                      {p.maSanPham}
                                    </td>
                                    <td className="text-center">
                                      {p.tenSanPham}
                                    </td>
                                    <td className="text-center">
                                      {p.tenDanhMuc}
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
                              (d) => Number(d.idSanPham) === Number(p.id)
                            ).length === 0 && (
                              <tr>
                                <td colSpan={9} className="text-center">
                                  <div className="text-muted p-3">
                                    <i className="fas fa-info-circle me-2"></i>
                                    <strong>
                                      Sản phẩm này chưa có chi tiết
                                    </strong>
                                    <br />
                                    <small>
                                      Chi tiết sản phẩm bao gồm: màu sắc, kích
                                      thước, chất liệu, giá, số lượng
                                    </small>
                                    <br />
                                    <button
                                      className="btn btn-primary btn-sm mt-2"
                                      onClick={() =>
                                        (window.location.href = `/dashboard/products/edit/${p.id}`)
                                      }
                                    >
                                      <i className="fas fa-edit me-1"></i>
                                      Thêm chi tiết sản phẩm
                                    </button>
                                  </div>
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
      {selectedProductId && (
        <div style={{ marginTop: 24 }}>
          <h5>Chi tiết sản phẩm:</h5>
          <table className="table">
            <thead>
              <tr>
                <th>Mã sản phẩm</th>
                <th>Tên</th>
                <th>Danh mục</th>
                <th>Màu sắc</th>
                <th>Kích thước</th>
                <th>Chất liệu</th>
                <th>Giá nhập</th>
                <th>Giá bán</th>
                <th>Số lượng</th>
              </tr>
            </thead>
            <tbody>
              {selectedProductDetails.length > 0 ? (
                selectedProductDetails.map((ct, idx) => {
                  const product = products.find((p) => p.id === ct.idSanPham);
                  console.log("Product:", product);
                  const idDanhMuc = product ? product.idDanhMuc : null;
                  console.log("ID Danh mục:", idDanhMuc);
                  console.log("All Categories:", allCategories);
                  return (
                    <tr key={idx}>
                      <td>{product?.maSanPham}</td>
                      <td>{product?.tenSanPham}</td>
                      <td>
                        {getNameById(
                          allCategories,
                          product?.idDanhMuc,
                          "tenDanhMuc"
                        )}
                      </td>
                      <td>{getNameById(colors, ct.idMauSac, "tenMauSac")}</td>
                      <td>{getNameById(sizes, ct.idKichCo, "tenKichCo")}</td>
                      <td>
                        {getNameById(materials, ct.idChatLieu, "tenChatLieu")}
                      </td>
                      <td>{ct.giaNhap?.toLocaleString()} VNĐ</td>
                      <td>{ct.gia?.toLocaleString()} VNĐ</td>
                      <td>{ct.soLuong}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="text-center">
                    <div className="alert alert-info mb-0">
                      <i className="fas fa-info-circle me-2"></i>
                      Sản phẩm này chưa có chi tiết. Vui lòng click vào nút{" "}
                      <i className="fas fa-edit"></i> để thêm chi tiết sản phẩm.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Products;
