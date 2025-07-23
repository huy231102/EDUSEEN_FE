import React from 'react';
import './style.css'
import MyCourseCardItem from '../MyCourseCardItem';
import Heading from 'components/common/Heading';

const MyCoursesList = ({ courses, progressMap }) => {
  return (
    <section className='courses my-courses'>
      <div className='courses-card-wrapper'>
        <div className='container'>
          <Heading subtitle="KHÓA HỌC CỦA TÔI" title="Tiếp tục hành trình học tập" />
          <div className='grid2'>
            {courses.map(course => (
              <MyCourseCardItem
                key={course.courseId}
                course={course}
                progress={progressMap[course.courseId] || 0}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyCoursesList; 