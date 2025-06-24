import React from "react";

/**
 * type: 'success' | 'error' | 'warning' | 'info'
 * message: string
 * onClose: function
 * visible: boolean
 */
const iconMap = {
  success: (
    <svg width="22" height="22" viewBox="0 0 16 16" fill="#198754">
      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.97 11.03a.75.75 0 0 0 1.07 0l3-3a.75.75 0 1 0-1.06-1.06L7.5 9.44 6.03 7.97a.75.75 0 1 0-1.06 1.06l2 2z" />
    </svg>
  ),
  error: (
    <svg width="22" height="22" viewBox="0 0 16 16" fill="#d32f2f">
      <path d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16zm.93-11.412-1 6a.552.552 0 0 1-1.1 0l-1-6A.552.552 0 0 1 6.552 4h2.896a.552.552 0 0 1 .482.588zM8 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
    </svg>
  ),
  warning: (
    <svg width="22" height="22" viewBox="0 0 16 16" fill="#f59e42">
      <path d="M8.982 1.566a1.13 1.13 0 0 0-1.964 0L.165 13.233c-.457.778.091 1.767.982 1.767h13.707c.89 0 1.438-.99.982-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
    </svg>
  ),
  info: (
    <svg width="22" height="22" viewBox="0 0 16 16" fill="#1976d2">
      <path d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16zM8.93 6.588a.5.5 0 0 0-.854-.354l-2 2a.5.5 0 0 0 .708.708l1.146-1.147V11.5a.5.5 0 0 0 1 0V6.588z" />
    </svg>
  ),
};

const Toast = ({ type = "info", message, visible, onClose }) => {
  if (!visible) return null;
  let color = "#1976d2";
  if (type === "success") color = "#198754";
  if (type === "error") color = "#d32f2f";
  if (type === "warning") color = "#f59e42";

  return (
    <div
      style={{
        position: "fixed",
        top: 32,
        right: 32,
        zIndex: 9999,
        minWidth: 320,
        background: "#fff",
        border: `1.5px solid ${color}`,
        borderRadius: 10,
        boxShadow: "0 4px 24px rgba(0,0,0,0.13)",
        padding: "18px 28px 12px 24px",
        color,
        fontWeight: 500,
        animation: "fadeIn 0.3s",
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      <span
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: color + "22",
        }}
      >
        {iconMap[type]}
      </span>
      <span style={{ flex: 1, fontSize: 17 }}>{message}</span>
      <span
        style={{
          marginLeft: 18,
          cursor: "pointer",
          fontSize: 22,
          color,
          opacity: 0.7,
        }}
        onClick={onClose}
        title="Đóng"
      >
        ×
      </span>
    </div>
  );
};

export default Toast;
