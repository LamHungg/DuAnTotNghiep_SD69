import React from "react";
import {
  FaStar,
  FaFire,
  FaPalette,
  FaRulerCombined,
  FaBoxes,
} from "react-icons/fa";
import "../styles/main.css";
import { useNavigate } from "react-router-dom";

const ProductCard = ({
  id,
  maSanPham,
  image,
  name,
  price,
  oldPrice,
  colors,
  sizes,
  rating,
  sold,
  discount,
  variants,
  totalStock,
  viewMode,
  inStock,
  description,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product-detail/${id}`, {
      state: {
        id,
        maSanPham,
        image,
        name,
        price,
        oldPrice,
        colors,
        sizes,
        rating,
        sold,
        variants,
        totalStock,
        viewMode,
        inStock,
        description,
      },
    });
  };

  const calculateDiscount = () => {
    if (!oldPrice || !price) return 0;
    return Math.round(((oldPrice - price) / oldPrice) * 100);
  };

  const discountPercent = discount || calculateDiscount();

  // Tính toán thống kê biến thể
  const getVariantStats = () => {
    if (!variants || variants.length === 0) return null;

    const uniqueColors = new Set(
      variants.map((v) => v.tenMauSac || v.color).filter(Boolean)
    ).size;
    const uniqueSizes = new Set(
      variants.map((v) => v.tenKichCo || v.size).filter(Boolean)
    ).size;

    return {
      totalVariants: variants.length,
      uniqueColors,
      uniqueSizes,
    };
  };

  const variantStats = getVariantStats();

  // Hiển thị giá range nếu có nhiều biến thể với giá khác nhau
  const getPriceDisplay = () => {
    if (!variants || variants.length === 0) {
      return (
        <span className="product-card__price">{price?.toLocaleString()}đ</span>
      );
    }

    const prices = variants.map((v) => v.gia || v.price).filter(Boolean);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    if (minPrice === maxPrice) {
      return (
        <span className="product-card__price">
          {minPrice.toLocaleString()}đ
        </span>
      );
    }

    return (
      <span className="product-card__price">
        {minPrice.toLocaleString()}đ - {maxPrice.toLocaleString()}đ
      </span>
    );
  };

  if (viewMode === "list") {
    return (
      <div className="product-card product-card--list" onClick={handleClick}>
        <div className="product-card__img-wrap">
          <img src={image} alt={name} className="product-card__img" />

          {/* Discount badge */}
          {discountPercent > 0 && (
            <div className="product-card__discount">-{discountPercent}%</div>
          )}

          {/* Hot badge for popular products */}
          {sold && sold > 1000 && (
            <div className="product-card__hot">
              <FaFire size={12} />
              Hot
            </div>
          )}
        </div>

        <div className="product-card__content">
          <div className="product-card__header">
            <div className="product-card__code">{maSanPham}</div>
            <h3 className="product-card__name">{name}</h3>

            {/* Rating and sold */}
            {(rating || sold) && (
              <div className="product-card__meta">
                {rating && (
                  <div className="product-card__rating">
                    <FaStar size={12} style={{ color: "#ffc107" }} />
                    <span>{rating}</span>
                  </div>
                )}
                {sold && (
                  <div className="product-card__sold">
                    Đã bán {sold.toLocaleString()}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Variant Stats */}
          {variantStats && (
            <div className="product-card__variant-stats">
              <div className="variant-stat">
                <FaBoxes className="variant-stat__icon" />
                <span>{variantStats.totalVariants} biến thể</span>
              </div>
              {variantStats.uniqueColors > 0 && (
                <div className="variant-stat">
                  <FaPalette className="variant-stat__icon" />
                  <span>{variantStats.uniqueColors} màu</span>
                </div>
              )}
              {variantStats.uniqueSizes > 0 && (
                <div className="variant-stat">
                  <FaRulerCombined className="variant-stat__icon" />
                  <span>{variantStats.uniqueSizes} size</span>
                </div>
              )}
            </div>
          )}

          {/* Colors and Sizes Preview */}
          <div className="product-card__variants-preview">
            {colors && colors.length > 0 && (
              <div className="product-card__colors">
                <span className="variant-label">Màu sắc:</span>
                {colors.slice(0, 3).map((color, i) => (
                  <span
                    key={i}
                    className="product-card__color"
                    style={{ background: color }}
                    title={color}
                  ></span>
                ))}
                {colors.length > 3 && (
                  <span className="color-more">+{colors.length - 3}</span>
                )}
              </div>
            )}

            {sizes && sizes.length > 0 && (
              <div className="product-card__sizes">
                <span className="variant-label">Kích thước:</span>
                {sizes.slice(0, 4).map((size, i) => (
                  <span key={i} className="product-card__size">
                    {size}
                  </span>
                ))}
                {sizes.length > 4 && (
                  <span className="size-more">+{sizes.length - 4}</span>
                )}
              </div>
            )}
          </div>

          <div className="product-card__prices">
            {getPriceDisplay()}
            {oldPrice && oldPrice > price && (
              <span className="product-card__old-price">
                {oldPrice.toLocaleString()}đ
              </span>
            )}
          </div>

          {/* Stock Info */}
          {totalStock !== undefined && (
            <div className="product-card__stock">
              <span
                className={`stock-status ${
                  totalStock > 0 ? "in-stock" : "out-of-stock"
                }`}
              >
                {totalStock > 0 ? `Còn ${totalStock} sản phẩm` : "Hết hàng"}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Grid view (default)
  return (
    <div
      className="product-card"
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      <div className="product-card__img-wrap">
        <img src={image} alt={name} className="product-card__img" />

        {/* Discount badge */}
        {discountPercent > 0 && (
          <div className="product-card__discount">-{discountPercent}%</div>
        )}

        {/* Hot badge for popular products */}
        {sold && sold > 1000 && (
          <div className="product-card__hot">
            <FaFire size={12} />
            Hot
          </div>
        )}
      </div>

      {/* Variant Stats */}
      {variantStats && (
        <div className="product-card__variant-stats">
          <div className="variant-stat">
            <FaBoxes className="variant-stat__icon" />
            <span>{variantStats.totalVariants}</span>
          </div>
          {variantStats.uniqueColors > 0 && (
            <div className="variant-stat">
              <FaPalette className="variant-stat__icon" />
              <span>{variantStats.uniqueColors}</span>
            </div>
          )}
          {variantStats.uniqueSizes > 0 && (
            <div className="variant-stat">
              <FaRulerCombined className="variant-stat__icon" />
              <span>{variantStats.uniqueSizes}</span>
            </div>
          )}
        </div>
      )}

      <div className="product-card__colors">
        {colors &&
          colors
            .slice(0, 4)
            .map((c, i) => (
              <span
                key={i}
                className="product-card__color"
                style={{ background: c }}
                title={`Màu ${i + 1}`}
              ></span>
            ))}
        {colors && colors.length > 4 && (
          <span className="color-more">+{colors.length - 4}</span>
        )}
      </div>

      <div className="product-card__name">{name}</div>

      {/* Rating and sold */}
      {(rating || sold) && (
        <div className="product-card__meta">
          {rating && (
            <div className="product-card__rating">
              <FaStar size={12} style={{ color: "#ffc107" }} />
              <span>{rating}</span>
            </div>
          )}
          {sold && (
            <div className="product-card__sold">
              Đã bán {sold.toLocaleString()}
            </div>
          )}
        </div>
      )}

      <div className="product-card__prices">
        {getPriceDisplay()}
        {oldPrice && oldPrice > price && (
          <span className="product-card__old-price">
            {oldPrice.toLocaleString()}đ
          </span>
        )}
      </div>

      {/* Stock Info */}
      {totalStock !== undefined && (
        <div className="product-card__stock">
          <span
            className={`stock-status ${
              totalStock > 0 ? "in-stock" : "out-of-stock"
            }`}
          >
            {totalStock > 0 ? `Còn ${totalStock}` : "Hết hàng"}
          </span>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
