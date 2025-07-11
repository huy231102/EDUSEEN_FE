import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { courses } from '../../data/courseData';
import Heading from '../../../../components/common/Heading';
import Testimonal from '../../components/Testimonal'; // Import Testimonal
import './style.css';

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const course = courses.find(c => c.id === parseInt(courseId));

  if (!course) {
    return <div>Không tìm thấy khóa học.</div>;
  }

  // Tính tổng số bài giảng
  const totalLectures = course.sections?.reduce((acc, section) => acc + section.lectures.length, 0) || 0;

  return (
    <>
      <section className='course-detail-content'>
        <div className='container content-grid'>
          <div className='content-left'>
            <div className='course-image-sticky'>
              <img src={course.cover} alt={course.name} />
              <Link to={`/courses/${courseId}/learn`} className="primary-btn start-learning-btn">
                Bắt đầu học
              </Link>
            </div>
          </div>
          <div className='content-right'>
            <h2>Mô tả khóa học</h2>
            <p>{course.description}</p>

            <div className='course-stats'>
              <div className='stat-item'>
                <i className='fa fa-book'></i>
                <span>{totalLectures} Bài giảng</span>
              </div>
              <div className='stat-item'>
                <i className='fa fa-clock-o'></i>
                <span>{course.totalTime}</span>
              </div>
            </div>
            
            <div className='teacher-info'>
              <h3>Giáo viên</h3>
              <div className='teacher-card'>
                <img src={course.tcover} alt={course.trainerName} />
                <div className='teacher-details'>
                  <h4>{course.trainerName}</h4>
                  <span>{course.trainerJob}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hiển thị đánh giá nếu có */}
      {course.reviews && course.reviews.length > 0 && (
        <Testimonal 
          items={course.reviews} 
          subtitle="ĐÁNH GIÁ" 
          title="Học Viên Của Chúng Tôi Nói Gì" 
        />
      )}
    </>
  );
}

export default CourseDetailPage; 