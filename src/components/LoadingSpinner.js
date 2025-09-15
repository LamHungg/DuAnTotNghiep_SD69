import React from "react";
import { FaSpinner } from "react-icons/fa";
import "./LoadingSpinner.css";

const LoadingSpinner = ({
  size = "medium",
  text = "Đang tải...",
  fullScreen = false,
  overlay = false,
}) => {
  const sizeClasses = {
    small: "spinner-small",
    medium: "spinner-medium",
    large: "spinner-large",
  };

  const spinnerClass = `loading-spinner ${
    sizeClasses[size] || sizeClasses.medium
  }`;

  if (fullScreen) {
    return (
      <div className="loading-fullscreen">
        <div className="loading-content">
          <div className={spinnerClass}>
            <FaSpinner />
          </div>
          {text && <p className="loading-text">{text}</p>}
        </div>
      </div>
    );
  }

  if (overlay) {
    return (
      <div className="loading-overlay">
        <div className="loading-content">
          <div className={spinnerClass}>
            <FaSpinner />
          </div>
          {text && <p className="loading-text">{text}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="loading-inline">
      <div className={spinnerClass}>
        <FaSpinner />
      </div>
      {text && <p className="loading-text">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
