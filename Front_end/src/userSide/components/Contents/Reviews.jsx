import React, { useState, useEffect } from 'react';
import { getReviews, createReview, deleteReview } from '../../../services/api/userAPI/ReviewAPI';
import '../../../assets/Style/home-css/Reviews.css';

const currentUserId = 'user-id'; // Giả sử bạn lấy từ localStorage hoặc context
const currentRoomId = 'room-id'; // ID phòng hiện tại

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const reviewsData = await getReviews();
                setReviews(reviewsData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    const handleAddReview = async () => {
        if (!newReview.trim()) return;

        try {
            const reviewData = {
                comment: newReview,
                idUser: currentUserId,
                idRoom: currentRoomId, 
            };
            const newReviewData = await createReview(reviewData);
            setReviews([newReviewData, ...reviews]);
            setNewReview('');
        } catch (err) {
            setError('Không thể thêm review.');
        }
    };

    const handleDeleteReview = async (id) => {
        try {
            await deleteReview(id);
            setReviews(reviews.filter((review) => review.id !== id));
        } catch (err) {
            setError('Không thể xóa review.');
        }
    };

    if (loading) return <div>Đang tải đánh giá...</div>;
    if (error) return <div>Lỗi: {error}</div>;

    return (
        <section className="reviews-section">
            <h2>Đánh giá của khách hàng</h2>
            <div className="add-review-box">
                <textarea
                    value={newReview}
                    onChange={(e) => setNewReview(e.target.value)}
                    placeholder="Chia sẻ đánh giá của bạn"
                />
                <button onClick={handleAddReview}>Thêm đánh giá</button>
            </div>

            <div className="reviews-list">
                {reviews.map((review) => (
                    <div key={review.id} className="review-item">
                        <div className="review-header">
                            <img
                                src={review.idUserNavigation?.avatar || '/default-avatar.png'}
                                alt="Avatar"
                                className="avatar"
                            />
                            <div>
                                <strong>{review.idUserNavigation?.name}</strong>
                                <p className="comment">{review.comment}</p>
                            </div>
                        </div>
                        {review.idUser === currentUserId && (
                            <div className="review-actions">
                                <button className="edit-btn">Sửa</button>
                                <button className="delete-btn" onClick={() => handleDeleteReview(review.id)}>Xóa</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Reviews;
