import React, { useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const AdminModal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnBackdrop = true,
  closeOnEscape = true,
  footer,
  className = ''
}) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && closeOnEscape) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, closeOnEscape]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && closeOnBackdrop) {
      onClose();
    }
  };

  const getModalSize = () => {
    switch (size) {
      case 'sm':
        return 'max-width: 400px;';
      case 'lg':
        return 'max-width: 800px;';
      case 'xl':
        return 'max-width: 1200px;';
      default:
        return 'max-width: 600px;';
    }
  };

  return (
    <div className="admin-modal" onClick={handleBackdropClick}>
      <div 
        className={`admin-modal-dialog ${className}`}
        style={{ style: getModalSize() }}
      >
        <div className="admin-modal-content">
          <div className="admin-modal-header">
            <h3 className="admin-modal-title">{title}</h3>
            {showCloseButton && (
              <button
                className="admin-modal-close"
                onClick={onClose}
                style={{
                  position: 'absolute',
                  right: '20px',
                  top: '20px',
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  fontSize: '20px',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '50%',
                  transition: 'background-color 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                <FaTimes />
              </button>
            )}
          </div>
          
          <div className="admin-modal-body">
            {children}
          </div>
          
          {footer && (
            <div className="admin-modal-footer">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminModal;
