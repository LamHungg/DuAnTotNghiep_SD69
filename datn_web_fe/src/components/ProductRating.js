import React, { useState, useEffect } from "react";
import {
  FaStar,
  FaUser,
  FaCalendarAlt,
  FaThumbsUp,
  FaHeart,
  FaSmile,
  FaMeh,
  FaFrown,
} from "react-icons/fa";
import danhGiaService from "../services/danhGiaService";
import Toast from "./Toast";
import "./ProductRating.css";

const ProductRating = ({ productId, customerId, onRatingChange }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);
  const [ratingStats, setRatingStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [userReview, setUserReview] = useState(null);
  const [toast, setToast] = useState({
    visible: false,
    type: "success",
    message: "",
  });

  // Load đánh giá và thống kê
  useEffect(() => {
    if (productId) {
      loadReviews();
      loadRatingStats();
      if (customerId) {
        checkUserReview();
      }
    }
  }, [productId, customerId]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const reviewsData = await danhGiaService.getDanhGiaBySanPham(productId);
      setReviews(reviewsData || []);
    } catch (error) {
      console.error("Lỗi khi tải đánh giá:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadRatingStats = async () => {
    try {
      const stats = await danhGiaService.getThongKeDanhGia(productId);
      setRatingStats(stats);
    } catch (error) {
      console.error("Lỗi khi tải thống kê đánh giá:", error);
    }
  };

  const checkUserReview = async () => {
    try {
      const hasReviewed = await danhGiaService.hasKhachHangReviewed(
        customerId,
        productId
      );
      setHasReviewed(hasReviewed);

      if (hasReviewed) {
        const userReviewData =
          await danhGiaService.getDanhGiaByKhachHangAndSanPham(
            customerId,
            productId
          );
        setUserReview(userReviewData);
        setRating(userReviewData.soSao);
        setComment(userReviewData.binhLuan || "");
      }
    } catch (error) {
      console.error("Lỗi khi kiểm tra đánh giá người dùng:", error);
    }
  };

  const handleSubmitReview = async () => {
    if (!rating || !comment.trim()) {
      showToast("Vui lòng chọn số sao và viết bình luận", "error");
      return;
    }

    try {
      setSubmitting(true);
      const reviewData = {
        idKhachHang: customerId,
        idSanPham: productId,
        soSao: rating,
        binhLuan: comment.trim(),
      };

      if (hasReviewed) {
        await danhGiaService.updateDanhGia(userReview.id, reviewData);
        showToast("Cập nhật đánh giá thành công!", "success");
      } else {
        await danhGiaService.createDanhGia(reviewData);
        showToast("Đánh giá thành công! Cảm ơn bạn.", "success");
        setHasReviewed(true);
      }

      // Reload data
      await loadReviews();
      await loadRatingStats();
      await checkUserReview();

      // Callback để cập nhật UI parent
      if (onRatingChange) {
        onRatingChange();
      }
    } catch (error) {
      console.error("Lỗi khi gửi đánh giá:", error);
      showToast("Có lỗi xảy ra. Vui lòng thử lại.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!userReview) return;

    try {
      setSubmitting(true);
      await danhGiaService.deleteDanhGia(userReview.id);
      showToast("Đã xóa đánh giá", "success");

      // Reset form
      setRating(0);
      setComment("");
      setHasReviewed(false);
      setUserReview(null);

      // Reload data
      await loadReviews();
      await loadRatingStats();

      // Callback để cập nhật UI parent
      if (onRatingChange) {
        onRatingChange();
      }
    } catch (error) {
      console.error("Lỗi khi xóa đánh giá:", error);
      showToast("Có lỗi xảy ra. Vui lòng thử lại.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const showToast = (message, type = "success") => {
    setToast({
      visible: true,
      type,
      message,
    });
  };

  const getRatingEmoji = (rating) => {
    if (rating >= 4.5) return <FaSmile />;
    if (rating >= 3.5) return <FaMeh />;
    return <FaFrown />;
  };

  const getRatingText = (rating) => {
    if (rating >= 4.5) return "Tuyệt vời";
    if (rating >= 4.0) return "Rất tốt";
    if (rating >= 3.5) return "Tốt";
    if (rating >= 3.0) return "Khá";
    if (rating >= 2.5) return "Trung bình";
    if (rating >= 2.0) return "Kém";
    return "Rất kém";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="product-rating">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Đang tải đánh giá...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-rating">
      <Toast
        visible={toast.visible}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ ...toast, visible: false })}
      />

      {/* Rating Summary */}
      <div className="rating-summary">
        <div className="rating-header">
          <h3>Đánh giá sản phẩm</h3>
          {ratingStats && (
            <div className="rating-badge">
              <span className="rating-score">
                {ratingStats.trungBinhSao?.toFixed(1) || "0.0"}
              </span>
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className={
                      star <= (ratingStats.trungBinhSao || 0)
                        ? "star filled"
                        : "star"
                    }
                  />
                ))}
              </div>
              <span className="rating-text">
                {getRatingText(ratingStats.trungBinhSao || 0)}
              </span>
              <span className="rating-emoji">
                {getRatingEmoji(ratingStats.trungBinhSao || 0)}
              </span>
            </div>
          )}
        </div>

        {ratingStats && (
          <div className="rating-overview">
            <div className="rating-stats">
              <div className="stat-item">
                <span className="stat-number">
                  {ratingStats.tongSoDanhGia || 0}
                </span>
                <span className="stat-label">Đánh giá</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">
                  {ratingStats.tongSoSao || 0}
                </span>
                <span className="stat-label">Sao</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Review Form */}
      {customerId && (
        <div className="review-form">
          <h4>{hasReviewed ? "Cập nhật đánh giá của bạn" : "Viết đánh giá"}</h4>

          <div className="star-rating">
            <label>Đánh giá của bạn:</label>
            <div className="stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  className={star <= (hover || rating) ? "star filled" : "star"}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                />
              ))}
            </div>
            <span className="rating-text">
              {rating > 0 && getRatingText(rating)}
            </span>
          </div>

          <div className="comment-section">
            <label>Bình luận:</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
              rows="4"
              disabled={submitting}
            />
          </div>

          <div className="form-actions">
            <button
              className="submit-btn"
              onClick={handleSubmitReview}
              disabled={submitting || !rating || !comment.trim()}
            >
              {submitting
                ? "Đang gửi..."
                : hasReviewed
                ? "Cập nhật"
                : "Gửi đánh giá"}
            </button>

            {hasReviewed && (
              <button
                className="delete-btn"
                onClick={handleDeleteReview}
                disabled={submitting}
              >
                Xóa đánh giá
              </button>
            )}
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="reviews-section">
        <h4>Đánh giá từ khách hàng ({reviews.length})</h4>

        {reviews.length === 0 ? (
          <div className="no-reviews">
            <div className="empty-state">
              <FaStar className="empty-icon" />
              <h5>Chưa có đánh giá nào</h5>
              <p>Hãy là người đầu tiên đánh giá sản phẩm này!</p>
              {!customerId && (
                <button
                  className="be-first-btn"
                  onClick={() => (window.location.href = "/login")}
                >
                  Đăng nhập để đánh giá
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="reviews-list">
            {reviews.map((review) => (
              <div key={review.id} className="review-item">
                <div className="review-header">
                  <div className="reviewer-info">
                    <FaUser className="user-icon" />
                    <span className="reviewer-name">
                      {review.tenKhachHang || "Khách hàng"}
                    </span>
                  </div>
                  <div className="review-meta">
                    <div className="rating-badge-small">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          className={
                            star <= review.soSao ? "star filled" : "star"
                          }
                        />
                      ))}
                    </div>
                    <span className="review-date">
                      <FaCalendarAlt />
                      {formatDate(review.ngayDanhGia)}
                    </span>
                  </div>
                </div>

                <div className="review-content">
                  <p>{review.binhLuan}</p>
                </div>

                <div className="review-actions">
                  <button className="action-btn">
                    <FaThumbsUp />
                    Hữu ích
                  </button>
                  <button className="action-btn">
                    <FaHeart />
                    Thích
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductRating;
