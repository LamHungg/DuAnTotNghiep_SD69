import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getBanners } from "../services/homeService";
import "../styles/main.css";

const Banner = () => {
  const [current, setCurrent] = useState(0);
  const [bannerData, setBannerData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch banner data
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const data = await getBanners();
        setBannerData(data);
      } catch (error) {
        console.error("Error fetching banners:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // Auto slide
  useEffect(() => {
    if (bannerData.length === 0) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % bannerData.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [bannerData.length]);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % bannerData.length);
  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + bannerData.length) % bannerData.length);

  const handleCTAClick = (link) => {
    navigate(link);
  };

  if (loading) {
    return (
      <section className="banner">
        <div className="banner__carousel">
          <div className="banner__slide" style={{ background: "#f0f0f0" }}>
            <div className="banner__overlay">
              <div className="banner__content">
                <div className="banner__slogan">Đang tải...</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (bannerData.length === 0) {
    return null;
  }

  return (
    <section className="banner">
      <div className="banner__carousel">
        <button
          className="banner__arrow banner__arrow--left"
          onClick={prevSlide}
          aria-label="Trước"
        >
          <FaChevronLeft size={22} />
        </button>

        <div
          className="banner__slide"
          style={{ backgroundImage: `url(${bannerData[current].image})` }}
        >
          <div className="banner__overlay">
            <div className="banner__content">
              <div className="banner__slogan">{bannerData[current].title}</div>
              <div className="banner__desc">{bannerData[current].subtitle}</div>
              <button
                className="banner__cta"
                onClick={() => handleCTAClick(bannerData[current].buttonLink)}
              >
                {bannerData[current].buttonText}
              </button>
            </div>
          </div>
        </div>

        <button
          className="banner__arrow banner__arrow--right"
          onClick={nextSlide}
          aria-label="Sau"
        >
          <FaChevronRight size={22} />
        </button>
      </div>

      <div className="banner__dots">
        {bannerData.map((_, idx) => (
          <span
            key={idx}
            className={`banner__dot${idx === current ? " active" : ""}`}
            onClick={() => setCurrent(idx)}
          ></span>
        ))}
      </div>
    </section>
  );
};

export default Banner;
