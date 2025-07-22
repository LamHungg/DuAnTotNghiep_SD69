import React from 'react';
import '../styles/main.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__col footer__col--social">
          <div className="footer__brand">THEZMEN.VN từ các nền tảng khác nhau nhé!</div>
          <div className="footer__socials">
            <a href="#" className="footer__icon" aria-label="Facebook"><span role="img" aria-label="fb">📘</span></a>
            <a href="#" className="footer__icon" aria-label="Instagram"><span role="img" aria-label="ig">📸</span></a>
            <a href="#" className="footer__icon" aria-label="TikTok"><span role="img" aria-label="tt">🎵</span></a>
            <a href="#" className="footer__icon" aria-label="Shopee"><span role="img" aria-label="sp">🛒</span></a>
            <a href="#" className="footer__icon" aria-label="Lazada"><span role="img" aria-label="lz">📦</span></a>
          </div>
        </div>
        <div className="footer__col footer__col--about">
          <div className="footer__title">ABOUT US</div>
          <ul className="footer__list">
            <li><a href="#">Trang chủ</a></li>
            <li><a href="#">Tất cả sản phẩm</a></li>
            <li><a href="#">Bảng Size</a></li>
            <li><a href="#">Kiểm tra đơn hàng</a></li>
          </ul>
        </div>
        <div className="footer__col footer__col--policy">
          <div className="footer__title">CHÍNH SÁCH</div>
          <ul className="footer__list">
            <li><a href="#">Chính sách mua hàng</a></li>
            <li><a href="#">Chính sách bảo mật</a></li>
            <li><a href="#">Phương thức thanh toán</a></li>
            <li><a href="#">Chính sách giao hàng</a></li>
            <li><a href="#">Chính sách đổi trả</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 