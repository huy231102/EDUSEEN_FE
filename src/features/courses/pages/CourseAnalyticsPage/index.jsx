import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  PieChart, Pie, Cell, Tooltip as ReTooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import './style.css';
import { courses } from 'features/courses/data/courseData';
import api from 'services/api';
import GradeDetailsModal from './GradeDetailsModal';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28BE6'];

const CourseAnalyticsPage = () => {
  const { courseId } = useParams();
  const [data, setData] = useState(null);
  const [studentGrades, setStudentGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('analytics');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [analyticsData, gradesData] = await Promise.all([
          api.get(`/api/teacher/course/${courseId}/analysis`),
          api.get(`/api/teacher/course/${courseId}/students/grades`)
        ]);
        setData(analyticsData);
        setStudentGrades(gradesData);
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [courseId]);

  if (loading) return <div className="analytics-page"><p>Đang tải...</p></div>;
  if (error) return <div className="analytics-page"><p>Lỗi: {error.message}</p></div>;
  if (!data) return null;

  // Lọc học viên theo tên
  const filteredStudents = studentGrades.filter(student =>
    student.studentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderAssignment = (assignment, idx) => {
    const gradeChartData = Object.entries(assignment.gradeDistribution || {}).map(([range, count]) => ({ name: range, value: count }));
    const submissionChartData = [
      { name: 'Đã nộp', value: assignment.totalSubmitted },
      { name: 'Chưa nộp', value: assignment.totalAssigned - assignment.totalSubmitted },
    ];
    return (
      <section key={assignment.assignmentId || idx} className="assignment-analytics">
        <h3 className="assignment-title">{assignment.title}</h3>
        <div className="charts-grid">
          <div className="chart-card">
            <h4>Phân bổ điểm</h4>
            <PieChart width={320} height={320}>
              <Pie data={gradeChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120}>
                {gradeChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ReTooltip />
              <Legend />
            </PieChart>
          </div>
          <div className="chart-card">
            <h4>Trạng thái nộp bài</h4>
            <BarChart width={320} height={320} data={submissionChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <ReTooltip />
              <Bar dataKey="value" fill="#1eb2a6" />
            </BarChart>
          </div>
        </div>
      </section>
    );
  };

  return (
    <div className="analytics-page course-analytics-page">
      <Link to="/teacher/dashboard" className="back-link">
        <i className="fas fa-arrow-left"></i> Quay lại bảng điều khiển
      </Link>
      <h2 className="stats-title">Thống kê khóa học <span className="highlight">#{courseId}</span></h2>
      
      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <i className="fas fa-chart-bar"></i> Biểu đồ phân tích
        </button>
        <button 
          className={`tab-button ${activeTab === 'students' ? 'active' : ''}`}
          onClick={() => setActiveTab('students')}
        >
          <i className="fas fa-users"></i> Danh sách học viên
        </button>
      </div>

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <>
          {/* Tổng quan */}
          <div className="overview-grid">
            <div className="overview-item stat-card">
              <h3>Tổng học viên</h3>
              <p className="stat-number primary">{data.totalEnrollments}</p>
            </div>
            <div className="overview-item stat-card">
              <h3>Tỉ lệ hoàn thành</h3>
              <p className="stat-number info">{(data.completionRate * 100).toFixed(1)}%</p>
            </div>
            <div className="overview-item stat-card">
              <h3>Điểm trung bình</h3>
              <p className="stat-number warning">{data.averageRating.toFixed(1)}</p>
            </div>
            <div className="overview-item stat-card">
              <h3>Số bài giảng hoàn thành TB</h3>
              <p className="stat-number success">{data.avgCompletedLectures.toFixed(1)}</p>
            </div>
          </div>
          <div className="assignments-grid">
            {data.assignments?.map(renderAssignment)}
          </div>
        </>
      )}

      {/* Students Tab */}
      {activeTab === 'students' && (
        <div className="students-tab">
          <div className="search-section">
            <div className="search-box">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Tìm kiếm theo tên học viên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="student-count">
              Hiển thị {filteredStudents.length} / {studentGrades.length} học viên
            </div>
          </div>

          <div className="table-container">
            <table className="students-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Họ và tên</th>
                  <th>Email</th>
                  <th>Điểm TB</th>
                  <th>Bài tập đã làm</th>
                  <th>Tổng bài tập</th>
                  <th>Chi tiết điểm</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, index) => (
                  <tr key={student.studentId}>
                    <td>{index + 1}</td>
                    <td className="student-name">{student.studentName}</td>
                    <td className="student-email">{student.studentEmail}</td>
                    <td className="average-grade">
                      <span className={`grade-badge ${student.averageGrade >= 8 ? 'excellent' : student.averageGrade >= 6.5 ? 'good' : student.averageGrade >= 5 ? 'average' : 'poor'}`}>
                        {student.averageGrade.toFixed(1)}
                      </span>
                    </td>
                    <td className="completed-assignments">
                      {student.completedAssignments} / {student.totalAssignments}
                    </td>
                    <td className="total-assignments">{student.totalAssignments}</td>
                    <td className="grade-details">
                      <button 
                        className="view-details-btn"
                        onClick={() => {
                          setSelectedStudent(student);
                          setIsModalOpen(true);
                        }}
                      >
                        <i className="fas fa-eye"></i> Xem chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Grade Details Modal */}
      <GradeDetailsModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedStudent(null);
        }}
        student={selectedStudent}
        assignmentGrades={selectedStudent?.assignmentGrades}
      />
    </div>
  );
};

export default CourseAnalyticsPage; 