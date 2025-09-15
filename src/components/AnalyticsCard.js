import React from "react";
import { FaTrendingUp, FaTrendingDown, FaMinus } from "react-icons/fa";
import "./AnalyticsCard.css";

const AnalyticsCard = ({
  title,
  value,
  previousValue,
  icon,
  color = "#667eea",
  format = "number",
  suffix = "",
  prefix = "",
}) => {
  const formatValue = (val) => {
    if (format === "currency") {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(val);
    } else if (format === "percentage") {
      return `${val}%`;
    } else if (format === "number") {
      return new Intl.NumberFormat("vi-VN").format(val);
    }
    return val;
  };

  const calculateChange = () => {
    if (!previousValue || previousValue === 0) {
      return { value: 0, isPositive: true, hasChange: false };
    }
    const change = ((value - previousValue) / previousValue) * 100;
    return {
      value: Math.abs(change).toFixed(1),
      isPositive: change >= 0,
      hasChange: true,
    };
  };

  const change = calculateChange();

  return (
    <div className="analytics-card" style={{ borderTopColor: color }}>
      <div className="analytics-card-header">
        <div className="analytics-card-icon" style={{ backgroundColor: color }}>
          {icon}
        </div>
        <div className="analytics-card-change">
          {change.hasChange ? (
            <>
              {change.isPositive ? (
                <FaTrendingUp className="trend-icon positive" />
              ) : (
                <FaTrendingDown className="trend-icon negative" />
              )}
              <span
                className={`change-value ${
                  change.isPositive ? "positive" : "negative"
                }`}
              >
                {change.value}%
              </span>
            </>
          ) : (
            <FaMinus className="trend-icon neutral" />
          )}
        </div>
      </div>

      <div className="analytics-card-content">
        <h3 className="analytics-card-title">{title}</h3>
        <div className="analytics-card-value">
          {prefix}
          {formatValue(value)}
          {suffix}
        </div>
        {change.hasChange && (
          <div className="analytics-card-subtitle">
            {change.isPositive ? "Tăng" : "Giảm"} {change.value}% so với trước
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsCard;
