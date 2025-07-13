import React from 'react';
import { Link } from 'react-router-dom';
import './style.css'

const MyCourseCardItem = ({ course, progress }) => {
  return (
    <div className='items mycourse-item'>
      <div className='content flex'>
        <div className='left'>
          <div className='img'>
            <img src={course.cover} alt={course.name} />
          </div>
        </div>
        <div className='text'>
          <h1>{course.name}</h1>
          {/* Teacher info & duration */}
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
      <div className='progress-display'>
        <div className='progress-bar-bg'>
          <div
            className='progress-bar-fill'
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <span className='progress-text'>{progress}% hoàn thành</span>
      </div>
      <Link to={`/courses/${course.id}/learn`}>
        <button className='outline-btn'>TIẾP TỤC HỌC</button>
      </Link>
    </div>
  );
};

export default MyCourseCardItem; 