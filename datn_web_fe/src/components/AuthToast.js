import React, { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaTimes,
} from "react-icons/fa";
import "./AuthToast.css";

const AuthToast = ({
  visible,
  type = "success",
  message,
  onClose,
  duration = 4000,
}) => {
  const [isVisible, setIsVisible] = useState(visible);

  useEffect(() => {
    setIsVisible(visible);
  }, [visible]);

  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return <FaCheckCircle />;
      case "error":
        return <FaExclamationTriangle />;
      case "warning":
        return <FaExclamationTriangle />;
      case "info":
        return <FaInfoCircle />;
      default:
        return <FaCheckCircle />;
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="auth-toast">
      <div className="auth-toast-content">
        <div className={`auth-toast-icon ${type}`}>{getIcon()}</div>
        <div className="auth-toast-message">{message}</div>
        <button className="auth-toast-close" onClick={handleClose}>
          <FaTimes />
        </button>
      </div>
      <div className="auth-toast-progress">
        <div
          className={`auth-toast-progress-bar ${type}`}
          style={{
            animationDuration: `${duration}ms`,
          }}
        />
      </div>
    </div>
  );
};

export default AuthToast;
