import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from 'services/api';
import './style.css';

const TeacherDashboardPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [displayCourses, setDisplayCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const transformCourse = useCallback((c) => {
    const totalLectures = (c.sections || []).reduce((sum, s) => sum + (s.lectures ? s.lectures.length : 0), 0);
    const totalMinutes = (c.sections || []).reduce((minSum, s) => minSum + (s.lectures || []).reduce((m, l) => m + (l.duration || 0), 0), 0);
    return {
      id: c.courseId,
      name: c.title,
      cover: c.cover || '/favicon.png', // placeholder nếu API chưa có
      totalLectures,
      totalTime: (totalMinutes / 60).toFixed(1),
      enrolledCount: c.enrolledCount || 0,
      rating: c.averageRating || 0,
    };
  }, []);

  useEffect(() => {
    async function fetchCourses() {
      try {
        setLoading(true);
        const data = await api.get('/api/teacher/course');
        const mapped = data.map(transformCourse);
        setDisplayCourses(mapped);
      } catch (err) {
        console.error(err);
        setError('Không thể tải danh sách khóa học.');
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, [transformCourse]);

  const filteredCourses = displayCourses.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // Hàm xoá khoá học
  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xoá khoá học này?')) return;
    try {
      await api.delete(`/api/teacher/course/${courseId}`);
      setDisplayCourses(prev => prev.filter(c => c.id !== courseId));
    } catch (err) {
      alert('Xoá khoá học thất bại!');
    }
  };

  return (
    <section className="teacher-dashboard">
      <div className="dashboard-container">
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
          {loading && <p>Đang tải...</p>}
          {error && <p className="error-text">{error}</p>}
          {!loading && filteredCourses.map(course => (
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
                <Link to={`/teacher/course/${course.id}/reviews`} className="btn">Quản lý đánh giá</Link>
                <Link to={`/teacher/course/${course.id}/analytics`} className="btn">Thống kê</Link>
                <Link to={`/teacher/course/${course.id}/assignments`} className="btn">Quản lý bài tập</Link>
                <button
                  className="btn small delete-btn"
                  title="Xoá khoá học"
                  onClick={() => handleDeleteCourse(course.id)}
                >
                  <i className="fas fa-trash" style={{ fontSize: '12px' }}></i>
                </button>
              </div>
            </div>
          ))}
          {!loading && filteredCourses.length === 0 && (
            <p>Không có khóa học phù hợp.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default TeacherDashboardPage;
