import React, { useState } from 'react';
import '../styles/main.css';
import { useNavigate } from 'react-router-dom';
// import Checkout from './muahang';

const mockCart = [
  {
    id: 1,
    name: 'Áo Thun Big Boxy Local Brand AIMÉ... ',
    image: 'https://cf.shopee.vn/file/sg-11134201-22110-2jv7k1k2v8jv2d',
    variant: 'Xám - XX cỡ mỹ, L',
    price: 169000,
    oldPrice: 260000,
    quantity: 1,
    checked: false,
  },
  {
    id: 2,
    name: 'Quần đùi biker short dáng ôm lưng...',
    image: 'https://cf.shopee.vn/file/sg-11134201-22110-2jv7k1k2v8jv2d',
    variant: 'Đen, S',
    price: 45000,
    oldPrice: 99000,
    quantity: 1,
    checked: false,
  },
];

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

const Cart = () => {
  const [cart, setCart] = useState(mockCart);
  const [selectAll, setSelectAll] = useState(false);
  const navigate = useNavigate();

  const handleCheck = (id) => {
    setCart(cart.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };
  const handleSelectAll = () => {
    const newVal = !selectAll;
    setSelectAll(newVal);
    setCart(cart.map(item => ({ ...item, checked: newVal })));
  };
  const handleQty = (id, delta) => {
    setCart(cart.map(item => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  };
  const total = cart.filter(i => i.checked).reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalQty = cart.filter(i => i.checked).reduce((sum, i) => sum + i.quantity, 0);
  const checkedCart = cart.filter(i => i.checked);

  const handleBuy = () => {
    // Lưu cart đã chọn vào localStorage để truyền sang trang muahang
    localStorage.setItem('checkout_cart', JSON.stringify(checkedCart));
    localStorage.setItem('checkout_total', total);
    navigate('/muahang');
  };

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-list">
          {cart.map(item => (
            <div className="cart-item" key={item.id}>
              <input type="checkbox" checked={item.checked} onChange={() => handleCheck(item.id)} />
              <img src={item.image} alt={item.name} className="cart-img" />
              <div className="cart-info">
                <div className="cart-name">{item.name}</div>
                <div className="cart-variant">{item.variant}</div>
                <div className="cart-price">
                  <span className="cart-price-main">₫{item.price.toLocaleString()}</span>
                  <span className="cart-price-old">₫{item.oldPrice.toLocaleString()}</span>
                </div>
                <div className="cart-qty">
                  <button onClick={() => handleQty(item.id, -1)} className="cart-qty-btn">-</button>
                  <span className="cart-qty-num">{item.quantity}</span>
                  <button onClick={() => handleQty(item.id, 1)} className="cart-qty-btn">+</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="cart-bottom-bar">
          <div className="cart-bottom-row">
            <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
            <span className="cart-bottom-all">Tất cả</span>
            <span className="cart-bottom-total">Tổng cộng <span className="cart-bottom-totalnum">₫{total.toLocaleString()}</span></span>
            <button className="cart-buy-btn" onClick={handleBuy} disabled={checkedCart.length === 0}>Mua hàng ({totalQty})</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart; 