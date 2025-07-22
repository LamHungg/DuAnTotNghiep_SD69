import React from 'react';
import Header from '../components/Header';
import Banner from '../components/Banner';
import CategoryNav from '../components/CategoryNav';
import ProductSection from '../components/ProductSection';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="home-page">
      <Header />
      <CategoryNav />
      <Banner />
      <section className="home-desc">
        <h2 className="home-desc__title">Enjoy Your Youth!</h2>
        <p className="home-desc__text">
          Không chỉ là thời trang, TEELAB còn là “phòng thí nghiệm” của tuổi trẻ, nơi nghiên cứu và cho ra đời những sản phẩm mang tên “youth”. Chúng mình luôn muốn truyền cảm hứng cho các bạn trẻ sống hết mình, mặc những gì mình thích và tự tin thể hiện cá tính.
        </p>
      </section>
      {/* Các section sản phẩm */}
      <ProductSection sectionTitle="Áo thun" />
      <ProductSection sectionTitle="Áo polo" />
      <ProductSection sectionTitle="Áo sơmi" />
      <ProductSection sectionTitle="Quần" />
      <ProductSection sectionTitle="Phụ kiện" />
      <Footer />
    </div>
  );
};

export default Home; 