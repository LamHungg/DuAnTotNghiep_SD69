import React from "react";

const AdminStatsCard = ({
  title,
  value,
  icon,
  change,
  changeType = "positive",
  color = "primary",
  onClick,
}) => {
  const formatValue = (val) => {
    if (typeof val === "number") {
      if (val >= 1000000) {
        return `${(val / 1000000).toFixed(1)}M`;
      } else if (val >= 1000) {
        return `${(val / 1000).toFixed(1)}K`;
      }
      return val.toLocaleString("vi-VN");
    }
    return val;
  };

  const formatChange = (change) => {
    if (!change) return null;
    const isPositive = change >= 0;
    const formattedChange = Math.abs(change).toFixed(1);
    return `${isPositive ? "+" : "-"}${formattedChange}%`;
  };

  return (
    <div
      className={`stat-card stat-card-${color} admin-fade-in`}
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      <div className="stat-card-icon">{icon}</div>
      <div className="stat-card-content">
        <div className="stat-card-value">{formatValue(value)}</div>
        <div className="stat-card-label">{title}</div>
        {change !== undefined && (
          <div className={`stat-card-change ${changeType}`}>
            {formatChange(change)}
            {changeType === "positive" ? (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M7 14l5-5 5 5z" />
              </svg>
            ) : (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M7 10l5 5 5-5z" />
              </svg>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminStatsCard;
