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

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const c = await api.get(`/api/teacher/course/${courseId}`);
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

  const sendReply = (id) => {
    // ở đây chỉ mock, thực tế sẽ gọi API
    const text = replyTexts[id];
    if (!text?.trim()) return;
    const updated = localReviews.map((r) =>
      r.id === id ? { ...r, teacherReply: text.trim() } : r
    );
    setLocalReviews(updated);
    setReplyTexts({ ...replyTexts, [id]: '' });
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
                      <p className="comment-text">{r.teacherReply}</p>
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
                      disabled={!replyTexts[r.id]?.trim()}
                    >
                      <i className="fa fa-paper-plane"></i> Gửi
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