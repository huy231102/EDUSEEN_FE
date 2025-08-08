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
  CircularProgress
} from '@material-ui/core';
import api from 'services/api';
import { useToast } from 'components/common/Toast';
import ScheduleIcon from '@material-ui/icons/Schedule';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import VideoCallIcon from '@material-ui/icons/VideoCall';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import TimerIcon from '@material-ui/icons/Timer';
import HistoryIcon from '@material-ui/icons/History';
import RefreshIcon from '@material-ui/icons/Refresh';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { makeStyles } from '@material-ui/core/styles';
import './style.css';

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
  card: {
    marginBottom: theme.spacing(2),
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows[8],
    },
  },
  sessionCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  sessionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(2),
    borderBottom: '1px solid #e0e0e0',
  },
  sessionInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  sessionDetails: {
    padding: theme.spacing(2),
  },
  durationChip: {
    backgroundColor: '#1eb2a6',
    color: 'white',
    fontWeight: 'bold',
  },
  dateChip: {
    backgroundColor: '#f0f0f0',
    color: '#333',
  },
  participantAvatar: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    marginRight: theme.spacing(1),
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
  emptyState: {
    textAlign: 'center',
    padding: theme.spacing(4),
    color: '#666',
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
}));

const PastSessions = () => {
  const classes = useStyles();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const { showToast } = useToast();

  const handleSessionClick = (session) => {
    setSelectedSession(session);
    setOpenDialog(true);
  };

  // Function kiểm tra xem schedule có quá hạn không
  const isScheduleOverdue = (session) => {
    if (!session.scheduledTime || !session.durationMinutes) return false;
    
    const startTime = new Date(session.scheduledTime);
    const endTime = new Date(startTime.getTime() + session.durationMinutes * 60000);
    const now = new Date();
    
    return endTime < now;
  };

  // Function gọi API lấy lịch sử cuộc gọi và lịch quá hạn
  const fetchCallHistory = async () => {
    setLoading(true);
    try {
      // Fetch video call history
      const historyResponse = await api.get('/api/videocall/history');
      console.log('Video Call History API Response:', historyResponse);
      
      // Fetch all schedules to find overdue ones
      const schedulesResponse = await api.get('/api/schedule/mySchedules');
      console.log('Schedules API Response:', schedulesResponse);
      
      // Process video call history
      const historyData = historyResponse.data || historyResponse;
      const videoCallSessions = Array.isArray(historyData) ? historyData.map(item => {
        console.log('Mapping video call item:', item);
        
        let startDate, endDate;
        try {
          startDate = new Date(item.startTime);
          endDate = new Date(item.endTime);
          
          if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            console.warn('Invalid date for video call item:', item);
            startDate = new Date();
            endDate = new Date();
          }
        } catch (error) {
          console.warn('Error parsing dates for video call item:', item, error);
          startDate = new Date();
          endDate = new Date();
        }
        
        const durationMinutes = item.durationMinutes || 0;
        
        return {
          id: `video_${item.callId || Math.random().toString()}`,
          type: 'video_call',
          date: startDate.toISOString().slice(0, 10),
          startTime: startDate.toLocaleTimeString('vi-VN', { 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: false 
          }),
          endTime: endDate.toLocaleTimeString('vi-VN', { 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: false 
          }),
          duration: formatDuration(durationMinutes),
          subject: item.subject || 'Tư vấn',
          participants: [
            { name: item.teacherName || 'Giáo viên', role: 'Giáo viên' },
            { name: item.studentName || 'Học sinh', role: 'Học sinh' }
          ],
          notes: item.note || '',
          status: 'Hoàn thành',
          scheduledTime: item.startTime,
          durationMinutes: durationMinutes
        };
      }) : [];

      // Process overdue schedules
      const schedulesData = schedulesResponse.data || schedulesResponse;
      const overdueSchedules = Array.isArray(schedulesData) ? schedulesData
        .map(item => {
          const startDate = new Date(item.scheduledTime);
          const timeStart = startDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false });
          const endDate = new Date(startDate.getTime() + item.duration * 60000);
          const timeEnd = endDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false });
          
          return {
            id: item.scheduleId,
            type: 'overdue_schedule',
            date: startDate.toISOString().slice(0, 10),
            startTime: timeStart,
            endTime: timeEnd,
            duration: `${Math.floor(item.duration/60) > 0 ? Math.floor(item.duration/60) + ' giờ ' : ''}${item.duration%60 > 0 ? item.duration%60 + ' phút' : ''}`.trim(),
            subject: item.courseTitle || 'Tư vấn',
            status: 'Quá hạn',
            partnerName: item.partnerName,
            role: item.role,
            scheduledTime: item.scheduledTime,
            durationMinutes: item.duration,
            participants: [
              { name: item.partnerName || 'Đối tác', role: item.role || 'Người tham gia' }
            ],
            notes: 'Cuộc gọi đã quá hạn và không được thực hiện'
          };
        })
        .filter(schedule => isScheduleOverdue(schedule)) : [];

      // Combine and sort by date (newest first)
      const allSessions = [...videoCallSessions, ...overdueSchedules].sort((a, b) => {
        const dateA = new Date(a.scheduledTime || a.date);
        const dateB = new Date(b.scheduledTime || b.date);
        return dateB - dateA;
      });

      setSessions(allSessions);
    } catch (error) {
      console.error('Error fetching call history:', error);
      if (error.message.includes('401')) {
        showToast('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!', 'error');
      } else if (error.message.includes('403')) {
        showToast('Bạn không có quyền truy cập lịch sử cuộc gọi!', 'error');
      } else {
        showToast('Lỗi tải lịch sử cuộc gọi!', 'error');
      }
      
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  // Function format thời lượng
  const formatDuration = (minutes) => {
    try {
      const mins = Math.abs(parseFloat(minutes) || 0);
      const hours = Math.floor(mins / 60);
      const remainingMins = Math.floor(mins % 60);
      
      if (hours > 0 && remainingMins > 0) {
        return `${hours} giờ ${remainingMins} phút`;
      } else if (hours > 0) {
        return `${hours} giờ`;
      } else {
        return `${remainingMins} phút`;
      }
    } catch (error) {
      console.warn('Error formatting duration:', error);
      return '0 phút';
    }
  };

  // Function tạo tiêu đề cuộc gọi
  const generateCallTitle = (participants) => {
    if (!participants || participants.length === 0) {
      return 'Cuộc gọi video';
    }
    
    if (participants.length === 1) {
      return `Cuộc gọi với ${participants[0].name}`;
    }
    
    const names = participants.map(p => p.name).join(', ');
    return `Cuộc gọi nhóm: ${names}`;
  };

  // Function tính toán thống kê
  const getStatistics = () => {
    const totalSessions = sessions.length;
    const completedCalls = sessions.filter(s => s.type === 'video_call').length;
    const overdueSchedules = sessions.filter(s => s.type === 'overdue_schedule').length;
    
    const totalDuration = sessions.reduce((total, session) => {
      const durationStr = session.duration;
      const hours = durationStr.match(/(\d+)\s*giờ/)?.[1] || 0;
      const minutes = durationStr.match(/(\d+)\s*phút/)?.[1] || 0;
      return total + parseInt(hours) * 60 + parseInt(minutes);
    }, 0);
    
    return {
      totalSessions,
      completedCalls,
      overdueSchedules,
      totalDuration: formatDuration(totalDuration)
    };
  };

  // Function làm mới dữ liệu
  const resetSessions = () => {
    fetchCallHistory();
  };

  // Function test API
  const testAPI = async () => {
    try {
      console.log('Testing API...');
      const response = await api.get('/api/videocall/history');
      console.log('Test API Response:', response);
      showToast('API test thành công!', 'success');
    } catch (error) {
      console.error('Test API Error:', error);
      showToast('API test thất bại!', 'error');
    }
  };

  // Function tạo test data
  const createTestData = () => {
    const testSessions = [
      {
        id: 1,
        date: '2024-01-15',
        startTime: '09:00',
        endTime: '10:30',
        duration: '1 giờ 30 phút',
        subject: 'Toán học',
        participants: [
          { name: 'Nguyễn Văn A', role: 'Giáo viên' },
          { name: 'Trần Thị B', role: 'Học sinh' }
        ],
        notes: 'Bài học về đạo hàm',
        status: 'Hoàn thành'
      },
      {
        id: 2,
        date: '2024-01-14',
        startTime: '14:00',
        endTime: '15:00',
        duration: '1 giờ',
        subject: 'Vật lý',
        participants: [
          { name: 'Lê Văn C', role: 'Giáo viên' },
          { name: 'Phạm Thị D', role: 'Học sinh' }
        ],
        notes: 'Bài học về điện từ',
        status: 'Hoàn thành'
      }
    ];
    setSessions(testSessions);
    showToast('Đã tải test data!', 'success');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedSession(null);
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

  const statistics = getStatistics();

  // Gọi API khi component mount
  useEffect(() => {
    // console.log('PastSessions component mounted');
    // console.log('Auth token:', localStorage.getItem('authToken'));
    fetchCallHistory();
  }, []);

  if (loading) {
    return (
      <div className={classes.loadingContainer}>
        <CircularProgress size={60} style={{ color: '#1eb2a6' }} />
        <Typography variant="h6" style={{ marginLeft: '16px' }}>
          Đang tải lịch sử cuộc gọi...
        </Typography>
      </div>
    );
  }

  // Debug info
  // console.log('Rendering PastSessions with sessions:', sessions);

  if (!Array.isArray(sessions) || sessions.length === 0) {
    return (
      <div className={classes.emptyStateContainer}>
        <HistoryIcon className={classes.emptyStateIcon} />
        <Typography variant="h5" gutterBottom>
          Chưa có cuộc gọi nào
        </Typography>
        <Typography variant="body1" color="textSecondary" align="center">
          Bạn chưa có lịch sử cuộc gọi video nào. Hãy bắt đầu cuộc gọi đầu tiên!
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={createTestData}
          style={{ marginTop: '16px' }}
        >
          Tải dữ liệu mẫu
        </Button>
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h5" style={{ fontWeight: 600 }}>
            <VideoCallIcon style={{ marginRight: '8px', color: '#1eb2a6', fontSize: '1.5rem' }} />
            Lịch sử cuộc gọi video
          </Typography>
          <Box>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<RefreshIcon />}
              onClick={resetSessions}
              size="small"
              style={{ borderRadius: '20px', textTransform: 'none' }}
            >
              Làm mới
            </Button>
          </Box>
        </Box>
        <Typography variant="body2" color="textSecondary">
          Xem lại lịch sử các cuộc gọi video đã tham gia
        </Typography>
      </div>

      {/* Thống kê */}
      <Grid container spacing={2} className={classes.statsGrid}>
        <Grid item xs={12} sm={3}>
          <div className={classes.statCard}>
            <ScheduleIcon className={classes.statIcon} />
            <Typography variant="h5" style={{ fontWeight: 600, marginBottom: '4px' }}>
              {statistics.totalSessions}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Tổng số cuộc gọi
            </Typography>
          </div>
        </Grid>
        <Grid item xs={12} sm={3}>
          <div className={classes.statCard}>
            <VideoCallIcon className={classes.statIcon} />
            <Typography variant="h5" style={{ fontWeight: 600, marginBottom: '4px' }}>
              {statistics.completedCalls}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Cuộc gọi hoàn thành
            </Typography>
          </div>
        </Grid>
        <Grid item xs={12} sm={3}>
          <div className={classes.statCard}>
            <HistoryIcon className={classes.statIcon} />
            <Typography variant="h5" style={{ fontWeight: 600, marginBottom: '4px' }}>
              {statistics.overdueSchedules}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Cuộc gọi quá hạn
            </Typography>
          </div>
        </Grid>
        <Grid item xs={12} sm={3}>
          <div className={classes.statCard}>
            <TimerIcon className={classes.statIcon} />
            <Typography variant="h5" style={{ fontWeight: 600, marginBottom: '4px' }}>
              {statistics.totalDuration}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Tổng thời gian
            </Typography>
          </div>
        </Grid>
      </Grid>

      {/* Bảng lịch sử */}
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
            {sessions.map((session, index) => {
              try {
                return (
                  <TableRow key={session.id || index} hover style={{ height: '60px' }}>
                <TableCell style={{ padding: '12px 16px' }}>
                  <Box display="flex" alignItems="center">
                    <VideoCallIcon style={{ marginRight: '8px', color: '#1eb2a6', fontSize: '18px' }} />
                    <Typography variant="body2" style={{ fontWeight: 600 }}>
                      {session.type === 'overdue_schedule' 
                        ? `Cuộc gọi với ${session.partnerName} (${session.role})`
                        : generateCallTitle(session.participants)
                      }
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell style={{ padding: '12px 16px' }}>
                  <Chip
                    icon={<CalendarTodayIcon />}
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
                    icon={<AccessTimeIcon />}
                    label={session.duration}
                    className={classes.durationChip}
                    size="small"
                  />
                </TableCell>
                <TableCell style={{ padding: '12px 16px' }}>
                  <Chip
                    label={session.status}
                    size="small"
                    style={{ 
                      backgroundColor: session.status === 'Quá hạn' ? '#ffebee' : '#e8f5e8', 
                      color: session.status === 'Quá hạn' ? '#c62828' : '#2e7d32',
                      fontWeight: 500,
                      fontSize: '12px'
                    }}
                  />
                </TableCell>
                <TableCell style={{ padding: '12px 16px' }}>
                  <Chip
                    label={session.subject}
                    size="small"
                    style={{ 
                      backgroundColor: '#e3f2fd', 
                      color: '#1976d2',
                      fontWeight: 500,
                      fontSize: '12px'
                    }}
                  />
                </TableCell>
                <TableCell style={{ padding: '12px 16px' }}>
                  <IconButton
                    color="default"
                    onClick={() => handleSessionClick(session)}
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
                  >
                    <MoreVertIcon style={{ fontSize: '16px', color: '#6c757d' }} />
                  </IconButton>
                </TableCell>
              </TableRow>
                );
              } catch (error) {
                console.error('Error rendering session:', error, session);
                return null;
              }
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog chi tiết cuộc gọi */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedSession && (
          <>
            <DialogTitle>
              <Typography variant="h6">
                Chi tiết cuộc gọi: {selectedSession.type === 'overdue_schedule' 
                  ? `Cuộc gọi với ${selectedSession.partnerName} (${selectedSession.role})`
                  : generateCallTitle(selectedSession.participants)
                }
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
                    Trạng thái
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <Chip
                      label={selectedSession.status}
                      size="small"
                      style={{ 
                        backgroundColor: selectedSession.status === 'Quá hạn' ? '#ffebee' : '#e8f5e8', 
                        color: selectedSession.status === 'Quá hạn' ? '#c62828' : '#2e7d32',
                        fontWeight: 500,
                        fontSize: '12px'
                      }}
                    />
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
                <Grid item xs={12}>
                  <Divider style={{ margin: '16px 0' }} />
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Người tham gia
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {selectedSession.participants.map((participant, index) => (
                      <Chip
                        key={index}
                        avatar={<Avatar>{participant.name.charAt(0)}</Avatar>}
                        label={`${participant.name} (${participant.role})`}
                        variant="outlined"
                        size="small"
                      />
                    ))}
                  </Box>
                </Grid>
                {selectedSession.notes && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      Ghi chú
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {selectedSession.notes}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Đóng
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </div>
  );
};

export default PastSessions; 