import React from "react";
import { FaBox, FaSearch, FaPlus, FaInbox } from "react-icons/fa";
import "./EmptyState.css";

const EmptyState = ({
  type = "data",
  title = "Không có dữ liệu",
  description = "Hiện tại chưa có dữ liệu nào được hiển thị.",
  actionText = "Thêm mới",
  onAction,
  icon,
  showAction = true,
}) => {
  const getIcon = () => {
    if (icon) return icon;

    switch (type) {
      case "search":
        return <FaSearch />;
      case "add":
        return <FaPlus />;
      case "inbox":
        return <FaInbox />;
      default:
        return <FaBox />;
    }
  };

  return (
    <div className="empty-state">
      <div className="empty-state-icon">{getIcon()}</div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-description">{description}</p>
      {showAction && onAction && (
        <button className="empty-state-action" onClick={onAction}>
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
