import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { courses } from 'features/courses/data/courseData';
import './style.css';

const AssignmentsDashboardPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const found = courses.find(c => c.id.toString() === courseId);
    if (!found) {
      navigate('/teacher/dashboard');
      return;
    }
    setCourse(found);

    const collected = [];
    found.sections?.forEach(sec => {
      sec.lectures?.forEach(lec => {
        if (lec.assignment) {
          // Mock some stats if chưa có
          const totalAssigned = 25;
          const totalSubmitted = Math.floor(Math.random() * 26); // 0-25
          const averageGrade = totalSubmitted ? (5 + Math.random() * 5).toFixed(1) : '-';
          collected.push({
            assignmentId: lec.assignment.id,
            title: lec.assignment.title,
            sectionTitle: sec.title,
            lectureTitle: lec.title,
            totalAssigned,
            totalSubmitted,
            averageGrade,
          });
        }
      });
    });
    setAssignments(collected);
  }, [courseId, navigate]);

  return (
    <section className="assignments-dashboard">
      <div className="container">
        <Link to="/teacher/dashboard" className="back-link"><i className="fas fa-arrow-left"></i> Quay lại Dashboard</Link>
        {course && <h2 className="page-title">Bài tập của khoá học: {course.name}</h2>}

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
                  <td>{a.averageGrade}</td>
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