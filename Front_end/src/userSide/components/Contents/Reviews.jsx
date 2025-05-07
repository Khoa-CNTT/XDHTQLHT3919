import React, { useState, useEffect } from 'react';
import {
  getAllReviews,
  createReview,
  replyToReview,
  updateReview,
  deleteReview
} from '../../../services/api/userAPI/ReviewAPI';
import Notification from '../../../userSide/components/Other/Notification';
import '../../../assets/Style/home-css/Reviews.css';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ comment: '', rating: 1 });
  const [replyForms, setReplyForms] = useState({});
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editForm, setEditForm] = useState({ comment: '', rating: 1 });
  const [notification, setNotification] = useState({ message: '', show: false, type: '' });

  const currentUserId = localStorage.getItem('idUser');
  const currentUserRole = localStorage.getItem('role'); // cần lưu từ login

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const data = await getAllReviews();
      setReviews(data);
    } catch (err) {
      showNotification('Lỗi tải đánh giá', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.comment.trim()) {
      showNotification('Bình luận không thể trống', 'error');
      return;
    }
    if (form.rating < 1 || form.rating > 5) {
      showNotification('Điểm đánh giá không hợp lệ', 'error');
      return;
    }

    try {
      await createReview(form);
      showNotification('Gửi đánh giá thành công', 'success');
      setForm({ comment: '', rating: 1 });
      loadReviews();
    } catch (err) {
      showNotification('Gửi đánh giá thất bại', 'error');
    }
  };

  const handleReplySubmit = async (e, reviewId) => {
    e.preventDefault();
    const replyText = replyForms[reviewId];
    if (!replyText?.trim()) return;

    try {
      await replyToReview(reviewId, { comment: replyText });
      setReplyForms({ ...replyForms, [reviewId]: '' });
      showNotification('Trả lời thành công', 'success');
      loadReviews();
    } catch {
      showNotification('Trả lời thất bại', 'error');
    }
  };

  const handleEdit = (review) => {
    setEditingReviewId(review.id);
    setEditForm({ comment: review.comment, rating: review.rating });
  };

  const handleUpdate = async (reviewId) => {
    try {
      await updateReview(reviewId, editForm);
      showNotification('Cập nhật thành công', 'success');
      setEditingReviewId(null);
      loadReviews();
    } catch {
      showNotification('Cập nhật thất bại', 'error');
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Bạn chắc chắn muốn xóa đánh giá này?')) return;
    try {
      await deleteReview(reviewId);
      showNotification('Xóa thành công', 'success');
      loadReviews();
    } catch {
      showNotification('Xóa thất bại', 'error');
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type, show: true });
  };

  const StarRating = ({ rating }) => (
    <span className="stars">
      {[...Array(5)].map((_, i) => (
        <span key={i} className={i < rating ? 'filled' : ''}>★</span>
      ))}
    </span>
  );

  return (
    <div className="review-user-modern">
      <Notification
        message={notification.message}
        show={notification.show}
        type={notification.type}
        onClose={() => setNotification({ ...notification, show: false })}
      />

      <h2>Đánh giá của bạn</h2>
      <form onSubmit={handleSubmit} className="review-form">
        <label>
          Bình luận:
          <textarea
            value={form.comment}
            onChange={(e) => setForm({ ...form, comment: e.target.value })}
            required
          />
        </label>
        <label>
          Điểm đánh giá:
          <div className="rating-stars-input">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={i < form.rating ? 'star selected' : 'star'}
                onClick={() => setForm({ ...form, rating: i + 1 })}
              >★</span>
            ))}
          </div>
        </label>
        <button type="submit">Gửi đánh giá</button>
      </form>

      <h3>Danh sách đánh giá</h3>
      <div className="review-list">
        {reviews.map((review) => (
          <div key={review.id} className="review-card">
            <div className="review-top">
              <strong>{review.userName}</strong>
              <StarRating rating={review.rating} />
              <span className="date">{new Date(review.createAt).toLocaleString()}</span>
            </div>

            {editingReviewId === review.id ? (
              <div className="edit-form">
                <textarea
                  value={editForm.comment}
                  onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                />
                <div className="rating-stars-input">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={i < editForm.rating ? 'star selected' : 'star'}
                      onClick={() => setEditForm({ ...editForm, rating: i + 1 })}
                    >★</span>
                  ))}
                </div>
                <button onClick={() => handleUpdate(review.id)}>Lưu</button>
                <button onClick={() => setEditingReviewId(null)}>Hủy</button>
              </div>
            ) : (
              <>
                <p className="comment">{review.comment}</p>
                {(review.idUser === currentUserId || currentUserRole === 'Admin') && (
                  <div className="review-actions">
                    <button onClick={() => handleEdit(review)}>Sửa</button>
                    <button onClick={() => handleDelete(review.id)}>Xóa</button>
                  </div>
                )}
              </>
            )}

            {review.replies?.length > 0 && (
              <div className="reply-list">
                {review.replies.map((reply) => (
                  <div key={reply.id} className="reply-item">
                    <strong>{reply.userName}</strong>: {reply.comment}
                    <div className="date-reply">{new Date(reply.createAt).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={(e) => handleReplySubmit(e, review.id)} className="reply-form">
              <textarea
                placeholder="Trả lời đánh giá..."
                value={replyForms[review.id] || ''}
                onChange={(e) =>
                  setReplyForms({ ...replyForms, [review.id]: e.target.value })
                }
              />
              <button type="submit">Trả lời</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
