import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { getProductsByCategory } from "../services/homeService";
import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaBox } from "react-icons/fa";
import "../styles/main.css";

const ProductSection = ({ sectionTitle, limit = 4 }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch products by category
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProductsByCategory(sectionTitle);

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

        setProducts(processedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [sectionTitle]);

  const handleViewAll = () => {
    navigate("/products", { state: { category: sectionTitle } });
  };

  if (loading) {
    return (
      <section className="product-section">
        <div className="product-section__header">
          <h2 className="product-section__title">{sectionTitle}</h2>
        </div>
        <div className="product-section__loading">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="product-card">
              <div className="product-card__img-wrap">
                <div
                  style={{
                    width: "100%",
                    height: "280px",
                    background: "rgba(255,255,255,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#6c757d",
                    borderRadius: "12px",
                  }}
                >
                  Đang tải...
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="product-section">
      <div className="product-section__header">
        <h2 className="product-section__title">{sectionTitle}</h2>
        {products.length > limit && (
          <button className="product-section__view-all" onClick={handleViewAll}>
            Xem tất cả ({products.length})
            <FaArrowRight />
          </button>
        )}
      </div>

      {products.length === 0 ? (
        <div className="product-section__empty">
          <FaBox className="product-section__empty-icon" />
          <p className="product-section__empty-text">
            Chưa có sản phẩm nào trong danh mục {sectionTitle}
          </p>
          <p className="product-section__empty-subtext">
            Hãy quay lại sau để xem các sản phẩm mới
          </p>
        </div>
      ) : (
        <div className="product-section__grid">
          {products.slice(0, limit).map((product) => (
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
              inStock={product.inStock}
              description={product.description}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductSection;
