import React from 'react';
import { FaTshirt, FaUserFriends, FaList, FaMale, FaFemale, FaChild, FaHatCowboy, FaSocks, FaGem } from 'react-icons/fa';

const categories = [
  { name: 'Tất cả sản phẩm', icon: <FaList /> },
  { name: 'Áo thun', icon: <FaTshirt /> },
  { name: 'Áo polo', icon: <FaTshirt /> },
  { name: 'Áo sơmi', icon: <FaTshirt /> },
  { name: 'Quần', icon: <FaMale /> },
  { name: 'Áo khoác', icon: <FaHatCowboy /> },
  { name: 'Hoodie', icon: <FaUserFriends /> },
  { name: 'Quần short', icon: <FaSocks /> },
  { name: 'Phụ kiện', icon: <FaGem /> },
];

const CategoryNav = () => {
  return (
    <nav className="category-nav">
      <ul className="category-nav__list">
        {categories.map((cat, idx) => (
          <li key={idx} className="category-nav__item">
            <a href="#" className="category-nav__link">
              <span className="category-nav__icon">{cat.icon}</span>
              <span>{cat.name}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default CategoryNav; 