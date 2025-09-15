import React, { useState, useEffect, useMemo } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductRating from "../components/ProductRating";
import "../styles/main.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import cartService from "../services/cartService";
import authService from "../services/authService";
import {
  FaStar,
  FaShoppingCart,
  FaShoppingBag,
  FaHeart,
  FaTruck,
  FaShieldAlt,
  FaUndo,
  FaPalette,
  FaRulerCombined,
  FaBoxes,
  FaCheck,
  FaTimes,
  FaSnowflake,
  FaHandPaper,
  FaSun,
  FaFire,
} from "react-icons/fa";

const API_URL = "http://localhost:8080/api";

// Hàm decode Unicode để xử lý mô tả bị lỗi encoding
const decodeDescription = (desc) => {
  if (!desc || typeof desc !== "string") return desc;

  try {
    let decoded = desc;

    // Thử decode Unicode escape sequences
    decoded = decoded.replace(/\\u([0-9a-fA-F]{4})/g, (match, hex) => {
      return String.fromCharCode(parseInt(hex, 16));
    });

    // Thay thế các ký tự lỗi encoding
    decoded = decoded.replace(/\?{3}/g, ""); // Xóa ???
    decoded = decoded.replace(/\\u0027/g, "'"); // Thay \u0027 bằng dấu nháy đơn

    // Nếu vẫn còn ký tự lỗi, thử decode UTF-8
    if (decoded.includes("\\u")) {
      decoded = decoded.replace(/\\u([0-9a-fA-F]{4})/g, (match, hex) => {
        return String.fromCharCode(parseInt(hex, 16));
      });
    }

    return decoded;
  } catch (error) {
    console.error("Error decoding description:", error);
    return desc;
  }
};

// Hàm chuyển đổi tên màu thành mã màu
const getColorCode = (colorName) => {
  if (!colorName) return "#222";

  switch (colorName.toLowerCase()) {
    case "trắng":
    case "white":
      return "#ffffff";
    case "đen":
    case "black":
      return "#222222";
    case "xanh":
    case "blue":
      return "#007bff";
    case "đỏ":
    case "red":
      return "#dc3545";
    case "vàng":
    case "yellow":
      return "#ffc107";
    case "xanh lá":
    case "green":
      return "#28a745";
    case "hồng":
    case "pink":
      return "#e83e8c";
    case "cam":
    case "orange":
      return "#fd7e14";
    case "tím":
    case "purple":
      return "#6f42c1";
    default:
      return "#222222";
  }
};

const ProductDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const stateProduct = location.state;

  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State cho việc chọn biến thể
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [priceChanged, setPriceChanged] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const decodedProductDescription = useMemo(
    () => decodeDescription(product?.description || ""),
    [product?.description]
  );

  // Lấy dữ liệu sản phẩm từ state hoặc API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        if (stateProduct) {
          // Sử dụng dữ liệu từ state (đã được gộp)
          console.log("Using stateProduct:", stateProduct);
          // Nếu stateProduct không có description, gọi API
          if (!stateProduct.description || !stateProduct.description.trim()) {
            console.log("stateProduct has no description, calling API...");
            const response = await axios.get(
              `${API_URL}/customer/products/${id}`
            );
            const productData = response.data.success
              ? response.data
              : response.data;

            const productInfo = {
              id: productData.id,
              maSanPham: productData.maSanPham,
              name: productData.name,
              category: productData.category,
              description:
                productData.description ||
                productData.moTa ||
                productData.desc ||
                "",
              rating: productData.rating,
              sold: productData.sold,
              variants: productData.variants || [],
            };

            setProduct(productInfo);
            setVariants(productInfo.variants);

            if (productInfo.variants && productInfo.variants.length > 0) {
              const firstVariant = productInfo.variants[0];
              setSelectedColor(firstVariant.color || firstVariant.tenMauSac);
              setSelectedSize(firstVariant.size || firstVariant.tenKichCo);
              setSelectedVariant(firstVariant);
            }
            return;
          }

          setProduct(stateProduct);
          setVariants(stateProduct.variants || []);

          // Tự động chọn biến thể đầu tiên
          if (stateProduct.variants && stateProduct.variants.length > 0) {
            const firstVariant = stateProduct.variants[0];
            setSelectedColor(firstVariant.tenMauSac || firstVariant.color);
            setSelectedSize(firstVariant.tenKichCo || firstVariant.size);
            setSelectedVariant(firstVariant);
          }
        } else if (id) {
          const response = await axios.get(
            `${API_URL}/customer/products/${id}`
          );
          const productData = response.data.success
            ? response.data
            : response.data;

          // Sử dụng dữ liệu từ API mới (đã được gộp)
          const productInfo = {
            id: productData.id,
            maSanPham: productData.maSanPham,
            name: productData.name,
            category: productData.category,
            description:
              productData.description ||
              productData.moTa ||
              productData.desc ||
              "",
            rating: productData.rating,
            sold: productData.sold,
            variants: productData.variants || [],
          };

          setProduct(productInfo);
          setVariants(productInfo.variants);

          // Tự động chọn biến thể đầu tiên
          if (productInfo.variants && productInfo.variants.length > 0) {
            const firstVariant = productInfo.variants[0];
            setSelectedColor(firstVariant.color || firstVariant.tenMauSac);
            setSelectedSize(firstVariant.size || firstVariant.tenKichCo);
            setSelectedVariant(firstVariant);
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("Không thể tải thông tin sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, stateProduct]);

  // Lấy danh sách màu và size duy nhất
  const uniqueColors = [
    ...new Set(
      (variants || []).map((v) => v.tenMauSac || v.color).filter(Boolean)
    ),
  ];
  const uniqueSizes = [
    ...new Set(
      (variants || []).map((v) => v.tenKichCo || v.size).filter(Boolean)
    ),
  ];

  // Lấy tất cả hình ảnh duy nhất từ các variants
  const uniqueImages = useMemo(() => {
    if (!variants || variants.length === 0) return [];

    const allImages = new Set();
    const imageObjects = [];

    variants.forEach((variant) => {
      // Lấy hình ảnh từ variant - có thể là array hoặc string
      let variantImages = [];

      if (variant.hinhAnh) {
        if (Array.isArray(variant.hinhAnh)) {
          variantImages = variant.hinhAnh;
        } else if (typeof variant.hinhAnh === "string") {
          variantImages = [variant.hinhAnh];
        }
      } else if (variant.image) {
        variantImages = [variant.image];
      }

      variantImages.forEach((imageUrl) => {
        if (imageUrl && !allImages.has(imageUrl)) {
          allImages.add(imageUrl);
          imageObjects.push({
            url: imageUrl,
            variant: variant,
            color: variant.tenMauSac || variant.color,
            size: variant.tenKichCo || variant.size,
          });
        }
      });
    });

    // Nếu không có hình ảnh từ variants, sử dụng hình mặc định
    if (imageObjects.length === 0) {
      imageObjects.push({
        url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&h=500&q=100",
        variant: null,
        color: null,
        size: null,
      });
    }

    return imageObjects;
  }, [variants]);

  // Lọc biến thể theo màu và size đã chọn
  const availableVariants = (variants || []).filter((v) => {
    if (selectedColor && (v.tenMauSac || v.color) !== selectedColor)
      return false;
    if (selectedSize && (v.tenKichCo || v.size) !== selectedSize) return false;
    return true;
  });

  // Cập nhật biến thể được chọn khi thay đổi màu/size
  useEffect(() => {
    if (!variants || variants.length === 0) {
      setSelectedVariant(null);
      return;
    }

    let newSelectedVariant = null;

    if (selectedColor && selectedSize) {
      newSelectedVariant = variants.find(
        (v) =>
          (v.tenMauSac || v.color) === selectedColor &&
          (v.tenKichCo || v.size) === selectedSize
      );
    } else if (selectedColor) {
      newSelectedVariant = variants.find(
        (v) => (v.tenMauSac || v.color) === selectedColor
      );
    } else if (selectedSize) {
      newSelectedVariant = variants.find(
        (v) => (v.tenKichCo || v.size) === selectedSize
      );
    } else {
      newSelectedVariant = variants[0] || null;
    }

    // Kiểm tra xem giá có thay đổi không
    if (selectedVariant && newSelectedVariant) {
      const oldPrice = selectedVariant.gia || selectedVariant.price || 0;
      const newPrice = newSelectedVariant.gia || newSelectedVariant.price || 0;

      if (oldPrice !== newPrice) {
        setPriceChanged(true);
        // Reset hiệu ứng sau 1 giây
        setTimeout(() => setPriceChanged(false), 1000);
      }
    }

    setSelectedVariant(newSelectedVariant);
  }, [selectedColor, selectedSize, variants]);

  // Tự động chọn hình ảnh phù hợp khi uniqueImages thay đổi
  useEffect(() => {
    if (selectedVariant && uniqueImages.length > 1) {
      const variantImageUrl =
        selectedVariant.hinhAnh?.[0] || selectedVariant.image;
      if (variantImageUrl) {
        const matchingImageIndex = uniqueImages.findIndex(
          (img) => img.url === variantImageUrl
        );
        if (matchingImageIndex !== -1) {
          setSelectedImageIndex(matchingImageIndex);
        }
      }
    }
  }, [selectedVariant, uniqueImages]);

  // Tính toán giá hiển thị
  const getPriceDisplay = () => {
    try {
      if (!variants || !variants.length)
        return { min: 0, max: 0, display: "0đ", currentPrice: 0 };

      // Nếu có biến thể được chọn, hiển thị giá của biến thể đó
      if (selectedVariant) {
        const currentPrice = selectedVariant.gia || selectedVariant.price || 0;
        return {
          min: currentPrice,
          max: currentPrice,
          display: `${currentPrice.toLocaleString()}đ`,
          currentPrice: currentPrice,
        };
      }

      // Nếu chưa chọn biến thể, hiển thị khoảng giá
      const prices = variants
        .map((v) => {
          const price = v.gia || v.price || 0;
          return typeof price === "number" ? price : 0;
        })
        .filter((price) => price > 0);

      if (prices.length === 0)
        return { min: 0, max: 0, display: "0đ", currentPrice: 0 };

      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);

      if (minPrice === maxPrice) {
        return {
          min: minPrice,
          max: maxPrice,
          display: `${minPrice.toLocaleString()}đ`,
          currentPrice: minPrice,
        };
      }

      return {
        min: minPrice,
        max: maxPrice,
        display: `${minPrice.toLocaleString()}đ - ${maxPrice.toLocaleString()}đ`,
        currentPrice: minPrice,
      };
    } catch (error) {
      console.error("Error in getPriceDisplay:", error);
      return { min: 0, max: 0, display: "0đ", currentPrice: 0 };
    }
  };

  const priceInfo = getPriceDisplay();

  // Hàm kiểm tra description có hợp lệ không
  const isValidDescription = (desc) => {
    if (!desc || typeof desc !== "string") return false;

    const trimmed = desc.trim();
    if (trimmed.length === 0) return false;

    // Kiểm tra có chứa ký tự lỗi encoding không
    if (trimmed.includes("???") || trimmed.includes("\\u0027")) return false;

    return true;
  };

  // Xử lý mua ngay
  const handleBuyNow = async () => {
    // Kiểm tra đăng nhập
    if (!authService.isAuthenticated()) {
      alert("Vui lòng đăng nhập để mua hàng!");
      navigate("/login");
      return;
    }

    if (!selectedVariant) {
      alert("Vui lòng chọn màu sắc và kích thước");
      return;
    }

    if ((selectedVariant.soLuong || selectedVariant.stock) < quantity) {
      alert("Số lượng vượt quá tồn kho");
      return;
    }

    try {
      // Tạo cart item cho mua ngay
      const buyNowItem = {
        id: Date.now(), // Temporary ID
        chiTietSanPhamId: selectedVariant.id,
        name: product.tenSanPham,
        image: selectedVariant.hinhAnh || product.hinhAnhChinh,
        variant: `${selectedColor} - ${selectedSize}`,
        price: selectedVariant.gia || selectedVariant.price,
        oldPrice: selectedVariant.gia || selectedVariant.price,
        quantity: quantity,
        checked: true,
        thanhTien: (selectedVariant.gia || selectedVariant.price) * quantity,
        soLuongTonKho: selectedVariant.soLuong || selectedVariant.stock,
        mauSac: selectedColor,
        kichCo: selectedSize,
        chatLieu: selectedVariant.chatLieu || product.chatLieu,
      };

      // Lưu vào localStorage để truyền sang trang checkout
      localStorage.setItem("checkout_cart", JSON.stringify([buyNowItem]));
      localStorage.setItem("checkout_total", buyNowItem.thanhTien);

      console.log("🔧 Buy now with item:", buyNowItem);

      // Chuyển đến trang checkout
      navigate("/checkout");
    } catch (error) {
      console.error("Lỗi mua ngay:", error);
      alert("Có lỗi xảy ra khi mua ngay!");
    }
  };

  // Xử lý thêm vào giỏ hàng
  const handleAddToCart = async () => {
    if (!selectedVariant) {
      alert("Vui lòng chọn màu sắc và kích thước");
      return;
    }

    if ((selectedVariant.soLuong || selectedVariant.stock) < quantity) {
      alert("Số lượng vượt quá tồn kho");
      return;
    }

    try {
      // Debug: Kiểm tra dữ liệu variant
      console.log("Debug - selectedVariant:", selectedVariant);
      console.log("Debug - selectedVariant.id:", selectedVariant.id);
      console.log("Debug - Tất cả variants:", variants);

      // Gọi API thêm vào giỏ hàng - QUAN TRỌNG: sử dụng chiTietSanPhamId
      console.log(
        "🔧 Adding to cart with chiTietSanPhamId:",
        selectedVariant.id
      );
      await cartService.addToCart(selectedVariant.id, quantity);

      console.log("Thêm vào giỏ hàng thành công:", {
        productId: product.id,
        variantId: selectedVariant.id,
        color: selectedColor,
        size: selectedSize,
        quantity,
        price: selectedVariant.gia || selectedVariant.price,
      });

      alert("Đã thêm vào giỏ hàng thành công!");

      // Trigger cart reload event
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Lỗi thêm vào giỏ hàng:", error);

      if (error.response?.status === 401) {
        alert("Vui lòng đăng nhập để thêm vào giỏ hàng!");
        navigate("/login");
      } else if (error.response?.status === 400) {
        alert(error.response.data || "Số lượng vượt quá tồn kho!");
      } else {
        alert("Có lỗi xảy ra khi thêm vào giỏ hàng!");
      }
    }
  };

  if (loading) {
    return (
      <div className="product-detail-page">
        <Header />
        <div className="product-detail-container">
          <div className="loading-spinner">Đang tải...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-page">
        <Header />
        <div className="product-detail-container">
          <div className="error-message">
            <FaTimes size={48} color="#dc3545" />
            <h2>Không tìm thấy sản phẩm</h2>
            <p>{error || "Sản phẩm không tồn tại hoặc đã bị xóa"}</p>
            <button
              onClick={() => navigate("/products")}
              className="btn-primary"
            >
              Quay lại danh sách sản phẩm
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <Header />

      <div className="product-detail-container">
        <div className="product-detail-content">
          {/* Product Images */}
          <div className="product-images">
            <div className="main-image">
              <img
                src={
                  uniqueImages[selectedImageIndex]?.url ||
                  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&h=500&q=100"
                }
                alt={product.name || "Sản phẩm"}
                className="product-image"
              />
              {uniqueImages[selectedImageIndex] && (
                <div className="image-info">
                  <small
                    style={{
                      color: "#6c757d",
                      fontSize: "12px",
                      position: "absolute",
                      bottom: "8px",
                      left: "8px",
                      background: "rgba(255,255,255,0.9)",
                      padding: "4px 8px",
                      borderRadius: "4px",
                    }}
                  >
                    {uniqueImages[selectedImageIndex].color &&
                      `Màu: ${uniqueImages[selectedImageIndex].color}`}
                    {uniqueImages[selectedImageIndex].color &&
                      uniqueImages[selectedImageIndex].size &&
                      " - "}
                    {uniqueImages[selectedImageIndex].size &&
                      `Size: ${uniqueImages[selectedImageIndex].size}`}
                  </small>
                </div>
              )}
            </div>

            {/* Thumbnail images */}
            {uniqueImages.length > 1 && (
              <div className="thumbnail-images">
                {uniqueImages.map((imageObj, index) => {
                  const tooltipText =
                    [
                      imageObj.color && `Màu: ${imageObj.color}`,
                      imageObj.size && `Size: ${imageObj.size}`,
                    ]
                      .filter(Boolean)
                      .join(" - ") || "Hình ảnh sản phẩm";

                  return (
                    <div
                      key={index}
                      className={`thumbnail ${
                        selectedImageIndex === index ? "active" : ""
                      }`}
                      onClick={() => setSelectedImageIndex(index)}
                      title={tooltipText}
                    >
                      <img
                        src={imageObj.url}
                        alt={tooltipText}
                        className="thumbnail-image"
                      />
                      {imageObj.color && (
                        <div
                          className="thumbnail-color-indicator"
                          style={{
                            backgroundColor: getColorCode(imageObj.color),
                          }}
                        ></div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Product Info - Moved below images */}
        <div className="product-info-section">
          <div className="product-info">
            <div className="product-code">{product.maSanPham || "N/A"}</div>
            <h1 className="product-name">{product.name || "Sản phẩm"}</h1>

            {/* Rating and Sold */}
            <div className="product-meta">
              <div className="rating">
                <FaStar color="#ffc107" />
                <span>{product.rating || 0}</span>
              </div>
              <div className="sold">
                Đã bán {(product.sold || 0).toLocaleString()}
              </div>
            </div>

            {/* Price */}
            <div className="product-price">
              <span
                className={`current-price ${
                  priceChanged ? "price-changed" : ""
                }`}
                style={{
                  transition: "all 0.3s ease",
                  transform: priceChanged ? "scale(1.05)" : "scale(1)",
                  color: priceChanged ? "#e74c3c" : "#e74c3c",
                }}
              >
                {priceInfo.display}
              </span>
              {selectedVariant?.giaCu &&
                selectedVariant.giaCu >
                  (selectedVariant.gia || selectedVariant.price || 0) && (
                  <span className="old-price">
                    {selectedVariant.giaCu.toLocaleString()}đ
                  </span>
                )}
              {!selectedVariant && priceInfo.min !== priceInfo.max && (
                <div className="price-note">
                  <small style={{ color: "#6c757d", fontSize: "14px" }}>
                    Chọn màu sắc và kích thước để xem giá cụ thể
                  </small>
                </div>
              )}
              {selectedVariant && (
                <div className="price-details">
                  <small style={{ color: "#27ae60", fontSize: "12px" }}>
                    Giá cho{" "}
                    {selectedColor && selectedSize
                      ? `${selectedColor} - ${selectedSize}`
                      : selectedColor
                      ? `${selectedColor}`
                      : selectedSize
                      ? `${selectedSize}`
                      : ""}
                  </small>
                </div>
              )}
            </div>

            {/* Variant Stats */}
            <div className="variant-stats">
              <div className="stat-item">
                <FaBoxes />
                <span>{variants ? variants.length : 0} biến thể</span>
              </div>
              <div className="stat-item">
                <FaPalette />
                <span>{uniqueColors.length} màu sắc</span>
              </div>
              <div className="stat-item">
                <FaRulerCombined />
                <span>{uniqueSizes.length} kích thước</span>
              </div>
            </div>

            {/* Color Selection */}
            {uniqueColors.length > 0 && (
              <div className="variant-selector">
                <label className="variant-label">
                  <FaPalette /> Màu sắc:
                </label>
                <div className="color-options">
                  {uniqueColors.map((color) => (
                    <button
                      key={color}
                      className={`color-option ${
                        selectedColor === color ? "selected" : ""
                      }`}
                      onClick={() => setSelectedColor(color)}
                      style={{ backgroundColor: getColorCode(color) }}
                      title={color}
                    >
                      {selectedColor === color && <FaCheck />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {uniqueSizes.length > 0 && (
              <div className="variant-selector">
                <label className="variant-label">
                  <FaRulerCombined /> Kích thước:
                </label>
                <div className="size-options">
                  {uniqueSizes.map((size) => {
                    const variant = variants.find(
                      (v) =>
                        (v.tenMauSac || v.color) === selectedColor &&
                        (v.tenKichCo || v.size) === size &&
                        (v.soLuong > 0 || v.stock > 0)
                    );
                    const available =
                      variant && (variant.soLuong > 0 || variant.stock > 0);

                    return (
                      <button
                        key={size}
                        className={`size-option ${
                          selectedSize === size ? "selected" : ""
                        } ${!available ? "disabled" : ""}`}
                        onClick={() => available && setSelectedSize(size)}
                        disabled={!available}
                      >
                        {size}
                        {selectedSize === size && <FaCheck />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Selected Variant Info */}
            {selectedVariant && (
              <div className="selected-variant-info">
                <div className="variant-details">
                  <span className="variant-text">
                    {selectedColor && selectedSize
                      ? `Màu: ${selectedColor} - Size: ${selectedSize}`
                      : selectedColor
                      ? `Màu: ${selectedColor}`
                      : selectedSize
                      ? `Size: ${selectedSize}`
                      : "Vui lòng chọn màu sắc và kích thước"}
                  </span>
                  <span className="variant-price">
                    {(
                      selectedVariant.gia ||
                      selectedVariant.price ||
                      0
                    ).toLocaleString()}
                    đ
                  </span>
                </div>

                <div className="stock-info">
                  <span
                    className={`stock-status ${
                      (selectedVariant.soLuong || selectedVariant.stock) > 0
                        ? "in-stock"
                        : "out-of-stock"
                    }`}
                  >
                    {(selectedVariant.soLuong || selectedVariant.stock) > 0
                      ? `Còn ${
                          selectedVariant.soLuong || selectedVariant.stock
                        } sản phẩm`
                      : "Hết hàng"}
                  </span>
                </div>
              </div>
            )}

            {/* Quantity */}
            {selectedVariant && (
              <div className="quantity-selector">
                <label className="quantity-label">Số lượng:</label>
                <div className="quantity-controls">
                  <button
                    className="quantity-btn"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    min="1"
                    max={
                      selectedVariant?.soLuong || selectedVariant?.stock || 1
                    }
                    className="quantity-input"
                  />
                  <button
                    className="quantity-btn"
                    onClick={() =>
                      setQuantity(
                        Math.min(
                          quantity + 1,
                          selectedVariant?.soLuong ||
                            selectedVariant?.stock ||
                            quantity,
                          quantity + 1
                        )
                      )
                    }
                    disabled={
                      quantity >=
                      (selectedVariant?.soLuong ||
                        selectedVariant?.stock ||
                        quantity)
                    }
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="product-actions">
              <button
                className="btn-buy-now"
                onClick={handleBuyNow}
                disabled={
                  !selectedVariant ||
                  (selectedVariant.soLuong || selectedVariant.stock || 0) === 0
                }
              >
                <FaShoppingBag />
                Mua ngay
              </button>

              <button
                className="btn-add-to-cart"
                onClick={handleAddToCart}
                disabled={
                  !selectedVariant ||
                  (selectedVariant.soLuong || selectedVariant.stock || 0) === 0
                }
              >
                <FaShoppingCart />
                Thêm vào giỏ hàng
              </button>

              <button className="btn-wishlist">
                <FaHeart />
                Yêu thích
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Description Section */}
      {decodedProductDescription && decodedProductDescription.trim() && (
        <div className="product-description-section">
          <div className="product-description">
            <h3>Mô tả sản phẩm</h3>
            <div className="description-content">
              {decodedProductDescription
                .split(/\n+/)
                .filter((line) => line.trim().length > 0)
                .slice(0, showFullDescription ? undefined : 3)
                .map((line, idx) => (
                  <p key={idx} style={{ marginBottom: 8 }}>
                    {line}
                  </p>
                ))}
              {decodedProductDescription.split(/\n+/).length > 3 && (
                <button
                  className="btn-secondary"
                  style={{ marginTop: 8 }}
                  onClick={() => setShowFullDescription((v) => !v)}
                >
                  {showFullDescription ? "Thu gọn" : "Xem thêm"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Size Guide Section */}
      <div className="size-guide-section">
        <div className="size-guide">
          <h3>Hướng dẫn chọn size</h3>
          <div className="size-table">
            <table>
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Chiều cao (cm)</th>
                  <th>Cân nặng (kg)</th>
                  <th>Ngực (cm)</th>
                  <th>Eo (cm)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>S</td>
                  <td>160-170</td>
                  <td>50-60</td>
                  <td>90-95</td>
                  <td>70-75</td>
                </tr>
                <tr>
                  <td>M</td>
                  <td>165-175</td>
                  <td>55-65</td>
                  <td>95-100</td>
                  <td>75-80</td>
                </tr>
                <tr>
                  <td>L</td>
                  <td>170-180</td>
                  <td>60-70</td>
                  <td>100-105</td>
                  <td>80-85</td>
                </tr>
                <tr>
                  <td>XL</td>
                  <td>175-185</td>
                  <td>65-75</td>
                  <td>105-110</td>
                  <td>85-90</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Care Instructions Section */}
      <div className="care-instructions-section">
        <div className="care-instructions">
          <h3>Hướng dẫn bảo quản</h3>
          <div className="care-list">
            <div className="care-item">
              <FaSnowflake />
              <span>Giặt ở nhiệt độ 30°C</span>
            </div>
            <div className="care-item">
              <FaHandPaper />
              <span>Không giặt khô</span>
            </div>
            <div className="care-item">
              <FaSun />
              <span>Không phơi trực tiếp dưới ánh nắng</span>
            </div>
            <div className="care-item">
              <FaFire />
              <span>Ủi ở nhiệt độ thấp</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Reviews Section */}
      <div className="product-reviews-section">
        <div className="product-reviews">
          <ProductRating
            productId={product?.id}
            customerId={1} // TODO: Lấy từ context hoặc localStorage
            onRatingChange={(newRating) => {
              // Cập nhật rating trong product state nếu cần
              if (product) {
                setProduct((prev) => ({
                  ...prev,
                  rating: newRating,
                }));
              }
            }}
          />
        </div>
      </div>

      {/* Shipping Info Section */}
      <div className="shipping-info-section">
        <div className="shipping-info">
          <div className="shipping-item">
            <FaTruck />
            <span>Miễn phí vận chuyển cho đơn hàng từ 500k</span>
          </div>
          <div className="shipping-item">
            <FaShieldAlt />
            <span>Bảo hành chính hãng 12 tháng</span>
          </div>
          <div className="shipping-item">
            <FaUndo />
            <span>Đổi trả miễn phí trong 30 ngày</span>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
