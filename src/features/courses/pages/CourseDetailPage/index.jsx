import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useMyCourses } from 'features/courses/contexts/MyCoursesContext';
import Testimonal from 'features/courses/components/Testimonal';
import CourseReviewForm from 'features/courses/components/CourseReviewForm';
import { useAuth } from '../../../auth/contexts/AuthContext';
import courseApi from 'services/courseApi';
import './style.css'
import Heading from 'components/common/Heading';

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const { enrollCourse, getProgress, enrolledCourses } = useMyCourses();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch course detail từ API
  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        setLoading(true);
        const data = await courseApi.getCourseDetail(courseId);
        // Map về structure FE mong muốn
        const mappedCourse = {
          id: data.courseId,
          name: data.title,
          cover: data.cover,
          description: data.description,
          trainerName: data.teacherName,
          trainerJob: 'Giảng viên', // placeholder
          teacherAvatarUrl: data.teacherAvatarUrl,
          totalTime: Math.round(data.sections?.reduce((totalHours, section) => {
            const sectionMinutes = section.lectures?.reduce((total, lecture) => 
              total + (lecture.duration || 0), 0) || 0;
            return totalHours + (sectionMinutes / 60);
          }, 0) * 100) / 100 || 0,
          rating: data.rating || 0,
          isEnrolled: data.isEnrolled || false, // Thêm trường này
          sections: data.sections?.map(section => ({
            id: section.sectionId,
            title: section.title,
            order: section.order,
            lectures: section.lectures?.map(lecture => ({
              id: lecture.lectureId,
              title: lecture.title,
              contentType: lecture.contentType,
              contentUrl: lecture.contentUrl,
              duration: lecture.duration,
              order: lecture.order,
              isCompleted: lecture.isCompleted || false,
              assignmentId: lecture.assignmentId || null
            })) || []
          })) || [],
          reviews: data.reviews?.map(review => ({
            id: Date.now() + Math.random(), // temporary id
            userName: review.userName,
            courseName: review.courseName,
            courseDescription: review.comment,
            userAvatarUrl: review.userAvatarUrl || '/images/testo/t1.webp',
            rating: review.rating,
            createdAt: review.createdAt
          })) || []
        };
        setCourse(mappedCourse);
      } catch (err) {
        console.error(err);
        setError('Không thể tải thông tin khóa học');
      } finally {
        setLoading(false);
      }
    };
    fetchCourseDetail();
  }, [courseId]);

  // Tính toán progress từ API data thay vì từ context
  const calculateProgress = () => {
    if (!course || !course.sections) return 0;
    
    const totalLectures = course.sections.reduce((acc, section) => 
      acc + section.lectures.length, 0);
    
    if (totalLectures === 0) return 0;
    
    const completedLectures = course.sections.reduce((acc, section) => 
      acc + section.lectures.filter(lecture => lecture.isCompleted).length, 0);
    
    return Math.round((completedLectures / totalLectures) * 100);
  };

  const progress = calculateProgress();

  // Kiểm tra xem user đã đăng ký khóa học chưa
  // Xóa hàm isEnrolled cũ

  // XÓA: localStorage reviews
  // const storedReviews = JSON.parse(localStorage.getItem('userReviews') || '{}');
  // const [userReviews, setUserReviews] = useState(storedReviews[courseId] || []);

  // Sửa lại handleReviewSubmit
  const handleReviewSubmit = async ({ rating, comment }) => {
    if (!user) return alert('Cần đăng nhập để đánh giá');
    try {
      await courseApi.rateCourse(course.id, { rating, reviewText: comment });
      // Sau khi gửi đánh giá, fetch lại chi tiết khoá học để cập nhật reviews
      setLoading(true);
      const data = await courseApi.getCourseDetail(courseId);
      // Map lại như ở trên
      const mappedCourse = {
        id: data.courseId,
        name: data.title,
        cover: data.cover,
        description: data.description,
        trainerName: data.teacherName,
        trainerJob: 'Giảng viên',
        teacherAvatarUrl: data.teacherAvatarUrl,
        totalTime: Math.round(data.sections?.reduce((totalHours, section) => {
          const sectionMinutes = section.lectures?.reduce((total, lecture) => 
            total + (lecture.duration || 0), 0) || 0;
          return totalHours + (sectionMinutes / 60);
        }, 0) * 100) / 100 || 0,
        rating: data.rating || 0,
        isEnrolled: data.isEnrolled || false,
        sections: data.sections?.map(section => ({
          id: section.sectionId,
          title: section.title,
          order: section.order,
          lectures: section.lectures?.map(lecture => ({
            id: lecture.lectureId,
            title: lecture.title,
            contentType: lecture.contentType,
            contentUrl: lecture.contentUrl,
            duration: lecture.duration,
            order: lecture.order,
            isCompleted: lecture.isCompleted || false,
            assignmentId: lecture.assignmentId || null
          })) || []
        })) || [],
        reviews: data.reviews?.map(review => ({
          id: Date.now() + Math.random(),
          userName: review.userName,
          courseName: review.courseName,
          courseDescription: review.comment,
          userAvatarUrl: review.userAvatarUrl || '/images/testo/t1.webp',
          rating: review.rating,
          createdAt: review.createdAt
        })) || []
      };
      setCourse(mappedCourse);
      setLoading(false);
    } catch (err) {
      alert('Gửi đánh giá thất bại!');
    }
  };

  // Hàm xử lý khi bấm nút bắt đầu/tiếp tục học
  const handleStartOrContinue = async () => {
    if (!user) {
      alert('Bạn cần đăng nhập để học khoá này!');
      return;
    }
    if (!course.isEnrolled) {
      try {
        await courseApi.enrollCourse(course.id); // Gọi API enroll đúng chuẩn
        // Fetch lại detail để lấy trạng thái mới nhất
        const data = await courseApi.getCourseDetail(courseId);
        const mappedCourse = {
          id: data.courseId,
          name: data.title,
          cover: data.cover,
          description: data.description,
          trainerName: data.teacherName,
          trainerJob: 'Giảng viên',
          teacherAvatarUrl: data.teacherAvatarUrl,
          totalTime: Math.round(data.sections?.reduce((totalHours, section) => {
            const sectionMinutes = section.lectures?.reduce((total, lecture) => 
              total + (lecture.duration || 0), 0) || 0;
            return totalHours + (sectionMinutes / 60);
          }, 0) * 100) / 100 || 0,
          rating: data.rating || 0,
          isEnrolled: data.isEnrolled || false,
          sections: data.sections?.map(section => ({
            id: section.sectionId,
            title: section.title,
            order: section.order,
            lectures: section.lectures?.map(lecture => ({
              id: lecture.lectureId,
              title: lecture.title,
              contentType: lecture.contentType,
              contentUrl: lecture.contentUrl,
              duration: lecture.duration,
              order: lecture.order,
              isCompleted: lecture.isCompleted || false,
              assignmentId: lecture.assignmentId || null
            })) || []
          })) || [],
          reviews: data.reviews?.map(review => ({
            id: Date.now() + Math.random(),
            userName: review.userName,
            courseName: review.courseName,
            courseDescription: review.comment,
            userAvatarUrl: review.userAvatarUrl || '/images/testo/t1.webp',
            rating: review.rating,
            createdAt: review.createdAt
          })) || []
        };
        // Navigate sang màn học, truyền data mới nhất
        navigate(`/courses/${courseId}/learn`, { state: { course: mappedCourse } });
      } catch (err) {
        alert('Đăng ký khoá học thất bại!');
      }
    } else {
      // Đã enroll, chuyển luôn và truyền data hiện tại
      navigate(`/courses/${courseId}/learn`, { state: { course } });
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '50px', textAlign: 'center' }}>
        <p>Đang tải thông tin khóa học...</p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="container" style={{ padding: '50px', textAlign: 'center' }}>
        <p>Lỗi: {error || 'Không tìm thấy khóa học.'}</p>
      </div>
    );
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
              <button
                className={`primary-btn start-learning-btn ${user && course.isEnrolled ? 'continue-learning' : ''}`}
                onClick={handleStartOrContinue}
              >
                {user && course.isEnrolled ? 'Tiếp tục học' : 'Bắt đầu học'}
              </button>
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
                <span>{course.totalTime} giờ</span>
              </div>
            </div>

            {/* Progress bar cho user đã đăng nhập */}
            {user && course.isEnrolled && (
                <div className="course-progress">
                  <div className="progress-info">
                    <span>Tiến độ học tập</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            
            <div className='teacher-info'>
              <h3>Giáo viên</h3>
              <div className='teacher-card'>
                <img src={course.teacherAvatarUrl || '/images/team/t1.webp'} alt={course.trainerName} />
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
      {course.reviews?.length > 0 && (
        <Testimonal
          items={course.reviews}
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