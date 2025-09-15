import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaSort,
  FaSortUp,
  FaSortDown,
} from "react-icons/fa";
import LoadingSpinner from "./LoadingSpinner";
import EmptyState from "./EmptyState";
import "./DataTable.css";

const DataTable = ({
  data = [],
  columns = [],
  loading = false,
  error = null,
  searchable = true,
  pagination = true,
  pageSize = 10,
  searchPlaceholder = "Tìm kiếm...",
  emptyMessage = "Không có dữ liệu",
  onRowClick,
  onRefresh,
  className = "",
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [filteredData, setFilteredData] = useState([]);

  // Filter and sort data
  useEffect(() => {
    let result = [...data];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter((item) =>
        columns.some((column) => {
          const value = column.getValue
            ? column.getValue(item)
            : item[column.key];
          return value && value.toString().toLowerCase().includes(searchLower);
        })
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        const aValue =
          columns.find((col) => col.key === sortConfig.key)?.getValue?.(a) ??
          a[sortConfig.key];
        const bValue =
          columns.find((col) => col.key === sortConfig.key)?.getValue?.(b) ??
          b[sortConfig.key];

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    setFilteredData(result);
    setCurrentPage(1); // Reset to first page when filtering
  }, [data, searchTerm, sortConfig, columns]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = pagination
    ? filteredData.slice(startIndex, endIndex)
    : filteredData;

  // Sorting
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="sort-icon" />;
    return sortConfig.direction === "asc" ? (
      <FaSortUp className="sort-icon active" />
    ) : (
      <FaSortDown className="sort-icon active" />
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className={`data-table-container ${className}`}>
        <LoadingSpinner text="Đang tải dữ liệu..." />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`data-table-container ${className}`}>
        <EmptyState
          type="error"
          title="Lỗi tải dữ liệu"
          description={error}
          actionText="Thử lại"
          onAction={onRefresh}
        />
      </div>
    );
  }

  return (
    <div className={`data-table-container ${className}`}>
      {/* Search Bar */}
      {searchable && (
        <div className="data-table-search">
          <div className="search-input-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          {onRefresh && (
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={onRefresh}
              title="Làm mới"
            >
              Làm mới
            </button>
          )}
        </div>
      )}

      {/* Table */}
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={column.sortable !== false ? "sortable" : ""}
                  onClick={() =>
                    column.sortable !== false && handleSort(column.key)
                  }
                  style={{ width: column.width }}
                >
                  <div className="th-content">
                    {column.header}
                    {column.sortable !== false && getSortIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="empty-cell">
                  <EmptyState
                    type="search"
                    title={emptyMessage}
                    description={
                      searchTerm
                        ? "Không tìm thấy kết quả phù hợp"
                        : "Chưa có dữ liệu nào"
                    }
                    showAction={false}
                  />
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={onRowClick ? "clickable" : ""}
                >
                  {columns.map((column, colIndex) => (
                    <td key={colIndex}>
                      {column.render
                        ? column.render(row)
                        : row[column.key] || ""}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="data-table-pagination">
          <div className="pagination-info">
            Hiển thị {startIndex + 1}-{Math.min(endIndex, filteredData.length)}
            trong tổng số {filteredData.length} kết quả
          </div>
          <div className="pagination-controls">
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <FaChevronLeft />
            </button>

            <span className="pagination-page">
              Trang {currentPage} / {totalPages}
            </span>

            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
