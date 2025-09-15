import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaUserCircle,
  FaSearch,
  FaTimes,
  FaHistory,
  FaLightbulb,
  FaTag,
  FaStar,
  FaFire,
  FaSignOutAlt,
  FaCog,
  FaHeart,
} from "react-icons/fa";
import { searchProducts } from "../services/homeService";
import authService from "../services/authService";
import CartBadge from "./CartBadge";
import "../styles/main.css";

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const searchTimeoutRef = useRef(null);
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);

  const navigate = useNavigate();

  // Load current user on component mount
  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAccountClick = () => {
    if (currentUser) {
      setShowUserMenu(!showUserMenu);
    } else {
      navigate("/login");
    }
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setShowUserMenu(false);
    navigate("/");
  };

  // Real-time search with debouncing
  useEffect(() => {
    if (searchTerm.trim().length >= 2) {
      // Clear previous timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      // Set new timeout for search
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          setIsSearching(true);
          const results = await searchProducts(searchTerm);
          setSearchResults(results);
          setShowSearchResults(true);
          setHasSearched(true);
        } catch (error) {
          console.error("Search error:", error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      }, 300); // 300ms delay
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
      setHasSearched(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    try {
      setIsSearching(true);
      const results = await searchProducts(searchTerm);
      setSearchResults(results);
      setShowSearchResults(true);
      setHasSearched(true);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Generate smart suggestions
    if (value.trim()) {
      const suggestions = generateSearchSuggestions(value);
      setSearchSuggestions(suggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  // Smart search suggestions
  const generateSearchSuggestions = (input) => {
    if (!input.trim()) return [];

    const suggestions = [];
    const inputLower = input.toLowerCase();

    // Category suggestions
    const categories = ["Áo thun", "Quần", "Áo khoác", "Giày", "Phụ kiện"];
    categories.forEach((category) => {
      if (category.toLowerCase().includes(inputLower)) {
        suggestions.push({
          type: "category",
          text: category,
          icon: <FaTag />,
          action: "filter",
        });
      }
    });

    // Price range suggestions
    if (inputLower.includes("giá") || inputLower.includes("price")) {
      suggestions.push(
        {
          type: "price",
          text: "Dưới 100.000đ",
          icon: <FaTag />,
          action: "filter",
        },
        {
          type: "price",
          text: "100.000đ - 300.000đ",
          icon: <FaTag />,
          action: "filter",
        },
        {
          type: "price",
          text: "Trên 1.000.000đ",
          icon: <FaTag />,
          action: "filter",
        }
      );
    }

    // Rating suggestions
    if (inputLower.includes("sao") || inputLower.includes("rating")) {
      suggestions.push(
        { type: "rating", text: "4+ sao", icon: <FaStar />, action: "filter" },
        { type: "rating", text: "5 sao", icon: <FaStar />, action: "filter" }
      );
    }

    // Feature suggestions
    if (inputLower.includes("hot") || inputLower.includes("bán chạy")) {
      suggestions.push({
        type: "feature",
        text: "Bán chạy",
        icon: <FaFire />,
        action: "filter",
      });
    }

    if (inputLower.includes("giảm") || inputLower.includes("sale")) {
      suggestions.push({
        type: "feature",
        text: "Có giảm giá",
        icon: <FaTag />,
        action: "filter",
      });
    }

    return suggestions.slice(0, 6);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.text);
    setShowSuggestions(false);

    // Add to search history
    if (!searchHistory.includes(suggestion.text)) {
      setSearchHistory((prev) => [suggestion.text, ...prev.slice(0, 4)]);
    }

    // Navigate to products page with filter
    if (suggestion.action === "filter") {
      navigate("/products", {
        state: {
          searchTerm: suggestion.text,
          filterType: suggestion.type,
          filterValue: suggestion.text,
        },
      });
    }
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
  };

  const handleProductClick = (product) => {
    navigate(`/product-detail/${product.id}`, {
      state: {
        id: product.id,
        image: product.image,
        name: product.name,
        price: product.minPrice || product.price,
        oldPrice: product.oldPrice,
        colors: product.colors,
        rating: product.rating,
        sold: product.totalSold || product.sold,
        variants: product.variants,
      },
    });
    setShowSearchResults(false);
    setSearchTerm("");
    setHasSearched(false);
  };

  const handleSearchFocus = () => {
    if (searchTerm.trim()) {
      if (searchResults.length > 0 && hasSearched) {
        setShowSearchResults(true);
      } else {
        setShowSuggestions(true);
      }
    } else {
      setShowSuggestions(true);
    }
  };

  const handleSearchBlur = () => {
    // Delay hiding results to allow clicking on them
    setTimeout(() => {
      setShowSearchResults(false);
      setShowSuggestions(false);
    }, 200);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
    setShowSearchResults(false);
    setShowSuggestions(false);
    setHasSearched(false);
  };

  const handleViewAllResults = () => {
    navigate("/products", { state: { searchTerm } });
    setShowSearchResults(false);
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="header">
      <nav className="header__nav">
        <div className="header__nav-left">
          <Link to="/" className="header__nav-link">
            TRANG CHỦ
          </Link>
          <a
            className="header__nav-link"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/size")}
          >
            SIZE
          </a>
          <a
            className="header__nav-link"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/gioi-thieu")}
          >
            GIỚI THIỆU
          </a>
          <a href="#" className="header__nav-link">
            LIÊN HỆ
          </a>
        </div>
        <div className="header__logo">
          <span
            style={{
              color: "#007bff",
              fontWeight: "bold",
              fontSize: "2.2rem",
              letterSpacing: 2,
            }}
          >
            ZMEN
          </span>
        </div>
        <div className="header__nav-right">
          <div className="header__search" ref={searchRef}>
            <form
              onSubmit={handleSearch}
              style={{ display: "flex", width: "100%", position: "relative" }}
            >
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm thể thao..."
                className="header__search-input"
                value={searchTerm}
                onChange={handleSearchInputChange}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
              />
              {searchTerm && (
                <button
                  type="button"
                  className="header__search-clear"
                  onClick={clearSearch}
                >
                  <FaTimes size={12} />
                </button>
              )}
              <button
                type="submit"
                className="header__search-btn"
                disabled={isSearching}
              >
                {isSearching ? <span>⏳</span> : <FaSearch size={16} />}
              </button>
            </form>

            {/* Search Results Dropdown */}
            {showSearchResults && (
              <div className="header__search-results">
                {searchResults.length > 0 ? (
                  <>
                    <div className="header__search-results-header">
                      <span>Tìm thấy {searchResults.length} kết quả</span>
                    </div>
                    {searchResults.slice(0, 5).map((product) => (
                      <div
                        key={product.id}
                        className="header__search-result-item"
                        onClick={() => handleProductClick(product)}
                      >
                        <img
                          src={product.image || product.hinhAnh?.[0]}
                          alt={product.name || product.tenSanPham}
                          className="header__search-result-img"
                          onError={(e) => {
                            e.target.src =
                              "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=50&h=50&q=100";
                          }}
                        />
                        <div className="header__search-result-info">
                          <div className="header__search-result-name">
                            {product.name || product.tenSanPham}
                          </div>
                          <div className="header__search-result-price">
                            {(
                              product.minPrice ||
                              product.price ||
                              0
                            ).toLocaleString()}
                            đ
                            {product.maxPrice &&
                              product.maxPrice !==
                                (product.minPrice || product.price) &&
                              ` - ${product.maxPrice.toLocaleString()}đ`}
                          </div>
                          <div className="header__search-result-category">
                            {product.category || product.tenDanhMuc}
                          </div>
                        </div>
                      </div>
                    ))}
                    {searchResults.length > 5 && (
                      <div
                        className="header__search-result-more"
                        onClick={handleViewAllResults}
                      >
                        Xem tất cả {searchResults.length} kết quả...
                      </div>
                    )}
                  </>
                ) : hasSearched ? (
                  <div className="header__search-no-results">
                    <p>Không tìm thấy sản phẩm nào</p>
                    <p>Thử tìm kiếm với từ khóa khác</p>
                  </div>
                ) : null}
              </div>
            )}

            {/* Smart Search Suggestions */}
            {showSuggestions && !showSearchResults && (
              <div className="header__search-suggestions">
                {/* Search History */}
                {searchHistory.length > 0 && !searchTerm && (
                  <div className="suggestion-section">
                    <div className="suggestion-header">
                      <FaHistory />
                      <span>Lịch sử tìm kiếm</span>
                      <button
                        className="clear-history-btn"
                        onClick={clearSearchHistory}
                      >
                        <FaTimes />
                      </button>
                    </div>
                    {searchHistory.map((term, index) => (
                      <div
                        key={index}
                        className="suggestion-item history-item"
                        onClick={() => setSearchTerm(term)}
                      >
                        <FaHistory />
                        <span>{term}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Smart Suggestions */}
                {searchSuggestions.length > 0 && (
                  <div className="suggestion-section">
                    <div className="suggestion-header">
                      <FaLightbulb />
                      <span>Gợi ý thông minh</span>
                    </div>
                    {searchSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="suggestion-item"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion.icon}
                        <span>{suggestion.text}</span>
                        <span className="suggestion-type">
                          {suggestion.type === "category" && "Danh mục"}
                          {suggestion.type === "price" && "Khoảng giá"}
                          {suggestion.type === "rating" && "Đánh giá"}
                          {suggestion.type === "feature" && "Tính năng"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="header__user-section" ref={userMenuRef}>
            <span
              className="header__icon-link"
              title={currentUser ? "Tài khoản" : "Đăng nhập"}
              onClick={handleAccountClick}
              style={{ cursor: "pointer" }}
            >
              {currentUser ? (
                <div className="user-avatar">
                  <span className="user-initials">
                    {currentUser.firstName?.charAt(0) ||
                      currentUser.email?.charAt(0) ||
                      "U"}
                  </span>
                </div>
              ) : (
                <FaUserCircle size={24} />
              )}
            </span>

            {/* User Dropdown Menu */}
            {showUserMenu && currentUser && (
              <div className="user-dropdown">
                <div className="user-info">
                  <div className="user-name">
                    {currentUser.firstName && currentUser.lastName
                      ? `${currentUser.firstName} ${currentUser.lastName}`
                      : currentUser.email}
                  </div>
                  <div className="user-email">{currentUser.email}</div>
                </div>
                <div className="user-menu-items">
                  <button
                    className="menu-item"
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate("/profile");
                    }}
                  >
                    <FaUserCircle />
                    <span>Hồ sơ</span>
                  </button>
                  <button
                    className="menu-item"
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate("/cart");
                    }}
                  >
                    <FaShoppingCart />
                    <span>Giỏ hàng</span>
                  </button>
                  <button
                    className="menu-item"
                    onClick={() => {
                      setShowUserMenu(false);
                      // navigate("/wishlist");
                    }}
                  >
                    <FaHeart />
                    <span>Yêu thích</span>
                  </button>
                  <button
                    className="menu-item"
                    onClick={() => {
                      setShowUserMenu(false);
                      // navigate("/settings");
                    }}
                  >
                    <FaCog />
                    <span>Cài đặt</span>
                  </button>
                  <div className="menu-divider"></div>
                  <button className="menu-item logout" onClick={handleLogout}>
                    <FaSignOutAlt />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </div>
            )}
          </div>
          <CartBadge />
        </div>
      </nav>
    </header>
  );
};

export default Header;

// Add CSS for user dropdown menu
const headerStyles = `
  .header__user-section {
    position: relative;
  }

  .user-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .user-avatar:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }

  .user-dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    width: 280px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    border: 1px solid #e2e8f0;
    z-index: 1000;
    margin-top: 8px;
    animation: slideDown 0.3s ease-out;
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .user-info {
    padding: 16px;
    border-bottom: 1px solid #e2e8f0;
    background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
    border-radius: 12px 12px 0 0;
  }

  .user-name {
    font-weight: 600;
    color: #2d3748;
    font-size: 16px;
    margin-bottom: 4px;
  }

  .user-email {
    color: #718096;
    font-size: 14px;
  }

  .user-menu-items {
    padding: 8px;
  }

  .menu-item {
    width: 100%;
    padding: 12px 16px;
    background: none;
    border: none;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 12px;
    color: #4a5568;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: left;
  }

  .menu-item:hover {
    background: #f7fafc;
    color: #2d3748;
  }

  .menu-item.logout {
    color: #e53e3e;
  }

  .menu-item.logout:hover {
    background: #fed7d7;
    color: #c53030;
  }

  .menu-divider {
    height: 1px;
    background: #e2e8f0;
    margin: 8px 0;
  }

  @media (max-width: 768px) {
    .user-dropdown {
      width: 260px;
      right: -10px;
    }
  }
`;

// Inject styles
if (typeof document !== "undefined") {
  const styleElement = document.createElement("style");
  styleElement.textContent = headerStyles;
  document.head.appendChild(styleElement);
}
