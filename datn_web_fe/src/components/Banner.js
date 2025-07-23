import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import '../styles/main.css';

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80',
    slogan: 'THỜI TRANG NAM NỮ HIỆN ĐẠI',
    desc: 'BST mới nhất, phong cách trẻ trung, năng động',
    cta: 'Mua ngay',
  },
  {
    image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
    slogan: 'SALE UP TO 50%',
    desc: 'Ưu đãi cực lớn cho mùa hè',
    cta: 'Xem ưu đãi',
  },
  {
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
    slogan: 'PHỤ KIỆN THỜI TRANG',
    desc: 'Túi xách, mũ, kính, đồng hồ...',
    cta: 'Khám phá ngay',
  },
];

const Banner = () => {
  const [current, setCurrent] = useState(0);
  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="banner">
      <div className="banner__carousel">
        <button className="banner__arrow banner__arrow--left" onClick={prevSlide} aria-label="Trước">
          <FaChevronLeft size={22} />
        </button>
        <div className="banner__slide" style={{backgroundImage: `url(${slides[current].image})`}}>
          <div className="banner__overlay">
            <div className="banner__content">
              <div className="banner__slogan">{slides[current].slogan}</div>
              <div className="banner__desc">{slides[current].desc}</div>
              <button className="banner__cta">{slides[current].cta}</button>
            </div>
          </div>
        </div>
        <button className="banner__arrow banner__arrow--right" onClick={nextSlide} aria-label="Sau">
          <FaChevronRight size={22} />
        </button>
      </div>
      <div className="banner__dots">
        {slides.map((_, idx) => (
          <span key={idx} className={`banner__dot${idx === current ? ' active' : ''}`} onClick={() => setCurrent(idx)}></span>
        ))}
      </div>
    </section>
  );
};

export default Banner; 