import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  PieChart, Pie, Cell, Tooltip as ReTooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import './style.css';
import { courses } from 'features/courses/data/courseData';
import api from 'services/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28BE6'];

const CourseAnalyticsPage = () => {
  const { courseId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await api.get(`/api/teacher/course/${courseId}/analysis`);
        setData(data);
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
    </div>
  );
};

export default CourseAnalyticsPage; 