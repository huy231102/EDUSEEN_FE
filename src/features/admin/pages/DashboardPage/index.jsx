import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Paper } from "@material-ui/core";
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { FaUserAlt, FaBookOpen, FaUserPlus, FaRegStar, FaUserGraduate } from 'react-icons/fa';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { Info } from "@material-ui/icons";

// Import CSS
import './style.css';

import { useAdmin } from "../../contexts/AdminContext";

const DashboardPage = () => {
  const { users, courses, userStatistics, courseStatistics } = useAdmin();
  const [chartData, setChartData] = useState([]);
  const [topCourses, setTopCourses] = useState([]);
  const [userRoleData, setUserRoleData] = useState([]);

  // Màu sắc cho từng vai trò
  const roleColors = {
    'Học sinh': '#1eb2a6',
    'Giáo viên': '#ff9800', 
    'Quản trị viên': '#f44336',
    'User': '#1eb2a6',
    'Teacher': '#ff9800',
    'Admin': '#f44336'
  };

  useEffect(() => {
    const processChartData = () => {
      try {
        // Sử dụng data từ AdminContext thay vì gọi API lại
        const userStats = userStatistics;
        const courseStats = courseStatistics;
        const coursesList = courses;
        
        console.log('userStats:', userStats);
        console.log('courseStats:', courseStats);
        console.log('coursesList:', coursesList);
        
        // Xử lý dữ liệu phân bố vai trò user
        const roleDistribution = userStats?.usersByRole || [];
        const pieData = roleDistribution.map(role => {
          // Map tên vai trò từ tiếng Anh sang tiếng Việt
          let roleName = role.roleName;
          if (role.roleName === 'User') roleName = 'Học sinh';
          else if (role.roleName === 'Teacher') roleName = 'Giáo viên';
          else if (role.roleName === 'Admin') roleName = 'Quản trị viên';
          
          return {
            name: roleName,
            value: role.count,
            percentage: role.percentage
          };
        });
        setUserRoleData(pieData);
        console.log('userRoleData:', pieData);
        
        // Tạo mảng tháng chuẩn (T1-T12)
        const months = [
          'T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'
        ];
        
        // Map dữ liệu user (nếu không có UserRegistrationsByMonth thì dùng mock hoặc 0)
        const userByMonth = userStats?.UserRegistrationsByMonth || userStats?.userRegistrationsByMonth || [];
        
        // Tính toán số khóa học mới theo tháng từ danh sách courses
        const currentYear = new Date().getFullYear();
        
        // Tạo chart data
        const chartData = months.map(m => {
          // Tìm user count cho tháng này
          let userCount = 0;
          if (userByMonth.length > 0) {
            const userData = userByMonth.find(u => 
              (u.Month || u.month) === m || 
              (u.Month || u.month) === `Th${m.substring(1)}`
            );
            userCount = userData ? (userData.Count || userData.count || 0) : 0;
          }
          
          // Tính số khóa học mới trong tháng này từ danh sách courses
          const monthNumber = parseInt(m.substring(1)); // Lấy số từ T1 -> 1
          const courseCount = coursesList.filter(course => {
            if (!course.createdAt) return false;
            const courseDate = new Date(course.createdAt);
            return courseDate.getMonth() + 1 === monthNumber && courseDate.getFullYear() === currentYear;
          }).length;
          
          return {
            name: m,
            'User mới': userCount,
            'Khóa học mới': courseCount
          };
        });
        
        console.log('chartData:', chartData);
        setChartData(chartData);
        
        // Top courses từ data đã có
        const sortedCourses = [...coursesList]
          .map(c => ({
            ...c,
            studentCount: c.students || 0,
            courseName: c.name || ''
          }))
          .sort((a, b) => b.studentCount - a.studentCount)
          .slice(0, 5);
        
        console.log('sortedCourses:', sortedCourses);
        setTopCourses(sortedCourses);
      } catch (err) {
        console.error('Error processing chart data:', err);
        setChartData([]);
        setTopCourses([]);
        setUserRoleData([]);
      }
    };
    
    // Chỉ xử lý data khi có đủ data từ AdminContext
    if (userStatistics && courseStatistics && courses) {
      processChartData();
    }
  }, [userStatistics, courseStatistics, courses]);

  const newUsersThisMonth = userStatistics?.newUsersThisMonth || 0;
  const pendingCourses = courseStatistics?.pendingCourses || 0;
  
  // Tính tổng số đánh giá từ danh sách courses
  const totalReviews = courses.reduce((total, course) => total + (course.reviewCount || 0), 0);
  
  // Tính tổng số lượt đăng ký từ danh sách courses
  const totalRegistrations = courses.reduce((total, course) => total + (course.students || 0), 0);
  
  // Tính số khóa học mới trong tháng này
  const currentMonth = new Date().getMonth() + 1; // Tháng hiện tại (1-12)
  const currentYear = new Date().getFullYear();
  const newCoursesThisMonth = courses.filter(course => {
    if (!course.createdAt) return false;
    const courseDate = new Date(course.createdAt);
    return courseDate.getMonth() + 1 === currentMonth && courseDate.getFullYear() === currentYear;
  }).length;

  return (
    <Box className="dashboard-container">
      <Grid container className="dashboard-stats-grid">
        <Grid item xs={12} sm={6} md={4}>
          <motion.div
            whileHover={{ scale: 1.07, boxShadow: '0 12px 32px rgba(30,178,166,0.18)' }}
            className="dashboard-stat-card"
          >
            <span className="dashboard-stat-icon"><FaUserAlt /></span>
            <div className="dashboard-stat-content">
              <div className="dashboard-stat-number">
                <CountUp end={users.length} duration={1.2} />
              </div>
              <div className="dashboard-stat-label">Người dùng</div>
            </div>
          </motion.div>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <motion.div 
            whileHover={{ scale: 1.07, boxShadow: '0 12px 32px rgba(30,178,166,0.18)' }} 
            className="dashboard-stat-card"
          >
            <span className="dashboard-stat-icon"><FaBookOpen /></span>
            <div className="dashboard-stat-content">
              <div className="dashboard-stat-number">
                <CountUp end={courses.length} duration={1.2} />
              </div>
              <div className="dashboard-stat-label">Khóa học</div>
            </div>
          </motion.div>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <motion.div 
            whileHover={{ scale: 1.07, boxShadow: '0 12px 32px rgba(255,179,0,0.18)' }} 
            className="dashboard-stat-card"
            style={{ background: 'linear-gradient(135deg, #fffbe7 0%, #fff 100%)' }}
          >
            <span className="dashboard-stat-icon" style={{ background: 'linear-gradient(135deg, #ffb300 60%, #ff7043 100%)' }}>
              <FaUserPlus />
            </span>
            <div className="dashboard-stat-content">
                             <div className="dashboard-stat-number">
                 <CountUp end={totalRegistrations} duration={1.2} />
               </div>
               <div className="dashboard-stat-label">Lượt đăng ký</div>
            </div>
          </motion.div>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <motion.div 
            whileHover={{ scale: 1.07, boxShadow: '0 12px 32px rgba(255,82,82,0.18)' }} 
            className="dashboard-stat-card"
            style={{ background: 'linear-gradient(135deg, #fff0f0 0%, #fff 100%)' }}
          >
            <span className="dashboard-stat-icon" style={{ background: 'linear-gradient(135deg, #ff5252 60%, #ffb300 100%)' }}>
              <FaRegStar />
            </span>
            <div className="dashboard-stat-content">
                             <div className="dashboard-stat-number">
                 <CountUp end={totalReviews} duration={1.2} />
               </div>
               <div className="dashboard-stat-label">Lượt đánh giá</div>
            </div>
          </motion.div>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <motion.div 
            whileHover={{ scale: 1.07, boxShadow: '0 12px 32px rgba(30,178,166,0.18)' }} 
            className="dashboard-stat-card"
          >
            <span className="dashboard-stat-icon" style={{ background: 'linear-gradient(135deg, #1eb2a6 60%, #184d47 100%)' }}>
              <FaUserGraduate />
            </span>
            <div className="dashboard-stat-content">
              <div className="dashboard-stat-number">
                <CountUp end={newUsersThisMonth} duration={1.2} />
              </div>
              <div className="dashboard-stat-label">User mới tháng này</div>
            </div>
          </motion.div>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <motion.div 
            whileHover={{ scale: 1.07, boxShadow: '0 12px 32px rgba(24,77,71,0.18)' }} 
            className="dashboard-stat-card"
          >
            <span className="dashboard-stat-icon" style={{ background: 'linear-gradient(135deg, #184d47 60%, #1eb2a6 100%)' }}>
              <FaBookOpen />
            </span>
            <div className="dashboard-stat-content">
                             <div className="dashboard-stat-number">
                 <CountUp end={newCoursesThisMonth} duration={1.2} />
               </div>
               <div className="dashboard-stat-label">Khóa học mới tháng này</div>
            </div>
          </motion.div>
        </Grid>
      </Grid>

      {/* Chart: User mới & Khóa học mới theo tháng */}
      <Box className="dashboard-chart-section">
        <Paper className="dashboard-chart-card">
          <Typography className="dashboard-chart-title">
            <Info className="dashboard-chart-icon" />
            Thống kê User & Khóa học mới theo tháng
          </Typography>
          <Box className="dashboard-chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="User mới" fill="#1eb2a6" />
                <Bar dataKey="Khóa học mới" fill="#184d47" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Box>

      {/* Pie Chart + Top Courses on one row */}
      <Box className="dashboard-charts-row">
        <Box className="dashboard-chart-col">
          <Paper className="dashboard-pie-chart-card">
            <Typography className="dashboard-pie-chart-title">
              <FaUserAlt className="dashboard-pie-chart-icon" />
              Phân bố vai trò người dùng
            </Typography>
            <Box className="dashboard-chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userRoleData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {userRoleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={roleColors[entry.name] || ['#1eb2a6', '#ff9800', '#f44336', '#9c27b0'][index % 4]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [value, name]} />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Box>

        <Box className="dashboard-chart-col">
          <Paper className="dashboard-top-courses-card">
            <Typography className="dashboard-top-courses-title">
              <FaBookOpen className="dashboard-top-courses-icon" />
              Top 5 khóa học đông học viên nhất
            </Typography>
            <Box className="dashboard-chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topCourses.map(c => ({
                    name: c.courseName,
                    soHocVien: c.studentCount
                  }))}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Bar dataKey="soHocVien" fill="#1eb2a6" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardPage; 