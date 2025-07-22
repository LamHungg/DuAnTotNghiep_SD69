import React, { useEffect, useState } from 'react';
import '../styles/main.css';
import { useNavigate } from 'react-router-dom';

const mockAddress = {
  name: 'Đặng Thị quyên',
  phone: '968 023 318',
  address: '18LK23 khu đô thị vân canh, Xã Vân Canh, Huyện Hoài Đức, Hà Nội',
};

const mockShipping = {
  method: 'Nhanh',
  fee: 25300,
  discount: 25300,
  voucher: 50000,
  estimate: '11 Tháng 7 - 12 Tháng 7',
};

const mockPayment = {
  method: 'Thanh toán khi nhận hàng',
};

const Checkout = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const cartData = localStorage.getItem('checkout_cart');
    const totalData = localStorage.getItem('checkout_total');
    setCart(cartData ? JSON.parse(cartData) : []);
    setTotal(totalData ? Number(totalData) : 0);
  }, []);

  const totalQty = cart.reduce((sum, i) => sum + i.quantity, 0);
  const totalOld = cart.reduce((sum, i) => sum + i.oldPrice * i.quantity, 0);
  const saving = totalOld - total;
  const shipping = mockShipping.fee - mockShipping.discount;
  const final = total - mockShipping.voucher + shipping;

  const handleAddressClick = () => {
    navigate('/profile?tab=address');
  };

  const handleOrder = () => {
    setShowPopup(true);
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-header">
          <button className="checkout-back" onClick={() => window.history.back()}>&larr;</button>
          <span className="checkout-title">Thanh toán</span>
        </div>
        <div onClick={handleAddressClick} style={{cursor: 'pointer'}} className="checkout-address">
          <span className="checkout-address-icon">📍</span>
          <span className="checkout-address-info">
            <b>{mockAddress.name}</b> (+84) {mockAddress.phone} <br />
            {mockAddress.address}
          </span>
        </div>
        <div className="checkout-products">
          {cart.map(item => (
            <div className="checkout-product" key={item.id}>
              <img src={item.image} alt={item.name} className="checkout-product-img" />
              <div className="checkout-product-info">
                <div className="checkout-product-name">{item.name}</div>
                <div className="checkout-product-variant">{item.variant}</div>
                <div className="checkout-product-prices">
                  <span className="checkout-product-price">₫{item.price.toLocaleString()}</span>
                  <span className="checkout-product-old">₫{item.oldPrice.toLocaleString()}</span>
                  <span className="checkout-product-qty">x{item.quantity}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="checkout-section">
          <div className="checkout-label">Phương thức vận chuyển</div>
          <div className="checkout-shipping-box">
            <span className="checkout-shipping-method">{mockShipping.method}</span>
            <span className="checkout-shipping-fee">{mockShipping.fee === 0 ? 'Miễn phí' : `₫${mockShipping.fee.toLocaleString()}`}</span>
            <span className="checkout-shipping-estimate">{mockShipping.estimate}</span>
          </div>
        </div>
        <div className="checkout-section">
          <div className="checkout-label">Phương thức thanh toán</div>
          <div className="checkout-payment-method">{mockPayment.method}</div>
        </div>
        <div className="checkout-section">
          <div className="checkout-label">Chi tiết thanh toán</div>
          <div className="checkout-detail-row">
            <span>Tổng tiền hàng</span>
            <span>₫{total.toLocaleString()}</span>
          </div>
          <div className="checkout-detail-row">
            <span>Tổng tiền phí vận chuyển</span>
            <span>₫{mockShipping.fee.toLocaleString()}</span>
          </div>
          <div className="checkout-detail-row">
            <span>Giảm giá phí vận chuyển</span>
            <span>-₫{mockShipping.discount.toLocaleString()}</span>
          </div>
          <div className="checkout-detail-row">
            <span>Tổng cộng Voucher giảm giá</span>
            <span>-₫{mockShipping.voucher.toLocaleString()}</span>
          </div>
          <div className="checkout-detail-row checkout-detail-total">
            <span>Tổng thanh toán</span>
            <span>₫{final.toLocaleString()}</span>
          </div>
        </div>
        <div className="checkout-bottom-bar">
          <div>
            <div className="checkout-bottom-total">Tổng cộng <span className="checkout-bottom-totalnum">₫{final.toLocaleString()}</span></div>
            <div className="checkout-bottom-saving">Tiết kiệm <span>₫{saving.toLocaleString()}</span></div>
          </div>
          <button onClick={handleOrder} style={{marginTop: 24, width: '100%', padding: '14px 0', background: '#ff6a00', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 18, cursor: 'pointer'}}>Đặt hàng</button>
        </div>
      </div>
      {/* Popup xác nhận đơn hàng */}
      {showPopup && (
        <div style={{position: 'fixed', top:0, left:0, right:0, bottom:0, background: 'rgba(0,0,0,0.18)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{background:'#fff', borderRadius: 16, maxWidth: 340, width: '90%', boxShadow: '0 2px 16px rgba(0,0,0,0.12)', padding: 20, position: 'relative'}}>
            <div style={{display:'flex', alignItems:'center', gap:12}}>
              <img src={cart[0]?.image || 'https://via.placeholder.com/60'} alt="sp" style={{width:60, height:60, borderRadius:10, objectFit:'cover'}} />
              <div style={{flex:1}}>
                <div style={{fontWeight:600, fontSize:16, color:'#222', marginBottom:2, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{cart[0]?.name || 'SET 2 Bông Tắm Tròn Cao Cấp 2 Màu...'}</div>
                <div style={{color:'#888', fontSize:14}}>{cart[0]?.variant || 'Chi 1 Bông Tắm SPAH6'} x1</div>
              </div>
            </div>
            <div style={{margin:'10px 0 0 0', color:'#888', fontSize:15, textDecoration:'line-through'}}>{cart[0]?.oldPrice ? cart[0].oldPrice.toLocaleString() + 'đ' : '25.000đ'}</div>
            <div style={{color:'#e53935', fontWeight:700, fontSize:18}}>{cart[0]?.price ? cart[0].price.toLocaleString() + 'đ' : '13.500đ'}</div>
            <div style={{margin:'10px 0 0 0', fontWeight:500}}>Tổng số tiền (1 sản phẩm): <span style={{color:'#e53935'}}>{cart[0]?.price ? cart[0].price.toLocaleString() + 'đ' : '13.500đ'}</span></div>
            <div style={{background:'#e8f7f0', color:'#1abc9c', borderRadius:8, padding:'10px 12px', margin:'16px 0 0 0', fontSize:15}}>
              Ngày giao hàng dự kiến: <b>16 Th07</b><br/>
              <span style={{color:'#888'}}>Đang chờ xác nhận đơn</span>
            </div>
            <span onClick={()=>setShowPopup(false)} style={{position:'absolute', top:10, right:14, fontSize:22, color:'#888', cursor:'pointer'}}>&times;</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout; 