import React, { useState, useRef } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/main.css';
import { useNavigate, useLocation } from 'react-router-dom';

// Dữ liệu mẫu cho các combobox địa chỉ
const provinces = [
  { value: '', label: 'Chọn tỉnh/thành phố' },
  { value: 'hanoi', label: 'Hà Nội' },
  { value: 'hcm', label: 'Hồ Chí Minh' },
];
const districts = {
  hanoi: [
    { value: '', label: 'Chọn quận/huyện' },
    { value: 'caugiay', label: 'Cầu Giấy' },
    { value: 'dongda', label: 'Đống Đa' },
  ],
  hcm: [
    { value: '', label: 'Chọn quận/huyện' },
    { value: 'q1', label: 'Quận 1' },
    { value: 'q3', label: 'Quận 3' },
  ],
};
const wards = {
  caugiay: [
    { value: '', label: 'Chọn phường/xã' },
    { value: 'dichvong', label: 'Dịch Vọng' },
    { value: 'nghia_do', label: 'Nghĩa Đô' },
  ],
  dongda: [
    { value: '', label: 'Chọn phường/xã' },
    { value: 'catlinh', label: 'Cát Linh' },
    { value: 'quoc_tu_giam', label: 'Quốc Tử Giám' },
  ],
  q1: [
    { value: '', label: 'Chọn phường/xã' },
    { value: 'bennghe', label: 'Bến Nghé' },
    { value: 'benthanh', label: 'Bến Thành' },
  ],
  q3: [
    { value: '', label: 'Chọn phường/xã' },
    { value: 'vo_thi_sau', label: 'Võ Thị Sáu' },
    { value: 'ward6', label: 'Phường 6' },
  ],
};

const orderTabs = [
  { key: 'cho_xac_nhan', label: 'Chờ xác nhận' },
  { key: 'dang_giao', label: 'Đang giao' },
  { key: 'da_nhan', label: 'Đã nhận' },
];
const fakeOrders = [
  {
    shop: 'USASTore',
    status: 'Chờ xác nhận',
    products: [
      {
        name: 'SET 2 Bông Tắm Tròn Cao Cấp 2 Màu...',
        variant: 'Chỉ 1 Bông Tắm SPAH6',
        img: 'https://down-vn.img.susercontent.com/file/sg-11134201-7rbk2-lq8w7w1k2k1v7d',
        qty: 1,
        price: 13500,
        oldPrice: 25000,
      },
    ],
    total: 13500,
    delivery: 'Ngày giao hàng dự kiến: 16 Th07',
    deliveryStatus: 'Đơn đang chờ xác nhận',
    canTrack: false,
    canReturn: false,
    canConfirm: false,
  },
  {
    shop: 'Kính Mắt Lily Official Store',
    status: 'Đang giao',
    products: [
      {
        name: 'Nước xịt rửa mắt kính LILYEYEWEAR c...',
        variant: 'Chai Xịt Lily',
        img: 'https://down-vn.img.susercontent.com/file/sg-11134201-7rbk2-lq8w7w1k2k1v7d',
        qty: 2,
        price: 9500,
        oldPrice: 15000,
      },
    ],
    total: 17480,
    delivery: 'Đơn vị vận chuyển đang giao',
    deliveryStatus: 'Dự kiến giao 15 Th07',
    canTrack: true,
    canReturn: false,
    canConfirm: true,
  },
  {
    shop: 'Niva Lipzo Official Store',
    status: 'Đã nhận',
    products: [
      {
        name: '[TIẾT KIỆM 50%] Bộ Đôi Bàn Chải Lip...',
        variant: 'Bộ Đôi Sensitive',
        img: 'https://down-vn.img.susercontent.com/file/sg-11134201-7rbk2-lq8w7w1k2k1v7d',
        qty: 1,
        price: 8200,
        oldPrice: 17000,
      },
    ],
    total: 8200,
    delivery: 'Đã nhận hàng ngày 14 Th07',
    deliveryStatus: '',
    canTrack: false,
    canReturn: true,
    canConfirm: false,
  },
];

const Profile = () => {
  const location = useLocation();
  const [tab, setTab] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get('tab') === 'address' ? 'address' : 'profile';
  });
  const navigate = useNavigate();
  // Profile state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [avatar, setAvatar] = useState(null);
  const fileInputRef = useRef();

  // Address state
  const [addressName, setAddressName] = useState('');
  const [addressPhone, setAddressPhone] = useState('');
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [ward, setWard] = useState('');
  const [addressDetail, setAddressDetail] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [addressType, setAddressType] = useState('Văn Phòng');

  // Danh sách địa chỉ (fake)
  const [addressList, setAddressList] = useState([
    {
      name: 'Nguyễn Văn A',
      phone: '0912345678',
      province: 'Hà Nội',
      district: 'Cầu Giấy',
      ward: 'Dịch Vọng',
      detail: 'Số 1, Trần Đăng Ninh',
      isDefault: true,
      type: 'Nhà Riêng',
    },
    {
      name: 'Trần Thị B',
      phone: '0987654321',
      province: 'Hồ Chí Minh',
      district: 'Quận 1',
      ward: 'Bến Nghé',
      detail: '12 Nguyễn Huệ',
      isDefault: false,
      type: 'Văn Phòng',
    },
  ]);
  const [selectedAddressIdx, setSelectedAddressIdx] = useState(0); // Mặc định chọn địa chỉ đầu tiên

  const [orderTab, setOrderTab] = useState('cho_giao');

  // Nếu URL thay đổi (user chuyển tab từ nơi khác), cập nhật tab
  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('tab') === 'address') setTab('address');
    if (params.get('tab') === 'profile') setTab('profile');
  }, [location.search]);

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setAvatar(ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset district, ward khi chọn lại tỉnh/thành phố
  const handleProvinceChange = (e) => {
    setProvince(e.target.value);
    setDistrict('');
    setWard('');
  };
  const handleDistrictChange = (e) => {
    setDistrict(e.target.value);
    setWard('');
  };

  const handleAddAddress = () => {
    // Lấy label từ value
    const getLabel = (arr, val) => (arr.find(i => i.value === val)?.label || '');
    setAddressList([
      ...addressList,
      {
        name: addressName,
        phone: addressPhone,
        province: getLabel(provinces, province),
        district: getLabel(districts[province] || [], district),
        ward: getLabel(wards[district] || [], ward),
        detail: addressDetail,
        isDefault,
        type: addressType,
      },
    ]);
    // Reset form
    setAddressName('');
    setAddressPhone('');
    setProvince('');
    setDistrict('');
    setWard('');
    setAddressDetail('');
    setIsDefault(false);
    setAddressType('Văn Phòng');
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  const handleUseAddress = () => {
    localStorage.setItem('selectedAddressIdx', selectedAddressIdx);
    navigate('/muahang');
  };

  return (
    <div style={{ background: '#fff', minHeight: '100vh', paddingBottom: 40 }}>
      <Header />
      <div style={{ maxWidth: 430, margin: '0 auto', background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden', marginTop: 32, marginBottom: 32, padding: 0 }}>
        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1.5px solid #f0f0f0', background: '#fafbfc' }}>
          <button onClick={() => setTab('profile')} style={{ flex: 1, padding: 16, fontWeight: 600, fontSize: 17, background: 'none', border: 'none', borderBottom: tab==='profile' ? '2.5px solid #ff6a00' : '2.5px solid transparent', color: tab==='profile' ? '#ff6a00' : '#888', cursor: 'pointer', outline: 'none' }}>Profile</button>
          <button onClick={() => setTab('address')} style={{ flex: 1, padding: 16, fontWeight: 600, fontSize: 17, background: 'none', border: 'none', borderBottom: tab==='address' ? '2.5px solid #ff6a00' : '2.5px solid transparent', color: tab==='address' ? '#ff6a00' : '#888', cursor: 'pointer', outline: 'none' }}>Địa chỉ</button>
          <button onClick={() => setTab('orders')} style={{ flex: 1, padding: 16, fontWeight: 600, fontSize: 17, background: 'none', border: 'none', borderBottom: tab==='orders' ? '2.5px solid #ff6a00' : '2.5px solid transparent', color: tab==='orders' ? '#ff6a00' : '#888', cursor: 'pointer', outline: 'none' }}>Đơn đã mua</button>
        </div>
        {/* Tab content */}
        {tab === 'profile' && (
          <div style={{ padding: '32px 24px' }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{ width: 84, height: 84, borderRadius: '50%', background: '#eee', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', border: '3px solid #fff', cursor: 'pointer' }} onClick={handleAvatarClick}>
                {avatar ? (
                  <img src={avatar} alt="avatar" style={{ width: 84, height: 84, borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: 44, color: '#bbb' }}>&#128100;</span>
                )}
                <span style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', background: '#0008', color: '#fff', fontSize: 13, borderRadius: 12, padding: '2px 10px', cursor: 'pointer' }}>Thêm ảnh</span>
                <input type="file" accept="image/*" style={{ display: 'none' }} ref={fileInputRef} onChange={handleFileChange} />
              </div>
              <div style={{ fontWeight: 600, fontSize: 22, marginTop: 12 }}>Sửa Hồ sơ</div>
            </div>
            <form>
              <ProfileField label="Họ tên">
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Nhập họ tên"
                  style={inputStyle}
                />
              </ProfileField>
              <ProfileField label="Email">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Nhập email"
                  style={inputStyle}
                />
              </ProfileField>
              <ProfileField label="Giới tính">
                <select value={gender} onChange={e => setGender(e.target.value)} style={inputStyle}>
                  <option value="">Chọn giới tính</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </ProfileField>
            </form>
            <button onClick={handleLogout} style={{marginTop: 24, width: '100%', padding: '12px 0', background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 16, cursor: 'pointer'}}>Đăng xuất</button>
          </div>
        )}
        {tab === 'address' && (
          <div style={{ padding: '0 0 24px 0', background: '#fafbfc', minHeight: 520 }}>
            {/* Header giả lập */}
            <div style={{ position: 'relative', background: '#fff', padding: '18px 0 0 0', textAlign: 'center', borderBottom: '1.5px solid #f0f0f0', marginBottom: 0 }}>
              <span style={{ position: 'absolute', left: 16, top: 18, fontSize: 22, color: '#ff6a00', cursor: 'pointer' }}>&lt;</span>
              <span style={{ fontWeight: 600, fontSize: 20, color: '#222' }}>Địa chỉ mới</span>
            </div>
            {/* Form địa chỉ */}
            <div style={{ background: '#fff', borderRadius: 12, margin: '18px 18px 0 18px', padding: '18px 16px 8px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
              <div style={{ color: '#888', fontSize: 14, marginBottom: 10 }}>Địa chỉ (dùng thông tin trước sáp nhập)</div>
              <div style={{ marginBottom: 14 }}>
                <input type="text" value={addressName} onChange={e => setAddressName(e.target.value)} placeholder="Họ và tên" style={inputStyle} />
              </div>
              <div style={{ marginBottom: 14 }}>
                <input type="text" value={addressPhone} onChange={e => setAddressPhone(e.target.value)} placeholder="Số điện thoại" style={inputStyle} />
              </div>
              <div style={{ marginBottom: 14 }}>
                <select value={province} onChange={handleProvinceChange} style={inputStyle}>
                  {provinces.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 14 }}>
                <select value={district} onChange={handleDistrictChange} style={inputStyle} disabled={!province}>
                  {(districts[province] || [{ value: '', label: 'Chọn quận/huyện' }]).map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 14 }}>
                <select value={ward} onChange={e => setWard(e.target.value)} style={inputStyle} disabled={!district}>
                  {(wards[district] || [{ value: '', label: 'Chọn phường/xã' }]).map(w => <option key={w.value} value={w.value}>{w.label}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 14 }}>
                <input type="text" value={addressDetail} onChange={e => setAddressDetail(e.target.value)} placeholder="Tên đường, Tòa nhà, Số nhà." style={inputStyle} />
              </div>
            </div>
            {/* Đặt làm mặc định & loại địa chỉ */}
            <div style={{ background: '#fff', borderRadius: 12, margin: '18px 18px 0 18px', padding: '18px 16px 8px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <span style={{ fontSize: 16, color: '#222' }}>Đặt làm địa chỉ mặc định</span>
                <label style={{ display: 'inline-block', position: 'relative', width: 44, height: 24 }}>
                  <input type="checkbox" checked={isDefault} onChange={e => setIsDefault(e.target.checked)} style={{ opacity: 0, width: 0, height: 0 }} />
                  <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, background: isDefault ? '#ff6a00' : '#ccc', borderRadius: 24, transition: '0.2s' }}></span>
                  <span style={{ position: 'absolute', left: isDefault ? 22 : 2, top: 2, width: 20, height: 20, background: '#fff', borderRadius: '50%', transition: '0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}></span>
                </label>
              </div>
              <div style={{ fontSize: 16, color: '#222', marginBottom: 10 }}>Loại địa chỉ:</div>
              <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
                <button type="button" onClick={() => setAddressType('Văn Phòng')} style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: addressType==='Văn Phòng' ? '2px solid #ff6a00' : '1.5px solid #eee', background: addressType==='Văn Phòng' ? '#fff7ed' : '#fafbfc', color: addressType==='Văn Phòng' ? '#ff6a00' : '#222', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Văn Phòng</button>
                <button type="button" onClick={() => setAddressType('Nhà Riêng')} style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: addressType==='Nhà Riêng' ? '2px solid #ff6a00' : '1.5px solid #eee', background: addressType==='Nhà Riêng' ? '#fff7ed' : '#fafbfc', color: addressType==='Nhà Riêng' ? '#ff6a00' : '#222', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Nhà Riêng</button>
              </div>
            </div>
            {/* Nút Add */}
            <div style={{ margin: '18px 18px 0 18px', textAlign: 'right' }}>
              <button onClick={handleAddAddress} style={{ background: '#ff6a00', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 32px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>Add</button>
            </div>
            {/* Danh sách địa chỉ đã lưu */}
            <div style={{ margin: '24px 18px 0 18px' }}>
              <div style={{ fontWeight: 600, fontSize: 17, marginBottom: 10 }}>Địa chỉ đã lưu</div>
              {addressList.map((addr, idx) => (
                <div key={idx} style={{ background: selectedAddressIdx === idx ? '#fff7ed' : '#fff', borderRadius: 10, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', padding: 14, marginBottom: 12, border: addr.isDefault ? '2px solid #ff6a00' : '1.5px solid #eee', display: 'flex', alignItems: 'flex-start', cursor: 'pointer', position: 'relative' }} onClick={() => setSelectedAddressIdx(idx)}>
                  <input type="radio" checked={selectedAddressIdx === idx} onChange={() => setSelectedAddressIdx(idx)} style={{ marginRight: 14, marginTop: 4, accentColor: '#ff6a00' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, color: '#222', marginBottom: 2 }}>{addr.name} <span style={{ color: '#888', fontWeight: 400 }}>({addr.phone})</span> {addr.isDefault && <span style={{ color: '#ff6a00', fontWeight: 600, fontSize: 13, marginLeft: 6 }}>[Mặc định]</span>}</div>
                    <div style={{ color: '#444', fontSize: 15 }}>{[addr.detail, addr.ward, addr.district, addr.province].filter(Boolean).join(', ')}</div>
                    <div style={{ color: '#888', fontSize: 14, marginTop: 2 }}>Loại: {addr.type}</div>
                  </div>
                </div>
              ))}
              <button onClick={handleUseAddress} style={{marginTop: 10, width: '100%', padding: '12px 0', background: '#ff6a00', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 16, cursor: 'pointer'}}>Sử dụng địa chỉ này</button>
            </div>
          </div>
        )}
        {tab === 'orders' && (
          <div style={{ background: '#fafbfc', minHeight: 520, padding: '0 0 24px 0' }}>
            {/* Tabs trạng thái đơn */}
            <div style={{ display: 'flex', gap: 0, borderBottom: '1.5px solid #f0f0f0', background: '#fff', position: 'sticky', top: 0, zIndex: 2 }}>
              {orderTabs.map(t => (
                <button key={t.key} onClick={() => setOrderTab(t.key)} style={{ flex: 1, padding: 14, fontWeight: 600, fontSize: 16, background: 'none', border: 'none', borderBottom: orderTab===t.key ? '2.5px solid #ff6a00' : '2.5px solid transparent', color: orderTab===t.key ? '#ff6a00' : '#888', cursor: 'pointer', outline: 'none' }}>{t.label}</button>
              ))}
            </div>
            {/* Danh sách đơn hàng */}
            <div style={{ padding: '18px 0' }}>
              {fakeOrders.filter(o => (
                (orderTab==='cho_xac_nhan' && o.status==='Chờ xác nhận') ||
                (orderTab==='dang_giao' && o.status==='Đang giao') ||
                (orderTab==='da_nhan' && o.status==='Đã nhận')
              )).map((order, idx) => (
                <div key={idx} style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', margin: '0 18px 18px 18px', padding: 18 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ fontWeight: 600, color: '#222', fontSize: 16 }}>✻ {order.shop} ✻</div>
                    <div style={{ color: order.status==='Chờ xác nhận' ? '#ff9800' : order.status==='Đang giao' ? '#2196f3' : '#43a047', fontWeight: 600 }}>{order.status}</div>
                  </div>
                  {order.products.map((p, i) => (
                    <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
                      <img src={p.img} alt={p.name} style={{ width: 54, height: 54, borderRadius: 8, objectFit: 'cover', background: '#fafafa' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, color: '#222', fontSize: 15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                        <div style={{ color: '#888', fontSize: 14 }}>{p.variant} x{p.qty}</div>
                        <div style={{ color: '#e53935', fontWeight: 700, fontSize: 16 }}>{p.price.toLocaleString()}<span style={{ fontWeight: 400, color: '#888', fontSize: 14, marginLeft: 8, textDecoration: 'line-through' }}>{p.oldPrice ? p.oldPrice.toLocaleString() : ''}</span></div>
                      </div>
                    </div>
                  ))}
                  <div style={{ fontWeight: 600, color: '#222', fontSize: 15, margin: '8px 0 0 0' }}>Tổng số tiền ({order.products.length} sản phẩm): <span style={{ color: '#e53935' }}>{order.total.toLocaleString()}</span></div>
                  <div style={{ background: '#e8f7f0', color: '#1abc9c', borderRadius: 8, padding: '10px 12px', margin: '14px 0 0 0', fontSize: 15 }}>
                    {order.delivery}<br />
                    <span style={{ color: '#888' }}>{order.deliveryStatus}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 12, marginTop: 14 }}>
                    {order.canTrack && <button style={{ flex: 1, border: '1.5px solid #2196f3', color: '#2196f3', background: '#fff', borderRadius: 8, padding: '10px 0', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Theo dõi đơn</button>}
                    {order.canReturn && <button style={{ flex: 1, border: '1.5px solid #ff6a00', color: '#ff6a00', background: '#fff', borderRadius: 8, padding: '10px 0', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Trả hàng/Hoàn tiền</button>}
                    {order.canConfirm && <button style={{ flex: 1, border: '1.5px solid #43a047', color: '#43a047', background: '#fff', borderRadius: 8, padding: '10px 0', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Đã nhận được hàng</button>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: 8,
  border: '1.5px solid #eee',
  fontSize: 16,
  marginTop: 6,
  marginBottom: 2,
  outline: 'none',
  background: '#fafbfc',
};

const ProfileField = ({ label, children }) => (
  <div style={{ marginBottom: 22 }}>
    <div style={{ fontWeight: 500, color: '#222', marginBottom: 2 }}>{label}</div>
    {children}
  </div>
);

export default Profile; 