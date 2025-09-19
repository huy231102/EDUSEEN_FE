import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from 'services/api';
import './style.css';

const CourseReviewsPage = () => {
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [filter, setFilter] = useState('all');
  const [replyTexts, setReplyTexts] = useState({});
  const [localReviews, setLocalReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendingReplies, setSendingReplies] = useState({});
  const [editingReply, setEditingReply] = useState(null);
  const [editReplyText, setEditReplyText] = useState('');
  const [updatingReply, setUpdatingReply] = useState(false);
  const [deletingReply, setDeletingReply] = useState({});

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const c = await api.get(`/api/teacher/course/${courseId}/reviews`);
        setCourseData({
          id: c.courseId,
          name: c.title,
          cover: c.cover || '/favicon.png',
        });
        setLocalReviews(c.reviews || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  const filtered = localReviews.filter((r) => {
    if (filter === 'all') return true;
    if (filter === 'unreplied') return !r.teacherReply;
    const star = parseInt(filter);
    return r.rating === star;
  });

  const handleReplyChange = (id, text) => {
    setReplyTexts({ ...replyTexts, [id]: text });
  };

  const sendReply = async (id) => {
    const text = replyTexts[id];
    if (!text?.trim()) return;
    setSendingReplies({ ...sendingReplies, [id]: true });
    try {
      const response = await api.post(`/api/teacher/course/review/${id}/reply`, { responseText: text.trim() });
      const updated = localReviews.map((r) =>
        r.id === id ? { ...r, teacherReply: text.trim(), responseId: response.responseId } : r
      );
      setLocalReviews(updated);
      setReplyTexts({ ...replyTexts, [id]: '' });
    } catch (err) {
      console.error('Send reply error', err);
    } finally {
      setSendingReplies({ ...sendingReplies, [id]: false });
    }
  };

  const startEditReply = (reviewId, currentReply) => {
    setEditingReply(reviewId);
    setEditReplyText(currentReply);
  };

  const cancelEditReply = () => {
    setEditingReply(null);
    setEditReplyText('');
  };

  const updateReply = async (reviewId, responseId) => {
    if (!editReplyText?.trim()) return;
    setUpdatingReply(true);
    try {
      await api.put(`/api/teacher/course/review/response/${responseId}`, { responseText: editReplyText.trim() });
      const updated = localReviews.map((r) =>
        r.id === reviewId ? { ...r, teacherReply: editReplyText.trim() } : r
      );
      setLocalReviews(updated);
      setEditingReply(null);
      setEditReplyText('');
    } catch (err) {
      console.error('Update reply error', err);
    } finally {
      setUpdatingReply(false);
    }
  };

  const deleteReply = async (reviewId, responseId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa phản hồi này?')) return;
    setDeletingReply({ ...deletingReply, [reviewId]: true });
    try {
      await api.delete(`/api/teacher/course/review/response/${responseId}`);
      const updated = localReviews.map((r) =>
        r.id === reviewId ? { ...r, teacherReply: null, responseId: null } : r
      );
      setLocalReviews(updated);
    } catch (err) {
      console.error('Delete reply error', err);
    } finally {
      setDeletingReply({ ...deletingReply, [reviewId]: false });
    }
  };

  if (loading) {
    return (
      <section className="course-reviews-page">
        <div className="container">
          <p>Đang tải...</p>
        </div>
      </section>
    );
  }

  if (!courseData) {
    return (
      <section className="course-reviews-page">
        <div className="container">
          <p>Không tìm thấy khóa học.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="course-reviews-page">
      <div className="reviews-container">
        {/* Back to dashboard */}
        <Link to="/teacher/dashboard" className="back-link">
          <i className="fas fa-arrow-left"></i> Quay lại bảng điều khiển
        </Link>

        <div className="reviews-content">
          <div className="review-filter">
            <label>Lọc: </label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">Tất cả</option>
              <option value="5">5 sao</option>
              <option value="4">4 sao</option>
              <option value="3">3 sao</option>
              <option value="2">2 sao</option>
              <option value="1">1 sao</option>
              <option value="unreplied">Chưa phản hồi</option>
            </select>
          </div>

          {filtered.length === 0 && <p>Không có đánh giá phù hợp.</p>}

          {filtered.map((r) => (
            <div key={r.id} className="review-item">
              <div className="review-header">
                <div>
                  <strong>{r.name}</strong> • <span className="review-date">{r.date || '---'}</span>
                </div>
                <span>{renderStars(r.rating)}</span>
              </div>
              <p className="review-content">{r.desc}</p>

              {/* Reply list */}
              <div className="review-conversation">
                {r.teacherReply && (
                  <div className="comment-item teacher">
                    <div className="comment-avatar"><i className="fa fa-chalkboard-teacher"></i></div>
                    <div className="comment-content">
                      <span className="comment-author">Giáo viên</span>
                      {editingReply === r.id ? (
                        <div className="edit-reply-form">
                          <textarea
                            value={editReplyText}
                            onChange={(e) => setEditReplyText(e.target.value)}
                            placeholder="Chỉnh sửa phản hồi..."
                          />
                          <div className="edit-reply-actions">
                            <button
                              className="edit-reply-btn save"
                              onClick={() => updateReply(r.id, r.responseId)}
                              disabled={!editReplyText?.trim() || updatingReply}
                            >
                              {updatingReply ? 'Đang lưu...' : 'Lưu'}
                            </button>
                            <button
                              className="edit-reply-btn cancel"
                              onClick={cancelEditReply}
                              disabled={updatingReply}
                            >
                              Hủy
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="comment-text">{r.teacherReply}</p>
                          <div className="reply-actions">
                            <button
                              className="reply-action-btn edit"
                              onClick={() => startEditReply(r.id, r.teacherReply)}
                              disabled={deletingReply[r.id]}
                            >
                              <i className="fa fa-edit"></i> Chỉnh sửa
                            </button>
                            <button
                              className="reply-action-btn delete"
                              onClick={() => deleteReply(r.id, r.responseId)}
                              disabled={deletingReply[r.id]}
                            >
                              <i className="fa fa-trash"></i> {deletingReply[r.id] ? 'Đang xóa...' : 'Xóa'}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {!r.teacherReply && (
                <div className="reply-box">
                  <div className="reply-input-wrapper">
                    <textarea
                      rows={2}
                      placeholder="Phản hồi của bạn..."
                      value={replyTexts[r.id] || ''}
                      onChange={(e) => handleReplyChange(r.id, e.target.value)}
                    ></textarea>
                    <button
                      className="reply-send-btn"
                      onClick={() => sendReply(r.id)}
                      disabled={!replyTexts[r.id]?.trim() || sendingReplies[r.id]}
                    >
                      <i className="fa fa-paper-plane"></i> {sendingReplies[r.id] ? 'Đang gửi...' : 'Gửi'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const renderStars = (rating) => {
  const stars = [];
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  for (let i = 0; i < full; i++) stars.push(<i key={`f${i}`} className="fas fa-star" />);
  if (half) stars.push(<i key="half" className="fas fa-star-half-alt" />);
  for (let i = stars.length; i < 5; i++) stars.push(<i key={`e${i}`} className="far fa-star" />);
  return stars;
};

export default CourseReviewsPage; 