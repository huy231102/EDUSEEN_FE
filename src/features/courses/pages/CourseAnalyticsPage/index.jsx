import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
// import {
//   PieChart, Pie, Cell, Tooltip as ReTooltip, Legend,
//   BarChart, Bar, XAxis, YAxis, CartesianGrid,
// } from 'recharts';
import './style.css';
import { courses } from 'features/courses/data/courseData';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28BE6'];

const CourseAnalyticsPage = () => {
  const { courseId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Giả lập gọi API
        const res = await fetch(`/api/teacher/courses/${courseId}/analysis`);
        if (!res.ok) throw new Error('Network response failed');
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
        // Tạo mock dựa trên dữ liệu cục bộ nếu gọi API lỗi
        const course = courses.find(c => c.id.toString() === courseId);
        const mockAssignments = [];
        if (course) {
          course.sections?.forEach(sec => {
            sec.lectures?.forEach(lec => {
              if (lec.assignment) {
                const totalAssigned = 120;
                const totalSubmitted = 60 + Math.floor(Math.random() * 60); // 60-119
                const gradeDistribution = {
                  '0-5': Math.floor(Math.random() * 10),
                  '5-7': Math.floor(Math.random() * 20),
                  '7-8': Math.floor(Math.random() * 30),
                  '8-9': Math.floor(Math.random() * 30),
                  '9-10': Math.floor(Math.random() * 20),
                };
                mockAssignments.push({
                  assignmentId: lec.assignment.id,
                  title: lec.assignment.title,
                  totalAssigned,
                  totalSubmitted,
                  completionRate: totalSubmitted / totalAssigned,
                  lateSubmissionCount: Math.floor(Math.random() * 15),
                  lateSubmissionRate: 0.1,
                  averageGrade: 7 + Math.random() * 3,
                  gradeDistribution,
                  gradedCount: totalSubmitted,
                });
              }
            });
          });
        }

        setData({
          courseId,
          totalEnrollments: 120,
          completionRate: 0.72,
          averageRating: 4.5,
          avgCompletedLectures: 28,
          assignments: mockAssignments.length ? mockAssignments : [],
        });
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
        <h3>{assignment.title}</h3>
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
    <div className="analytics-page">
      <Link to="/teacher/dashboard" className="back-link">
        <i className="fas fa-arrow-left"></i> Quay lại bảng điều khiển
      </Link>
      <h2>Thống kê khóa học #{courseId}</h2>

      {/* Tổng quan */}
      <div className="overview-grid">
        <div className="overview-item">
          <h3>Tổng học viên</h3>
          <p>{data.totalEnrollments}</p>
        </div>
        <div className="overview-item">
          <h3>Tỉ lệ hoàn thành</h3>
          <p>{(data.completionRate * 100).toFixed(1)}%</p>
        </div>
        <div className="overview-item">
          <h3>Điểm trung bình</h3>
          <p>{data.averageRating.toFixed(1)}</p>
        </div>
        <div className="overview-item">
          <h3>Số bài giảng hoàn thành TB</h3>
          <p>{data.avgCompletedLectures.toFixed(1)}</p>
        </div>
      </div>

      <div className="assignments-grid">
        {data.assignments?.map(renderAssignment)}
      </div>
    </div>
  );
};

export default CourseAnalyticsPage; 