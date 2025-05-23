import React, { useState, useEffect } from 'react';
import {
  getAllReviews,
  createReview,
  replyToReview,
  updateReview,
  deleteReview,
} from '../../../services/api/userAPI/reviewAPI';
import Notification from '../../../userSide/components/Other/Notification';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import '../../../assets/Style/home-css/Reviews.css';


const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ comment: '', rating: 1 });
  const [replyForms, setReplyForms] = useState({});
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editForm, setEditForm] = useState({ comment: '', rating: 1 });
  const [notification, setNotification] = useState({ message: '', show: false, type: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [replying, setReplying] = useState({});
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editReplyForm, setEditReplyForm] = useState({ comment: '' });


  const currentUserId = localStorage.getItem('idUser');
  const currentUserRole = localStorage.getItem('role');

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const data = await getAllReviews();
      // Sắp xếp mới nhất lên đầu
      setReviews(data.sort((a, b) => new Date(b.createAt) - new Date(a.createAt)));
    } catch (error) {
      showNotification('Lỗi tải đánh giá', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type, show: true });
  };

  // Tạo đánh giá mới
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.comment.trim()) {
      showNotification('Bình luận không được để trống', 'error');
      return;
    }
    if (form.rating < 1 || form.rating > 5) {
      showNotification('Điểm đánh giá phải từ 1 đến 5', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await createReview({ comment: form.comment, rating: form.rating });
      showNotification('Gửi đánh giá thành công', 'success');
      setForm({ comment: '', rating: 1 });
      loadReviews();
    } catch (error) {
      showNotification('Gửi đánh giá thất bại', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Trả lời đánh giá
  const handleReplySubmit = async (e, reviewId) => {
    e.preventDefault();
    const replyText = replyForms[reviewId];
    if (!replyText?.trim()) {
      showNotification('Nội dung trả lời không được để trống', 'error');
      return;
    }

    setReplying((prev) => ({ ...prev, [reviewId]: true }));
    try {
      await replyToReview(reviewId, { comment: replyText });
      setReplyForms((prev) => ({ ...prev, [reviewId]: '' }));
      showNotification('Trả lời thành công', 'success');
      loadReviews();
    } catch (error) {
      showNotification('Trả lời thất bại', 'error');
    } finally {
      setReplying((prev) => ({ ...prev, [reviewId]: false }));
    }
  };
  const handleEditReply = (reply) => {
    setEditingReplyId(reply.id);
    setEditReplyForm({ comment: reply.comment });
  };

  const handleUpdateReply = async (replyId) => {
  if (!editReplyForm.comment.trim()) {
    showNotification('Nội dung trả lời không được để trống', 'error');
    return;
  }

  try {
    await updateReview(replyId, { comment: editReplyForm.comment, rating: 1 });
    showNotification('Cập nhật trả lời thành công', 'success');
    setEditingReplyId(null);
    loadReviews();
  } catch (error) {
    showNotification('Cập nhật trả lời thất bại', 'error');
  }
};
  const handleDeleteReply = async (replyId) => {
    if (!window.confirm('Bạn chắc chắn muốn xóa trả lời này?')) return;

    try {
      await deleteReview(replyId);
      showNotification('Xóa trả lời thành công', 'success');
      loadReviews();
    } catch (error) {
      showNotification('Xóa trả lời thất bại', 'error');
    }
  };


  // Bắt đầu chỉnh sửa
  const handleEdit = (review) => {
    setEditingReviewId(review.id);
    setEditForm({ comment: review.comment, rating: review.rating });
  };

  // Lưu cập nhật đánh giá
  const handleUpdate = async (reviewId) => {
    if (!editForm.comment.trim()) {
      showNotification('Bình luận không được để trống', 'error');
      return;
    }
    if (editForm.rating < 1 || editForm.rating > 5) {
      showNotification('Điểm đánh giá phải từ 1 đến 5', 'error');
      return;
    }

    try {
      await updateReview(reviewId, { comment: editForm.comment, rating: editForm.rating });
      showNotification('Cập nhật thành công', 'success');
      setEditingReviewId(null);
      loadReviews();
    } catch (error) {
      showNotification('Cập nhật thất bại', 'error');
    }
  };

  // Xóa đánh giá
  const handleDelete = async (reviewId) => {
    if (!window.confirm('Bạn chắc chắn muốn xóa đánh giá này?')) return;
    try {
      await deleteReview(reviewId);
      showNotification('Xóa thành công', 'success');
      loadReviews();
    } catch (error) {
      showNotification('Xóa thất bại', 'error');
    }
  };

  const StarRating = ({ rating }) => {
    const ratingNumber = Number(rating);
    return (
      <span className="stars">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={i < ratingNumber ? 'filled' : ''}>
            ★
          </span>
        ))}
      </span>
    );
  };



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
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setForm({ ...form, rating: i + 1 })}
              >
                ★
              </span>
            ))}
          </div>
        </label>
        <button type="submit" disabled={submitting}>
          {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
        </button>
      </form>

      <h3>Danh sách đánh giá</h3>
      <div className="review-list">
        {loading ? (
          [...Array(3)].map((_, idx) => (
            <div key={idx} className="review-card">
              <Skeleton height={40} width="60%" />
              <Skeleton count={2} />
              <Skeleton height={50} />
            </div>
          ))
        ) : reviews.length === 0 ? (
          <p>Chưa có đánh giá nào.</p>
        ) : (
          reviews.map((review) => (

            <div key={review.id} className="review-card">

              <div className="review-top">
                <div className="user-info">
                  <img
                    src={review.avatarUrl || '/default-avatar.png'}
                    alt="avatar"
                    className="avatar"
                  />
                  <strong>{review.userName || (review.idUser === currentUserId ? 'Bạn' : 'Ẩn danh')}</strong>
                </div>

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
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && setEditForm({ ...editForm, rating: i + 1 })}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <div className="review-actions">
                      <button onClick={() => handleUpdate(review.id)}>Lưu</button>
                      <button onClick={() => setEditingReviewId(null)}>Hủy</button>
                  </div>

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

              {review.replies.map((reply) => (
                <div key={reply.id} className="reply-item">
                  <div className="user-info">
                    <img
                      src={reply.avatarUrl || '/default-avatar.png'}
                      alt="avatar"
                      className="avatar"
                    />
                    <strong>{reply.userName || (reply.idUser === currentUserId ? 'Bạn' : 'Ẩn danh')}</strong>
                  </div>

                  {editingReplyId === reply.id ? (
                    <div className="edit-form">
                      <textarea
                        value={editReplyForm.comment}
                        onChange={(e) => setEditReplyForm({ comment: e.target.value })}
                      />
                      <div className="review-actions">
                      <button onClick={() => handleUpdateReply(reply.id)}>Lưu</button>
                      <button onClick={() => setEditingReplyId(null)}>Hủy</button>
                      </div>
                    </div>

                    
                  ) : (
                    <>
                      <p className="comment">{reply.comment}</p>
                      {(reply.idUser === currentUserId || currentUserRole === 'Admin') && (
                        <div className="review-actions">
                          <button onClick={() => handleEditReply(reply)}>Sửa</button>
                          <button onClick={() => handleDeleteReply(reply.id)}>Xóa</button>
                        </div>
                      )}
                    </>
                  )}

                  <div className="date-reply">{new Date(reply.createAt).toLocaleString()}</div>
                </div>
              ))}


              <form onSubmit={(e) => handleReplySubmit(e, review.id)} className="reply-form">
                <textarea
                  placeholder="Viết trả lời..."
                  value={replyForms[review.id] || ''}
                  onChange={(e) =>
                    setReplyForms((prev) => ({ ...prev, [review.id]: e.target.value }))
                  }
                  disabled={replying[review.id]}
                  required
                />
                <button type="submit" disabled={replying[review.id]}>
                  {replying[review.id] ? 'Đang gửi...' : 'Trả lời'}
                </button>
              </form>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Reviews;
