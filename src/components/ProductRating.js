import React, { useState, useEffect } from "react";
import { FaStar, FaUser, FaCalendarAlt } from "react-icons/fa";
import danhGiaService from "../services/danhGiaService";
import Toast from "./Toast";

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

      if (hasReviewed && userReview) {
        // Cập nhật đánh giá
        await danhGiaService.updateDanhGia(userReview.id, reviewData);
        showToast("Cập nhật đánh giá thành công!", "success");
      } else {
        // Tạo đánh giá mới
        await danhGiaService.createDanhGia(reviewData);
        setHasReviewed(true);
        showToast(
          "Đánh giá thành công! Cảm ơn bạn đã chia sẻ ý kiến.",
          "success"
        );
      }

      // Reload data
      await loadReviews();
      await loadRatingStats();
      await checkUserReview();

      // Reset form nếu là đánh giá mới
      if (!hasReviewed) {
        setRating(0);
        setComment("");
      }

      // Callback để cập nhật rating ở component cha
      if (onRatingChange) {
        onRatingChange(ratingStats?.trungBinhSao || 0);
      }
    } catch (error) {
      console.error("Lỗi khi gửi đánh giá:", error);
      showToast(
        error.response?.data || "Có lỗi xảy ra khi gửi đánh giá",
        "error"
      );
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
    setTimeout(() => setToast({ ...toast, visible: false }), 3000);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderStars = (rating, interactive = false, size = 16) => {
    return [...Array(5)].map((_, index) => {
      const starValue = index + 1;
      return (
        <FaStar
          key={index}
          size={size}
          className={`star ${interactive ? "interactive" : ""}`}
          style={{
            color: starValue <= (hover || rating) ? "#ffc107" : "#e4e5e9",
            cursor: interactive ? "pointer" : "default",
          }}
          onClick={() => interactive && setRating(starValue)}
          onMouseEnter={() => interactive && setHover(starValue)}
          onMouseLeave={() => interactive && setHover(0)}
        />
      );
    });
  };

  const renderRatingDistribution = () => {
    if (!ratingStats?.phanBoSao) return null;

    const total = ratingStats.tongSoDanhGia;
    return (
      <div className="rating-distribution">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = ratingStats.phanBoSao[star] || 0;
          const percentage = total > 0 ? (count / total) * 100 : 0;
          return (
            <div key={star} className="rating-bar">
              <span className="star-label">{star} sao</span>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <span className="count">{count}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="product-rating">
      <Toast
        visible={toast.visible}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ ...toast, visible: false })}
      />

      {/* Rating Summary */}
      {ratingStats && (
        <div className="rating-summary">
          <div className="rating-overview">
            <div className="average-rating">
              <span className="rating-number">
                {ratingStats.trungBinhSao.toFixed(1)}
              </span>
              <div className="stars">
                {renderStars(Math.round(ratingStats.trungBinhSao))}
              </div>
              <span className="total-reviews">
                {ratingStats.tongSoDanhGia} đánh giá
              </span>
            </div>
            {renderRatingDistribution()}
          </div>
        </div>
      )}

      {/* Review Form */}
      {customerId && (
        <div className="review-form">
          <h4>{hasReviewed ? "Cập nhật đánh giá của bạn" : "Viết đánh giá"}</h4>
          <div className="rating-input">
            <label>Đánh giá của bạn:</label>
            <div className="stars-input">
              {renderStars(rating, true, 24)}
              <span className="rating-text">
                {rating > 0 ? `${rating} sao` : "Chọn số sao"}
              </span>
            </div>
          </div>
          <div className="comment-input">
            <label>Bình luận:</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
              rows="4"
              maxLength="500"
            />
            <span className="char-count">{comment.length}/500</span>
          </div>
          <button
            className="submit-review-btn"
            onClick={handleSubmitReview}
            disabled={submitting || !rating || !comment.trim()}
          >
            {submitting
              ? "Đang gửi..."
              : hasReviewed
              ? "Cập nhật đánh giá"
              : "Gửi đánh giá"}
          </button>
        </div>
      )}

      {/* Reviews List */}
      <div className="reviews-section">
        <h4>Đánh giá từ khách hàng ({reviews.length})</h4>
        {loading ? (
          <div className="loading">Đang tải đánh giá...</div>
        ) : reviews.length > 0 ? (
          <div className="reviews-list">
            {reviews.map((review) => (
              <div key={review.id} className="review-item">
                <div className="review-header">
                  <div className="reviewer-info">
                    <FaUser className="user-icon" />
                    <span className="reviewer-name">{review.tenKhachHang}</span>
                  </div>
                  <div className="review-rating">
                    {renderStars(review.soSao, false, 14)}
                  </div>
                  <div className="review-date">
                    <FaCalendarAlt size={12} />
                    <span>{formatDate(review.ngayDanhGia)}</span>
                  </div>
                </div>
                <div className="review-content">
                  <p>{review.binhLuan}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-reviews">
            <p>Chưa có đánh giá nào cho sản phẩm này.</p>
            {customerId && <p>Hãy là người đầu tiên đánh giá sản phẩm này!</p>}
          </div>
        )}
      </div>

      <style jsx>{`
        .product-rating {
          margin: 20px 0;
          padding: 20px;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .rating-summary {
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid #eee;
        }

        .rating-overview {
          display: flex;
          gap: 30px;
          align-items: flex-start;
        }

        .average-rating {
          text-align: center;
          min-width: 150px;
        }

        .rating-number {
          font-size: 48px;
          font-weight: bold;
          color: #333;
          display: block;
        }

        .stars {
          display: flex;
          justify-content: center;
          gap: 2px;
          margin: 8px 0;
        }

        .star {
          transition: color 0.2s ease;
        }

        .star.interactive:hover {
          transform: scale(1.1);
        }

        .total-reviews {
          color: #666;
          font-size: 14px;
        }

        .rating-distribution {
          flex: 1;
        }

        .rating-bar {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }

        .star-label {
          min-width: 50px;
          font-size: 14px;
        }

        .progress-bar {
          flex: 1;
          height: 8px;
          background: #f0f0f0;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: #ffc107;
          transition: width 0.3s ease;
        }

        .count {
          min-width: 30px;
          text-align: right;
          font-size: 14px;
          color: #666;
        }

        .review-form {
          margin-bottom: 30px;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .review-form h4 {
          margin-bottom: 15px;
          color: #333;
        }

        .rating-input {
          margin-bottom: 15px;
        }

        .rating-input label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
        }

        .stars-input {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .rating-text {
          font-size: 14px;
          color: #666;
        }

        .comment-input {
          margin-bottom: 15px;
        }

        .comment-input label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
        }

        .comment-input textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          resize: vertical;
          font-family: inherit;
        }

        .char-count {
          display: block;
          text-align: right;
          font-size: 12px;
          color: #666;
          margin-top: 4px;
        }

        .submit-review-btn {
          background: #007bff;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 600;
          transition: background 0.2s ease;
        }

        .submit-review-btn:hover:not(:disabled) {
          background: #0056b3;
        }

        .submit-review-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .reviews-section h4 {
          margin-bottom: 15px;
          color: #333;
        }

        .loading {
          text-align: center;
          color: #666;
          padding: 20px;
        }

        .reviews-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .review-item {
          padding: 15px;
          border: 1px solid #eee;
          border-radius: 6px;
          background: #fafafa;
        }

        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          flex-wrap: wrap;
          gap: 10px;
        }

        .reviewer-info {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .user-icon {
          color: #007bff;
        }

        .reviewer-name {
          font-weight: 600;
          color: #333;
        }

        .review-rating {
          display: flex;
          gap: 2px;
        }

        .review-date {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #666;
          font-size: 12px;
        }

        .review-content p {
          margin: 0;
          line-height: 1.5;
          color: #333;
        }

        .no-reviews {
          text-align: center;
          color: #666;
          padding: 20px;
        }

        @media (max-width: 768px) {
          .rating-overview {
            flex-direction: column;
            gap: 20px;
          }

          .review-header {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductRating;
