import React from 'react';
import { Link } from 'react-router-dom';

const CourseCardItem = ({ course }) => {

  const renderStars = (rating) => {
    const stars = [];
    // Làm tròn đến 0.5 sao gần nhất
    const visualRating = Math.round(rating * 2) / 2;

    const fullStars = Math.floor(visualRating);
    const hasHalfStar = visualRating % 1 !== 0;

    // Render sao đầy
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full_${i}`} className='fas fa-star'></i>);
    }
    // Render sao rưỡi (nếu có)
    if (hasHalfStar) {
      stars.push(<i key='half' className='fas fa-star-half-alt'></i>);
    }
    // Render sao rỗng để đủ 5 sao
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty_${i}`} className='far fa-star'></i>);
    }

    return stars;
  };

  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN');
  }

  return (
    <div className='items' key={course.id}>
      {course.isFavorite && (
        <i className='fa fa-star favorite-icon' />
      )}
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
            <span>{course.totalTime} giờ</span>
          </div>
        </div>
      </div>
      <div className='price'>
        <h3>
          {formatPrice(course.priceAll)}đ / {course.pricePer}
        </h3>
      </div>
      <Link to={`/courses/${course.id}`}>
        <button className='outline-btn'>ĐĂNG KÝ NGAY !</button>
      </Link>
    </div>
  );
};

export default CourseCardItem; 