import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { getAllProducts, getCategories } from "../services/homeService";
import {
  FaFilter,
  FaSort,
  FaTh,
  FaThList,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaStar,
  FaFire,
  FaTag,
  FaPalette,
  FaRulerCombined,
  FaBoxes,
} from "react-icons/fa";
import "../styles/main.css";

const Products = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [productVariants, setProductVariants] = useState({}); // Lưu trữ biến thể theo productId
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("name");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [ratingFilter, setRatingFilter] = useState([]);
  const [discountFilter, setDiscountFilter] = useState(false);
  const [hotFilter, setHotFilter] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    rating: true,
    features: true,
  });
  const [searchTerm, setSearchTerm] = useState("");

  // Get initial category from navigation
  useEffect(() => {
    if (location.state?.category) {
      setSelectedCategories([location.state.category]);
    }
    if (location.state?.searchTerm) {
      // Set search term in a way that can be used for filtering
      setSearchTerm(location.state.searchTerm);
    }

    // Handle filter from header search
    if (location.state?.filterType && location.state?.filterValue) {
      const { filterType, filterValue } = location.state;

      switch (filterType) {
        case "category":
          setSelectedCategories([filterValue]);
          break;
        case "price":
          if (filterValue === "Dưới 100k" || filterValue === "Dưới 100.000đ") {
            setPriceRange({ min: "0", max: "100000" });
          } else if (filterValue === "100.000đ - 300.000đ") {
            setPriceRange({ min: "100000", max: "300000" });
          } else if (filterValue === "Trên 1.000.000đ") {
            setPriceRange({ min: "1000000", max: "" });
          }
          break;
        case "rating":
          if (filterValue === "4+ sao") {
            setRatingFilter([4, 5]);
          } else if (filterValue === "5 sao") {
            setRatingFilter([5]);
          }
          break;
        case "hot":
          setHotFilter(true);
          break;
        case "discount":
          setDiscountFilter(true);
          break;
        default:
          break;
      }
    }
  }, [location.state]);

  // Fetch products and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          getAllProducts(),
          getCategories(),
        ]);

        // Backend đã gộp sản phẩm theo nhóm, chỉ cần xử lý thêm các trường tính toán
        const processedProducts = productsData.map((product) => {
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
        setProductVariants({}); // Không cần variantsByProduct nữa vì đã có trong product.variants
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Tính toán số lượng sản phẩm trong mỗi danh mục sau khi lọc
  const getCategoryCounts = () => {
    const counts = {};
    products.forEach((product) => {
      const categoryName = product.category || product.tenDanhMuc || "Khác";
      counts[categoryName] = (counts[categoryName] || 0) + 1;
    });
    return counts;
  };

  // Filter and sort products
  const filteredProducts = products
    .filter((product) => {
      // Search term filter
      if (
        searchTerm &&
        !product.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      // Category filter - multiple selection (cải thiện logic so sánh)
      if (selectedCategories.length > 0) {
        const productCategory = product.category || product.tenDanhMuc || "";
        const isInSelectedCategory = selectedCategories.some((selectedCat) => {
          // So sánh chính xác hoặc chứa từ khóa
          return (
            productCategory.toLowerCase().includes(selectedCat.toLowerCase()) ||
            selectedCat.toLowerCase().includes(productCategory.toLowerCase())
          );
        });
        if (!isInSelectedCategory) {
          return false;
        }
      }

      // Price range filter - sử dụng giá thấp nhất
      if (priceRange.min && product.minPrice < parseInt(priceRange.min)) {
        return false;
      }
      if (priceRange.max && product.maxPrice > parseInt(priceRange.max)) {
        return false;
      }

      // Rating filter
      if (
        ratingFilter.length > 0 &&
        !ratingFilter.includes(Math.floor(product.rating))
      ) {
        return false;
      }

      // Discount filter
      if (discountFilter && !product.oldPrice) {
        return false;
      }

      // Hot filter (sold > 100)
      if (hotFilter && product.totalSold <= 100) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.minPrice - b.minPrice;
        case "price-high":
          return b.maxPrice - a.maxPrice;
        case "name":
          return a.name.localeCompare(b.name);
        case "rating":
          return b.rating - a.rating;
        case "sold":
          return b.totalSold - a.totalSold;
        case "discount":
          const discountA = a.oldPrice
            ? ((a.oldPrice - a.minPrice) / a.oldPrice) * 100
            : 0;
          const discountB = b.oldPrice
            ? ((b.oldPrice - b.minPrice) / b.oldPrice) * 100
            : 0;
          return discountB - discountA;
        default:
          return 0;
      }
    });

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const handleRatingChange = (rating) => {
    setRatingFilter((prev) => {
      if (prev.includes(rating)) {
        return prev.filter((r) => r !== rating);
      } else {
        return [...prev, rating];
      }
    });
  };

  const handlePriceRangeChange = (field, value) => {
    setPriceRange((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange({ min: "", max: "" });
    setRatingFilter([]);
    setDiscountFilter(false);
    setHotFilter(false);
    setSearchTerm("");
    setSortBy("name");
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedCategories.length > 0) count++;
    if (priceRange.min || priceRange.max) count++;
    if (ratingFilter.length > 0) count++;
    if (discountFilter) count++;
    if (hotFilter) count++;
    if (searchTerm) count++;
    return count;
  };

  if (loading) {
    return (
      <div className="products-page">
        <Header />
        <div className="products-container">
          <div className="products-loading">
            <div className="loading-spinner"></div>
            <p>Đang tải sản phẩm...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="products-page">
      <Header />

      <div className="products-container">
        <div className="products-header">
          <h1 className="products-title">
            {searchTerm
              ? `Kết quả tìm kiếm: "${searchTerm}"`
              : selectedCategories.length === 1
              ? `Sản phẩm ${selectedCategories[0]}`
              : selectedCategories.length > 1
              ? `${selectedCategories.length} danh mục đã chọn`
              : "Tất cả sản phẩm"}
          </h1>
          <p className="products-subtitle">
            Tìm thấy {filteredProducts.length} sản phẩm
            {getActiveFiltersCount() > 0 && (
              <span className="active-filters-count">
                ({getActiveFiltersCount()} bộ lọc đang hoạt động)
              </span>
            )}
          </p>

          {/* Hiển thị danh mục đã chọn */}
          {selectedCategories.length > 0 && (
            <div className="selected-categories">
              <span className="selected-categories-label">
                Danh mục đã chọn:
              </span>
              {selectedCategories.map((category, index) => (
                <span key={category} className="selected-category-tag">
                  {category}
                  {index < selectedCategories.length - 1 && ", "}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="products-content">
          {/* Filters Sidebar */}
          <div className={`products-filters ${showFilters ? "show" : ""}`}>
            <div className="filters-header">
              <h3>
                <FaFilter /> Bộ lọc
                {getActiveFiltersCount() > 0 && (
                  <span className="filter-badge">
                    {getActiveFiltersCount()}
                  </span>
                )}
              </h3>
              <div className="filters-header-actions">
                {getActiveFiltersCount() > 0 && (
                  <button
                    className="clear-filters-btn"
                    onClick={clearFilters}
                    title="Xóa tất cả bộ lọc"
                  >
                    <FaTimes />
                  </button>
                )}
                <button
                  className="filters-toggle"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  {showFilters ? <FaTimes /> : <FaFilter />}
                </button>
              </div>
            </div>

            <div className="filters-content">
              {/* Categories */}
              <div className="filter-section">
                <div
                  className="filter-section-header"
                  onClick={() => toggleSection("categories")}
                >
                  <h4>Danh mục sản phẩm</h4>
                  {expandedSections.categories ? (
                    <FaChevronUp />
                  ) : (
                    <FaChevronDown />
                  )}
                </div>
                {expandedSections.categories && (
                  <div className="filter-options">
                    {(() => {
                      const categoryCounts = getCategoryCounts();
                      const uniqueCategories = [
                        ...new Set(
                          products.map(
                            (p) => p.category || p.tenDanhMuc || "Khác"
                          )
                        ),
                      ];

                      return uniqueCategories.map((categoryName) => {
                        const count = categoryCounts[categoryName] || 0;
                        return (
                          <label key={categoryName} className="filter-option">
                            <input
                              type="checkbox"
                              checked={selectedCategories.includes(
                                categoryName
                              )}
                              onChange={() =>
                                handleCategoryChange(categoryName)
                              }
                            />
                            <span className="checkmark"></span>
                            <span className="option-text">{categoryName}</span>
                            <span className="option-count">({count})</span>
                          </label>
                        );
                      });
                    })()}
                  </div>
                )}
              </div>

              {/* Price Range */}
              <div className="filter-section">
                <div
                  className="filter-section-header"
                  onClick={() => toggleSection("price")}
                >
                  <h4>Khoảng giá</h4>
                  {expandedSections.price ? <FaChevronUp /> : <FaChevronDown />}
                </div>
                {expandedSections.price && (
                  <div className="filter-options">
                    {/* Price Range Presets */}
                    <div className="price-presets">
                      <label className="filter-option">
                        <input
                          type="radio"
                          name="priceRange"
                          checked={!priceRange.min && !priceRange.max}
                          onChange={() => setPriceRange({ min: "", max: "" })}
                        />
                        <span className="checkmark"></span>
                        <span className="option-text">Tất cả giá</span>
                      </label>
                      <label className="filter-option">
                        <input
                          type="radio"
                          name="priceRange"
                          checked={
                            priceRange.min === "0" &&
                            priceRange.max === "100000"
                          }
                          onChange={() =>
                            setPriceRange({ min: "0", max: "100000" })
                          }
                        />
                        <span className="checkmark"></span>
                        <span className="option-text">Dưới 100.000đ</span>
                      </label>
                      <label className="filter-option">
                        <input
                          type="radio"
                          name="priceRange"
                          checked={
                            priceRange.min === "100000" &&
                            priceRange.max === "300000"
                          }
                          onChange={() =>
                            setPriceRange({ min: "100000", max: "300000" })
                          }
                        />
                        <span className="checkmark"></span>
                        <span className="option-text">100.000đ - 300.000đ</span>
                      </label>
                      <label className="filter-option">
                        <input
                          type="radio"
                          name="priceRange"
                          checked={
                            priceRange.min === "300000" &&
                            priceRange.max === "500000"
                          }
                          onChange={() =>
                            setPriceRange({ min: "300000", max: "500000" })
                          }
                        />
                        <span className="checkmark"></span>
                        <span className="option-text">300.000đ - 500.000đ</span>
                      </label>
                      <label className="filter-option">
                        <input
                          type="radio"
                          name="priceRange"
                          checked={
                            priceRange.min === "500000" &&
                            priceRange.max === "1000000"
                          }
                          onChange={() =>
                            setPriceRange({ min: "500000", max: "1000000" })
                          }
                        />
                        <span className="checkmark"></span>
                        <span className="option-text">
                          500.000đ - 1.000.000đ
                        </span>
                      </label>
                      <label className="filter-option">
                        <input
                          type="radio"
                          name="priceRange"
                          checked={
                            priceRange.min === "1000000" && !priceRange.max
                          }
                          onChange={() =>
                            setPriceRange({ min: "1000000", max: "" })
                          }
                        />
                        <span className="checkmark"></span>
                        <span className="option-text">Trên 1.000.000đ</span>
                      </label>
                    </div>

                    {/* Custom Price Range */}
                    <div className="custom-price-range">
                      <div className="custom-price-header">
                        <span>Khoảng giá tùy chỉnh:</span>
                      </div>
                      <div className="price-inputs">
                        <div className="price-input-group">
                          <label>Từ:</label>
                          <input
                            type="number"
                            placeholder="0"
                            value={priceRange.min}
                            onChange={(e) =>
                              handlePriceRangeChange("min", e.target.value)
                            }
                            onFocus={() => {
                              // Clear radio selection when custom input is used
                              const radioButtons = document.querySelectorAll(
                                'input[name="priceRange"]'
                              );
                              radioButtons.forEach(
                                (radio) => (radio.checked = false)
                              );
                            }}
                          />
                        </div>
                        <div className="price-input-group">
                          <label>Đến:</label>
                          <input
                            type="number"
                            placeholder="Không giới hạn"
                            value={priceRange.max}
                            onChange={(e) =>
                              handlePriceRangeChange("max", e.target.value)
                            }
                            onFocus={() => {
                              // Clear radio selection when custom input is used
                              const radioButtons = document.querySelectorAll(
                                'input[name="priceRange"]'
                              );
                              radioButtons.forEach(
                                (radio) => (radio.checked = false)
                              );
                            }}
                          />
                        </div>
                      </div>
                      <div className="price-format-hint">
                        Nhập giá bằng VNĐ (VD: 500000)
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Rating Filter */}
              <div className="filter-section">
                <div
                  className="filter-section-header"
                  onClick={() => toggleSection("rating")}
                >
                  <h4>Đánh giá</h4>
                  {expandedSections.rating ? (
                    <FaChevronUp />
                  ) : (
                    <FaChevronDown />
                  )}
                </div>
                {expandedSections.rating && (
                  <div className="filter-options">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <label key={rating} className="filter-option">
                        <input
                          type="checkbox"
                          checked={ratingFilter.includes(rating)}
                          onChange={() => handleRatingChange(rating)}
                        />
                        <span className="checkmark"></span>
                        <span className="option-text">{rating}+ sao</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Features Filter */}
              <div className="filter-section">
                <div
                  className="filter-section-header"
                  onClick={() => toggleSection("features")}
                >
                  <h4>Tính năng</h4>
                  {expandedSections.features ? (
                    <FaChevronUp />
                  ) : (
                    <FaChevronDown />
                  )}
                </div>
                {expandedSections.features && (
                  <div className="filter-options">
                    <label className="filter-option">
                      <input
                        type="checkbox"
                        checked={discountFilter}
                        onChange={(e) => setDiscountFilter(e.target.checked)}
                      />
                      <span className="checkmark"></span>
                      <span className="option-text">Có giảm giá</span>
                    </label>
                    <label className="filter-option">
                      <input
                        type="checkbox"
                        checked={hotFilter}
                        onChange={(e) => setHotFilter(e.target.checked)}
                      />
                      <span className="checkmark"></span>
                      <span className="option-text">Bán chạy</span>
                    </label>
                  </div>
                )}
              </div>

              {/* Clear Filters */}
              {getActiveFiltersCount() > 0 && (
                <button onClick={clearFilters} className="clear-filters-btn">
                  Xóa tất cả bộ lọc
                </button>
              )}
            </div>
          </div>

          {/* Products Section */}
          <div className="products-main">
            {/* Products Header */}
            <div className="products-toolbar">
              <div className="products-count">
                Hiển thị {filteredProducts.length} sản phẩm
              </div>

              <div className="products-controls">
                {/* View Mode Toggle */}
                <div className="view-mode-toggle">
                  <button
                    className={`view-btn ${
                      viewMode === "grid" ? "active" : ""
                    }`}
                    onClick={() => setViewMode("grid")}
                    title="Xem dạng lưới"
                  >
                    <FaTh />
                  </button>
                  <button
                    className={`view-btn ${
                      viewMode === "list" ? "active" : ""
                    }`}
                    onClick={() => setViewMode("list")}
                    title="Xem dạng danh sách"
                  >
                    <FaThList />
                  </button>
                </div>

                {/* Sort Dropdown */}
                <div className="sort-dropdown">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="sort-select"
                  >
                    <option value="name">Sắp xếp theo tên</option>
                    <option value="price-low">Giá tăng dần</option>
                    <option value="price-high">Giá giảm dần</option>
                    <option value="rating">Đánh giá cao nhất</option>
                    <option value="sold">Bán chạy nhất</option>
                    <option value="discount">Giảm giá nhiều nhất</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Active Filters Display */}
            {getActiveFiltersCount() > 0 && (
              <div className="active-filters">
                <h4>Bộ lọc đang hoạt động:</h4>
                <div className="active-filter-tags">
                  {searchTerm && (
                    <span className="filter-tag">
                      Tìm kiếm: "{searchTerm}"{" "}
                      <FaTimes onClick={() => setSearchTerm("")} />
                    </span>
                  )}
                  {selectedCategories.map((category) => (
                    <span key={category} className="filter-tag">
                      {category}{" "}
                      <FaTimes onClick={() => handleCategoryChange(category)} />
                    </span>
                  ))}
                  {priceRange.min || priceRange.max ? (
                    <span className="filter-tag">
                      {priceRange.min && priceRange.max
                        ? `${parseInt(
                            priceRange.min
                          ).toLocaleString()}đ - ${parseInt(
                            priceRange.max
                          ).toLocaleString()}đ`
                        : priceRange.min
                        ? `Từ ${parseInt(priceRange.min).toLocaleString()}đ`
                        : `Đến ${parseInt(
                            priceRange.max
                          ).toLocaleString()}đ`}{" "}
                      <FaTimes
                        onClick={() => setPriceRange({ min: "", max: "" })}
                      />
                    </span>
                  ) : null}
                  {ratingFilter.map((rating) => (
                    <span key={rating} className="filter-tag">
                      {rating}+ sao{" "}
                      <FaTimes onClick={() => handleRatingChange(rating)} />
                    </span>
                  ))}
                  {discountFilter && (
                    <span className="filter-tag">
                      Có giảm giá{" "}
                      <FaTimes onClick={() => setDiscountFilter(false)} />
                    </span>
                  )}
                  {hotFilter && (
                    <span className="filter-tag">
                      Bán chạy <FaTimes onClick={() => setHotFilter(false)} />
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Products Grid/List */}
            {filteredProducts.length === 0 ? (
              <div className="products-empty">
                <div className="empty-icon">📦</div>
                <h3>Không tìm thấy sản phẩm nào</h3>
                <p>Thử điều chỉnh bộ lọc hoặc tìm kiếm với từ khóa khác</p>
                <button onClick={clearFilters} className="clear-filters-btn">
                  Xóa tất cả bộ lọc
                </button>
              </div>
            ) : (
              <div
                className={`products-grid ${
                  viewMode === "list" ? "list-view" : ""
                }`}
              >
                {filteredProducts.map((product) => (
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
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}

            {/* Pagination or Load More */}
            {filteredProducts.length > 0 && (
              <div className="products-footer">
                <p>Hiển thị {filteredProducts.length} sản phẩm</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Products;
