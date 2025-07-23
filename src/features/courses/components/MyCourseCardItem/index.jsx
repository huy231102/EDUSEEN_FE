import React from 'react';
import { Link } from 'react-router-dom';
import './style.css'

const MyCourseCardItem = ({ course, progress }) => {
  return (
    <div className='items mycourse-item' style={{position: 'relative'}}>
      {/* Icon ngôi sao favorite */}
      <i
        className={`favorite-icon ${course.isFavorite ? 'fas fa-star' : 'far fa-star'}`}
        style={{
          position: 'absolute',
          top: 12,
          right: 16,
          fontSize: 24,
          color: course.isFavorite ? '#FFD700' : '#fff',
          textShadow: '0 0 4px #888',
          zIndex: 2,
          cursor: 'default'
        }}
      />
      <div className='content flex'>
        <div className='left'>
          <div className='img'>
            <img src={course.cover} alt={course.title} />
          </div>
        </div>
        <div className='text'>
          <h1>{course.title}</h1>
          {/* Teacher info & duration */}
          <div className='details'>
            <div className='box'>
              <div className='dimg'>
                <img src={course.teacherAvatarUrl} alt={course.teacherName} />
              </div>
              <div className='para'>
                <h4>{course.teacherName}</h4>
              </div>
            </div>
            <span>{course.totalTime} giờ</span>
          </div>
          {/* Hiển thị số bài giảng đã hoàn thành */}
          <div style={{marginTop: 8, fontSize: 14}}>
            {typeof course.CompletedLectures === 'number' && typeof course.TotalLectures === 'number' && (
              <span>Bài giảng đã hoàn thành: {course.CompletedLectures}/{course.TotalLectures}</span>
            )}
          </div>
        </div>
      </div>
      <div className='progress-display'>
        <div className='progress-bar-bg'>
          <div
            className='progress-bar-fill'
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <span className='progress-text'>{progress}% hoàn thành</span>
      </div>
      <Link to={`/courses/${course.courseId}/learn`}>
        <button className='outline-btn'>TIẾP TỤC HỌC</button>
      </Link>
    </div>
  );
};

export default MyCourseCardItem; 