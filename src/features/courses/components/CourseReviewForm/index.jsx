import React, { useState } from 'react';
import './style.css'

const CourseReviewForm = ({ courseId, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) return alert('Vui lòng chọn số sao.');
    onSubmit({ rating, comment });
    setRating(0);
    setComment('');
  };

  const getStarClass = (star) => {
    if (rating >= star) return 'fas fa-star';
    if (rating >= star - 0.5) return 'fas fa-star-half-alt';
    return 'far fa-star';
  };

  const getHoverClass = (star) => {
    if (hover >= star) return 'fas fa-star';
    if (hover >= star - 0.5) return 'fas fa-star-half-alt';
    return getStarClass(star);
  };

  const handleStarMove = (star, e) => {
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    const isHalf = x < width / 2;
    const value = isHalf ? star - 0.5 : star;
    setHover(value);
  };

  const handleStarLeave = () => setHover(0);

  const handleStarClick = (star, e) => {
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    const isHalf = x < width / 2;
    const value = isHalf ? star - 0.5 : star;
    setRating(value);
  };

  return (
    <form className="courseReviewForm" onSubmit={handleSubmit}>
      <h3>Đánh giá khóa học</h3>
      <div className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onMouseMove={(e) => handleStarMove(star, e)}
            onMouseLeave={handleStarLeave}
            onClick={(e) => handleStarClick(star, e)}
          >
            <i className={getHoverClass(star)}></i>
          </span>
        ))}
      </div>
      <textarea
        placeholder="Nhận xét của bạn..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button type="submit" className="primary-btn submitBtn">Gửi đánh giá</button>
    </form>
  );
};

export default CourseReviewForm; 