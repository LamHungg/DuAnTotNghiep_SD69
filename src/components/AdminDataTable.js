import React from 'react';
import { FaEye, FaEdit, FaTrash, FaSearch, FaFilter } from 'react-icons/fa';

const AdminDataTable = ({
  title,
  data,
  columns,
  onAdd,
  onEdit,
  onDelete,
  onView,
  searchTerm,
  onSearchChange,
  filters,
  onFilterChange,
  loading = false,
  emptyMessage = "Không có dữ liệu",
  showActions = true,
  showSearch = true,
  showFilters = true
}) => {
  const renderCell = (item, column) => {
    if (column.render) {
      return column.render(item[column.key], item);
    }
    
    if (column.type === 'badge') {
      return (
        <span className={`admin-badge admin-badge-${item[column.key] || 'primary'}`}>
          {column.options?.[item[column.key]] || item[column.key]}
        </span>
      );
    }
    
    if (column.type === 'currency') {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(item[column.key]);
    }
    
    if (column.type === 'date') {
      return new Date(item[column.key]).toLocaleDateString('vi-VN');
    }
    
    return item[column.key];
  };

  const renderActions = (item) => (
    <div className="admin-action-buttons">
      {onView && (
        <button
          className="admin-action-btn admin-action-btn-view"
          onClick={() => onView(item)}
          title="Xem chi tiết"
        >
          <FaEye />
        </button>
      )}
      {onEdit && (
        <button
          className="admin-action-btn admin-action-btn-edit"
          onClick={() => onEdit(item)}
          title="Chỉnh sửa"
        >
          <FaEdit />
        </button>
      )}
      {onDelete && (
        <button
          className="admin-action-btn admin-action-btn-delete"
          onClick={() => onDelete(item)}
          title="Xóa"
        >
          <FaTrash />
        </button>
      )}
    </div>
  );

  return (
    <div className="data-table admin-fade-in">
      <div className="data-table-header">
        <h2 className="data-table-title">{title}</h2>
        <div className="data-table-actions">
          {onAdd && (
            <button className="admin-btn admin-btn-primary" onClick={onAdd}>
              Thêm mới
            </button>
          )}
        </div>
      </div>

      {(showSearch || showFilters) && (
        <div className="admin-search-filters">
          {showSearch && (
            <div className="admin-filter-group">
              <label className="admin-filter-label">
                <FaSearch className="me-2" />
                Tìm kiếm
              </label>
              <input
                type="text"
                className="admin-filter-input"
                placeholder="Nhập từ khóa tìm kiếm..."
                value={searchTerm || ''}
                onChange={(e) => onSearchChange?.(e.target.value)}
              />
            </div>
          )}
          
          {showFilters && filters?.map((filter, index) => (
            <div key={index} className="admin-filter-group">
              <label className="admin-filter-label">
                <FaFilter className="me-2" />
                {filter.label}
              </label>
              {filter.type === 'select' ? (
                <select
                  className="admin-filter-input"
                  value={filter.value || ''}
                  onChange={(e) => onFilterChange?.(filter.key, e.target.value)}
                >
                  <option value="">Tất cả</option>
                  {filter.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={filter.type || 'text'}
                  className="admin-filter-input"
                  placeholder={filter.placeholder}
                  value={filter.value || ''}
                  onChange={(e) => onFilterChange?.(filter.key, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
      )}

      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key} style={column.headerStyle}>
                  {column.title}
                </th>
              ))}
              {showActions && <th style={{ width: '120px' }}>Thao tác</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + (showActions ? 1 : 0)} className="text-center py-4">
                  <div className="loading-spinner mx-auto"></div>
                  <div className="mt-2">Đang tải dữ liệu...</div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (showActions ? 1 : 0)} className="text-center py-4">
                  <div className="text-muted">{emptyMessage}</div>
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr key={item.id || index}>
                  {columns.map((column) => (
                    <td key={column.key} style={column.cellStyle}>
                      {renderCell(item, column)}
                    </td>
                  ))}
                  {showActions && (
                    <td>
                      {renderActions(item)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDataTable;
