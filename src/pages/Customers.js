import React, { useEffect, useState } from "react";
import { FaSearch, FaEye, FaToggleOn, FaToggleOff, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import khachHangService from "../services/khachHangService";
import { getOrderById } from "../services/donHangService";

const Customers = () => {
  const [customers, setCustomers] = useState([
    {
      maKhachHang: "KH001",
      hoTen: "Nguyễn Văn A",
      soDienThoai: "0901234567",
      email: "vana@example.com",
      ngaySinh: "1990-01-01",
      trangThaiTaiKhoan: 1,
      gioiTinh: "Nam",
      tenDangNhap: "vana",
      matKhau: "123456"
    },
    {
      maKhachHang: "KH002",
      hoTen: "Trần Thị B",
      soDienThoai: "0912345678",
      email: "thib@example.com",
      ngaySinh: "1992-02-02",
      trangThaiTaiKhoan: 0,
      gioiTinh: "Nữ",
      tenDangNhap: "thib",
      matKhau: "abcdef"
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    hoTen: "",
    soDienThoai: "",
    email: "",
    ngaySinh: "",
    gioiTinh: "Nam",
    tenDangNhap: "",
    matKhau: ""
  });
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [orderDetails, setOrderDetails] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const [formErrors, setFormErrors] = useState({});
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Sắp xếp để khách hàng có mã GUEST lên đầu
  const sortedCustomers = [...customers].sort((a, b) => {
    // Nếu a có mã GUEST thì đưa lên đầu
    if (a.maKhachHang === "GUEST") return -1;
    // Nếu b có mã GUEST thì đưa lên đầu
    if (b.maKhachHang === "GUEST") return 1;
    // Còn lại sắp xếp theo mã khách hàng
    return a.maKhachHang.localeCompare(b.maKhachHang);
  });

  const paginatedCustomers = sortedCustomers.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage);
  const totalPages = Math.ceil(sortedCustomers.length / recordsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      if (!searchValue.trim()) {
        const data = await khachHangService.getAllKhachHang();
        setCustomers(data);
      } else {
        // Lọc theo họ tên hoặc số điện thoại (không phân biệt hoa thường)
        const all = await khachHangService.getAllKhachHang();
        const keyword = searchValue.trim().toLowerCase();
        const filtered = all.filter(cus =>
          (cus.hoTen && cus.hoTen.toLowerCase().includes(keyword)) ||
          (cus.soDienThoai && cus.soDienThoai.includes(keyword))
        );
        setCustomers(filtered);
      }
    } catch (error) {
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchTimeout) clearTimeout(searchTimeout);
    const timeout = setTimeout(() => {
      handleSearch();
    }, 400);
    setSearchTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  const validateForm = () => {
    const errors = {};
    if (!newCustomer.hoTen.trim()) {
      errors.hoTen = 'Vui lòng nhập họ tên';
    }
    if (!newCustomer.soDienThoai.trim()) {
      errors.soDienThoai = 'Vui lòng nhập số điện thoại';
    }
    else if (!/^0\d{8,10}$/.test(newCustomer.soDienThoai.trim())) {
      errors.soDienThoai = 'Số điện thoại không hợp lệ (phải bắt đầu bằng 0 và có 9-11 số)';
    }
    if (newCustomer.email && !/^\S+@\S+\.\S+$/.test(newCustomer.email)) {
      errors.email = 'Email không đúng định dạng';
    }
    if (newCustomer.ngaySinh && new Date(newCustomer.ngaySinh) > new Date()) {
      errors.ngaySinh = 'Ngày sinh không được lớn hơn ngày hiện tại';
    }
    return errors;
  };

  const handleAddCustomer = async () => {
    const errors = validateForm();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    try {
      setLoading(true);
      await khachHangService.addKhachHang(newCustomer);
      setShowAddForm(false);
      setNewCustomer({
        hoTen: "",
        soDienThoai: "",
        email: "",
        ngaySinh: "",
        gioiTinh: "Nam",
        tenDangNhap: "",
        matKhau: ""
      });
      // Reload danh sách khách hàng
      const data = await khachHangService.getAllKhachHang();
      setCustomers(data);
      setFormErrors({});
    } catch (error) {
      alert("Thêm khách hàng thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTrangThai = async (cus) => {
    const newTrangThai = (cus.trangThaiTaiKhoan === 1 || cus.trangThaiTaiKhoan === true) ? 0 : 1;
    try {
      setLoading(true);
      await khachHangService.updateTrangThaiKhachHang(cus.id || cus.maKhachHang, newTrangThai);
      // Reload danh sách khách hàng
      const data = await khachHangService.getAllKhachHang();
      setCustomers(data);
    } catch (error) {
      alert("Cập nhật trạng thái thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const handleShowOrderDetail = async (cus) => {
    try {
      setLoading(true);
      setSelectedCustomer(cus);
      const res = await khachHangService.getChiTietDonHangKhachHang(cus.id || cus.maKhachHang);
      setOrderDetails(res);
      setShowOrderDetail(true);
    } catch (error) {
      alert("Không lấy được danh sách đơn hàng!");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseOrderDetail = () => {
    setShowOrderDetail(false);
    setOrderDetails([]);
    setSelectedCustomer(null);
  };

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await khachHangService.getAllKhachHang();
        setCustomers(data);
      } catch (error) {
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const switchStyle = {
    position: 'relative',
    display: 'inline-block',
    width: 40,
    height: 22,
    verticalAlign: 'middle',
  };
  const sliderStyle = (active) => ({
    position: 'absolute',
    cursor: 'pointer',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: active ? '#10b981' : '#d1d5db',
    borderRadius: 22,
    transition: '0.3s',
  });
  const circleStyle = (active) => ({
    position: 'absolute',
    height: 18,
    width: 18,
    left: active ? 20 : 2,
    bottom: 2,
    backgroundColor: '#fff',
    borderRadius: '50%',
    transition: '0.3s',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  });

  return (
    <div>
      <div className="d-flex justify-between align-center mb-4 flex-wrap gap-2">
        <h2 className="fw-bold mb-0">Quản lý khách hàng</h2>
        {!showAddForm && (
        <div className="d-flex gap-2 align-center">
            <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>
              Thêm khách hàng
            </button>
          <div className="search-customer-box position-relative">
            <input
              className="form-control search-customer-input"
              placeholder="Search customers..."
              style={{ paddingRight: 38, minWidth: 240 }}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <FaSearch
              className="search-customer-icon position-absolute top-50 end-0 translate-middle-y me-3"
              style={{ cursor: "pointer" }}
              onClick={handleSearch}
            />
          </div>
        </div>
        )}
      </div>
      {showAddForm && (
        <div className="card mb-4 p-3 w-100">
          <h5 className="mb-3">Thêm khách hàng mới</h5>
          <form>
            <div className="row">
              <div className="col-md-3 mb-2">
                <label className="form-label">Họ tên</label>
                <input type="text" className="form-control" value={newCustomer.hoTen} onChange={e => setNewCustomer({...newCustomer, hoTen: e.target.value})} />
                {formErrors.hoTen && <div className="text-danger small">{formErrors.hoTen}</div>}
              </div>
              <div className="col-md-3 mb-2">
                <label className="form-label">Số điện thoại</label>
                <input type="text" className="form-control" value={newCustomer.soDienThoai} onChange={e => setNewCustomer({...newCustomer, soDienThoai: e.target.value})} />
                {formErrors.soDienThoai && <div className="text-danger small">{formErrors.soDienThoai}</div>}
              </div>
              <div className="col-md-3 mb-2">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" value={newCustomer.email} onChange={e => setNewCustomer({...newCustomer, email: e.target.value})} />
                {formErrors.email && <div className="text-danger small">{formErrors.email}</div>}
              </div>
              <div className="col-md-3 mb-2">
                <label className="form-label">Ngày sinh</label>
                <input type="date" className="form-control" value={newCustomer.ngaySinh} onChange={e => setNewCustomer({...newCustomer, ngaySinh: e.target.value})} max={new Date().toISOString().split('T')[0]} />
                {formErrors.ngaySinh && <div className="text-danger small">{formErrors.ngaySinh}</div>}
              </div>
              <div className="col-md-2 mb-2">
                <label className="form-label">Giới tính</label>
                <select className="form-control" value={newCustomer.gioiTinh} onChange={e => setNewCustomer({...newCustomer, gioiTinh: e.target.value})}>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </div>
              <div className="col-md-3 mb-2">
                <label className="form-label">Tên đăng nhập</label>
                <input type="text" className="form-control" value={newCustomer.tenDangNhap} onChange={e => setNewCustomer({...newCustomer, tenDangNhap: e.target.value})} />
              </div>
              <div className="col-md-3 mb-2">
                <label className="form-label">Mật khẩu</label>
                <input type="password" className="form-control" value={newCustomer.matKhau} onChange={e => setNewCustomer({...newCustomer, matKhau: e.target.value})} />
              </div>
            </div>
            <div className="mt-3 d-flex gap-2">
              <button type="button" className="btn btn-primary" onClick={handleAddCustomer}>Lưu</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowAddForm(false)}>Hủy</button>
            </div>
          </form>
        </div>
      )}
      {showAddForm ? (
        <div className="customer-table-wrapper">
          <table className="table customer-table align-middle mb-0">
            <thead>
              <tr>
                <th className="text-center">ID</th>
                <th className="text-center">MÃ KHÁCH HÀNG</th>
                <th className="text-center">HỌ TÊN</th>
                <th className="text-center">SỐ ĐIỆN THOẠI</th>
                <th className="text-center">EMAIL</th>
                <th className="text-center">NGÀY SINH</th>
                <th className="text-center">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center">
                    Đang tải...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center">
                    Không có khách hàng
                  </td>
                </tr>
              ) : (
                paginatedCustomers.map((cus, idx) => (
                  <tr key={cus.maKhachHang || idx}>
                    <td className="text-center">{(currentPage - 1) * recordsPerPage + idx + 1}</td>
                    <td className="text-center">{cus.maKhachHang}</td>
                    <td className="text-center">{cus.hoTen}</td>
                    <td className="text-center">{cus.soDienThoai}</td>
                    <td className="text-center">{cus.email}</td>
                    <td className="text-center">{cus.ngaySinh ? new Date(cus.ngaySinh).toLocaleDateString() : ''}</td>
                    <td className="text-center">
                      <button className="btn btn-link p-1" title="Xem chi tiết" onClick={() => handleShowOrderDetail(cus)}>
                        <FaEye size={18} />
                      </button>
                      {/* Ẩn nút bật/tắt trạng thái cho khách hàng GUEST */}
                      {cus.maKhachHang !== "GUEST" && (
                      <button
                        className="btn btn-link p-1 ms-2"
                        style={{background: 'none', border: 'none', padding: 0}}
                        title={cus.trangThaiTaiKhoan === 1 || cus.trangThaiTaiKhoan === true ? "Khóa khách hàng" : "Mở khóa khách hàng"}
                        onClick={() => handleToggleTrangThai(cus)}
                      >
                        <span style={switchStyle}>
                          <span style={sliderStyle(cus.trangThaiTaiKhoan === 1 || cus.trangThaiTaiKhoan === true)}></span>
                          <span style={circleStyle(cus.trangThaiTaiKhoan === 1 || cus.trangThaiTaiKhoan === true)}></span>
                        </span>
                      </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                  margin: '0 2px',
                  padding: '2px 8px',
                  borderRadius: 6,
                  border: '1.5px solid #222',
                  background: '#fafbfc',
                  color: '#222',
                  fontSize: 15,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  outline: 'none',
                }}
              >
                <FaChevronLeft />
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  style={{
                    margin: '0 2px',
                    padding: '2px 10px',
                    borderRadius: 6,
                    border: currentPage === i + 1 ? '1.5px solid #7c3aed' : '1.5px solid #ccc',
                    background: currentPage === i + 1 ? '#7c3aed' : '#fff',
                    color: currentPage === i + 1 ? '#fff' : '#222',
                    fontWeight: currentPage === i + 1 ? 'bold' : 'normal',
                    fontSize: 14,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    outline: 'none',
                  }}
                  onMouseOver={e => e.currentTarget.style.background = currentPage === i + 1 ? '#7c3aed' : '#f3f4f6'}
                  onMouseOut={e => e.currentTarget.style.background = currentPage === i + 1 ? '#7c3aed' : '#fff'}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{
                  margin: '0 2px',
                  padding: '2px 8px',
                  borderRadius: 6,
                  border: '1.5px solid #222',
                  background: '#fafbfc',
                  color: '#222',
                  fontSize: 15,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  outline: 'none',
                }}
              >
                <FaChevronRight />
              </button>
            </div>
          )}
        </div>
      ) : (
      <div className="customer-table-wrapper">
        <table className="table customer-table align-middle mb-0">
          <thead>
            <tr>
              <th className="text-center">ID</th>
              <th className="text-center">MÃ KHÁCH HÀNG</th>
              <th className="text-center">HỌ TÊN</th>
              <th className="text-center">SỐ ĐIỆN THOẠI</th>
              <th className="text-center">EMAIL</th>
              <th className="text-center">NGÀY SINH</th>
              <th className="text-center">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center">
                  Đang tải...
                </td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center">
                  Không có khách hàng
                </td>
              </tr>
            ) : (
                paginatedCustomers.map((cus, idx) => (
                <tr key={cus.maKhachHang || idx}>
                    <td className="text-center">{(currentPage - 1) * recordsPerPage + idx + 1}</td>
                  <td className="text-center">{cus.maKhachHang}</td>
                  <td className="text-center">{cus.hoTen}</td>
                  <td className="text-center">{cus.soDienThoai}</td>
                  <td className="text-center">{cus.email}</td>
                  <td className="text-center">{cus.ngaySinh ? new Date(cus.ngaySinh).toLocaleDateString() : ''}</td>
                  <td className="text-center">
                      <button className="btn btn-link p-1" title="Xem chi tiết" onClick={() => handleShowOrderDetail(cus)}>
                      <FaEye size={18} />
                    </button>
                    {/* Ẩn nút bật/tắt trạng thái cho khách hàng GUEST */}
                    {cus.maKhachHang !== "GUEST" && (
                    <button
                      className="btn btn-link p-1 ms-2"
                      style={{background: 'none', border: 'none', padding: 0}}
                      title={cus.trangThaiTaiKhoan === 1 || cus.trangThaiTaiKhoan === true ? "Khóa khách hàng" : "Mở khóa khách hàng"}
                        onClick={() => handleToggleTrangThai(cus)}
                    >
                      <span style={switchStyle}>
                        <span style={sliderStyle(cus.trangThaiTaiKhoan === 1 || cus.trangThaiTaiKhoan === true)}></span>
                        <span style={circleStyle(cus.trangThaiTaiKhoan === 1 || cus.trangThaiTaiKhoan === true)}></span>
                      </span>
                    </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                  margin: '0 2px',
                  padding: '2px 8px',
                  borderRadius: 6,
                  border: '1.5px solid #222',
                  background: '#fafbfc',
                  color: '#222',
                  fontSize: 15,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  outline: 'none',
                }}
              >
                <FaChevronLeft />
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  style={{
                    margin: '0 2px',
                    padding: '2px 10px',
                    borderRadius: 6,
                    border: currentPage === i + 1 ? '1.5px solid #7c3aed' : '1.5px solid #ccc',
                    background: currentPage === i + 1 ? '#7c3aed' : '#fff',
                    color: currentPage === i + 1 ? '#fff' : '#222',
                    fontWeight: currentPage === i + 1 ? 'bold' : 'normal',
                    fontSize: 14,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    outline: 'none',
                  }}
                  onMouseOver={e => e.currentTarget.style.background = currentPage === i + 1 ? '#7c3aed' : '#f3f4f6'}
                  onMouseOut={e => e.currentTarget.style.background = currentPage === i + 1 ? '#7c3aed' : '#fff'}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{
                  margin: '0 2px',
                  padding: '2px 8px',
                  borderRadius: 6,
                  border: '1.5px solid #222',
                  background: '#fafbfc',
                  color: '#222',
                  fontSize: 15,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  outline: 'none',
                }}
              >
                <FaChevronRight />
              </button>
            </div>
          )}
        </div>
      )}
      {/* Modal chi tiết đơn hàng */}
      {showOrderDetail && (
        <div className="modal show d-block" tabIndex="-1" style={{background: 'rgba(0,0,0,0.3)'}}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Danh sách đơn hàng của khách hàng</h5>
                <button type="button" className="btn-close" onClick={handleCloseOrderDetail}></button>
              </div>
              <div className="modal-body">
                <div className="mb-2"><b>Khách hàng:</b> {selectedCustomer?.hoTen} ({selectedCustomer?.maKhachHang})</div>
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Mã đơn hàng</th>
                        <th>Mã sản phẩm</th>
                        <th>Tên</th>
                        <th>Kích cỡ</th>
                        <th>Màu sắc</th>
                        <th>Chất liệu</th>
                        <th>Giá</th>
                        <th>Tên khuyến mãi</th>
                        <th>Tổng tiền hàng</th>
                        <th>Tổng thanh toán</th>
                        <th>Ngày đặt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderDetails && orderDetails.length > 0 ? orderDetails.map((item, idx) => (
                        <tr key={idx}>
                          <td>{item.maDonHang}</td>
                          <td>{item.maSanPham}</td>
                          <td>{item.tenSanPham}</td>
                          <td>{item.kichCo}</td>
                          <td>{item.mauSac}</td>
                          <td>{item.chatLieu}</td>
                          <td>{item.gia?.toLocaleString()}</td>
                          <td>{item.tenKhuyenMai || ''}</td>
                          <td>{item.tongTienHang?.toLocaleString()}</td>
                          <td>{item.tongThanhToan?.toLocaleString()}</td>
                          <td>{item.ngayDat ? new Date(item.ngayDat).toLocaleDateString() : ''}</td>
                        </tr>
                      )) : (
                        <tr><td colSpan={11} className="text-center">Không có đơn hàng</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseOrderDetail}>Đóng</button>
              </div>
            </div>
          </div>
      </div>
      )}
    </div>
  );
};

export default Customers;
