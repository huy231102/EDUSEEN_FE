import React, { useState, useEffect } from 'react';
import {
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Box,
  Divider,
  CircularProgress,
  Fab,
  Tooltip,
  TextField,
  Snackbar,
  Menu,
  MenuItem
} from '@material-ui/core';

import {
  PlayArrow,
  Schedule,
  AccessTime,
  Person,
  Event,
  CalendarToday,
  Timer,
  Add,
  Edit,
  Delete,
  VideoCall,
  Notifications,
  MoreVert
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import './style.css';
// Đã xóa hoàn toàn dòng import { DatePicker, TimePicker } from '@material-ui/pickers';
import { useAuth } from 'features/auth/contexts/AuthContext';
import api from 'services/api';
import { useToast } from 'components/common/Toast';
import { courses } from 'features/courses/data/courseData';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    backgroundColor: 'transparent',
    minHeight: '100vh',
  },
  header: {
    marginBottom: theme.spacing(2),
    textAlign: 'center',
  },
  statsGrid: {
    marginBottom: theme.spacing(2),
  },
  statCard: {
    textAlign: 'center',
    padding: theme.spacing(1.5),
    backgroundColor: '#fff',
    borderRadius: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    border: '1px solid rgba(0,0,0,0.05)',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-3px)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
    },
  },
  statIcon: {
    fontSize: '1.8rem',
    color: '#1eb2a6',
    marginBottom: theme.spacing(0.5),
  },
  tableContainer: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    border: '1px solid rgba(0,0,0,0.05)',
  },
  tableHeader: {
    backgroundColor: '#1eb2a6',
    '& .MuiTableCell-head': {
      color: 'white',
      fontWeight: 'bold',
    },
  },
  upcomingChip: {
    backgroundColor: '#4caf50',
    color: 'white',
    fontWeight: 'bold',
  },
  todayChip: {
    backgroundColor: '#ff9800',
    color: 'white',
    fontWeight: 'bold',
  },
  tomorrowChip: {
    backgroundColor: '#2196f3',
    color: 'white',
    fontWeight: 'bold',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '400px',
  },
  emptyStateContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    padding: theme.spacing(4),
  },
  emptyStateIcon: {
    fontSize: '4rem',
    color: '#ccc',
    marginBottom: theme.spacing(2),
  },
  fab: {
    position: 'fixed',
    bottom: theme.spacing(3),
    right: theme.spacing(3),
    backgroundColor: '#1eb2a6',
    color: 'white',
    '&:hover': {
      backgroundColor: '#15968d',
    },
  },
}));

// Mock data cho lịch sắp tới
const mockUpcomingSessions = [
  {
    id: 1,
    date: '2025-07-25',
    startTime: '14:00',
    endTime: '15:30',
    duration: '1 giờ 30 phút',
    participants: [
      { name: 'Nguyễn Văn Toán', role: 'Giáo viên Toán' },
      { name: 'Học sinh A', role: 'Học sinh' }
    ],
    subject: 'Toán học',
    status: 'scheduled',
    notes: 'Ôn tập chương Đại số',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    reminder: '15 phút trước'
  },
  {
    id: 2,
    date: '2025-07-26',
    startTime: '09:00',
    endTime: '10:15',
    duration: '1 giờ 15 phút',
    participants: [
      { name: 'Trần Thị Vật Lý', role: 'Giáo viên Vật lý' },
      { name: 'Học sinh A', role: 'Học sinh' }
    ],
    subject: 'Vật lý',
    status: 'scheduled',
    notes: 'Thực hành thí nghiệm ảo',
    meetingLink: 'https://meet.google.com/xyz-uvw-rst',
    reminder: '30 phút trước'
  },
  {
    id: 3,
    date: '2025-07-27',
    startTime: '16:00',
    endTime: '16:45',
    duration: '45 phút',
    participants: [
      { name: 'Lê Văn Tư Vấn', role: 'Cố vấn học tập' },
      { name: 'Học sinh A', role: 'Học sinh' }
    ],
    subject: 'Tư vấn',
    status: 'scheduled',
    notes: 'Thảo luận về kế hoạch học tập',
    meetingLink: 'https://meet.google.com/mno-pqr-stu',
    reminder: '1 giờ trước'
  },
  {
    id: 4,
    date: '2025-07-28',
    startTime: '13:00',
    endTime: '14:00',
    duration: '1 giờ',
    participants: [
      { name: 'Phạm Thị Anh', role: 'Giáo viên Tiếng Anh' },
      { name: 'Học sinh A', role: 'Học sinh' }
    ],
    subject: 'Tiếng Anh',
    status: 'scheduled',
    notes: 'Luyện tập phát âm và giao tiếp',
    meetingLink: 'https://meet.google.com/vwx-yz1-234',
    reminder: '15 phút trước'
  },
  {
    id: 5,
    date: '2025-07-29',
    startTime: '10:00',
    endTime: '11:30',
    duration: '1 giờ 30 phút',
    participants: [
      { name: 'Hoàng Văn Hóa', role: 'Giáo viên Hóa học' },
      { name: 'Học sinh A', role: 'Học sinh' }
    ],
    subject: 'Hóa học',
    status: 'scheduled',
    notes: 'Giải bài tập về phản ứng hóa học',
    meetingLink: 'https://meet.google.com/567-890-abc',
    reminder: '30 phút trước'
  }
];

const PersonalCalendar = ({ onSwitchToVideoCall }) => {
  const classes = useStyles();
  const { user } = useAuth();
  const [upcomingSessions, setUpcomingSessions] = useState([]); // bỏ mockUpcomingSessions
  const [selectedSession, setSelectedSession] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [newSession, setNewSession] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    duration: '',
    caller: '',
    callerEmail: '',
    calleeEmail: '',
    courseId: '', // thay subject thành courseId
    meetingLink: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'error'
  });
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedSessionForMenu, setSelectedSessionForMenu] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const { showToast } = useToast();
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
  const [cancelingSession, setCancelingSession] = useState(null);

  // Đưa fetchMySchedules ra ngoài useEffect để có thể gọi lại sau khi đặt lịch
  const fetchMySchedules = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/schedule/mySchedules');
      // Map dữ liệu BE trả về sang format FE cần (dùng key thường)
      const mapped = res.map(item => {
        const startDate = new Date(item.scheduledTime);
        const timeStart = startDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false });
        const endDate = new Date(startDate.getTime() + item.duration * 60000);
        const timeEnd = endDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false });
        return {
          id: item.scheduleId,
          date: startDate.toISOString().slice(0, 10),
          startTime: timeStart,
          endTime: timeEnd,
          duration: `${Math.floor(item.duration/60) > 0 ? Math.floor(item.duration/60) + ' giờ ' : ''}${item.duration%60 > 0 ? item.duration%60 + ' phút' : ''}`.trim(),
          subject: item.courseTitle || 'Tư vấn',
          status: item.status,
          partnerName: item.partnerName,
          role: item.role,
        };
      });
      setUpcomingSessions(mapped);
    } catch (err) {
      showToast('Lỗi tải lịch cá nhân!', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMySchedules();
  }, []);

  const handleSessionClick = (session) => {
    setSelectedSession(session);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedSession(null);
  };

  const handleOpenCreateDialog = () => {
    let defaultName = '';
    if (user) {
      if (user.name) defaultName = user.name;
      else if (user.username) defaultName = user.username;
      else if (user.email) defaultName = user.email.split('@')[0];
    }
    setNewSession((prev) => ({
      ...prev,
      caller: defaultName,
      callerEmail: user?.email || '',
    }));
    setOpenCreateDialog(true);
  };
  const handleCloseCreateDialog = () => setOpenCreateDialog(false);

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleJoinVideoCall = () => {
    if (onSwitchToVideoCall) {
      onSwitchToVideoCall();
    }
    handleCloseDialog();
  };

  const handleMenuOpen = (event, session) => {
    setMenuAnchor(event.currentTarget);
    setSelectedSessionForMenu(session);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedSessionForMenu(null);
  };

  const handleViewDetails = () => {
    if (selectedSessionForMenu) {
      setSelectedSession(selectedSessionForMenu);
      setOpenDialog(true);
    }
    handleMenuClose();
  };

  const handleEditSession = () => {
    if (selectedSessionForMenu) {
      setEditingSession({ ...selectedSessionForMenu });
      setOpenEditDialog(true);
    }
    handleMenuClose();
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditingSession(null);
  };

  const handleEditSessionChange = (field, value) => {
    setEditingSession(prev => {
      const updated = { ...prev, [field]: value };
      
      // Tự động tính toán thời lượng khi thay đổi startTime hoặc endTime
      if (field === 'startTime' || field === 'endTime') {
        const duration = calculateDuration(updated.startTime, updated.endTime);
        updated.duration = duration;
      }
      
      return updated;
    });
  };

  // Function validation cho chỉnh sửa lịch
  const validateEditSession = () => {
    const errors = [];

    // 1. Kiểm tra thông tin bắt buộc
    if (!editingSession.date) {
      errors.push('Vui lòng chọn ngày');
    }
    
    if (!editingSession.startTime) {
      errors.push('Vui lòng chọn thời gian bắt đầu');
    }
    
    if (!editingSession.endTime) {
      errors.push('Vui lòng chọn thời gian kết thúc');
    }
    
    if (!editingSession.courseTitle?.trim()) {
      errors.push('Vui lòng chọn khóa học');
    }

    // 2. Kiểm tra ngày không được trong quá khứ
    if (editingSession.date) {
      const selectedDate = new Date(editingSession.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        errors.push('Không thể đặt lịch cho ngày trong quá khứ');
      }
    }

    // 3. Kiểm tra thời gian hợp lệ
    if (editingSession.startTime && editingSession.endTime) {
      const start = new Date(`2000-01-01T${editingSession.startTime}`);
      const end = new Date(`2000-01-01T${editingSession.endTime}`);
      
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        errors.push('Thời gian không hợp lệ');
      } else if (start >= end) {
        errors.push('Thời gian kết thúc phải sau thời gian bắt đầu');
      } else {
        const diffMs = end - start;
        const durationMinutes = Math.floor(diffMs / (1000 * 60));
        
        if (durationMinutes < 15) {
          errors.push('Thời lượng cuộc gọi phải ít nhất 15 phút');
        }
        
        if (durationMinutes > 480) { // 8 giờ
          errors.push('Thời lượng cuộc gọi không được quá 8 giờ');
        }
      }
    }

    // 4. Kiểm tra trùng lặp lịch (loại trừ session hiện tại)
    if (editingSession.date && editingSession.startTime && editingSession.endTime) {
      const newStart = new Date(`${editingSession.date}T${editingSession.startTime}`);
      const newEnd = new Date(`${editingSession.date}T${editingSession.endTime}`);
      
      const hasConflict = upcomingSessions.some(session => {
        if (session.id === editingSession.id) return false; // Bỏ qua session hiện tại
        
        const sessionStart = new Date(`${session.date}T${session.startTime}`);
        const sessionEnd = new Date(`${session.date}T${session.endTime}`);
        
        return (newStart < sessionEnd && newEnd > sessionStart);
      });
      
      if (hasConflict) {
        errors.push('Thời gian này đã có lịch khác được đặt');
      }
    }

    return errors;
  };

  const handleSaveEdit = () => {
    // Validation toàn diện
    const validationErrors = validateEditSession();
    
    if (validationErrors.length > 0) {
      setSnackbar({
        open: true,
        message: validationErrors[0], // Hiển thị lỗi đầu tiên
        severity: 'error'
      });
      return;
    }

    // Tính lại duration
    const start = new Date(`${editingSession.date}T${editingSession.startTime}`);
    const end = new Date(`${editingSession.date}T${editingSession.endTime}`);
    const diffMs = end - start;
    const diffMins = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    const duration = `${hours > 0 ? hours + ' giờ ' : ''}${mins > 0 ? mins + ' phút' : ''}`;

    // Cập nhật session
    const updatedSessions = upcomingSessions.map(session => 
      session.id === editingSession.id 
        ? { ...editingSession, duration }
        : session
    ).sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.startTime}`);
      const dateB = new Date(`${b.date}T${b.startTime}`);
      return dateA - dateB;
    });
    setUpcomingSessions(updatedSessions);

    setSnackbar({
      open: true,
      message: 'Cập nhật lịch thành công!',
      severity: 'success'
    });

    handleCloseEditDialog();
  };

  const handleCancelSession = () => {
    if (selectedSessionForMenu) {
      setCancelingSession(selectedSessionForMenu);
      setConfirmCancelOpen(true);
    }
    handleMenuClose();
  };

  const confirmCancel = async () => {
    if (!cancelingSession) return;
    try {
      setLoading(true);
      await api.delete(`/api/schedule/${cancelingSession.id}`);
      showToast('Hủy lịch thành công và đã gửi email thông báo!', 'success');
      await fetchMySchedules();
    } catch (err) {
      showToast('Hủy lịch thất bại!', 'error');
    } finally {
      setLoading(false);
      setConfirmCancelOpen(false);
      setCancelingSession(null);
    }
  };

  const cancelCancel = () => {
    setConfirmCancelOpen(false);
    setCancelingSession(null);
  };

  // Function tính toán thời lượng từ startTime và endTime
  const calculateDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return '';
    
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    
    if (end <= start) return 'Thời gian không hợp lệ';
    
    const diffMs = end - start;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    
    if (hours > 0 && minutes > 0) {
      return `${hours} giờ ${minutes} phút`;
    } else if (hours > 0) {
      return `${hours} giờ`;
    } else {
      return `${minutes} phút`;
    }
  };

  const handleNewSessionChange = (field, value) => {
    setNewSession((prev) => {
      const updated = { ...prev, [field]: value };
      
      // Tự động tính toán thời lượng khi thay đổi startTime hoặc endTime
      if (field === 'startTime' || field === 'endTime') {
        const duration = calculateDuration(updated.startTime, updated.endTime);
        updated.duration = duration;
      }
      
      return updated;
    });
  };

  // Hàm gọi API đặt lịch
  const bookSchedule = async (scheduleData) => {
    try {
      const res = await api.post('/api/schedule/set', scheduleData);
      showToast(res.message || 'Đặt lịch thành công!', 'success');
      await fetchMySchedules(); // reload lại danh sách lịch sau khi đặt thành công
    } catch (err) {
      showToast(err.message || 'Đặt lịch thất bại!', 'error');
    }
  };

  // Function validation toàn diện
  const validateCreateSession = () => {
    const errors = [];

    // 1. Kiểm tra thông tin bắt buộc
    if (!newSession.title?.trim()) {
      errors.push('Tiêu đề cuộc gọi không được để trống');
    }
    
    if (!newSession.date) {
      errors.push('Vui lòng chọn ngày');
    }
    
    if (!newSession.startTime) {
      errors.push('Vui lòng chọn thời gian bắt đầu');
    }
    
    if (!newSession.endTime) {
      errors.push('Vui lòng chọn thời gian kết thúc');
    }
    
    if (!newSession.caller?.trim()) {
      errors.push('Tên người gọi không được để trống');
    }
    
    if (!newSession.calleeEmail?.trim()) {
      errors.push('Email người được mời không được để trống');
    }
    
    if (!newSession.courseId) {
      errors.push('Vui lòng chọn khóa học');
    }

    // 2. Kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (newSession.calleeEmail && !emailRegex.test(newSession.calleeEmail)) {
      errors.push('Email người được mời không đúng định dạng');
    }

    // 3. Kiểm tra ngày không được trong quá khứ
    if (newSession.date) {
      const selectedDate = new Date(newSession.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        errors.push('Không thể đặt lịch cho ngày trong quá khứ');
      }
    }

    // 4. Kiểm tra thời gian hợp lệ
    if (newSession.startTime && newSession.endTime) {
      const start = new Date(`2000-01-01T${newSession.startTime}`);
      const end = new Date(`2000-01-01T${newSession.endTime}`);
      
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        errors.push('Thời gian không hợp lệ');
      } else if (start >= end) {
        errors.push('Thời gian kết thúc phải sau thời gian bắt đầu');
      } else {
        const diffMs = end - start;
        const durationMinutes = Math.floor(diffMs / (1000 * 60));
        
        if (durationMinutes < 15) {
          errors.push('Thời lượng cuộc gọi phải ít nhất 15 phút');
        }
        
        if (durationMinutes > 480) { // 8 giờ
          errors.push('Thời lượng cuộc gọi không được quá 8 giờ');
        }
      }
    }

    // 5. Kiểm tra trùng lặp lịch
    if (newSession.date && newSession.startTime && newSession.endTime) {
      const newStart = new Date(`${newSession.date}T${newSession.startTime}`);
      const newEnd = new Date(`${newSession.date}T${newSession.endTime}`);
      
      const hasConflict = upcomingSessions.some(session => {
        const sessionStart = new Date(`${session.date}T${session.startTime}`);
        const sessionEnd = new Date(`${session.date}T${session.endTime}`);
        
        return (newStart < sessionEnd && newEnd > sessionStart);
      });
      
      if (hasConflict) {
        errors.push('Thời gian này đã có lịch khác được đặt');
      }
    }

    return errors;
  };

  const handleCreateSession = async () => {
    // Validation toàn diện
    const validationErrors = validateCreateSession();
    
    if (validationErrors.length > 0) {
      setSnackbar({
        open: true,
        message: validationErrors[0], // Hiển thị lỗi đầu tiên
        severity: 'error'
      });
      return;
    }

    // Tính toán duration từ startTime và endTime
    const start = new Date(`2000-01-01T${newSession.startTime}`);
    const end = new Date(`2000-01-01T${newSession.endTime}`);
    const diffMs = end - start;
    const durationMinutes = Math.floor(diffMs / (1000 * 60));
    
    const scheduleData = {
      dto: {
        SenderEmail: user?.email || '', // Email người đặt lịch (user hiện tại)
        ReceiverEmail: newSession.calleeEmail.trim(), // Email người nhận
        ScheduledTime: `${newSession.date}T${newSession.startTime}`,
        Duration: durationMinutes,
        CourseId: parseInt(newSession.courseId, 10),
      }
    };
    
    try {
      await bookSchedule(scheduleData);
      setOpenCreateDialog(false);
      // Reset form
      setNewSession({
        title: '',
        date: '',
        startTime: '',
        endTime: '',
        duration: '',
        caller: '',
        callerEmail: '',
        calleeEmail: '',
        courseId: '',
        meetingLink: '',
      });
    } catch (error) {
      // Error handling đã có trong bookSchedule
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDateStatus = (dateString) => {
    const today = new Date();
    const sessionDate = new Date(dateString);
    const diffTime = sessionDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'today';
    if (diffDays === 1) return 'tomorrow';
    if (diffDays > 1) return 'upcoming';
    return 'past';
  };

  const getStatusChip = (dateString) => {
    const status = getDateStatus(dateString);
    switch (status) {
      case 'today':
        return <Chip label="Hôm nay" className={classes.todayChip} size="small" />;
      case 'tomorrow':
        return <Chip label="Ngày mai" className={classes.tomorrowChip} size="small" />;
      case 'upcoming':
        return <Chip label="Sắp tới" className={classes.upcomingChip} size="small" />;
      default:
        return <Chip label="Quá hạn" color="secondary" size="small" />;
    }
  };

  const getStatistics = () => {
    const totalScheduled = upcomingSessions.length;
    const todaySessions = upcomingSessions.filter(session => getDateStatus(session.date) === 'today').length;
    
    // Tính cuộc gọi trong tuần này (từ Thứ 2 đến Chủ nhật)
    const today = new Date();
    // Lấy ngày đầu tuần (Thứ 2)
    const startOfWeek = new Date(today);
    const day = today.getDay();
    const diffToMonday = (day === 0 ? -6 : 1) - day; // Nếu Chủ nhật (0) thì lùi 6 ngày, còn lại lùi về Thứ 2
    startOfWeek.setDate(today.getDate() + diffToMonday);
    startOfWeek.setHours(0, 0, 0, 0);
    // Ngày cuối tuần (Chủ nhật)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const thisWeekSessions = upcomingSessions.filter(session => {
      const sessionDate = new Date(session.date);
      sessionDate.setHours(0, 0, 0, 0); // So sánh theo ngày
      return sessionDate >= startOfWeek && sessionDate <= endOfWeek;
    }).length;

    return {
      totalScheduled,
      todaySessions,
      thisWeekSessions
    };
  };

  const statistics = getStatistics();

  if (loading) {
    return (
      <div className={classes.loadingContainer}>
        <CircularProgress size={60} style={{ color: '#1eb2a6' }} />
        <Typography variant="h6" style={{ marginLeft: '16px' }}>
          Đang tải lịch cá nhân...
        </Typography>
      </div>
    );
  }

  if (upcomingSessions.length === 0) {
    return (
      <div className={classes.emptyStateContainer}>
        <Event className={classes.emptyStateIcon} />
        <Typography variant="h5" gutterBottom>
          Chưa có cuộc gọi nào được đặt lịch
        </Typography>
        <Typography variant="body1" color="textSecondary" align="center">
          Hãy đặt lịch cuộc gọi đầu tiên với giáo viên!
        </Typography>
        <Button
          variant="contained"
          color="primary"
          style={{ marginTop: '16px' }}
          onClick={handleOpenCreateDialog}
        >
          Đặt lịch cuộc gọi
        </Button>
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h5" style={{ fontWeight: 600 }}>
            <Event style={{ marginRight: '8px', color: '#1eb2a6', fontSize: '1.5rem' }} />
            Lịch cá nhân
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            style={{ borderRadius: '20px', textTransform: 'none' }}
            onClick={handleOpenCreateDialog}
          >
            Đặt lịch mới
          </Button>
        </Box>
        <Typography variant="body2" color="textSecondary">
          Xem các cuộc gọi sắp tới đã được đặt lịch
        </Typography>
      </div>

      {/* Thống kê */}
      <Grid container spacing={3} className={classes.statsGrid}>
        <Grid item xs={12} sm={4}>
          <div className={classes.statCard}>
            <Schedule className={classes.statIcon} />
            <Typography variant="h4" style={{ fontWeight: 700, marginBottom: '4px', color: '#222' }}>
              {statistics.totalScheduled}
            </Typography>
            <Typography variant="body2" color="textSecondary" style={{ fontWeight: 500 }}>
              Tổng số cuộc gọi đã đặt
            </Typography>
          </div>
        </Grid>
        <Grid item xs={12} sm={4}>
          <div className={classes.statCard}>
            <CalendarToday className={classes.statIcon} />
            <Typography variant="h4" style={{ fontWeight: 700, marginBottom: '4px', color: '#222' }}>
              {statistics.todaySessions}
            </Typography>
            <Typography variant="body2" color="textSecondary" style={{ fontWeight: 500 }}>
              Cuộc gọi hôm nay
            </Typography>
          </div>
        </Grid>
        <Grid item xs={12} sm={4}>
          <div className={classes.statCard}>
            <Notifications className={classes.statIcon} />
            <Typography variant="h4" style={{ fontWeight: 700, marginBottom: '4px', color: '#222' }}>
              {statistics.thisWeekSessions}
            </Typography>
            <Typography variant="body2" color="textSecondary" style={{ fontWeight: 500 }}>
              Cuộc gọi tuần này
            </Typography>
          </div>
        </Grid>
      </Grid>

      {/* Bảng lịch sắp tới */}
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table size="small">
          <TableHead className={classes.tableHeader}>
            <TableRow>
              <TableCell style={{ padding: '12px 16px' }}>Cuộc gọi</TableCell>
              <TableCell style={{ padding: '12px 16px' }}>Ngày</TableCell>
              <TableCell style={{ padding: '12px 16px' }}>Thời gian</TableCell>
              <TableCell style={{ padding: '12px 16px' }}>Thời lượng</TableCell>
              <TableCell style={{ padding: '12px 16px' }}>Trạng thái</TableCell>
              <TableCell style={{ padding: '12px 16px' }}>Môn học</TableCell>
              <TableCell style={{ padding: '12px 16px' }}>Chi tiết</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {upcomingSessions.map((session) => (
              <TableRow key={session.id} hover style={{ height: '60px' }}>
                <TableCell style={{ padding: '12px 16px' }}>
                  <Box display="flex" alignItems="center">
                    <Event style={{ marginRight: '8px', color: '#1eb2a6', fontSize: '18px' }} />
                    <Typography variant="body2" style={{ fontWeight: 600 }}>
                      Cuộc gọi với {session.partnerName} ({session.role})
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell style={{ padding: '12px 16px' }}>
                  <Chip
                    icon={<CalendarToday />}
                    label={formatDate(session.date)}
                    className={classes.dateChip}
                    size="small"
                  />
                </TableCell>
                <TableCell style={{ padding: '12px 16px' }}>
                  <Typography variant="body2">
                    {session.startTime} - {session.endTime}
                  </Typography>
                </TableCell>
                <TableCell style={{ padding: '12px 16px' }}>
                  <Chip
                    icon={<AccessTime />}
                    label={session.duration}
                    className={classes.durationChip}
                    size="small"
                  />
                </TableCell>
                <TableCell style={{ padding: '12px 16px' }}>
                  {getStatusChip(session.date)}
                </TableCell>
                <TableCell style={{ padding: '12px 16px' }}>
                  <Chip
                    label={session.subject}
                    size="small"
                    style={{ 
                      backgroundColor: '#e8f5e8', 
                      color: '#2e7d32',
                      fontWeight: 500,
                      fontSize: '12px'
                    }}
                  />
                </TableCell>
                <TableCell style={{ padding: '12px 16px' }}>
                  <IconButton
                    color="default"
                    size="small"
                    style={{ 
                      backgroundColor: '#f8f9fa',
                      width: '32px',
                      height: '32px',
                      border: '1px solid #e9ecef',
                      '&:hover': {
                        backgroundColor: '#e9ecef'
                      }
                    }}
                    onClick={(e) => handleMenuOpen(e, session)}
                  >
                    <MoreVert style={{ fontSize: '16px', color: '#6c757d' }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog chi tiết cuộc gọi */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        className="form-dialog"
      >
        {selectedSession && (
          <>
            <DialogTitle>
              <Typography variant="h6">
                Chi tiết cuộc gọi: Cuộc gọi với {selectedSession.partnerName} ({selectedSession.role})
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Ngày diễn ra
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {formatDate(selectedSession.date)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Thời gian
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedSession.startTime} - {selectedSession.endTime}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Thời lượng
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedSession.duration}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Môn học
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedSession.subject}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Trạng thái
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {getStatusChip(selectedSession.date)}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Divider style={{ margin: '16px 0' }} />
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Người tham gia
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {/* Mock data for participants, as the original mock data didn't have this */}
                    {/* In a real scenario, you'd fetch participants from the API */}
                    <Chip
                      avatar={<Avatar>{selectedSession.partnerName.charAt(0)}</Avatar>}
                      label={`${selectedSession.partnerName} (${selectedSession.role})`}
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Link cuộc gọi
                  </Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleJoinVideoCall}
                    startIcon={<VideoCall />}
                  >
                    Tham gia cuộc gọi
                  </Button>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Đóng
              </Button>
              <Button 
                variant="contained" 
                color="primary"
                onClick={handleJoinVideoCall}
                startIcon={<VideoCall />}
              >
                Tham gia ngay
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Dialog tạo mới lịch */}
      <Dialog 
        open={openCreateDialog} 
        onClose={handleCloseCreateDialog} 
        maxWidth="sm" 
        fullWidth
        className="form-dialog"
      >
        <DialogTitle>Thêm lịch cuộc gọi mới</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Tiêu đề cuộc gọi"
                fullWidth
                value={newSession.title}
                onChange={e => handleNewSessionChange('title', e.target.value)}
                margin="dense"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Ngày"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={newSession.date}
                onChange={e => handleNewSessionChange('date', e.target.value)}
                margin="dense"
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                label="Giờ bắt đầu"
                type="time"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={newSession.startTime}
                onChange={e => handleNewSessionChange('startTime', e.target.value)}
                margin="dense"
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                label="Giờ kết thúc"
                type="time"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={newSession.endTime}
                onChange={e => handleNewSessionChange('endTime', e.target.value)}
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Tên người gọi"
                fullWidth
                value={newSession.caller}
                onChange={e => handleNewSessionChange('caller', e.target.value)}
                margin="dense"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email người tạo cuộc gọi"
                fullWidth
                value={newSession.callerEmail}
                margin="dense"
                type="email"
                disabled
                helperText="Email được lấy từ tài khoản đăng nhập"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email người được mời"
                fullWidth
                value={newSession.calleeEmail}
                onChange={e => handleNewSessionChange('calleeEmail', e.target.value)}
                margin="dense"
                type="email"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                label="Khóa học"
                fullWidth
                value={newSession.courseId}
                onChange={e => handleNewSessionChange('courseId', e.target.value)}
                margin="dense"
                SelectProps={{ native: true }}
                required
                InputLabelProps={{ shrink: true }}
              >
                <option value="">Chọn khóa học</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Thời lượng"
                fullWidth
                value={newSession.duration}
                margin="dense"
                disabled
                helperText="Tự động tính toán từ thời gian bắt đầu và kết thúc"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>


          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreateDialog} color="default">Hủy</Button>
          <Button onClick={handleCreateSession} color="primary" variant="contained">Lưu</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog chỉnh sửa lịch */}
      <Dialog 
        open={openEditDialog} 
        onClose={handleCloseEditDialog} 
        maxWidth="sm" 
        fullWidth
        className="form-dialog"
      >
        <DialogTitle>Chỉnh sửa lịch cuộc gọi</DialogTitle>
        <DialogContent>
          {editingSession && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Ngày"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={editingSession.date}
                  onChange={e => handleEditSessionChange('date', e.target.value)}
                  margin="dense"
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField
                  label="Giờ bắt đầu"
                  type="time"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={editingSession.startTime}
                  onChange={e => handleEditSessionChange('startTime', e.target.value)}
                  margin="dense"
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField
                  label="Giờ kết thúc"
                  type="time"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={editingSession.endTime}
                  onChange={e => handleEditSessionChange('endTime', e.target.value)}
                  margin="dense"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  label="Khóa học"
                  fullWidth
                  value={editingSession.courseTitle || ''}
                  onChange={e => handleEditSessionChange('courseTitle', e.target.value)}
                  margin="dense"
                  SelectProps={{ native: true }}
                  required
                  InputLabelProps={{ shrink: true }}
                >
                  <option value="">Chọn khóa học</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.name}>
                      {course.name}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Thời lượng"
                  fullWidth
                  value={editingSession.duration || ''}
                  margin="dense"
                  disabled
                  helperText="Tự động tính toán từ thời gian bắt đầu và kết thúc"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="default">Hủy</Button>
          <Button onClick={handleSaveEdit} color="primary" variant="contained">Lưu thay đổi</Button>
        </DialogActions>
      </Dialog>

      {/* Menu tùy chọn */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewDetails}>
          <Typography variant="body2">Xem chi tiết</Typography>
        </MenuItem>
        <MenuItem onClick={handleEditSession}>
          <Typography variant="body2">Chỉnh sửa</Typography>
        </MenuItem>
        <MenuItem onClick={handleCancelSession} style={{ color: '#f44336' }}>
          <Typography variant="body2" style={{ color: '#f44336' }}>Hủy lịch</Typography>
        </MenuItem>
      </Menu>

      {/* Dialog xác nhận hủy lịch */}
      <Dialog open={confirmCancelOpen} onClose={cancelCancel} maxWidth="xs" fullWidth>
        <DialogTitle>Xác nhận hủy lịch</DialogTitle>
        <DialogContent>
          <Typography>Bạn có chắc chắn muốn hủy lịch này không?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelCancel} color="default">Không</Button>
          <Button onClick={confirmCancel} color="secondary" variant="contained">Hủy lịch</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar thông báo lỗi */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        message={snackbar.message}
      />

    </div>
  );
};

export default PersonalCalendar; 