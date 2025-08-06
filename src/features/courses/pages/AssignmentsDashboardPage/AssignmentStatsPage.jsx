import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  PieChart, Pie, Cell, Tooltip as ReTooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import api from 'services/api';
import './style.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28BE6'];

const AssignmentStatsPage = () => {
  const { courseId, assignmentId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/teacher/course/assignment/${assignmentId}/analysis`);
        setData(res);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [assignmentId]);

  if (loading) return <div className="analytics-page"><p>Đang tải...</p></div>;
  if (error) return <div className="analytics-page"><p>Lỗi: {error.message}</p></div>;
  if (!data) return null;

  const gradeChartData = Object.entries(data.gradeDistribution || {}).map(([range, count]) => ({ name: range, value: count }));
  const submissionChartData = [
    { name: 'Đã nộp', value: data.totalSubmitted },
    { name: 'Chưa nộp', value: data.totalAssigned - data.totalSubmitted },
  ];

  return (
    <section className="assignments-dashboard">
      <div className="container">
        <div className="analytics-page assignment-stats-page">
          <Link
            to={`/teacher/course/${courseId}/assignments`}
            className="back-link"
          >
            <i className="fas fa-arrow-left"></i> Quay lại danh sách bài tập
          </Link>
          <h2 className="stats-title">
            Thống kê bài tập: <span className="highlight">{data.title}</span>
          </h2>
          <div className="overview-grid">
            <div className="overview-item stat-card">
              <h3>Tổng học viên</h3>
              <p className="stat-number primary">{data.totalAssigned}</p>
            </div>
            <div className="overview-item stat-card">
              <h3>Số đã nộp</h3>
              <p className="stat-number success">{data.totalSubmitted}</p>
            </div>
            <div className="overview-item stat-card">
              <h3>Tỉ lệ nộp bài</h3>
              <p className="stat-number info">
                {(data.completionRate * 100).toFixed(1)}%
              </p>
            </div>
            <div className="overview-item stat-card">
              <h3>Điểm trung bình</h3>
              <p className="stat-number warning">
                {data.averageGrade ? Number(data.averageGrade).toFixed(1) : "-"}
              </p>
            </div>
            <div className="overview-item stat-card">
              <h3>Số bài nộp muộn</h3>
              <p className="stat-number danger">{data.lateSubmissionCount}</p>
            </div>
          </div>
          <div className="charts-grid">
            <div className="chart-card">
              <h4>Phân bổ điểm</h4>
              <PieChart width={320} height={320}>
                <Pie
                  data={gradeChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                >
                  {gradeChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
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
        </div>
      </div>
    </section>
  );
};

export default AssignmentStatsPage; 