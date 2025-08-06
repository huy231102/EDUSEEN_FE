import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from 'services/api';
import './style.css';

const AssignmentsDashboardPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [course, setCourse] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [courseData, assignmentsData] = await Promise.all([
          api.get(`/api/teacher/course/${courseId}`),
          api.get(`/api/teacher/course/${courseId}/assignments`),
        ]);
        setCourse(courseData);
        setAssignments(assignmentsData);
      } catch (err) {
        console.error(err);
        navigate('/teacher/dashboard');
      }
    }
    fetchData();
  }, [courseId, navigate]);

  return (
    <section className="assignments-dashboard">
      <div className="assignments-container">
        <Link to="/teacher/dashboard" className="back-link"><i className="fas fa-arrow-left"></i> Quay lại Dashboard</Link>
        {course && <h2 className="page-title">Bài tập của khoá học: {course.title || course.name}</h2>}

        {course && (
          <div className="top-actions">
            <Link to={`/teacher/course/${courseId}/assignments/new`} className="btn primary">+ Tạo bài tập mới</Link>
          </div>
        )}

        <div className="table-wrapper">
          <table className="assignments-table">
            <thead>
              <tr>
                <th>Tên bài tập</th>
                <th>Trạng thái nộp</th>
                <th>Điểm trung bình</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map(a => (
                <tr key={a.assignmentId}>
                  <td>
                    <strong>{a.title}</strong>
                    <br/>
                    <small>{a.sectionTitle} &raquo; {a.lectureTitle}</small>
                  </td>
                  <td>
                    <span className="submit-status">
                      {a.totalSubmitted}/{a.totalAssigned} đã nộp
                    </span>
                  </td>
                  <td>{a.averageGrade !== null && a.averageGrade !== undefined ? Number(a.averageGrade).toFixed(1) : '-'}</td>
                  <td className="actions-cell">
                    <Link to={`/teacher/course/${courseId}/assignments/${a.assignmentId}`} className="btn small">Xem bài nộp</Link>
                    <Link to={`/teacher/course/${courseId}/assignments/${a.assignmentId}/edit`} className="btn small">Chỉnh sửa</Link>
                    <Link to={`/teacher/course/${courseId}/assignments/${a.assignmentId}/stats`} className="btn small">Thống kê</Link>
                  </td>
                </tr>
              ))}
              {assignments.length === 0 && (
                <tr><td colSpan="4" style={{textAlign:'center'}}>Chưa có bài tập nào.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default AssignmentsDashboardPage;