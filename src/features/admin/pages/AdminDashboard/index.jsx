import React, { useState, useEffect } from "react";
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, AppBar, Toolbar, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, TextField, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Select, FormControl, InputLabel, Switch, FormControlLabel, TablePagination, Avatar, Grid, InputAdornment, Chip, Collapse } from "@material-ui/core";
import { People, Dashboard, Assignment, School, ExitToApp, Add, Edit, Delete, GetApp, PictureAsPdf, Search, Info, Star, BarChart, PersonAdd, RateReview, Lock, LockOpen, Refresh, Settings, ExpandLess, ExpandMore, Tune } from "@material-ui/icons";
import './style.css';
import { format } from 'date-fns';
import { Bar, Pie } from 'react-chartjs-2';
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
import MuiAlert from '@material-ui/lab/Alert';
import EmojiObjectsIcon from '@material-ui/icons/EmojiObjects';
import BookIcon from '@material-ui/icons/Book';
import LanguageIcon from '@material-ui/icons/Language';
import { BarChart as BarChartIcon } from '@material-ui/icons';
import api from "services/api";


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
    students: [
      { id: 1, name: 'Phan Văn G', email: 'g@gmail.com', status: 'approved', registeredAt: '2023-01-12' },
      { id: 2, name: 'Bùi Thị H', email: 'h@gmail.com', status: 'pending', registeredAt: '2023-01-13' },
    ]
  },
  {
    id: 2,
    name: 'Văn học hiện đại',
    code: 'LIT11B',
    teacher: 'Trần Thị B',
    createdAt: '2023-02-15',
    status: 'Đã duyệt',
    students: [
      { id: 3, name: 'Lý Văn I', email: 'i@gmail.com', status: 'approved', registeredAt: '2023-02-16' },
    ]
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
  "Tạm ngưng": "#ff9800",
  "Chờ duyệt": "#1a237e",
  "Không hoạt động": "#9e9e9e",
  "Đã duyệt": "#1eb2a6",
};

function AdminDashboard(props) {
  const [courses, setCourses] = useState(fallbackCourses);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [openCourseDetail, setOpenCourseDetail] = useState(false);
  const [openAddStudent, setOpenAddStudent] = useState(false);
  const [addStudentName, setAddStudentName] = useState('');
  const [addStudentEmail, setAddStudentEmail] = useState('');
  // Thêm state cho filter tìm kiếm khóa học
  const [courseSearch, setCourseSearch] = useState("");
  const [coursePage, setCoursePage] = useState(0);
  const [courseRowsPerPage, setCourseRowsPerPage] = useState(5);
  const [courseStatusFilter, setCourseStatusFilter] = useState("");
  const [courseDateFilter, setCourseDateFilter] = useState("");
  const [loadingCourses, setLoadingCourses] = useState(true);

  const handleOpenCourseDetail = (course) => {
    setSelectedCourse(course);
    setOpenCourseDetail(true);
  };
  const handleCloseCourseDetail = () => setOpenCourseDetail(false);

  const handleApproveStudent = (studentId) => {
    setCourses(prev => prev.map(c =>
      c.id === selectedCourse.id ? {
        ...c,
        students: c.students.map(s => s.id === studentId ? { ...s, status: 'approved' } : s)
      } : c
    ));
    setSelectedCourse(prev => ({
      ...prev,
      students: prev.students.map(s => s.id === studentId ? { ...s, status: 'approved' } : s)
    }));
  };
  const handleRejectStudent = (studentId) => {
    setCourses(prev => prev.map(c =>
      c.id === selectedCourse.id ? {
        ...c,
        students: c.students.map(s => s.id === studentId ? { ...s, status: 'rejected' } : s)
      } : c
    ));
    setSelectedCourse(prev => ({
      ...prev,
      students: prev.students.map(s => s.id === studentId ? { ...s, status: 'rejected' } : s)
    }));
  };
  const handleRemoveStudent = (studentId) => {
    setCourses(prev => prev.map(c =>
      c.id === selectedCourse.id ? {
        ...c,
        students: c.students.filter(s => s.id !== studentId)
      } : c
    ));
    setSelectedCourse(prev => ({
      ...prev,
      students: prev.students.filter(s => s.id !== studentId)
    }));
  };
  const handleOpenAddStudent = () => setOpenAddStudent(true);
  const handleCloseAddStudent = () => setOpenAddStudent(false);
  const handleConfirmAddStudent = () => {
    if (!addStudentName || !addStudentEmail) return;
    const newStudent = {
      id: Date.now(),
      name: addStudentName,
      email: addStudentEmail,
      status: 'approved',
      registeredAt: new Date().toISOString().slice(0, 10)
    };
    setCourses(prev => prev.map(c =>
      c.id === selectedCourse.id ? {
        ...c,
        students: [...c.students, newStudent]
      } : c
    ));
    setSelectedCourse(prev => ({
      ...prev,
      students: [...prev.students, newStudent]
    }));
    setAddStudentName('');
    setAddStudentEmail('');
    setOpenAddStudent(false);
  };

  const handleApproveCourse = (courseId) => {
    setCourses(prev => prev.map(c =>
      c.id === courseId ? { ...c, status: 'Đã duyệt' } : c
    ));
    if (selectedCourse && selectedCourse.id === courseId) {
      setSelectedCourse(prev => ({ ...prev, status: 'Đã duyệt' }));
    }
  };
  const handleLockCourse = (courseId) => {
    setCourses(prev => prev.map(c =>
      c.id === courseId ? { ...c, status: 'Đã khóa' } : c
    ));
    if (selectedCourse && selectedCourse.id === courseId) {
      setSelectedCourse(prev => ({ ...prev, status: 'Đã khóa' }));
    }
  };
  const handleUnlockCourse = (courseId) => {
    setCourses(prev => prev.map(c =>
      c.id === courseId ? { ...c, status: 'Đã duyệt' } : c
    ));
    if (selectedCourse && selectedCourse.id === courseId) {
      setSelectedCourse(prev => ({ ...prev, status: 'Đã duyệt' }));
    }
  };

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
  const [openPendingUsersDialog, setOpenPendingUsersDialog] = useState(false);
  const [pendingUsers, setPendingUsers] = useState(
    mockUsers.filter(u => u.status === 'Chờ duyệt')
      .map(u => ({ ...u, selectedRole: u.role || 'Học sinh' }))
  );
  const [openSetting, setOpenSetting] = useState(false);

  useEffect(() => {
    const roleMapById = {
      1: "Học sinh",        // User
      2: "Quản trị viên",   // Admin
      3: "Giáo viên"        // Teacher
    };
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await api.get("/api/users");
        const data = Array.isArray(res) ? res : res.data;
        setUsers(
          data.map(u => ({
            id: u.userId,
            name: `${u.firstName || ''} ${u.lastName || ''}`.trim(),
            email: u.email,
            username: u.username,
            role: roleMapById[u.roleId] || u.roleName,
            status: u.isActive ? "Hoạt động" : "Đã khóa",
            joined: u.createdAt,
            lastActive: u.updatedAt,
            avatar: u.avatarUrl,
          }))
        );
      } catch (err) {
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Mapping từ CourseDto (BE) sang format FE
  const mapCourseDtoToFE = (dto) => ({
    id: dto.courseId,
    name: dto.title,
    code: '', // BE chưa trả về, có thể bỏ qua hoặc bổ sung ở BE
    teacher: dto.teacherName,
    createdAt: dto.createdAt,
    status: '', // BE chưa trả về, có thể để mặc định hoặc bổ sung ở BE
    students: [], // BE chưa trả về, có thể để rỗng hoặc bổ sung ở BE
    description: dto.description,
    category: dto.categoryName,
    level: dto.level,
  });

  useEffect(() => {
    const fetchCourses = async () => {
      setLoadingCourses(true);
      try {
        const res = await api.get("/api/courses");
        if (Array.isArray(res)) {
          setCourses(res.map(mapCourseDtoToFE));
        } else {
          setCourses(fallbackCourses);
        }
      } catch (err) {
        setCourses(fallbackCourses);
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchCourses();
  }, []);

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

  const handleSaveEdit = () => {
    setUsers(prev => prev.map(u => u.id === editUser.id ? { ...editUser } : u));
    setOpenEdit(false);
  };

  const handleOpenPendingUsersDialog = () => setOpenPendingUsersDialog(true);
  const handleClosePendingUsersDialog = () => setOpenPendingUsersDialog(false);

  const handleChangeRole = (userId, value) => {
    setPendingUsers(prev => prev.map(u => u.id === userId ? { ...u, selectedRole: value } : u));
  };

  const handleApproveUser = (userId, role) => {
    // Cập nhật user sang trạng thái Hoạt động và role mới
    setUsers(prev => prev.map(u =>
      u.id === userId ? { ...u, status: 'Hoạt động', role } : u
    ));
    setPendingUsers(prev => prev.filter(u => u.id !== userId));
  };

  // Thống kê số liệu dashboard
  const totalUsers = users.length;
  const totalCourses = courses.length;
  const totalCourseRegistrations = courses.reduce((sum, c) => sum + c.students.length, 0);
  // Giả lập số đánh giá (nếu có trường reviews)
  const totalCourseReviews = courses.reduce((sum, c) => sum + (c.reviews ? c.reviews.length : 0), 0);
  // Số user mới trong tháng này
  const now = new Date();
  const usersThisMonth = users.filter(u => {
    const joined = new Date(u.joined);
    return joined.getMonth() === now.getMonth() && joined.getFullYear() === now.getFullYear();
  }).length;
  // Số khóa học mới trong tháng này
  const coursesThisMonth = courses.filter(c => {
    const created = new Date(c.createdAt);
    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
  }).length;
  // Số khóa học chờ duyệt
  const coursesPending = courses.filter(c => c.status === 'Chờ duyệt').length;

  // Dữ liệu biểu đồ mock: số user và số khóa học theo tháng (12 tháng)
  const months = [
    'Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'
  ];
  // Tạo dữ liệu fake cho chart
  const usersByMonth = Array.from({ length: 12 }, () => Math.floor(Math.random() * 50));
  const coursesByMonth = Array.from({ length: 12 }, () => Math.floor(Math.random() * 20));
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
    'Tạm ngưng': users.filter(u => u.status === 'Tạm ngưng').length,
    'Chờ duyệt': users.filter(u => u.status === 'Chờ duyệt').length,
    'Không hoạt động': users.filter(u => u.status === 'Không hoạt động').length,
  };
  const pieStatusData = {
    labels: Object.keys(userStatusCounts),
    datasets: [{
      data: Object.values(userStatusCounts),
      backgroundColor: ['#4caf50', '#f44336', '#ff9800', '#1a237e', '#9e9e9e'],
      borderWidth: 2,
    }]
  };

  // Bar chart top 5 khóa học đông học viên nhất
  const topCourses = [...courses]
    .sort((a, b) => b.students.length - a.students.length)
    .slice(0, 5);
  const barTopCoursesData = {
    labels: topCourses.map(c => c.name),
    datasets: [{
      label: 'Số học viên',
      data: topCourses.map(c => c.students.length),
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
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
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
            <ListItem button onClick={() => setOpenSetting(!openSetting)}>
              <ListItemIcon><Settings /></ListItemIcon>
              <ListItemText primary="Cài đặt hệ thống" />
              {openSetting ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={openSetting} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem
                  button
                  style={{ paddingLeft: 40 }}
                  selected={selectedMenu === "Quản lý danh mục khóa học"}
                  onClick={() => setSelectedMenu("Quản lý danh mục khóa học")}
                >
                  <ListItemIcon><CategoryIcon /></ListItemIcon>
                  <ListItemText primary="Quản lý danh mục khóa học" />
                </ListItem>
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
              onClick={() => setSelectedMenu(menuItems[3].text)}
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
            <Typography variant="h4" sx={{ color: '#184d47', fontWeight: 700, mb: 3, textAlign: 'center' }}>Thống kê tổng quan</Typography>
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
                    <div style={{ ...statNumberStyle, fontSize: 40 }}><CountUp end={usersThisMonth} duration={1.2} /></div>
                    <div style={{ ...statLabelStyle, fontSize: 18 }}>User mới tháng này</div>
                  </div>
                </motion.div>
              </Grid>
              <Grid item xs={12} sm={6} md={4} style={{ marginBottom: 32 }}>
                <motion.div whileHover={{ scale: 1.07, boxShadow: '0 12px 32px rgba(24,77,71,0.18)' }} style={{ ...statCardStyle, minWidth: 260, minHeight: 120, padding: 32 }}>
                  <span style={{ ...statIconStyle, background: 'linear-gradient(135deg, #184d47 60%, #1eb2a6 100%)', width: 60, height: 60, fontSize: 38 }}><FaBookOpen /></span>
                  <div>
                    <div style={{ ...statNumberStyle, fontSize: 40 }}><CountUp end={coursesThisMonth} duration={1.2} /></div>
                    <div style={{ ...statLabelStyle, fontSize: 18 }}>Khóa học mới tháng này</div>
                  </div>
                </motion.div>
              </Grid>
              <Grid item xs={12} sm={6} md={4} style={{ marginBottom: 32 }}>
                <motion.div whileHover={{ scale: 1.07, boxShadow: '0 12px 32px rgba(255,112,67,0.18)' }} style={{ ...statCardStyle, background: 'linear-gradient(135deg, #fff3e0 0%, #fff 100%)', minWidth: 260, minHeight: 120, padding: 32 }}>
                  <span style={{ ...statIconStyle, background: 'linear-gradient(135deg, #ff7043 60%, #ffb300 100%)', width: 60, height: 60, fontSize: 38 }}><FaClipboardList /></span>
                  <div>
                    <div style={{ ...statNumberStyle, fontSize: 40 }}><CountUp end={coursesPending} duration={1.2} /></div>
                    <div style={{ ...statLabelStyle, fontSize: 18 }}>Khóa học chờ duyệt</div>
                  </div>
                </motion.div>
              </Grid>
            </Grid>
            <Paper elevation={4} sx={{ p: 3, borderRadius: 4, mt: 4, background: '#fff', boxShadow: '0 4px 24px rgba(30,178,166,0.08)' }}>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <span style={{...statIconStyle, background: 'linear-gradient(135deg, #1eb2a6 60%, #184d47 100%)', width: 40, height: 40, fontSize: 24}}><BarChartIcon style={{ fontSize: 24 }} /></span>
                <Typography variant="h6" style={{ fontWeight: 700, color: '#184d47' }}>Thống kê user & khóa học theo tháng ({now.getFullYear()})</Typography>
              </Box>
              <div style={{ width: '100%', height: 320 }}>
                <Bar data={barData} options={barOptions} />
              </div>
            </Paper>
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
            <Typography variant="h4" sx={{ color: '#184d47', fontWeight: 700, mb: 3, textAlign: 'center' }}>Quản lý người dùng</Typography>
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
                    <MenuItem value="Không hoạt động">Không hoạt động</MenuItem>
                    <MenuItem value="Đã khóa">Đã khóa</MenuItem>
                    <MenuItem value="Chờ duyệt">Chờ duyệt</MenuItem>
                    <MenuItem value="Tạm ngưng">Tạm ngưng</MenuItem>
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
                            {user.status === 'Chờ duyệt' && (
                              <>
                                <IconButton onClick={() => handleApproveUser(user.id, 'Học sinh')}>
                                  <PersonAdd />
                                </IconButton>
                                <IconButton onClick={() => handleApproveUser(user.id, 'Giáo viên')}>
                                  <RateReview />
                                </IconButton>
                              </>
                            )}
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
                    <MenuItem value="Không hoạt động">Không hoạt động</MenuItem>
                    <MenuItem value="Đã khóa">Đã khóa</MenuItem>
                    <MenuItem value="Chờ duyệt">Chờ duyệt</MenuItem>
                    <MenuItem value="Tạm ngưng">Tạm ngưng</MenuItem>
                  </Select>
                </FormControl>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseEdit} color="primary">Hủy</Button>
                <Button onClick={handleSaveEdit} color="primary">Lưu</Button>
              </DialogActions>
            </Dialog>
            <Dialog open={openPendingUsersDialog} onClose={handleClosePendingUsersDialog}>
              <DialogTitle>Duyệt người dùng chờ</DialogTitle>
              <DialogContent>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Tên người dùng</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Vai trò</TableCell>
                      <TableCell>Trạng thái</TableCell>
                      <TableCell>Hoạt động</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pendingUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <FormControl variant="outlined" size="small">
                            <InputLabel>Vai trò</InputLabel>
                            <Select
                              value={user.selectedRole}
                              onChange={(e) => handleChangeRole(user.id, e.target.value)}
                              label="Vai trò"
                            >
                              <MenuItem value="Học sinh">Học sinh</MenuItem>
                              <MenuItem value="Giáo viên">Giáo viên</MenuItem>
                            </Select>
                          </FormControl>
                        </TableCell>
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
                        <TableCell>
                          <Button
                            variant="contained"
                            color="success"
                            onClick={() => handleApproveUser(user.id, user.selectedRole)}
                            startIcon={<PersonAdd />}
                          >
                            Duyệt
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClosePendingUsersDialog} color="primary">Đóng</Button>
              </DialogActions>
            </Dialog>
          </>
        )}
        {selectedMenu === "Quản lý khóa học" && (
          <>
            <Typography variant="h4" sx={{ color: '#184d47', fontWeight: 700, mb: 3, textAlign: 'center' }}>Quản lý khóa học</Typography>
            <Paper elevation={4} sx={{ p: 3, borderRadius: 4, background: '#fff', boxShadow: '0 4px 24px rgba(30,178,166,0.08)' }}>
              <Box display="flex" alignItems="center" gap={3} mb={2}>
                <TextField
                  variant="outlined"
                  size="small"
                  placeholder="Tìm kiếm khóa học"
                  value={courseSearch}
                  onChange={e => setCourseSearch(e.target.value)}
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
                  <InputLabel>Trạng thái</InputLabel>
                  <Select value={courseStatusFilter} onChange={e => setCourseStatusFilter(e.target.value)} label="Trạng thái">
                    <MenuItem value="">Tất cả</MenuItem>
                    <MenuItem value="Chờ duyệt">Chờ duyệt</MenuItem>
                    <MenuItem value="Đã duyệt">Đã duyệt</MenuItem>
                    <MenuItem value="Đã khóa">Đã khóa</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  variant="outlined"
                  size="small"
                  type="date"
                  label="Ngày tạo"
                  InputLabelProps={{ shrink: true }}
                  value={courseDateFilter}
                  onChange={e => setCourseDateFilter(e.target.value)}
                  style={{ minWidth: 160 }}
                />
                <IconButton onClick={() => { setCourseSearch(''); setCourseStatusFilter(''); setCourseDateFilter(''); }}>
                  <Refresh />
                </IconButton>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Tên khóa học</TableCell>
                      <TableCell>Mã khóa học</TableCell>
                      <TableCell>Giáo viên</TableCell>
                      <TableCell>Trạng thái</TableCell>
                      <TableCell>Số học viên</TableCell>
                      <TableCell>Hoạt động</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loadingCourses ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          Đang tải dữ liệu khóa học...
                        </TableCell>
                      </TableRow>
                    ) : courses.filter(c => (c.name || '').toLowerCase().includes(courseSearch.toLowerCase())).map((course) => (
                      <TableRow key={course.id}>
                        <TableCell>{course.name}</TableCell>
                        <TableCell>{course.code || '-'}</TableCell>
                        <TableCell>{course.teacher}</TableCell>
                        <TableCell>{course.status || '-'}</TableCell>
                        <TableCell>{course.students ? course.students.length : 0}</TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleOpenCourseDetail(course)}>
                            <Info />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={courses.length} // This count should be based on filtered courses
                rowsPerPage={courseRowsPerPage}
                page={coursePage}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
            <Dialog open={openCourseDetail} onClose={handleCloseCourseDetail}>
              <DialogTitle>Chi tiết khóa học</DialogTitle>
              <DialogContent>
                <Typography variant="h6">Thông tin khóa học</Typography>
                <Typography>Tên khóa học: {selectedCourse?.name}</Typography>
                <Typography>Mã khóa học: {selectedCourse?.code || '-'}</Typography>
                <Typography>Giáo viên: {selectedCourse?.teacher}</Typography>
                <Typography>Trạng thái: {selectedCourse?.status || '-'}</Typography>
                <Typography>Số học viên: {selectedCourse?.students ? selectedCourse.students.length : 0}</Typography>
                <Typography>
                  Ngày tạo: {selectedCourse?.createdAt && !isNaN(new Date(selectedCourse.createdAt))
                    ? format(new Date(selectedCourse.createdAt), 'dd/MM/yyyy')
                    : 'Không xác định'}
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseCourseDetail} color="primary">Đóng</Button>
              </DialogActions>
            </Dialog>
            <Dialog open={openAddStudent} onClose={handleCloseAddStudent}>
              <DialogTitle>Thêm học sinh vào khóa học</DialogTitle>
              <DialogContent>
                <TextField
                  label="Tên học sinh"
                  fullWidth
                  margin="normal"
                  value={addStudentName}
                  onChange={(e) => setAddStudentName(e.target.value)}
                />
                <TextField
                  label="Email học sinh"
                  fullWidth
                  margin="normal"
                  value={addStudentEmail}
                  onChange={(e) => setAddStudentEmail(e.target.value)}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseAddStudent} color="primary">Hủy</Button>
                <Button onClick={handleConfirmAddStudent} color="primary">Thêm</Button>
              </DialogActions>
            </Dialog>
          </>
        )}
        {selectedMenu === "Quản lý danh mục khóa học" && (
          <Paper elevation={3} style={{ padding: 32, maxWidth: 700 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h5">Quản lý danh mục khóa học</Typography>
              <Button variant="contained" color="primary" onClick={handleOpenAddCategory}>Thêm danh mục</Button>
            </Box>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Tìm kiếm danh mục..."
              value={searchCategory}
              onChange={e => setSearchCategory(e.target.value)}
              style={{ marginBottom: 16, minWidth: 260 }}
              InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
            />
            <DragDropContext onDragEnd={result => {
              if (!result.destination) return;
              const reordered = Array.from(categories);
              const [removed] = reordered.splice(result.source.index, 1);
              reordered.splice(result.destination.index, 0, removed);
              setCategories(reordered);
              setToast({ open: true, message: 'Đã thay đổi thứ tự danh mục!', severity: 'info' });
            }}>
              <Droppable droppableId="category-list">
                {(provided) => (
                  <Table ref={provided.innerRef} {...provided.droppableProps} size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ width: 40 }}></TableCell>
                        <TableCell>Icon</TableCell>
                        <TableCell>Tên danh mục</TableCell>
                        <TableCell>Số khóa học</TableCell>
                        <TableCell>Trạng thái</TableCell>
                        <TableCell>Thao tác</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {categories.filter(cat => cat.name.toLowerCase().includes(searchCategory.toLowerCase())).map((cat, idx) => (
                        <Draggable key={cat.id} draggableId={cat.id.toString()} index={idx}>
                          {(provided, snapshot) => (
                            <TableRow
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              style={{ background: snapshot.isDragging ? '#f0f7fa' : 'inherit', ...provided.draggableProps.style }}
                            >
                              <TableCell {...provided.dragHandleProps} style={{ cursor: 'grab', width: 40 }}>::</TableCell>
                              <TableCell>{getIconByType(cat.iconType)}</TableCell>
                              <TableCell>
                                <Box display="flex" alignItems="center">
                                  <Typography style={{ fontWeight: 600 }}>{cat.name}</Typography>
                                  <Chip label={`${cat.courseCount} KH`} size="small" style={{ marginLeft: 8, background: cat.active ? '#e0f7fa' : '#ffe0e0', color: cat.active ? '#184d47' : '#f44336', fontWeight: 600 }} />
                                </Box>
                                <Typography variant="body2" color="textSecondary">{cat.description}</Typography>
                              </TableCell>
                              <TableCell>{cat.courseCount}</TableCell>
                              <TableCell>
                                <Switch checked={cat.active} onChange={() => handleToggleCategory(cat.id)} color="primary" />
                              </TableCell>
                              <TableCell>
                                <IconButton onClick={() => handleEditCategory(cat)}><Edit fontSize="small" /></IconButton>
                                <IconButton onClick={() => handleDeleteCategory(cat.id)}><Delete fontSize="small" /></IconButton>
                              </TableCell>
                            </TableRow>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </TableBody>
                  </Table>
                )}
              </Droppable>
            </DragDropContext>
            <Dialog open={openAddCategory} onClose={handleCloseAddCategory}>
              <DialogTitle>{editCategory ? 'Sửa danh mục' : 'Thêm danh mục'}</DialogTitle>
              <DialogContent>
                <TextField
                  label="Tên danh mục"
                  fullWidth
                  margin="normal"
                  value={newCategory.name}
                  onChange={e => setNewCategory({ ...newCategory, name: e.target.value })}
                />
                <TextField
                  label="Mô tả"
                  fullWidth
                  margin="normal"
                  value={newCategory.description}
                  onChange={e => setNewCategory({ ...newCategory, description: e.target.value })}
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel>Chọn icon</InputLabel>
                  <Select
                    value={newCategory.iconType}
                    onChange={e => setNewCategory({ ...newCategory, iconType: e.target.value })}
                    label="Chọn icon"
                  >
                    {iconOptions.map(opt => (
                      <MenuItem value={opt.value} key={opt.value}>
                        <Box display="flex" alignItems="center">{opt.icon}<span style={{ marginLeft: 8 }}>{opt.label}</span></Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseAddCategory}>Hủy</Button>
                <Button onClick={editCategory ? handleSaveEditCategory : handleSaveAddCategory} color="primary">Lưu</Button>
              </DialogActions>
            </Dialog>
            <Dialog open={openDeleteConfirm} onClose={() => setOpenDeleteConfirm(false)}>
              <DialogTitle>Xác nhận xóa</DialogTitle>
              <DialogContent>Bạn có chắc chắn muốn xóa danh mục này không?</DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenDeleteConfirm(false)}>Hủy</Button>
                <Button onClick={handleConfirmDelete} color="secondary">Xóa</Button>
              </DialogActions>
            </Dialog>
            <Snackbar open={toast.open} autoHideDuration={2000} onClose={() => setToast({ ...toast, open: false })}>
              <MuiAlert elevation={6} variant="filled" onClose={() => setToast({ ...toast, open: false })} severity={toast.severity}>{toast.message}</MuiAlert>
            </Snackbar>
          </Paper>
        )}
        {selectedMenu === "Cấu hình thông báo" && (
          <Paper elevation={3} style={{ padding: 32, maxWidth: 600 }}>
            <Typography variant="h5" gutterBottom>Cấu hình thông báo</Typography>
            <FormControlLabel
              control={<Switch checked={notifyEmail} onChange={e => setNotifyEmail(e.target.checked)} />}
              label="Gửi email thông báo"
            />
            <FormControlLabel
              control={<Switch checked={notifyInApp} onChange={e => setNotifyInApp(e.target.checked)} />}
              label="Thông báo trong hệ thống"
            />
            <TextField
              label="Mẫu thông báo duyệt user"
              fullWidth
              margin="normal"
              multiline
              rows={3}
              value={templateUserApprove}
              onChange={e => setTemplateUserApprove(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={handleSaveNotificationConfig}>Lưu thay đổi</Button>
          </Paper>
        )}
        {selectedMenu === "Cài đặt chung" && (
          <Paper elevation={3} style={{ padding: 32, maxWidth: 600 }}>
            <Typography variant="h5" gutterBottom>Cài đặt chung</Typography>
            <TextField
              label="Tên hệ thống"
              fullWidth
              margin="normal"
              value={systemName}
              onChange={e => setSystemName(e.target.value)}
            />
            <Box display="flex" alignItems="center" mb={2}>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="upload-logo"
                type="file"
                onChange={handleLogoChange}
              />
              <label htmlFor="upload-logo">
                <Button variant="outlined" color="primary" component="span">Upload Logo</Button>
              </label>
              {logo && <img src={logo} alt="logo" style={{ height: 40, marginLeft: 16, borderRadius: 8, boxShadow: '0 2px 8px #ccc' }} />}
            </Box>
            <TextField
              label="Màu chủ đạo"
              type="color"
              margin="normal"
              value={mainColor}
              onChange={e => setMainColor(e.target.value)}
              style={{ width: 120 }}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Ngôn ngữ mặc định</InputLabel>
              <Select value={defaultLang} onChange={e => setDefaultLang(e.target.value)}>
                <MenuItem value="vi">Tiếng Việt</MenuItem>
                <MenuItem value="en">English</MenuItem>
              </Select>
            </FormControl>
            <Button variant="contained" color="primary" onClick={handleSaveGeneralConfig}>Lưu thay đổi</Button>
          </Paper>
        )}
        {selectedMenu === "Đăng xuất" && (
          <Box mt={8} textAlign="center">
            <Typography variant="h4" style={{ color: '#184d47', fontWeight: 700 }}>Bạn đã chọn Đăng xuất</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AdminDashboard; 