import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { getFeaturedProducts } from "../services/homeService";
import { useNavigate } from "react-router-dom";
import "../styles/main.css";

const FeaturedProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch featured products
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const data = await getFeaturedProducts();

        // Xử lý dữ liệu đã gộp từ backend (giống như Products.js)
        const processedProducts = data.map((product) => {
          // Tính toán giá thấp nhất và cao nhất từ variants
          const prices = product.variants?.map((v) => v.gia || v.price) || [];
          const minPrice =
            prices.length > 0
              ? Math.min(...prices)
              : product.gia || product.price;
          const maxPrice =
            prices.length > 0
              ? Math.max(...prices)
              : product.gia || product.price;

          // Tính toán tổng số lượng tồn kho
          const totalStock =
            product.variants?.reduce(
              (sum, v) => sum + (v.soLuong || v.stock || 0),
              0
            ) || 0;

          // Tính toán tổng đã bán
          const totalSold =
            product.variants?.reduce(
              (sum, v) => sum + (v.daBan || v.sold || 0),
              0
            ) ||
            product.daBan ||
            product.sold ||
            0;

          return {
            ...product,
            minPrice,
            maxPrice,
            totalStock,
            totalSold,
            // Đảm bảo các trường cần thiết
            id: product.id,
            maSanPham: product.maSanPham,
            name: product.tenSanPham || product.name,
            category: product.tenDanhMuc || product.category,
            image: product.hinhAnh?.[0] || product.image,
            price: product.gia || product.price,
            oldPrice: product.giaCu || product.oldPrice,
            rating: product.rating || 4.5,
            sold: product.daBan || product.sold || 0,
            colors: product.colors || [],
            sizes: product.sizes || [],
            variants: product.variants || [],
          };
        });

        setFeaturedProducts(processedProducts);
      } catch (error) {
        console.error("Error fetching featured products:", error);
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const handleViewAll = () => {
    navigate("/products", { state: { featured: true } });
  };

  if (loading) {
    return (
      <section className="featured-products">
        <div className="featured-products__container">
          <div className="featured-products__header">
            <h2 className="featured-products__title">
              <span className="featured-products__title-icon">🔥</span>
              Sản phẩm nổi bật
            </h2>
            <p className="featured-products__subtitle">
              Những sản phẩm được yêu thích nhất với ưu đãi đặc biệt
            </p>
          </div>
          <div className="featured-products__grid">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="product-card" style={{ opacity: 0.5 }}>
                <div className="product-card__img-wrap">
                  <div
                    style={{
                      width: "100%",
                      height: "280px",
                      background: "rgba(255,255,255,0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      borderRadius: "20px",
                    }}
                  >
                    Đang tải...
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (featuredProducts.length === 0) {
    return null;
  }

  return (
    <section className="featured-products">
      <div className="featured-products__container">
        <div className="featured-products__header">
          <h2 className="featured-products__title">
            <span className="featured-products__title-icon">🔥</span>
            Sản phẩm nổi bật
          </h2>
          <p className="featured-products__subtitle">
            Những sản phẩm được yêu thích nhất với ưu đãi đặc biệt
          </p>
        </div>

        <div className="featured-products__grid">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              maSanPham={product.maSanPham}
              image={product.image}
              name={product.name}
              price={product.minPrice}
              oldPrice={product.oldPrice}
              colors={product.colors}
              sizes={product.sizes}
              rating={product.rating}
              sold={product.totalSold}
              variants={product.variants}
              totalStock={product.totalStock}
              viewMode="grid"
              discount={product.discount}
            />
          ))}
        </div>

        <div className="featured-products__footer">
          <button
            className="featured-products__view-all"
            onClick={handleViewAll}
          >
            Xem tất cả sản phẩm nổi bật
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
