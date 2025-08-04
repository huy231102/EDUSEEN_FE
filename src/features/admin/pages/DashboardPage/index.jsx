import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Paper } from "@material-ui/core";
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { FaUserAlt, FaBookOpen, FaUserPlus, FaRegStar, FaUserGraduate } from 'react-icons/fa';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Info } from "@material-ui/icons";

// Import CSS
import './style.css';

import { useAdmin } from "../../contexts/AdminContext";

const DashboardPage = () => {
  const { users, courses, userStatistics, courseStatistics } = useAdmin();
  const [chartData, setChartData] = useState([]);
  const [topCourses, setTopCourses] = useState([]);

  useEffect(() => {
    // Mock data cho biểu đồ
    const mockChartData = [
      { name: 'T1', 'User mới': 12, 'Khóa học mới': 5 },
      { name: 'T2', 'User mới': 19, 'Khóa học mới': 8 },
      { name: 'T3', 'User mới': 15, 'Khóa học mới': 12 },
      { name: 'T4', 'User mới': 25, 'Khóa học mới': 15 },
      { name: 'T5', 'User mới': 22, 'Khóa học mới': 18 },
      { name: 'T6', 'User mới': 30, 'Khóa học mới': 20 },
    ];
    setChartData(mockChartData);

    // Top courses
    const sortedCourses = [...courses].sort((a, b) => 
      (Array.isArray(b.students) ? b.students.length : (b.students || 0)) - 
      (Array.isArray(a.students) ? a.students.length : (a.students || 0))
    ).slice(0, 5);
    setTopCourses(sortedCourses);
  }, [courses]);

  const newUsersThisMonth = userStatistics?.newUsersThisMonth || 0;
  const pendingCourses = courseStatistics?.pendingCourses || 0;

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
                <CountUp end={3} duration={1.2} />
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
                <CountUp end={0} duration={1.2} />
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
                <CountUp end={pendingCourses} duration={1.2} />
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

      {/* Bar Chart: Top 5 khóa học đông học viên nhất */}
      <Box className="dashboard-top-courses">
        <Paper className="dashboard-top-courses-card">
          <Typography className="dashboard-top-courses-title">
            <FaBookOpen className="dashboard-top-courses-icon" />
            Top 5 khóa học đông học viên nhất
          </Typography>
          <Box className="dashboard-chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topCourses.map((c, idx) => ({
                  name: c.name,
                  'Số học viên': Array.isArray(c.students) ? c.students.length : (c.students || 0),
                }))}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Bar dataKey="Số học viên" fill="#1eb2a6" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default DashboardPage; 