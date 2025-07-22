import React from 'react';
import '../styles/main.css';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ image, name, price, oldPrice, colors }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/product-detail', {
      state: { image, name, price, oldPrice, colors }
    });
  };
  return (
    <div className="product-card" onClick={handleClick} style={{ cursor: 'pointer' }}>
      <div className="product-card__img-wrap">
        <img src={image} alt={name} className="product-card__img" />
      </div>
      <div className="product-card__colors">
        {colors && colors.map((c, i) => (
          <span key={i} className="product-card__color" style={{background: c}}></span>
        ))}
      </div>
      <div className="product-card__name">{name}</div>
      <div className="product-card__prices">
        <span className="product-card__price">{price.toLocaleString()}đ</span>
        {oldPrice && <span className="product-card__old-price">{oldPrice.toLocaleString()}đ</span>}
      </div>
    </div>
  );
};

export default ProductCard; 