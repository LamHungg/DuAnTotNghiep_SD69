import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Banner from "../components/Banner";
import CategoryNav from "../components/CategoryNav";
import FeaturedProducts from "../components/FeaturedProducts";
import ProductSection from "../components/ProductSection";
import Statistics from "../components/Statistics";
import Footer from "../components/Footer";
import PromotionBanner from "../components/PromotionBanner";
import {
  FaArrowRight,
  FaStar,
  FaFire,
  FaTruck,
  FaShieldAlt,
  FaHeadset,
} from "react-icons/fa";

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={`home-page ${isVisible ? "visible" : ""}`}>
      <Header />
      <PromotionBanner />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Thời Trang Thể Thao
              <span className="hero-highlight"> Hiện Đại</span>
            </h1>
            <p className="hero-subtitle">
              Khám phá bộ sưu tập thể thao mới nhất với phong cách năng động,
              thoải mái. Chất lượng cao, phù hợp cho mọi hoạt động thể thao.
            </p>
            <div className="hero-actions">
              <Link to="/products" className="btn-primary">
                Mua sắm ngay
                <FaArrowRight />
              </Link>
              <Link to="/gioi-thieu" className="btn-secondary">
                Tìm hiểu thêm
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-image-container">
              <img
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=100"
                alt="Thời trang thể thao nam hiện đại"
                className="hero-main-image"
              />
              <div className="floating-card card-1">
                <FaStar />
                <span>4.9/5</span>
              </div>
              <div className="floating-card card-2">
                <FaFire />
                <span>Hot Sale</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <h2>Danh Mục Thể Thao</h2>
            <p>Chọn danh mục thể thao bạn yêu thích</p>
          </div>
          <CategoryNav />
        </div>
      </section>

      {/* Banner Section */}
      <section className="banner-section">
        <Banner />
      </section>

      {/* Featured Products */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2>Sản Phẩm Thể Thao Nổi Bật</h2>
            <p>Những sản phẩm thể thao được yêu thích nhất</p>
          </div>
          <FeaturedProducts />
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>Về ZMEN Sports</h2>
              <p>
                Không chỉ là thời trang, ZMEN Sports còn là "phòng thí nghiệm"
                của thể thao, nơi nghiên cứu và cho ra đời những sản phẩm thể
                thao chất lượng cao. Chúng mình luôn muốn truyền cảm hứng cho
                các bạn trẻ sống năng động, tập luyện thể thao và tự tin thể
                hiện phong cách.
              </p>
              <div className="about-stats">
                <div className="stat-item">
                  <span className="stat-number">5+</span>
                  <span className="stat-label">Năm kinh nghiệm</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">10k+</span>
                  <span className="stat-label">Khách hàng</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">500+</span>
                  <span className="stat-label">Sản phẩm</span>
                </div>
              </div>
            </div>
            <div className="about-image">
              <div className="about-image-container">
                <img
                  src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=100"
                  alt="ZMEN Sports Store"
                  className="about-main-image"
                />
                <div className="about-overlay">
                  <div className="about-overlay-content">
                    <h3>ZMEN Sports</h3>
                    <p>Nơi tạo nên phong cách thể thao</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FaTruck />
              </div>
              <h3>Giao hàng nhanh</h3>
              <p>Giao hàng toàn quốc trong 2-3 ngày</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaShieldAlt />
              </div>
              <h3>Chất lượng đảm bảo</h3>
              <p>100% sản phẩm chính hãng, chất lượng cao</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaHeadset />
              </div>
              <h3>Hỗ trợ 24/7</h3>
              <p>Đội ngũ CSKH chuyên nghiệp, tận tâm</p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="stats-section">
        <Statistics />
      </section>

      {/* Product Sections */}
      <section className="products-section">
        <div className="container">
          <div
            className="section-header"
            style={{ textAlign: "center", marginBottom: "60px" }}
          >
            <h2
              style={{
                fontSize: "2.5rem",
                fontWeight: "700",
                color: "#333",
                marginBottom: "16px",
              }}
            >
              Sản phẩm nổi bật
            </h2>
            <p
              style={{
                fontSize: "1.1rem",
                color: "#666",
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              Khám phá các sản phẩm thể thao chất lượng cao được yêu thích nhất
            </p>
          </div>
          <ProductSection sectionTitle="Áo thun" />
          <ProductSection sectionTitle="Áo polo" />
          <ProductSection sectionTitle="Áo sơmi" />
          <ProductSection sectionTitle="Quần" />
          <ProductSection sectionTitle="Áo khoác" />
          <ProductSection sectionTitle="Phụ kiện" />
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Sẵn sàng tập luyện?</h2>
            <p>
              Khám phá bộ sưu tập thể thao mới nhất với nhiều ưu đãi hấp dẫn
            </p>
            <Link to="/products" className="btn-primary btn-large">
              Xem tất cả sản phẩm thể thao
              <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
