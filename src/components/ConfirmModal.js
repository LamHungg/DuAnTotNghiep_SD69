import React from "react";

const ConfirmModal = ({
  visible,
  title = "Xác nhận",
  message = "Bạn có chắc chắn muốn thực hiện thao tác này?",
  onConfirm,
  onCancel,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
}) => {
  if (!visible) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.25)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          minWidth: 340,
          maxWidth: 400,
          boxShadow: "0 8px 32px 0 rgba(31,38,135,0.18)",
          padding: 32,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={{ fontSize: 28, color: "#f59e42", marginBottom: 8 }}>
          <b>!</b>
        </div>
        <h4 style={{ fontWeight: 700, fontSize: 20, marginBottom: 12 }}>
          {title}
        </h4>
        <div
          style={{
            fontSize: 16,
            color: "#333",
            marginBottom: 28,
            textAlign: "center",
          }}
        >
          {message}
        </div>
        <div
          style={{
            display: "flex",
            gap: 16,
            width: "100%",
            justifyContent: "center",
          }}
        >
          <button
            onClick={onCancel}
            style={{
              borderRadius: 8,
              minWidth: 80,
              fontWeight: 500,
              background: "#f5f5f5",
              color: "#444",
              border: "none",
              padding: "10px 0",
              fontSize: 16,
              cursor: "pointer",
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            style={{
              borderRadius: 8,
              minWidth: 90,
              fontWeight: 600,
              background: "#1976d2",
              color: "#fff",
              border: "none",
              padding: "10px 0",
              fontSize: 16,
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(25,118,210,0.08)",
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
