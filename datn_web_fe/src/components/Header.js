import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUserCircle } from 'react-icons/fa';
import '../styles/main.css';

const Header = () => {
  const navigate = useNavigate();
  const handleAccountClick = () => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };
  return (
    <header className="header">
      <nav className="header__nav">
        <div className="header__nav-left">
          <Link to="/" className="header__nav-link">TRANG CHỦ</Link>
          <a className="header__nav-link" style={{cursor:'pointer'}} onClick={() => navigate('/size')}>SIZE</a>
          <a className="header__nav-link" style={{cursor:'pointer'}} onClick={() => navigate('/gioi-thieu')}>GIỚI THIỆU</a>
          <a href="#" className="header__nav-link">LIÊN HỆ</a>
        </div>
        <div className="header__logo">
          <span style={{color: '#007bff', fontWeight: 'bold', fontSize: '2.2rem', letterSpacing: 2}}>ZMEN</span>
        </div>
        <div className="header__nav-right">
          <div className="header__search">
            <input type="text" placeholder="Tìm kiếm sản phẩm..." className="header__search-input" />
            <button className="header__search-btn">
              <span role="img" aria-label="search">🔍</span>
            </button>
          </div>
          <span className="header__icon-link" title="Tài khoản" onClick={handleAccountClick} style={{cursor: 'pointer'}}>
            <FaUserCircle size={24} />
          </span>
          <span className="header__icon-link" title="Giỏ hàng" onClick={() => navigate('/cart')} style={{cursor: 'pointer'}}>
            <FaShoppingCart size={22} />
          </span>
        </div>
      </nav>
    </header>
  );
};

export default Header; 