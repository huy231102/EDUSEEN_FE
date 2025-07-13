import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { courses } from 'features/courses/data/courseData';
import { useMyCourses } from 'features/courses/contexts/MyCoursesContext';
import Testimonal from 'features/courses/components/Testimonal';
import CourseReviewForm from 'features/courses/components/CourseReviewForm';
import { useAuth } from '../../../auth/contexts/AuthContext';
import './style.css'
import Heading from 'components/common/Heading';

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const { enrollCourse, getProgress } = useMyCourses();
  const { user } = useAuth();

  const course = courses.find(c => c.id === parseInt(courseId));

  const progress = course ? getProgress(course.id) : 0;

  // localStorage reviews
  const storedReviews = JSON.parse(localStorage.getItem('userReviews') || '{}');
  const [userReviews, setUserReviews] = React.useState(storedReviews[courseId] || []);

  const handleReviewSubmit = ({ rating, comment }) => {
    if (!user) return alert('Cần đăng nhập để đánh giá');
    const newReview = {
      id: Date.now(),
      userId: user.user_id,
      name: `${user.first_name} ${user.last_name}`,
      post: 'Học viên',
      desc: comment,
      cover: user.avatar_url || '/images/testo/t1.webp',
      rating,
    };

    let updated = [...userReviews];
    const idx = updated.findIndex((r) => r.userId === user.user_id);
    if (idx >= 0) {
      updated[idx] = newReview; // cập nhật
    } else {
      updated.push(newReview);
    }

    setUserReviews(updated);
    const all = { ...storedReviews, [courseId]: updated };
    localStorage.setItem('userReviews', JSON.stringify(all));
  };

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
              <Link
                to={`/courses/${courseId}/learn`}
                className="primary-btn start-learning-btn"
                onClick={() => enrollCourse(course.id)}
              >
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

      {/* Hiển thị đánh giá */}
      {(course.reviews?.length > 0 || userReviews.length > 0) && (
        <Testimonal
          items={[...(course.reviews || []), ...userReviews]}
          subtitle="ĐÁNH GIÁ"
          title="Học Viên Của Chúng Tôi Nói Gì"
        />
      )}

      {/* Form đánh giá nếu hoàn thành 100% */}
      {progress === 100 && (
        <div className="container">
          <CourseReviewForm courseId={course.id} onSubmit={handleReviewSubmit} />
        </div>
      )}
    </>
  );
}

export default CourseDetailPage; 