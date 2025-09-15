import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../services/homeService";
import "../styles/main.css";

const CategoryNav = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Category images mapping - Sports themed 4K
  const categoryImages = {
    Áo: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=100",
    Quần: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=400&q=100",
    Váy: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=400&q=100",
    "Giày dép":
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=100",
    "Phụ kiện":
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=400&q=100",
    "Áo thun":
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=100",
    "Áo polo":
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=400&q=100",
    "Áo sơmi":
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=400&q=100",
    "Áo khoác":
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=400&q=100",
    // Sports specific categories
    "Áo thể thao":
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=100",
    "Quần thể thao":
      "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=400&q=100",
    "Giày thể thao":
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=100",
    "Phụ kiện thể thao":
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=400&q=100",
  };

  // Fetch categories data
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        // Add images to categories
        const categoriesWithImages = data.map((category) => ({
          ...category,
          image:
            categoryImages[category.name] ||
            "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=100",
        }));
        setCategoryData(categoriesWithImages);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryName) => {
    navigate("/products", { state: { category: categoryName } });
  };

  if (loading) {
    return (
      <nav className="category-nav">
        <div className="category-nav__container">
          <ul className="category-nav__list">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <li key={i} className="category-nav__item">
                <div className="category-nav__link" style={{ opacity: 0.5 }}>
                  <div className="category-nav__image-placeholder"></div>
                  <span className="category-nav__name">Đang tải...</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    );
  }

  return (
    <nav className="category-nav">
      <div className="category-nav__container">
        <ul className="category-nav__list">
          {categoryData.map((category) => (
            <li key={category.id} className="category-nav__item">
              <button
                className="category-nav__link"
                onClick={() => handleCategoryClick(category.name)}
              >
                <div className="category-nav__image-container">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="category-nav__image"
                  />
                  <div className="category-nav__overlay">
                    <span className="category-nav__icon">{category.icon}</span>
                  </div>
                </div>
                <span className="category-nav__name">{category.name}</span>
                <span className="category-nav__count">({category.count})</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default CategoryNav;
