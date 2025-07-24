import React, { useState, useEffect } from "react";
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, AppBar, Toolbar, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, TextField, Tooltip as MuiTooltip, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Select, FormControl, InputLabel, Switch, FormControlLabel, TablePagination, Avatar, Grid, InputAdornment, Chip, Collapse } from "@material-ui/core";
import { People, Dashboard, Assignment, School, ExitToApp, Add, Edit, Delete, GetApp, PictureAsPdf, Search, Info, Star, BarChart as BarChartIcon, PersonAdd, RateReview, Lock, LockOpen, Refresh, Settings, ExpandLess, ExpandMore, Tune, PlayArrow, AccessTime, TrendingUp, CheckCircle, Group, Person, Block } from "@material-ui/icons";
import './style.css';
import { format } from 'date-fns';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js';
import CountUp from 'react-countup';
import { FaUserAlt, FaBookOpen, FaUserPlus, FaRegStar, FaUserGraduate, FaClipboardList, FaRegEdit } from 'react-icons/fa';
import { motion } from 'framer-motion';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import CategoryIcon from '@material-ui/icons/Category';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import FolderIcon from '@material-ui/icons/Folder';
import Snackbar from '@material-ui/core/Snackbar';

import EmojiObjectsIcon from '@material-ui/icons/EmojiObjects';
import BookIcon from '@material-ui/icons/Book';
import LanguageIcon from '@material-ui/icons/Language';

import api from "services/api";
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend as RechartsLegend, ResponsiveContainer } from 'recharts';


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  ChartTooltip,
  Legend,
  ChartDataLabels
);

const fallbackCourses = [
  {
    id: 1,
    name: 'Toán 12 Nâng cao',
    code: 'MATH12A',
    teacher: 'Nguyễn Văn A',
    createdAt: '2023-01-10',
    status: 'Chờ duyệt',
    students: 2,
    description: 'Khóa học toán nâng cao cho học sinh lớp 12',
    category: 'Toán học',
    level: 'Advanced',
    thumbnailUrl: ''
  },
  {
    id: 2,
    name: 'Văn học hiện đại',
    code: 'LIT11B',
    teacher: 'Trần Thị B',
    createdAt: '2023-02-15',
    status: 'Đã duyệt',
    students: 1,
    description: 'Khóa học văn học hiện đại Việt Nam',
    category: 'Văn học',
    level: 'Intermediate',
    thumbnailUrl: ''
  }
];

// Mock dữ liệu user mẫu để tránh lỗi khi chưa có API hoặc khi pendingUsers cần dữ liệu mẫu
const mockUsers = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "a@gmail.com",
    username: "nguyenvana",
    role: "Học sinh",
    status: "Hoạt động",
    joined: "2023-01-10",
    lastActive: "2023-07-01",
    avatar: "",
  },
  {
    id: 2,
    name: "Trần Thị B",
    email: "b@gmail.com",
    username: "tranthib",
    role: "Quản trị viên",
    status: "Chờ duyệt",
    joined: "2023-02-15",
    lastActive: "2023-07-02",
    avatar: "",
  },
  // ... Thêm các user mẫu khác nếu cần
];

// Bảng màu cho các trạng thái user/course
const statusColor = {
  "Hoạt động": "#4caf50",
  "Đã khóa": "#f44336",
  "Đã duyệt": "#1eb2a6",
};

function AdminDashboard(props) {
  const navigate = useNavigate();
  // State cho Quản lý khóa học - phải khai báo trước khi sử dụng
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [openCourseDetail, setOpenCourseDetail] = useState(false);

  const [courseSearch, setCourseSearch] = useState("");
  const [coursePage, setCoursePage] = useState(0);
  const [courseRowsPerPage, setCourseRowsPerPage] = useState(8);
  const [courseStatusFilter, setCourseStatusFilter] = useState("");
  const [courseDateFilter, setCourseDateFilter] = useState("");
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [courseToast, setCourseToast] = useState({ open: false, message: '', severity: 'success' });
  const [userToast, setUserToast] = useState({ open: false, message: '', severity: 'success' });
  const [usingFallbackData, setUsingFallbackData] = useState(false);
  const [usingFallbackUsers, setUsingFallbackUsers] = useState(false);
  const [courseStatistics, setCourseStatistics] = useState({
    totalCourses: 0,
    activeCourses: 0,
    inactiveCourses: 0,
    pendingCourses: 0,
    totalStudents: 0,
    totalTeachers: 0,
    averageRating: 0,
    totalReviews: 0
  });
  const [courseStatisticsLoaded, setCourseStatisticsLoaded] = useState(false);

  const [userStatistics, setUserStatistics] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    students: 0,
    teachers: 0,
    admins: 0,
    newUsersThisMonth: 0,
    newUsersThisWeek: 0,
    averageUsersPerDay: 0,
    usersByRole: [],
    usersByStatus: [],
    userRegistrationsByMonth: []
  });




  // State cho Quản lý người dùng
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedMenu, setSelectedMenu] = useState("Bảng điều khiển");


  const [openSetting, setOpenSetting] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  // Định nghĩa roleMapById ở ngoài useEffect để có thể sử dụng trong fetchUsers
  const roleMapById = {
    1: "Học sinh",        // User
    2: "Quản trị viên",   // Admin
    3: "Giáo viên"        // Teacher
  };

  // Thêm lại biến now cho chart data
  const now = new Date();
  const chartYear = now.getFullYear(); // Lấy năm hiện tại, hoặc cho phép chọn năm nếu muốn

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Bắt đầu loadData...');
        
        // Load users
        await fetchUsers();
        console.log('fetchUsers hoàn thành');
        
        // Load user statistics
        await fetchUserStatistics(chartYear);
        console.log('fetchUserStatistics hoàn thành');
        
        // Load courses và course statistics
        await fetchCourses();
        console.log('fetchCourses hoàn thành');
        
        await fetchCourseStatistics(chartYear);
        console.log('fetchCourseStatistics hoàn thành');
        
      } catch (error) {
        console.error('Lỗi trong loadData:', error);
      }
    };
    
    loadData();
  }, [chartYear]);

  // Chỉ load lại course statistics khi courses thay đổi và chưa load
  useEffect(() => {
    if (courses.length > 0 && !courseStatisticsLoaded) {
      console.log('Courses đã load, load lại course statistics...');
      fetchCourseStatistics();
    }
  }, [courses, courseStatisticsLoaded]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      console.log('Đang tải danh sách người dùng...');
      const res = await api.get("/api/admin/user");
      console.log('Response từ API users:', res);
      
      // Xử lý response có thể là array hoặc object có data property
      const data = Array.isArray(res) ? res : (res?.data || []);
      console.log('Data từ API users:', data);
      
      const mappedUsers = data.map(u => ({
        id: u.userId,
        name: `${u.firstName || ''} ${u.lastName || ''}`.trim(),
        email: u.email,
        username: u.username,
        role: roleMapById[u.roleId] || u.roleName,
        status: u.isActive ? "Hoạt động" : "Đã khóa",
        joined: u.createdAt,
        lastActive: u.updatedAt,
        avatar: u.avatarUrl,
      }));
      
      console.log('Mapped users:', mappedUsers);
      setUsers(mappedUsers);
      setUsingFallbackUsers(false);
    } catch (err) {
      console.error('Lỗi khi tải danh sách người dùng:', err);
      console.log('Error details:', {
        message: err.message,
        status: err.status,
        response: err.response
      });
      
      // Sử dụng mock data khi API không hoạt động
      setUsers(mockUsers.filter(u => u.status !== 'Chờ duyệt'));
      setUsingFallbackUsers(true);
      // Hiển thị thông báo lỗi
      setUserToast({
        open: true,
        message: `Không thể tải danh sách người dùng: ${err.message || 'Lỗi không xác định'}`,
        severity: 'warning'
      });
    } finally {
      setLoading(false);
    }
  };



  // Lọc theo tên, email, username, role, trạng thái, ngày tham gia
  const filteredUsers = users.filter(u => {
    const searchMatch =
      ((u.name || '').toLowerCase().includes(search.toLowerCase())) ||
      ((u.email || '').toLowerCase().includes(search.toLowerCase())) ||
      ((u.username || '').toLowerCase().includes(search.toLowerCase()));
    const roleMatch = roleFilter ? u.role === roleFilter : true;
    const statusMatch = statusFilter ? u.status === statusFilter : true;
    const dateMatch = dateFilter ? u.joined === dateFilter : true;
    return searchMatch && roleMatch && statusMatch && dateMatch;
  });

  // Phân trang
  const pagedUsers = filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDetail = (user) => {
    console.log("Chi tiết user:", user); // Thêm dòng này
    setSelectedUser(user);
    setOpenDetail(true);
  };
  const handleCloseDetail = () => setOpenDetail(false);

  const handleOpenEdit = (user) => {
    setEditUser({ ...user });
    setOpenEdit(true);
  };
  const handleCloseEdit = () => setOpenEdit(false);

  const handleEditChange = (field, value) => {
    setEditUser(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveEdit = async () => {
    try {
      console.log('Đang cập nhật thông tin user:', editUser);
      
      // Gọi API để cập nhật user
      const response = await api.put(`/api/admin/user/${editUser.id}`, {
        firstName: editUser.name.split(' ')[0] || '',
        lastName: editUser.name.split(' ').slice(1).join(' ') || '',
        email: editUser.email,
        username: editUser.username,
        roleId: editUser.role === 'Học sinh' ? 1 : 
                editUser.role === 'Quản trị viên' ? 2 : 3,
        isActive: editUser.status === 'Hoạt động'
      });
      
      console.log('Response từ API update user:', response);
      
      // Cập nhật state local
      setUsers(prev => prev.map(u => u.id === editUser.id ? { ...editUser } : u));
      setOpenEdit(false);
      
      setUserToast({
        open: true,
        message: 'Cập nhật thông tin người dùng thành công!',
        severity: 'success'
      });
      
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin user:', error);
      console.log('Error details:', {
        message: error.message,
        status: error.status,
        response: error.response
      });
      
      setUserToast({
        open: true,
        message: `Không thể cập nhật thông tin: ${error.message || 'Lỗi không xác định'}`,
        severity: 'error'
      });
    }
  };



  // Thống kê số liệu dashboard
  const totalUsers = userStatistics.totalUsers || 0;
  const activeUsers = userStatistics.activeUsers || 0;
  const inactiveUsers = userStatistics.inactiveUsers || 0;
  const students = userStatistics.students || 0;
  const teachers = userStatistics.teachers || 0;
  const admins = userStatistics.admins || 0;
  const newUsersThisMonth = userStatistics.newUsersThisMonth || 0;
  const newUsersThisWeek = userStatistics.newUsersThisWeek || 0;
  const averageUsersPerDay = userStatistics.averageUsersPerDay || 0;

  const totalCourses = courseStatistics.totalCourses || 0;
  const activeCourses = courseStatistics.activeCourses || 0;
  const inactiveCourses = courseStatistics.inactiveCourses || 0;
  const pendingCourses = courseStatistics.pendingCourses || 0;
  const totalStudents = courseStatistics.totalStudents || 0;
  const totalTeachers = courseStatistics.totalTeachers || 0;
  const averageRating = courseStatistics.averageRating || 0;
  const totalReviews = courseStatistics.totalReviews || 0;

  // Dữ liệu biểu đồ mock: số user và số khóa học theo tháng (12 tháng)
  const months = [
    'Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'
  ];
  // Lấy số liệu user mới từ API, fallback về random nếu không có
  const usersByMonth = (userStatistics.userRegistrationsByMonth && userStatistics.userRegistrationsByMonth.length === 12 && typeof userStatistics.userRegistrationsByMonth[0] === 'object')
    ? userStatistics.userRegistrationsByMonth.map(item => item.Count)
    : Array.from({ length: 12 }, () => Math.floor(Math.random() * 50));
  // Lấy số liệu khóa học mới từ API, fallback về random nếu không có
  const coursesByMonth = (courseStatistics.courseRegistrationsByMonth && courseStatistics.courseRegistrationsByMonth.length === 12)
    ? courseStatistics.courseRegistrationsByMonth
    : Array.from({ length: 12 }, () => Math.floor(Math.random() * 20));
  const barData = {
    labels: months,
    datasets: [
      {
        label: 'User mới',
        backgroundColor: '#1eb2a6',
        data: usersByMonth,
      },
      {
        label: 'Khóa học mới',
        backgroundColor: '#184d47',
        data: coursesByMonth,
      },
    ],
  };
  const barOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const value = context.parsed;
            const percent = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${value} (${percent}%)`;
          }
        }
      },
      datalabels: {
        anchor: 'end',
        align: 'right',
        color: '#184d47',
        font: { weight: 'bold', size: 14 },
        formatter: value => value
      }
    },
    scales: { y: { beginAtZero: true } },
    animation: {
      duration: 1500,
      easing: 'easeOutBounce'
    }
  };

  // Chuẩn bị dữ liệu cho Recharts
  const chartData = months.map((label, idx) => ({
    name: label,
    'User mới': usersByMonth[idx],
    'Khóa học mới': coursesByMonth[idx],
  }));

  // Giả lập user admin
  const userAdmin = { username: 'admin', name: 'Admin' };

  // Lấy user từ props, context hoặc localStorage (mock tạm nếu chưa có)
  const user = props.user || JSON.parse(localStorage.getItem('user')) || { roleId: 2, username: 'admin' };
  // XÓA hoặc comment đoạn useEffect tự động chuyển tab Dashboard
  // React.useEffect(() => {
  //   if (user.roleId === 2) {
  //     setSelectedMenu('Bảng điều khiển');
  //   }
  // }, [user]);

  // Thêm style cho card thống kê
  const statCardStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    background: 'linear-gradient(135deg, #e0f7fa 0%, #fff 100%)',
    borderRadius: 18,
    boxShadow: '0 4px 16px rgba(30,178,166,0.08)',
    padding: '24px 32px',
    minWidth: 220,
    minHeight: 90,
    transition: 'transform 0.2s',
    cursor: 'pointer',
  };
  const statIconStyle = {
    width: 48,
    height: 48,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #1eb2a6 60%, #184d47 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: 32,
    boxShadow: '0 2px 8px rgba(30,178,166,0.12)'
  };
  const statNumberStyle = {
    fontWeight: 800,
    fontSize: 32,
    color: '#184d47',
    marginBottom: 2
  };
  const statLabelStyle = {
    fontWeight: 500,
    color: '#555',
    fontSize: 15
  };

  // Pie chart trạng thái user
  const userStatusCounts = {
    'Hoạt động': users.filter(u => u.status === 'Hoạt động').length,
    'Đã khóa': users.filter(u => u.status === 'Đã khóa').length,
  };
  const pieStatusData = {
    labels: Object.keys(userStatusCounts),
    datasets: [{
      data: Object.values(userStatusCounts),
      backgroundColor: ['#4caf50', '#f44336'],
      borderWidth: 2,
    }]
  };

  // Bar chart top 5 khóa học đông học viên nhất
  const topCourses = [...courses]
    .sort((a, b) => (Array.isArray(b.students) ? b.students.length : (b.students || 0)) - (Array.isArray(a.students) ? a.students.length : (a.students || 0)))
    .slice(0, 5);
  const barTopCoursesData = {
    labels: topCourses.map(c => c.name),
    datasets: [{
      label: 'Số học viên',
      data: topCourses.map(c => Array.isArray(c.students) ? c.students.length : (c.students || 0)),
      backgroundColor: '#1eb2a6',
      borderRadius: 8,
      maxBarThickness: 36,
    }]
  };
  const barTopCoursesOptions = {
    indexAxis: 'y',
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const value = context.parsed;
            const percent = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${value} (${percent}%)`;
          }
        }
      },
      datalabels: {
        anchor: 'end',
        align: 'right',
        color: '#184d47',
        font: { weight: 'bold', size: 14 },
        formatter: value => value
      }
    },
    scales: { x: { beginAtZero: true, ticks: { stepSize: 1 } } },
    animation: { duration: 1200, easing: 'easeOutBounce' }
  };

  const [systemSettingTab, setSystemSettingTab] = useState(0);

  // State cho Quản lý danh mục khóa học
  const [categories, setCategories] = useState([
    { id: 1, name: 'Toán', description: 'Các khóa học toán', active: true, courseCount: 12, iconType: 'folder' },
    { id: 2, name: 'Văn', description: 'Các khóa học văn', active: true, courseCount: 8, iconType: 'book' },
    { id: 3, name: 'Tiếng Anh', description: 'Các khóa học tiếng Anh', active: false, courseCount: 5, iconType: 'lang' },
  ]);
  const [searchCategory, setSearchCategory] = useState('');
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [openAddCategory, setOpenAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', description: '', iconType: 'folder' });
  const [editCategory, setEditCategory] = useState(null);

  const handleOpenAddCategory = () => { setNewCategory({ name: '', description: '', iconType: 'folder' }); setOpenAddCategory(true); };
  const handleCloseAddCategory = () => setOpenAddCategory(false);
  const handleSaveAddCategory = () => {
    setCategories(prev => [...prev, { id: Date.now(), name: newCategory.name, description: newCategory.description, active: true, courseCount: 0, iconType: newCategory.iconType }]);
    setOpenAddCategory(false);
    setToast({ open: true, message: 'Thêm danh mục thành công!', severity: 'success' });
  };
  const handleEditCategory = (cat) => { setEditCategory(cat); setNewCategory({ name: cat.name, description: cat.description, iconType: cat.iconType }); setOpenAddCategory(true); };
  const handleSaveEditCategory = () => {
    setCategories(prev => prev.map(cat => cat.id === editCategory.id ? { ...cat, name: newCategory.name, description: newCategory.description, iconType: newCategory.iconType } : cat));
    setEditCategory(null); setOpenAddCategory(false);
    setToast({ open: true, message: 'Cập nhật danh mục thành công!', severity: 'success' });
  };
  const handleDeleteCategory = (id) => { setOpenDeleteConfirm(true); setDeleteTarget(id); };
  const handleConfirmDelete = () => {
    setCategories(prev => prev.filter(cat => cat.id !== deleteTarget));
    setOpenDeleteConfirm(false); setDeleteTarget(null);
    setToast({ open: true, message: 'Xóa danh mục thành công!', severity: 'success' });
  };
  const handleToggleCategory = (id) => {
    setCategories(prev => prev.map(cat => cat.id === id ? { ...cat, active: !cat.active } : cat));
    setToast({ open: true, message: 'Đã cập nhật trạng thái danh mục!', severity: 'info' });
  };

  // State cho Cấu hình thông báo
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyInApp, setNotifyInApp] = useState(true);
  const [templateUserApprove, setTemplateUserApprove] = useState('Chúc mừng, tài khoản của bạn đã được duyệt!');
  const handleSaveNotificationConfig = () => alert('Đã lưu cấu hình thông báo!');

  // State cho Cài đặt chung
  const [systemName, setSystemName] = useState('EDUSEEN LMS');
  const [logo, setLogo] = useState(null);
  const [mainColor, setMainColor] = useState('#1eb2a6');
  const [defaultLang, setDefaultLang] = useState('vi');
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setLogo(ev.target.result);
      reader.readAsDataURL(file);
    }
  };
  const handleSaveGeneralConfig = () => alert('Đã lưu cài đặt chung!');

  const iconOptions = [
    { label: 'Folder', value: 'folder', icon: <FolderIcon style={{ color: '#1eb2a6' }} /> },
    { label: 'Book', value: 'book', icon: <BookIcon style={{ color: '#ff9800' }} /> },
    { label: 'Lightbulb', value: 'light', icon: <EmojiObjectsIcon style={{ color: '#fbc02d' }} /> },
    { label: 'Language', value: 'lang', icon: <LanguageIcon style={{ color: '#2196f3' }} /> },
  ];
  const getIconByType = (type) => {
    const found = iconOptions.find(i => i.value === type);
    return found ? found.icon : <FolderIcon style={{ color: '#1eb2a6' }} />;
  };

  // Menu sidebar cho admin dashboard
  const menuItems = [
    { text: "Bảng điều khiển", icon: <Dashboard /> },
    { text: "Quản lý người dùng", icon: <People /> },
    { text: "Quản lý khóa học", icon: <School /> },
    { text: "Đăng xuất", icon: <ExitToApp /> },
  ];



  // Lấy danh sách khóa học từ API
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoadingCourses(true);
    try {
      console.log('Đang tải danh sách khóa học...');
      const response = await api.get("/api/admin/course");
      console.log('Response từ API courses:', response);
      
      // Xử lý response có thể là array hoặc object có data property
      const data = Array.isArray(response) ? response : (response?.data || []);
      console.log('Data từ API courses:', data);
      
      if (Array.isArray(data) && data.length > 0) {
        const mappedCourses = data.map(course => ({
          id: course.courseId,
          name: course.title,
          code: course.courseId.toString(),
          teacher: course.teacherName || 'Chưa có giáo viên',
          createdAt: course.createdAt,
          status: course.isActive ? 'Đã duyệt' : 'Chờ duyệt',
          students: course.studentCount || 0,
          description: course.description,
          category: course.categoryName,
          level: course.level,
          sectionCount: course.sectionCount || 0,
          lectureCount: course.lectureCount || 0,
          averageRating: course.averageRating,
          reviewCount: course.reviewCount || 0,
          thumbnailUrl: course.thumbnailUrl
        }));
        
        console.log('Courses đã được map:', mappedCourses);
        setCourses(mappedCourses);
        setUsingFallbackData(false);
      } else {
        console.log('Không có dữ liệu courses từ API');
        setCourses([]);
        setUsingFallbackData(false);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách khóa học:', error);
      console.log('Sử dụng fallback courses data...');
      
      // Sử dụng fallback data khi API không hoạt động
      setCourses(fallbackCourses);
      setUsingFallbackData(true);
      setCourseToast({
        open: true,
        message: 'Không thể kết nối API, đang sử dụng dữ liệu mẫu',
        severity: 'warning'
      });
    } finally {
      setLoadingCourses(false);
    }
  };

  // Fetch course statistics
  const fetchCourseStatistics = async (year = chartYear) => {
    try {
      const response = await api.get(`/api/admin/course/statistics?year=${year}`);
      const data = response?.data || response;
      const stats = {
        totalCourses: data.totalCourses || 0,
        activeCourses: data.activeCourses || 0,
        inactiveCourses: data.inactiveCourses || 0,
        pendingCourses: data.pendingCourses || 0,
        totalStudents: data.totalStudents || 0,
        totalTeachers: data.totalTeachers || 0,
        averageRating: data.averageRating || 0,
        totalReviews: data.totalReviews || 0,
        courseRegistrationsByMonth: data.courseRegistrationsByMonth || []
      };
      setCourseStatistics(stats);
      setCourseStatisticsLoaded(true);
    } catch (error) {
      console.error('Lỗi khi tải thống kê khóa học:', error);
      console.log('Sử dụng fallback data từ courses array...');
      
      // Sử dụng dữ liệu từ courses nếu API không hoạt động
      const fallbackStats = {
        totalCourses: courses.length,
        activeCourses: courses.filter(c => c.status === 'Đã duyệt').length,
        inactiveCourses: courses.filter(c => c.status === 'Chờ duyệt').length,
        pendingCourses: courses.filter(c => c.status === 'Chờ duyệt').length,
        totalStudents: courses.reduce((sum, c) => sum + (Array.isArray(c.students) ? c.students.length : (c.students || 0)), 0),
        totalTeachers: 0,
        averageRating: 0,
        totalReviews: 0
      };
      
      console.log('Fallback stats:', fallbackStats);
      setCourseStatistics(fallbackStats);
      setCourseStatisticsLoaded(true);
    }
  };

  // Fetch user statistics
  const fetchUserStatistics = async (year = chartYear) => {
    try {
      const response = await api.get(`/api/admin/user/statistics?year=${year}`);
      const data = response?.data || response;
      // Lấy danh sách users hiện tại để xác định học sinh
      // (nếu users chưa load thì fallback về data.students như cũ)
      let studentsCount = 0;
      if (users && users.length > 0) {
        studentsCount = users.filter(u => u.role !== 'Quản trị viên' && u.role !== 'Giáo viên').length;
      } else {
        studentsCount = data.students || 0;
      }
      
      const stats = {
        totalUsers: data.totalUsers || 0,
        activeUsers: data.activeUsers || 0,
        inactiveUsers: data.inactiveUsers || 0,
        students: studentsCount,
        teachers: data.teachers || 0,
        admins: data.admins || 0,
        newUsersThisMonth: data.newUsersThisMonth || 0,
        newUsersThisWeek: data.newUsersThisWeek || 0,
        averageUsersPerDay: data.averageUsersPerDay || 0,
        usersByRole: data.usersByRole || [],
        usersByStatus: data.usersByStatus || [],
        userRegistrationsByMonth: data.userRegistrationsByMonth || []
      };
      
      console.log('User statistics đã được set:', stats);
      setUserStatistics(stats);
    } catch (error) {
      console.error('Lỗi khi tải thống kê người dùng:', error);
      console.log('Sử dụng fallback data từ users array...');
      
      // Sử dụng dữ liệu từ users nếu API không hoạt động
      const fallbackStats = {
        totalUsers: users.length,
        activeUsers: users.filter(u => u.status === 'Hoạt động').length,
        inactiveUsers: users.filter(u => u.status === 'Đã khóa').length,
        students: users.filter(u => u.role !== 'Quản trị viên' && u.role !== 'Giáo viên').length,
        teachers: users.filter(u => u.role === 'Giáo viên').length,
        admins: users.filter(u => u.role === 'Quản trị viên').length,
        newUsersThisMonth: 0,
        newUsersThisWeek: 0,
        averageUsersPerDay: 0,
        usersByRole: [],
        usersByStatus: [],
        userRegistrationsByMonth: []
      };
      
      console.log('Fallback user stats:', fallbackStats);
      setUserStatistics(fallbackStats);
    }
  };

  // Lọc khóa học
  const filteredCourses = courses.filter(course => {
    const searchMatch = course.name.toLowerCase().includes(courseSearch.toLowerCase()) ||
                       course.teacher.toLowerCase().includes(courseSearch.toLowerCase());
    const statusMatch = courseStatusFilter ? course.status === courseStatusFilter : true;
    const dateMatch = courseDateFilter ? course.createdAt === courseDateFilter : true;
    return searchMatch && statusMatch && dateMatch;
  });

  // Phân trang khóa học
  const pagedCourses = filteredCourses.slice(
    coursePage * courseRowsPerPage,
    coursePage * courseRowsPerPage + courseRowsPerPage
  );

  const handleCoursePageChange = (event, newPage) => {
    setCoursePage(newPage);
  };

  const handleCourseRowsPerPageChange = (event) => {
    setCourseRowsPerPage(parseInt(event.target.value, 10));
    setCoursePage(0);
  };







  // Xử lý mở chi tiết khóa học
  const handleOpenCourseDetail = (course) => {
    setSelectedCourse(course);
    setOpenCourseDetail(true);
  };



  // Xử lý xóa khóa học
  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khóa học này?')) {
      try {
        console.log('Đang xóa khóa học:', courseId);
        
        const response = await api.delete(`/api/admin/course/${courseId}`);
        console.log('Response từ API delete course:', response);
        
        setCourseToast({
          open: true,
          message: 'Xóa khóa học thành công!',
          severity: 'success'
        });
        
        // Tải lại danh sách và thống kê
        await fetchCourses();
        await fetchCourseStatistics();
        
      } catch (error) {
        console.error('Lỗi khi xóa khóa học:', error);
        console.log('Error details:', {
          message: error.message,
          status: error.status,
          response: error.response
        });
        
        setCourseToast({
          open: true,
          message: `Không thể xóa khóa học: ${error.message || 'Lỗi không xác định'}`,
          severity: 'error'
        });
      }
    }
  };

  // Xử lý duyệt/khóa khóa học
  const handleToggleCourseStatus = async (courseId, currentStatus) => {
    try {
      console.log('Đang thay đổi trạng thái khóa học:', { courseId, currentStatus });
      
      const newStatus = currentStatus === 'Đã duyệt' ? false : true;
      console.log('Trạng thái mới:', newStatus);
      
      const response = await api.put(`/api/admin/course/${courseId}/status`, {
        isActive: newStatus
      });
      
      console.log('Response từ API toggle status:', response);
      
      setCourseToast({
        open: true,
        message: `Đã ${newStatus ? 'duyệt' : 'khóa'} khóa học!`,
        severity: 'success'
      });
      
      // Tải lại danh sách và thống kê
      await fetchCourses();
      await fetchCourseStatistics();
      
    } catch (error) {
      console.error('Lỗi khi thay đổi trạng thái khóa học:', error);
      console.log('Error details:', {
        message: error.message,
        status: error.status,
        response: error.response
      });
      
      setCourseToast({
        open: true,
        message: `Không thể thay đổi trạng thái khóa học: ${error.message || 'Lỗi không xác định'}`,
        severity: 'error'
      });
    }
  };

  // Hàm xử lý logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login'); // hoặc window.location.href = '/login'; nếu không dùng react-router-dom
  };

  return (
    <Box sx={{ background: '#f7fafc', minHeight: '100vh' }}>
      {/* Sidebar cố định bên trái */}
      <Drawer variant="permanent" anchor="left" className="admin-sidebar">
        <Box width={220} bgcolor="#184d47" color="#fff" height="100vh">
          <Box p={3} textAlign="center" borderBottom="1px solid #33d1c9">
            <Box display="flex" flexDirection="column" alignItems="center" mb={1}>
              <Avatar style={{ background: '#fff', color: '#1eb2a6', fontWeight: 700, width: 48, height: 48, marginBottom: 4 }}>
                {userAdmin.username.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="body2" style={{ color: '#fff' }}>Xin chào, {userAdmin.username}</Typography>
            </Box>
          </Box>
          <List>
            {menuItems.slice(0, 3).map((item) => (
              <ListItem
                button
                key={item.text}
                selected={selectedMenu === item.text}
                onClick={() => setSelectedMenu(item.text)}
                style={{
                  background: selectedMenu === item.text ? "#222" : "transparent",
                  color: selectedMenu === item.text ? "#fff" : "#333",
                  borderRadius: 8,
                  marginBottom: 8,
                  position: "relative",
                  minHeight: 44,
                  fontWeight: selectedMenu === item.text ? 600 : 400,
                  transition: "background 0.2s",
                }}
              >
                {selectedMenu === item.text && (
                  <Box
                    position="absolute"
                    left={0}
                    top={8}
                    bottom={8}
                    width={4}
                    bgcolor="#00e0ff"
                    borderRadius={2}
                  />
                )}
                <ListItemIcon style={{ color: selectedMenu === item.text ? "#fff" : "#333" }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
            {/* Dropdown Cài đặt hệ thống */}
            <ListItem 
              button 
              selected={selectedMenu === "Quản lý danh mục khóa học"}
              onClick={() => setSelectedMenu("Quản lý danh mục khóa học")}
            >
              <ListItemIcon><CategoryIcon /></ListItemIcon>
              <ListItemText primary="Quản lý danh mục khóa học" />
            </ListItem>
            <Collapse in={openSetting} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem
                  button
                  style={{ paddingLeft: 40 }}
                  selected={selectedMenu === "Cấu hình thông báo"}
                  onClick={() => setSelectedMenu("Cấu hình thông báo")}
                >
                  <ListItemIcon><NotificationsIcon /></ListItemIcon>
                  <ListItemText primary="Cấu hình thông báo" />
                </ListItem>
                <ListItem
                  button
                  style={{ paddingLeft: 40 }}
                  selected={selectedMenu === "Cài đặt chung"}
                  onClick={() => setSelectedMenu("Cài đặt chung")}
                >
                  <ListItemIcon><Tune /></ListItemIcon>
                  <ListItemText primary="Cài đặt chung" />
                </ListItem>
              </List>
            </Collapse>
            {/* Đăng xuất */}
            <ListItem
              button
              key={menuItems[3].text}
              selected={selectedMenu === menuItems[3].text}
              onClick={handleLogout}
              style={{
                background: selectedMenu === menuItems[3].text ? "#222" : "transparent",
                color: selectedMenu === menuItems[3].text ? "#fff" : "#333",
                borderRadius: 8,
                marginBottom: 8,
                position: "relative",
                minHeight: 44,
                fontWeight: selectedMenu === menuItems[3].text ? 600 : 400,
                transition: "background 0.2s",
              }}
            >
              {selectedMenu === menuItems[3].text && (
                <Box
                  position="absolute"
                  left={0}
                  top={8}
                  bottom={8}
                  width={4}
                  bgcolor="#00e0ff"
                  borderRadius={2}
                />
              )}
              <ListItemIcon style={{ color: selectedMenu === menuItems[3].text ? "#fff" : "#333" }}>
                {menuItems[3].icon}
              </ListItemIcon>
              <ListItemText primary={menuItems[3].text} />
            </ListItem>
          </List>
        </Box>
      </Drawer>
      {/* Nội dung dashboard, marginLeft để không đè lên sidebar */}
      <Box sx={{ ml: '220px', maxWidth: 1200, mx: 'auto', px: 2, py: 5 }}>
        {selectedMenu === "Bảng điều khiển" && (
          <>
            {/* Section: Thống kê tổng quan */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h4" sx={{ color: '#184d47', fontWeight: 700, textAlign: 'center' }}>Thống kê tổng quan</Typography>
            </Box>
            <Grid container spacing={4} mb={6}>
              <Grid item xs={12} sm={6} md={4} style={{ marginBottom: 32 }}>
                <motion.div
                  whileHover={{ scale: 1.07, boxShadow: '0 12px 32px rgba(30,178,166,0.18)' }}
                  style={{ ...statCardStyle, minWidth: 260, minHeight: 120, padding: 32 }}
                >
                  <span style={{ ...statIconStyle, width: 60, height: 60, fontSize: 38 }}><FaUserAlt /></span>
                  <div>
                    <div style={{ ...statNumberStyle, fontSize: 40 }}><CountUp end={users.length} duration={1.2} /></div>
                    <div style={{ ...statLabelStyle, fontSize: 18 }}>Người dùng</div>
                  </div>
                </motion.div>
              </Grid>
              <Grid item xs={12} sm={6} md={4} style={{ marginBottom: 32 }}>
                <motion.div whileHover={{ scale: 1.07, boxShadow: '0 12px 32px rgba(30,178,166,0.18)' }} style={{ ...statCardStyle, minWidth: 260, minHeight: 120, padding: 32 }}>
                  <span style={{ ...statIconStyle, width: 60, height: 60, fontSize: 38 }}><FaBookOpen /></span>
                  <div>
                    <div style={{ ...statNumberStyle, fontSize: 40 }}><CountUp end={courses.length} duration={1.2} /></div>
                    <div style={{ ...statLabelStyle, fontSize: 18 }}>Khóa học</div>
                  </div>
                </motion.div>
              </Grid>
              <Grid item xs={12} sm={6} md={4} style={{ marginBottom: 32 }}>
                <motion.div whileHover={{ scale: 1.07, boxShadow: '0 12px 32px rgba(255,179,0,0.18)' }} style={{ ...statCardStyle, background: 'linear-gradient(135deg, #fffbe7 0%, #fff 100%)', minWidth: 260, minHeight: 120, padding: 32 }}>
                  <span style={{ ...statIconStyle, background: 'linear-gradient(135deg, #ffb300 60%, #ff7043 100%)', width: 60, height: 60, fontSize: 38 }}><FaUserPlus /></span>
                  <div>
                    <div style={{ ...statNumberStyle, fontSize: 40 }}><CountUp end={3} duration={1.2} /></div>
                    <div style={{ ...statLabelStyle, fontSize: 18 }}>Lượt đăng ký</div>
                  </div>
                </motion.div>
              </Grid>
              <Grid item xs={12} sm={6} md={4} style={{ marginBottom: 32 }}>
                <motion.div whileHover={{ scale: 1.07, boxShadow: '0 12px 32px rgba(255,82,82,0.18)' }} style={{ ...statCardStyle, background: 'linear-gradient(135deg, #fff0f0 0%, #fff 100%)', minWidth: 260, minHeight: 120, padding: 32 }}>
                  <span style={{ ...statIconStyle, background: 'linear-gradient(135deg, #ff5252 60%, #ffb300 100%)', width: 60, height: 60, fontSize: 38 }}><FaRegStar /></span>
                  <div>
                    <div style={{ ...statNumberStyle, fontSize: 40 }}><CountUp end={0} duration={1.2} /></div>
                    <div style={{ ...statLabelStyle, fontSize: 18 }}>Lượt đánh giá</div>
                  </div>
                </motion.div>
              </Grid>
              <Grid item xs={12} sm={6} md={4} style={{ marginBottom: 32 }}>
                <motion.div whileHover={{ scale: 1.07, boxShadow: '0 12px 32px rgba(30,178,166,0.18)' }} style={{ ...statCardStyle, minWidth: 260, minHeight: 120, padding: 32 }}>
                  <span style={{ ...statIconStyle, background: 'linear-gradient(135deg, #1eb2a6 60%, #184d47 100%)', width: 60, height: 60, fontSize: 38 }}><FaUserGraduate /></span>
                  <div>
                    <div style={{ ...statNumberStyle, fontSize: 40 }}><CountUp end={newUsersThisMonth} duration={1.2} /></div>
                    <div style={{ ...statLabelStyle, fontSize: 18 }}>User mới tháng này</div>
                  </div>
                </motion.div>
              </Grid>
              <Grid item xs={12} sm={6} md={4} style={{ marginBottom: 32 }}>
                <motion.div whileHover={{ scale: 1.07, boxShadow: '0 12px 32px rgba(24,77,71,0.18)' }} style={{ ...statCardStyle, minWidth: 260, minHeight: 120, padding: 32 }}>
                  <span style={{ ...statIconStyle, background: 'linear-gradient(135deg, #184d47 60%, #1eb2a6 100%)', width: 60, height: 60, fontSize: 38 }}><FaBookOpen /></span>
                  <div>
                    <div style={{ ...statNumberStyle, fontSize: 40 }}><CountUp end={pendingCourses} duration={1.2} /></div>
                    <div style={{ ...statLabelStyle, fontSize: 18 }}>Khóa học mới tháng này</div>
                  </div>
                </motion.div>
              </Grid>
            </Grid>
            {/* Section thông báo mới */}
            <Box mt={5}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 4, background: '#e0f7fa', boxShadow: '0 2px 12px rgba(30,178,166,0.08)' }}>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <span style={{...statIconStyle, background: 'linear-gradient(135deg, #184d47 60%, #1eb2a6 100%)', width: 36, height: 36, fontSize: 20}}><Info style={{ fontSize: 20 }} /></span>
                  <Typography variant="h6" style={{ color: '#184d47', fontWeight: 700 }}>Thông báo mới</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="textSecondary">- Hệ thống đã cập nhật giao diện dashboard mới hiện đại hơn.</Typography>
                  <Typography variant="body2" color="textSecondary">- Chúc bạn một ngày làm việc hiệu quả!</Typography>
                </Box>
              </Paper>
            </Box>
          </>
        )}
        {selectedMenu === "Quản lý người dùng" && (
          <>
            {/* Header Section */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h3" sx={{ color: '#184d47', fontWeight: 800, mb: 1 }}>
                Người dùng
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="body2" sx={{ color: '#1eb2a6', fontWeight: 600 }}>Dashboard</Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>/</Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>Người dùng</Typography>
              </Box>
            </Box>

            {/* Warning Message */}
            {usingFallbackUsers && (
              <Paper elevation={2} sx={{ p: 2, mb: 3, borderRadius: 12, background: '#fff3cd', border: '1px solid #ffeaa7' }}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Info style={{ color: '#856404' }} />
                  <Typography variant="body2" style={{ color: '#856404' }}>
                    Đang sử dụng dữ liệu mẫu do không thể kết nối API. Vui lòng kiểm tra kết nối mạng hoặc liên hệ quản trị viên.
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      setUsingFallbackUsers(false);
                      fetchUsers();
                      fetchUserStatistics();
                    }}
                    style={{ color: '#856404', borderColor: '#856404' }}
                  >
                    Thử lại
                  </Button>
                </Box>
              </Paper>
            )}

            {/* Statistics Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={2.4}>
                <Paper elevation={0} sx={{ 
                  p: 3, 
                  borderRadius: 20, 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                  color: 'white',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -50,
                    right: -50,
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)',
                    zIndex: 0
                  }
                }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" position="relative" zIndex={1}>
                    <Box>
                      <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, fontSize: '2.5rem' }}>
                        {userStatistics.totalUsers}
                      </Typography>
                      <Typography variant="body1" sx={{ opacity: 0.95, fontWeight: 500, fontSize: '0.95rem' }}>
                        Tổng người dùng
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1} mt={1}>
                        <TrendingUp style={{ fontSize: 16, opacity: 0.8 }} />
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                          +{userStatistics.newUsersThisMonth} tháng này
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ 
                      width: 70, 
                      height: 70, 
                      borderRadius: '50%', 
                      background: 'rgba(255,255,255,0.2)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.3)'
                    }}>
                      <People style={{ fontSize: 35 }} />
                    </Box>
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12} sm={6} md={2.4}>
                <Paper elevation={0} sx={{ 
                  p: 3, 
                  borderRadius: 20, 
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', 
                  color: 'white',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -30,
                    right: -30,
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)',
                    zIndex: 0
                  }
                }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" position="relative" zIndex={1}>
                    <Box>
                      <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, fontSize: '2.5rem' }}>
                        {userStatistics.activeUsers}
                      </Typography>
                      <Typography variant="body1" sx={{ opacity: 0.95, fontWeight: 500, fontSize: '0.95rem' }}>
                        Người dùng hoạt động
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1} mt={1}>
                        <CheckCircle style={{ fontSize: 16, opacity: 0.8 }} />
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                          {userStatistics.totalUsers > 0 ? ((userStatistics.activeUsers / userStatistics.totalUsers) * 100).toFixed(1) : 0}% tổng số
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ 
                      width: 70, 
                      height: 70, 
                      borderRadius: '50%', 
                      background: 'rgba(255,255,255,0.2)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.3)'
                    }}>
                      <CheckCircle style={{ fontSize: 35 }} />
                    </Box>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6} md={2.4}>
                <Paper elevation={0} sx={{ 
                  p: 3, 
                  borderRadius: 20, 
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', 
                  color: 'white',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -40,
                    right: -40,
                    width: 90,
                    height: 90,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)',
                    zIndex: 0
                  }
                }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" position="relative" zIndex={1}>
                    <Box>
                      <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, fontSize: '2.5rem' }}>
                        {userStatistics.students}
                      </Typography>
                      <Typography variant="body1" sx={{ opacity: 0.95, fontWeight: 500, fontSize: '0.95rem' }}>
                        Học sinh
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1} mt={1}>
                        <School style={{ fontSize: 16, opacity: 0.8 }} />
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                          {userStatistics.totalUsers > 0 ? ((userStatistics.students / userStatistics.totalUsers) * 100).toFixed(1) : 0}% tổng số
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ 
                      width: 70, 
                      height: 70, 
                      borderRadius: '50%', 
                      background: 'rgba(255,255,255,0.2)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.3)'
                    }}>
                      <School style={{ fontSize: 35 }} />
                    </Box>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6} md={2.4}>
                <Paper elevation={0} sx={{ 
                  p: 3, 
                  borderRadius: 20, 
                  background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', 
                  color: 'white',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -35,
                    right: -35,
                    width: 85,
                    height: 85,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)',
                    zIndex: 0
                  }
                }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" position="relative" zIndex={1}>
                    <Box>
                      <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, fontSize: '2.5rem' }}>
                        {userStatistics.teachers}
                      </Typography>
                      <Typography variant="body1" sx={{ opacity: 0.95, fontWeight: 500, fontSize: '0.95rem' }}>
                        Giáo viên
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1} mt={1}>
                        <Person style={{ fontSize: 16, opacity: 0.8 }} />
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                          {userStatistics.totalUsers > 0 ? ((userStatistics.teachers / userStatistics.totalUsers) * 100).toFixed(1) : 0}% tổng số
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ 
                      width: 70, 
                      height: 70, 
                      borderRadius: '50%', 
                      background: 'rgba(255,255,255,0.2)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.3)'
                    }}>
                      <Person style={{ fontSize: 35 }} />
                    </Box>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6} md={2.4}>
                <Paper elevation={0} sx={{ 
                  p: 3, 
                  borderRadius: 20, 
                  background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', 
                  color: 'white',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -45,
                    right: -45,
                    width: 95,
                    height: 95,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)',
                    zIndex: 0
                  }
                }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" position="relative" zIndex={1}>
                    <Box>
                      <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, fontSize: '2.5rem' }}>
                        {userStatistics.inactiveUsers}
                      </Typography>
                      <Typography variant="body1" sx={{ opacity: 0.95, fontWeight: 500, fontSize: '0.95rem' }}>
                        Người dùng không hoạt động
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1} mt={1}>
                        <Block style={{ fontSize: 16, opacity: 0.8 }} />
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                          {userStatistics.totalUsers > 0 ? ((userStatistics.inactiveUsers / userStatistics.totalUsers) * 100).toFixed(1) : 0}% tổng số
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ 
                      width: 70, 
                      height: 70, 
                      borderRadius: '50%', 
                      background: 'rgba(255,255,255,0.2)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.3)'
                    }}>
                      <Block style={{ fontSize: 35 }} />
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            </Grid>

            <Paper elevation={4} sx={{ p: 3, borderRadius: 4, background: '#fff', boxShadow: '0 4px 24px rgba(30,178,166,0.08)' }}>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <span style={{...statIconStyle, background: 'linear-gradient(135deg, #1eb2a6 60%, #184d47 100%)', width: 40, height: 40, fontSize: 24}}><People style={{ fontSize: 24 }} /></span>
                <Typography variant="h6" style={{ fontWeight: 700, color: '#184d47' }}>Danh sách người dùng</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={3} mb={2}>
                <TextField
                  variant="outlined"
                  size="small"
                  placeholder="Tìm kiếm người dùng"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                    style: { borderRadius: 24 }
                  }}
                  style={{ minWidth: 200 }}
                />
                <FormControl variant="outlined" size="small" style={{ minWidth: 150 }}>
                  <InputLabel>Vai trò</InputLabel>
                  <Select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} label="Vai trò">
                    <MenuItem value="">Tất cả</MenuItem>
                    <MenuItem value="Admin">Admin</MenuItem>
                    <MenuItem value="Giáo viên">Giáo viên</MenuItem>
                    <MenuItem value="Học sinh">Học sinh</MenuItem>
                  </Select>
                </FormControl>
                <FormControl variant="outlined" size="small" style={{ minWidth: 150 }}>
                  <InputLabel>Trạng thái</InputLabel>
                  <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} label="Trạng thái">
                    <MenuItem value="">Tất cả</MenuItem>
                    <MenuItem value="Hoạt động">Hoạt động</MenuItem>
                    <MenuItem value="Đã khóa">Đã khóa</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  variant="outlined"
                  size="small"
                  type="date"
                  label="Ngày tham gia"
                  InputLabelProps={{ shrink: true }}
                  value={dateFilter}
                  onChange={e => setDateFilter(e.target.value)}
                  style={{ minWidth: 160 }}
                />
                <IconButton onClick={() => { setSearch(''); setRoleFilter(''); setStatusFilter(''); setDateFilter(''); }}>
                  <Refresh />
                </IconButton>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Ảnh đại diện</TableCell>
                      <TableCell>Tên người dùng</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Vai trò</TableCell>
                      <TableCell>Trạng thái</TableCell>
                      <TableCell>Ngày tham gia</TableCell>
                      <TableCell>Hoạt động</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center">Đang tải dữ liệu...</TableCell>
                      </TableRow>
                    ) : filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center">Không tìm thấy người dùng nào.</TableCell>
                      </TableRow>
                    ) : (
                      pagedUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <Avatar alt={user.name} src={user.avatar} sx={{ width: 40, height: 40 }} />
                          </TableCell>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.role}</TableCell>
                          <TableCell>
                            <Chip
                              label={user.status}
                              style={{
                                backgroundColor: statusColor[user.status],
                                color: '#fff',
                                fontWeight: 600,
                              }}
                            />
                          </TableCell>
                          <TableCell>{user.joined && !isNaN(new Date(user.joined)) ? format(new Date(user.joined), 'dd/MM/yyyy') : 'Không xác định'}</TableCell>
                          <TableCell>
                            <IconButton onClick={() => handleOpenDetail(user)}>
                              <Info />
                            </IconButton>
                            <IconButton onClick={() => handleOpenEdit(user)}>
                              <Edit />
                            </IconButton>

                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredUsers.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
            <Dialog open={openDetail} onClose={handleCloseDetail}>
              <DialogTitle>Chi tiết người dùng</DialogTitle>
              <DialogContent>
                <Typography variant="h6">Thông tin chi tiết</Typography>
                <Typography>Tên: {selectedUser?.name}</Typography>
                <Typography>Email: {selectedUser?.email}</Typography>
                <Typography>Tên đăng nhập: {selectedUser?.username}</Typography>
                <Typography>Vai trò: {selectedUser?.role}</Typography>
                <Typography>Trạng thái: {selectedUser?.status}</Typography>
                <Typography>Ngày tham gia: {selectedUser?.joined && !isNaN(new Date(selectedUser.joined)) ? format(new Date(selectedUser.joined), 'dd/MM/yyyy') : 'Không xác định'}</Typography>
                <Typography>Hoạt động gần đây: {selectedUser?.lastActive}</Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDetail} color="primary">Đóng</Button>
              </DialogActions>
            </Dialog>
            <Dialog open={openEdit} onClose={handleCloseEdit}>
              <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
              <DialogContent>
                <TextField
                  label="Tên người dùng"
                  fullWidth
                  margin="normal"
                  value={editUser?.name}
                  onChange={(e) => handleEditChange('name', e.target.value)}
                />
                <TextField
                  label="Email"
                  fullWidth
                  margin="normal"
                  value={editUser?.email}
                  onChange={(e) => handleEditChange('email', e.target.value)}
                />
                <FormControl variant="outlined" fullWidth margin="normal">
                  <InputLabel>Vai trò</InputLabel>
                  <Select
                    value={editUser?.role}
                    onChange={(e) => handleEditChange('role', e.target.value)}
                    label="Vai trò"
                  >
                    <MenuItem value="Admin">Admin</MenuItem>
                    <MenuItem value="Giáo viên">Giáo viên</MenuItem>
                    <MenuItem value="Học sinh">Học sinh</MenuItem>
                  </Select>
                </FormControl>
                <FormControl variant="outlined" fullWidth margin="normal">
                  <InputLabel>Trạng thái</InputLabel>
                  <Select
                    value={editUser?.status}
                    onChange={(e) => handleEditChange('status', e.target.value)}
                    label="Trạng thái"
                  >
                    <MenuItem value="Hoạt động">Hoạt động</MenuItem>
                    <MenuItem value="Đã khóa">Đã khóa</MenuItem>
                  </Select>
                </FormControl>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseEdit} color="primary">Hủy</Button>
                <Button onClick={handleSaveEdit} color="primary">Lưu</Button>
              </DialogActions>
            </Dialog>

          </>
        )}
        {selectedMenu === "Quản lý khóa học" && (
          <>
            {/* Header Section */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h3" sx={{ color: '#184d47', fontWeight: 800, mb: 1 }}>
                Khóa học
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="body2" sx={{ color: '#1eb2a6', fontWeight: 600 }}>Dashboard</Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>/</Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>Khóa học</Typography>
              </Box>
            </Box>

            {/* Warning Message */}
            {usingFallbackData && (
              <Paper elevation={2} sx={{ p: 2, mb: 3, borderRadius: 12, background: '#fff3cd', border: '1px solid #ffeaa7' }}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Info style={{ color: '#856404' }} />
                  <Typography variant="body2" style={{ color: '#856404' }}>
                    Đang sử dụng dữ liệu mẫu do không thể kết nối API. Vui lòng kiểm tra kết nối mạng hoặc liên hệ quản trị viên.
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      setUsingFallbackData(false);
                      fetchCourses();
                    }}
                    style={{ color: '#856404', borderColor: '#856404' }}
                  >
                    Thử lại
                  </Button>
                </Box>
              </Paper>
            )}

            {/* Statistics Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={2.4}>
                <Paper elevation={0} sx={{ 
                  p: 3, 
                  borderRadius: 20, 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                  color: 'white',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -50,
                    right: -50,
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)',
                    zIndex: 0
                  }
                }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" position="relative" zIndex={1}>
                    <Box>
                      <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, fontSize: '2.5rem' }}>
                        {courseStatistics.totalCourses}
                      </Typography>
                      <Typography variant="body1" sx={{ opacity: 0.95, fontWeight: 500, fontSize: '0.95rem' }}>
                        Tổng khóa học
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1} mt={1}>
                        <TrendingUp style={{ fontSize: 16, opacity: 0.8 }} />
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                          +12% so với tháng trước
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ 
                      width: 70, 
                      height: 70, 
                      borderRadius: '50%', 
                      background: 'rgba(255,255,255,0.2)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.3)'
                    }}>
                      <School style={{ fontSize: 35 }} />
                    </Box>
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12} sm={6} md={2.4}>
                <Paper elevation={0} sx={{ 
                  p: 3, 
                  borderRadius: 20, 
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', 
                  color: 'white',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -30,
                    right: -30,
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)',
                    zIndex: 0
                  }
                }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" position="relative" zIndex={1}>
                    <Box>
                      <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, fontSize: '2.5rem' }}>
                        {courseStatistics.activeCourses}
                      </Typography>
                      <Typography variant="body1" sx={{ opacity: 0.95, fontWeight: 500, fontSize: '0.95rem' }}>
                        Khóa học hoạt động
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1} mt={1}>
                        <CheckCircle style={{ fontSize: 16, opacity: 0.8 }} />
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                          {courseStatistics.totalCourses > 0 ? ((courseStatistics.activeCourses / courseStatistics.totalCourses) * 100).toFixed(1) : 0}% tổng số
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ 
                      width: 70, 
                      height: 70, 
                      borderRadius: '50%', 
                      background: 'rgba(255,255,255,0.2)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.3)'
                    }}>
                      <BarChartIcon style={{ fontSize: 35 }} />
                    </Box>
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12} sm={6} md={2.4}>
                <Paper elevation={0} sx={{ 
                  p: 3, 
                  borderRadius: 20, 
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', 
                  color: 'white',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -40,
                    right: -40,
                    width: 90,
                    height: 90,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)',
                    zIndex: 0
                  }
                }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" position="relative" zIndex={1}>
                    <Box>
                      <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, fontSize: '2.5rem' }}>
                        {courseStatistics.totalStudents}
                      </Typography>
                      <Typography variant="body1" sx={{ opacity: 0.95, fontWeight: 500, fontSize: '0.95rem' }}>
                        Tổng học viên
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1} mt={1}>
                        <Group style={{ fontSize: 16, opacity: 0.8 }} />
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                          {courseStatistics.totalStudents > 0 ? Math.round(courseStatistics.totalStudents / courseStatistics.totalCourses) : 0} TB/khóa học
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ 
                      width: 70, 
                      height: 70, 
                      borderRadius: '50%', 
                      background: 'rgba(255,255,255,0.2)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.3)'
                    }}>
                      <FaUserGraduate style={{ fontSize: 35 }} />
                    </Box>
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12} sm={6} md={2.4}>
                <Paper elevation={0} sx={{ 
                  p: 3, 
                  borderRadius: 20, 
                  background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', 
                  color: 'white',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -35,
                    right: -35,
                    width: 85,
                    height: 85,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)',
                    zIndex: 0
                  }
                }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" position="relative" zIndex={1}>
                    <Box>
                      <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, fontSize: '2.5rem' }}>
                        {courseStatistics.averageRating.toFixed(1)}
                      </Typography>
                      <Typography variant="body1" sx={{ opacity: 0.95, fontWeight: 500, fontSize: '0.95rem' }}>
                        Đánh giá TB
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1} mt={1}>
                        <FaRegStar style={{ fontSize: 16, opacity: 0.8 }} />
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                          {courseStatistics.totalReviews} đánh giá
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ 
                      width: 70, 
                      height: 70, 
                      borderRadius: '50%', 
                      background: 'rgba(255,255,255,0.2)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.3)'
                    }}>
                      <FaRegStar style={{ fontSize: 35 }} />
                    </Box>
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12} sm={6} md={2.4}>
                <Paper elevation={0} sx={{ 
                  p: 3, 
                  borderRadius: 20, 
                  background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', 
                  color: 'white',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -25,
                    right: -25,
                    width: 75,
                    height: 75,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)',
                    zIndex: 0
                  }
                }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" position="relative" zIndex={1}>
                    <Box>
                      <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, fontSize: '2.5rem' }}>
                        {courseStatistics.pendingCourses}
                      </Typography>
                      <Typography variant="body1" sx={{ opacity: 0.95, fontWeight: 500, fontSize: '0.95rem' }}>
                        Chờ duyệt
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1} mt={1}>
                        <Info style={{ fontSize: 16, opacity: 0.8 }} />
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                          Cần xem xét
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ 
                      width: 70, 
                      height: 70, 
                      borderRadius: '50%', 
                      background: 'rgba(255,255,255,0.2)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.3)'
                    }}>
                      <Info style={{ fontSize: 35 }} />
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            </Grid>

            {/* Main Content */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: 16, background: '#fff', border: '1px solid #f0f0f0' }}>
              {/* Search and Filter Section */}
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Box display="flex" alignItems="center" gap={2} sx={{ flex: 1, maxWidth: 400 }}>
                  <TextField
                    variant="outlined"
                    size="small"
                    placeholder="Tìm kiếm khóa học..."
                    value={courseSearch}
                    onChange={e => setCourseSearch(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search style={{ color: '#666' }} />
                        </InputAdornment>
                      ),
                      style: { 
                        borderRadius: 12,
                        background: '#f8f9fa',
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: 'none'
                        }
                      }
                    }}
                    sx={{ 
                      width: '100%',
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          border: 'none'
                        },
                        '&:hover fieldset': {
                          border: 'none'
                        },
                        '&.Mui-focused fieldset': {
                          border: 'none'
                        }
                      }
                    }}
                  />
                </Box>

              </Box>

              {/* Filter Tabs */}
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Button
                  variant={courseStatusFilter === '' ? "contained" : "text"}
                  onClick={() => setCourseStatusFilter('')}
                  sx={{ 
                    borderRadius: 20, 
                    textTransform: 'none', 
                    fontWeight: 600,
                    background: courseStatusFilter === '' ? 'linear-gradient(135deg, #1eb2a6 0%, #184d47 100%)' : 'transparent',
                    color: courseStatusFilter === '' ? 'white' : '#666',
                    '&:hover': {
                      background: courseStatusFilter === '' ? 'linear-gradient(135deg, #184d47 0%, #1eb2a6 100%)' : '#f5f5f5'
                    }
                  }}
                >
                  Tất cả
                </Button>
                <Button
                  variant={courseStatusFilter === 'Đã duyệt' ? "contained" : "text"}
                  onClick={() => setCourseStatusFilter('Đã duyệt')}
                  sx={{ 
                    borderRadius: 20, 
                    textTransform: 'none', 
                    fontWeight: 600,
                    background: courseStatusFilter === 'Đã duyệt' ? 'linear-gradient(135deg, #1eb2a6 0%, #184d47 100%)' : 'transparent',
                    color: courseStatusFilter === 'Đã duyệt' ? 'white' : '#666',
                    '&:hover': {
                      background: courseStatusFilter === 'Đã duyệt' ? 'linear-gradient(135deg, #184d47 0%, #1eb2a6 100%)' : '#f5f5f5'
                    }
                  }}
                >
                  Hoạt động
                </Button>
                <Button
                  variant={courseStatusFilter === 'Chờ duyệt' ? "contained" : "text"}
                  onClick={() => setCourseStatusFilter('Chờ duyệt')}
                  sx={{ 
                    borderRadius: 20, 
                    textTransform: 'none', 
                    fontWeight: 600,
                    background: courseStatusFilter === 'Chờ duyệt' ? 'linear-gradient(135deg, #1eb2a6 0%, #184d47 100%)' : 'transparent',
                    color: courseStatusFilter === 'Chờ duyệt' ? 'white' : '#666',
                    '&:hover': {
                      background: courseStatusFilter === 'Chờ duyệt' ? 'linear-gradient(135deg, #184d47 0%, #1eb2a6 100%)' : '#f5f5f5'
                    }
                  }}
                >
                  Chờ duyệt
                </Button>
                <Button
                  variant={courseStatusFilter === 'Đã khóa' ? "contained" : "text"}
                  onClick={() => setCourseStatusFilter('Đã khóa')}
                  sx={{ 
                    borderRadius: 20, 
                    textTransform: 'none', 
                    fontWeight: 600,
                    background: courseStatusFilter === 'Đã khóa' ? 'linear-gradient(135deg, #1eb2a6 0%, #184d47 100%)' : 'transparent',
                    color: courseStatusFilter === 'Đã khóa' ? 'white' : '#666',
                    '&:hover': {
                      background: courseStatusFilter === 'Đã khóa' ? 'linear-gradient(135deg, #184d47 0%, #1eb2a6 100%)' : '#f5f5f5'
                    }
                  }}
                >
                  Đã khóa
                </Button>
                <Box sx={{ flex: 1 }} />
                <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
                  <Select 
                    value={courseDateFilter} 
                    onChange={e => setCourseDateFilter(e.target.value)}
                    displayEmpty
                    sx={{ 
                      borderRadius: 12,
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: '1px solid #e0e0e0'
                      }
                    }}
                  >
                    <MenuItem value="">Tất cả danh mục</MenuItem>
                    <MenuItem value="today">Hôm nay</MenuItem>
                    <MenuItem value="week">Tuần này</MenuItem>
                    <MenuItem value="month">Tháng này</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              
              {/* Course Cards Grid */}
              {loadingCourses ? (
                <Box display="flex" flexDirection="column" alignItems="center" gap={2} py={8}>
                  <div style={{ width: 40, height: 40, border: '3px solid #e0e0e0', borderTop: '3px solid #1eb2a6', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                  <Typography variant="body2" color="textSecondary">Đang tải dữ liệu khóa học...</Typography>
                </Box>
              ) : pagedCourses.length === 0 ? (
                <Box display="flex" flexDirection="column" alignItems="center" gap={2} py={8}>
                  <Typography variant="body1" color="textSecondary">
                    {filteredCourses.length === 0 ? 'Không tìm thấy khóa học nào.' : 'Không có dữ liệu khóa học.'}
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {pagedCourses.map((course) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={course.id}>
                      <Paper 
                        elevation={0} 
                        sx={{ 
                          p: 3, 
                          borderRadius: 16, 
                          border: '1px solid #f0f0f0',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                            border: '1px solid #1eb2a6'
                          }
                        }}
                      >
                        {/* Course Level Badge */}
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                          <Chip 
                            label={course.level || 'Beginner'} 
                            size="small" 
                            sx={{ 
                              background: course.level === 'Advanced' ? '#ffebee' : course.level === 'Intermediate' ? '#fff3e0' : '#e8f5e8',
                              color: course.level === 'Advanced' ? '#d32f2f' : course.level === 'Intermediate' ? '#f57c00' : '#388e3c',
                              fontWeight: 600,
                              borderRadius: 8
                            }}
                          />
                          <Box display="flex" gap={1}>
                            <MuiTooltip title="Xem chi tiết">
                              <IconButton 
                                size="small" 
                                onClick={(e) => { e.stopPropagation(); handleOpenCourseDetail(course); }}
                                sx={{ color: '#1eb2a6', p: 0.5 }}
                              >
                                <Info fontSize="small" />
                              </IconButton>
                            </MuiTooltip>

                          </Box>
                        </Box>

                        {/* Course Thumbnail */}
                        <Box sx={{ mb: 2, position: 'relative' }}>
                          {course.thumbnailUrl ? (
                            <img 
                              src={course.thumbnailUrl} 
                              alt={course.name}
                              style={{ 
                                width: '100%', 
                                height: 120, 
                                borderRadius: 12, 
                                objectFit: 'cover' 
                              }}
                            />
                          ) : (
                            <Box 
                              sx={{ 
                                width: '100%', 
                                height: 120, 
                                borderRadius: 12, 
                                background: 'linear-gradient(135deg, #e0f7fa 0%, #f0f9ff 100%)',
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center' 
                              }}
                            >
                              <School style={{ color: '#1eb2a6', fontSize: 40 }} />
                            </Box>
                          )}
                          <Chip
                            label={course.status}
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: 8,
                              right: 8,
                              backgroundColor: statusColor[course.status] || '#9e9e9e',
                              color: '#fff',
                              fontWeight: 600,
                              fontSize: '0.7rem'
                            }}
                          />
                        </Box>

                        {/* Course Category */}
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#666', 
                            mb: 1, 
                            fontWeight: 500,
                            textTransform: 'uppercase',
                            fontSize: '0.75rem',
                            letterSpacing: 0.5
                          }}
                        >
                          {course.category || 'Chưa phân loại'}
                        </Typography>

                        {/* Course Title */}
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 700, 
                            mb: 2, 
                            color: '#184d47',
                            lineHeight: 1.3,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}
                        >
                          {course.name}
                        </Typography>

                        {/* Course Metrics */}
                        <Box display="flex" alignItems="center" gap={3} mb={2}>
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <BarChartIcon style={{ fontSize: 16, color: '#666' }} />
                            <Typography variant="body2" sx={{ color: '#666', fontSize: '0.8rem' }}>
                              {course.level || 'Beginner'}
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <PlayArrow style={{ fontSize: 16, color: '#666' }} />
                            <Typography variant="body2" sx={{ color: '#666', fontSize: '0.8rem' }}>
                              {course.lectureCount || 0} Bài học
                            </Typography>
                          </Box>
                        </Box>
                        <Box display="flex" alignItems="center" gap={3} mb={2}>
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <FaClipboardList style={{ fontSize: 16, color: '#666' }} />
                            <Typography variant="body2" sx={{ color: '#666', fontSize: '0.8rem' }}>
                              {course.sectionCount || 0} Chương
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <FaUserGraduate style={{ fontSize: 16, color: '#666' }} />
                            <Typography variant="body2" sx={{ color: '#666', fontSize: '0.8rem' }}>
                              {Array.isArray(course.students) ? course.students.length : course.students || 0} Học viên
                            </Typography>
                          </Box>
                        </Box>
                        {course.averageRating && (
                          <Box display="flex" alignItems="center" gap={3} mb={3}>
                            <Box display="flex" alignItems="center" gap={0.5}>
                              <FaRegStar style={{ fontSize: 16, color: '#ffc107' }} />
                              <Typography variant="body2" sx={{ color: '#666', fontSize: '0.8rem' }}>
                                {course.averageRating.toFixed(1)} ({course.reviewCount || 0} đánh giá)
                              </Typography>
                            </Box>
                          </Box>
                        )}

                        {/* Course Actions */}
                        <Box display="flex" justifyContent="flex-end" alignItems="center">
                          <Box display="flex" gap={0.5}>
                            <MuiTooltip title={course.status === 'Đã duyệt' ? 'Khóa khóa học' : 'Duyệt khóa học'}>
                              <IconButton 
                                size="small" 
                                onClick={(e) => { e.stopPropagation(); handleToggleCourseStatus(course.id, course.status); }}
                                sx={{ color: course.status === 'Đã duyệt' ? '#f44336' : '#4caf50', p: 0.5 }}
                              >
                                {course.status === 'Đã duyệt' ? <Lock fontSize="small" /> : <LockOpen fontSize="small" />}
                              </IconButton>
                            </MuiTooltip>
                            <MuiTooltip title="Xóa khóa học">
                              <IconButton 
                                size="small" 
                                onClick={(e) => { e.stopPropagation(); handleDeleteCourse(course.id); }}
                                sx={{ color: '#f44336', p: 0.5 }}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </MuiTooltip>
                          </Box>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              )}
              
              {/* Pagination */}
              <Box display="flex" justifyContent="center" mt={4}>
                <TablePagination
                  rowsPerPageOptions={[8, 12, 16]}
                  component="div"
                  count={filteredCourses.length}
                  rowsPerPage={courseRowsPerPage}
                  page={coursePage}
                  onPageChange={handleCoursePageChange}
                  onRowsPerPageChange={handleCourseRowsPerPageChange}
                  labelRowsPerPage="Khóa học mỗi trang:"
                  labelDisplayedRows={({ from, to, count }) => `${from}-${to} của ${count}`}
                />
              </Box>
            </Paper>
          </>
        )}
        {selectedMenu === "Quản lý danh mục khóa học" && (
          <Paper elevation={3} style={{ padding: 32, maxWidth: 700, margin: '32px auto' }}>
            <Typography variant="h5" mb={2}>Quản lý danh mục khóa học</Typography>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Tìm kiếm danh mục..."
              value={searchCategory}
              onChange={e => setSearchCategory(e.target.value)}
              style={{ marginBottom: 16, minWidth: 260 }}
              InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
            />
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Icon</TableCell>
                  <TableCell>Tên danh mục</TableCell>
                  <TableCell>Số khóa học</TableCell>
                  <TableCell>Trạng thái</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories.filter(cat => cat.name.toLowerCase().includes(searchCategory.toLowerCase())).map((cat) => (
                  <TableRow key={cat.id}>
                    <TableCell>{getIconByType(cat.iconType)}</TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Typography style={{ fontWeight: 600 }}>{cat.name}</Typography>
                        <Chip label={`${cat.courseCount} KH`} size="small" style={{ marginLeft: 8, background: cat.active ? '#e0f7fa' : '#ffe0e0', color: cat.active ? '#184d47' : '#f44336', fontWeight: 600 }} />
                      </Box>
                      <Typography variant="body2" color="textSecondary">{cat.description}</Typography>
                    </TableCell>
                    <TableCell>{cat.courseCount}</TableCell>
                    <TableCell>{cat.active ? "Đang bật" : "Đang tắt"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        )}
      </Box>
    </Box>
  );
}

export default AdminDashboard;