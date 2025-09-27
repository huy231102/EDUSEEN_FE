import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { courseApi } from 'services/courseApi';

const CourseCardItem = ({ course }) => {
  const [isFavorite, setIsFavorite] = useState(course.isFavorite);
  const [saving, setSaving] = useState(false);

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (saving) return;
    try {
      setSaving(true);
      if (isFavorite) {
        await courseApi.removeFavorite(course.id);
        setIsFavorite(false);
      } else {
        await courseApi.saveFavorite(course.id);
        setIsFavorite(true);
      }
    } catch (err) {
      console.error(err);
      alert('Không thể lưu khóa học yêu thích. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const visualRating = Math.round(rating * 2) / 2;
    const fullStars = Math.floor(visualRating);
    const hasHalfStar = visualRating % 1 !== 0;
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full_${i}`} className='fas fa-star'></i>);
    }
    if (hasHalfStar) {
      stars.push(<i key='half' className='fas fa-star-half-alt'></i>);
    }
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty_${i}`} className='far fa-star'></i>);
    }
    return stars;
  };

  return (
    <div className='items' key={course.id}>
      <i
        className={`favorite-icon ${isFavorite ? 'fas fa-star' : 'far fa-star'}`}
        onClick={handleFavoriteClick}
        style={{ cursor: saving ? 'not-allowed' : 'pointer' }}
      />
      <div className='content flex'>
        <div className='left'>
          <div className='img'>
            <img src={course.cover} alt={course.name} />
          </div>
        </div>
        <div className='text'>
          <h1>{course.name}</h1>
          <div className='rate'>
            {renderStars(course.rating)}
            <label htmlFor=''>({course.rating.toFixed(1)})</label>
          </div>
          <div className='details'>
            <div className='box'>
              <div className='dimg'>
                <img src={course.tcover} alt={course.trainerName} />
              </div>
              <div className='para'>
                <h4>{course.trainerName}</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Link to={`/courses/${course.id}`}>
        <button className='outline-btn'>XEM CHI TIẾT</button>
      </Link>
    </div>
  );
};

export default CourseCardItem; 