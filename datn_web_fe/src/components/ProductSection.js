import React from 'react';
import ProductCard from './ProductCard';
import '../styles/main.css';

// Dữ liệu mẫu cho từng loại sản phẩm, dùng link ảnh quần áo thực tế
const productImage = 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80';
const mockProducts = [
  {
    image: productImage,
    name: 'Áo Thun Local Brand Unisex Teelab Summer Trắng TS523',
    price: 210000,
    oldPrice: 300000,
    colors: ['#fff', '#000', '#1a1a1a', '#e74c3c']
  },
  {
    image: productImage,
    name: 'Áo Thun Local Brand Unisex Teelab Zabrion Original Tshirt',
    price: 246000,
    oldPrice: 350000,
    colors: ['#fff', '#000', '#2c3e50', '#e67e22']
  },
  {
    image: productImage,
    name: 'Áo Thun Local Brand Unisex Teelab Seasonal Tshirt',
    price: 195000,
    oldPrice: null,
    colors: ['#fff', '#000', '#2980b9']
  },
  {
    image: productImage,
    name: 'Áo Thun Local Brand Unisex Teelab Basic Tshirt',
    price: 210000,
    oldPrice: 300000,
    colors: ['#fff', '#000', '#8e44ad']
  }
];

const ProductSection = ({ sectionTitle }) => {
  return (
    <section className="product-section">
      <h2 className="product-section__title">{sectionTitle}</h2>
      <div className="product-section__list">
        {mockProducts.map((p, idx) => (
          <ProductCard key={idx} {...p} />
        ))}
      </div>
      <div className="product-section__more">
        <a href="#" className="product-section__more-link">Xem thêm</a>
      </div>
    </section>
  );
};

export default ProductSection; 