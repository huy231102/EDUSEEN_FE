import React, { useEffect, useState } from 'react';
import MyCoursesList from 'features/courses/components/MyCoursesList';
import CoursesList from 'features/courses/components/CoursesList';
import { Link, useNavigate } from 'react-router-dom';
import courseApi from 'services/courseApi';
import './style.css';

const MyCoursesPage = () => {
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const res = await courseApi.getMyCourses();
        setMyCourses(res);
      } catch (err) {
        setMyCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMyCourses();
  }, []);

  if (loading) return <div>Đang tải dữ liệu...</div>;

  if (!myCourses || myCourses.length === 0) {
    return (
      <div className="mycourses-empty">
        <h2>Bạn chưa đăng ký khóa học nào.</h2>
        <button className="primary-btn" onClick={() => navigate('/courses')}>Khám phá khóa học</button>
      </div>
    );
  }

  // Tính progress % dựa vào 2 trường mới
  const progressMap = Object.fromEntries(
    myCourses.map((c) => [c.courseId, c.TotalLectures > 0 ? Math.round((c.CompletedLectures / c.TotalLectures) * 100) : 0])
  );

  // Nếu muốn hiển thị danh sách yêu thích, cần fetch thêm từ API khác
  // const favoriteCourses = ...

  return (
    <>
      <MyCoursesList courses={myCourses} progressMap={progressMap} />
      {/* <CoursesList courses={favoriteCourses} subtitle="KHÓA HỌC YÊU THÍCH" title="Những khóa học bạn đánh dấu sao" /> */}
    </>
  );
};

export default MyCoursesPage; 