import React, { useState, useEffect } from "react";
import { FaUsers, FaBox, FaShoppingCart, FaHeart } from "react-icons/fa";
import { getStatistics } from "../services/homeService";
import "../styles/main.css";

const Statistics = () => {
  const [statistics, setStatistics] = useState({
    customers: 0,
    products: 0,
    orders: 0,
    satisfaction: 0,
  });
  const [loading, setLoading] = useState(true);

  // Fetch statistics
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        const data = await getStatistics();
        setStatistics(data);
      } catch (error) {
        console.error("Error fetching statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  const statsItems = [
    {
      icon: <FaUsers />,
      value: loading ? "..." : statistics.customers.toLocaleString(),
      label: "Khách hàng",
      color: "#007bff",
    },
    {
      icon: <FaBox />,
      value: loading ? "..." : statistics.products.toLocaleString(),
      label: "Sản phẩm",
      color: "#28a745",
    },
    {
      icon: <FaShoppingCart />,
      value: loading ? "..." : statistics.orders.toLocaleString(),
      label: "Đơn hàng",
      color: "#ffc107",
    },
    {
      icon: <FaHeart />,
      value: loading ? "..." : `${statistics.satisfaction}%`,
      label: "Hài lòng",
      color: "#dc3545",
    },
  ];

  return (
    <section className="statistics">
      <div className="statistics__background">
        <img
          src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=100"
          alt="ZMEN Sports Store Background"
          className="statistics__bg-image"
        />
        <div className="statistics__overlay"></div>
      </div>
      <div className="statistics__container">
        <h2 className="statistics__title">
          ZMEN Sports - Thương hiệu thể thao được tin tưởng
        </h2>
        <div className="statistics__grid">
          {statsItems.map((item, index) => (
            <div key={index} className="statistics__item">
              <div className="statistics__icon" style={{ color: item.color }}>
                {item.icon}
              </div>
              <div className="statistics__content">
                <div className="statistics__value">{item.value}</div>
                <div className="statistics__label">{item.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Statistics;
