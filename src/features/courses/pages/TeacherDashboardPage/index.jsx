import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courses } from 'features/courses/data/courseData';
import './style.css';

const TeacherDashboardPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [displayCourses, setDisplayCourses] = useState([]);

  useEffect(() => {
    const filteredCourses = courses.filter(course =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setDisplayCourses(filteredCourses);
  }, [searchTerm]);

  return (
    <section className="teacher-dashboard">
      <div className="container">
        <h2 className="dashboard-title">Quản lý khóa học</h2>

        <div className="dashboard-controls">
          {/* Nút tạo khoá học mới */}
          <Link to="/teacher/course/new" className="btn primary create-btn">
            <i className="fa fa-plus" /> Tạo khoá học mới
          </Link>
          <div className="search-control">
            <i className="fas fa-search" />
            <input
              type="text"
              placeholder="Tìm kiếm khóa học..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="dashboard-cards">
          {displayCourses.map(course => (
            <div className="teacher-course-card" key={course.id}>
              <div className="thumbnail">
                <img src={course.cover} alt={course.name} />
              </div>
              <div className="info">
                <h3>{course.name}</h3>
                <p>{course.totalLectures} bài giảng • {course.totalTime} giờ</p>
                <div className="metrics">
                  <span><i className="fas fa-user" /> {course.enrolledCount || 0}</span>
                  <span><i className="fas fa-star" /> {course.rating.toFixed(1)}</span>
                </div>
              </div>
              <div className="actions">
                <Link to={`/teacher/course/${course.id}/edit`} className="btn primary">Chỉnh sửa nội dung</Link>
                <Link to={`/teacher/course/${course.id}/edit?tab=reviews`} className="btn">Quản lý đánh giá</Link>
                <Link to={`/teacher/course/${course.id}/analytics`} className="btn">Thống kê</Link>
                <Link to={`/teacher/course/${course.id}/assignments`} className="btn">Quản lý bài tập</Link>
                <Link to={`/courses/${course.id}`} className="btn outline">Xem trang khóa học</Link>
              </div>
            </div>
          ))}
          {displayCourses.length === 0 && (
            <p>Không có khóa học phù hợp.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default TeacherDashboardPage;
