import React, { useState } from "react";

const ProductImage = ({ product, src, alt, className = "product-image" }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Determine image source and alt text
  let imageUrl = null;
  let imageAlt = alt || "Product Image";

  if (product) {
    // If product object is provided
    const hasImage = product.hinhAnh && product.hinhAnh.length > 0;
    imageUrl = hasImage
      ? product.hinhAnh[0].duongDan || product.hinhAnh[0]
      : null;
    imageAlt = product.tenSanPham || "Product Image";
  } else if (src) {
    // If src is provided directly
    imageUrl = src;
  }

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  if (!imageUrl || imageError) {
    return (
      <div className={`${className} no-image-placeholder`}>
        <div className="no-image-content">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19ZM8.5 13.5L11 16.51L14.5 12L19 18H5L8.5 13.5Z"
              fill="#9CA3AF"
            />
          </svg>
          <span>No Image</span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={imageAlt}
      className={`${className} ${imageLoaded ? "loaded" : "loading"}`}
      onError={handleImageError}
      onLoad={handleImageLoad}
    />
  );
};

export default ProductImage;
