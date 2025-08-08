import React, { useState } from 'react';
import { 
  Typography, 
  AppBar, 
  Button, 
  Tabs, 
  Tab, 
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Snackbar
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import VideoCallIcon from '@material-ui/icons/VideoCall';
import HistoryIcon from '@material-ui/icons/History';
import EventIcon from '@material-ui/icons/Event';

import VideoPlayer from '../../components/VideoPlayer';
import Sidebar from '../../components/Sidebar';
import Notifications from '../../components/Notifications';
import PastSessions from '../../components/PastSessions';
import PersonalCalendar from '../../components/PersonalCalendar';
import { SessionsProvider } from '../../contexts/SessionsContext';
import { useAuth } from 'features/auth/contexts/AuthContext';
import { useToast } from 'components/common/Toast';
import api from 'services/api';
import './style.css';

const useStyles = makeStyles((theme) => ({
  appBar: {
    borderRadius: '15px',
    margin: '20px 0',
    padding: '10px 0',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '600px',
    background: 'rgba(255, 255, 255, 0.9)',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',

    [theme.breakpoints.down('xs')]: {
      width: '90%',
    },
  },
  image: {
    marginLeft: '15px',
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    zIndex: 10,
    backgroundColor: '#1eb2a6',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#15968d',
    },
  },
  tabsContainer: {
    width: '100%',
    maxWidth: '1200px',
    margin: '20px auto',
    backgroundColor: '#fff',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    border: '1px solid #f0f0f0',
    overflow: 'hidden',
  },
  tabs: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: '12px',
    borderTopRightRadius: '12px',
    borderBottom: '1px solid #e0e0e0',
    '& .MuiTab-root': {
      minHeight: '70px',
      fontSize: '15px',
      fontWeight: '600',
      textTransform: 'none',
      color: '#666666',
      transition: 'all 0.3s ease',
      '&:hover': {
        backgroundColor: '#f5f5f5',
        color: '#1eb2a6',
      },
      '&.Mui-selected': {
        color: '#1eb2a6',
        backgroundColor: '#f0f9f8',
        fontWeight: '700',
        '& .MuiSvgIcon-root': {
          color: '#1eb2a6',
        },
      },
      '& .MuiSvgIcon-root': {
        fontSize: '24px',
        marginBottom: '4px',
        color: '#999999',
        transition: 'color 0.3s ease',
      },
      '& .MuiTab-wrapper': {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50px',
      },
    },
    '& .MuiTabs-indicator': {
      backgroundColor: '#1eb2a6',
      height: '4px',
      borderRadius: '2px',
    },
    '& .MuiTabs-flexContainer': {
      justifyContent: 'space-around',
    },
  },
  tabPanel: {
    padding: theme.spacing(3),
    minHeight: '500px',
  },
  videoCallContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
}));

// TabPanel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      style={{ display: value === index ? 'block' : 'none' }}
      id={`video-tabpanel-${index}`}
      aria-labelledby={`video-tab-${index}`}
      {...other}
    >
      <Box>{children}</Box>
    </div>
  );
}

const VideoCallPage = () => {
  const classes = useStyles();
  const [tabValue, setTabValue] = useState(0);
  const { user } = useAuth();
  const { showToast } = useToast();

  // Thêm log để debug state dialog
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  console.log("VideoCallPage render, openCreateDialog:", openCreateDialog);
  
  const [newSession, setNewSession] = useState({
    date: '',
    startTime: '',
    endTime: '',
    duration: '',
    caller: '',
    callerEmail: '',
    calleeEmail: '',
    meetingLink: '',
  });
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'error'
  });
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleOpenCreateDialog = () => {
    console.log("Gọi setOpenCreateDialog(true)");
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

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
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

  // Function validation toàn diện
  const validateCreateSession = () => {
    const errors = [];

    // 1. Kiểm tra thông tin bắt buộc
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
      receiverEmail: newSession.calleeEmail.trim(),
      scheduledTime: `${newSession.date}T${newSession.startTime}`,
      duration: durationMinutes,
    };
    
    try {
      const res = await api.post('/api/schedule/set', scheduleData);
      showToast(res.message || 'Đặt lịch thành công!', 'success');
      handleCloseCreateDialog(); // Đóng dialog sau khi lưu thành công
      // Reset form
      setNewSession({
        date: '',
        startTime: '',
        endTime: '',
        duration: '',
        caller: '',
        callerEmail: '',
        calleeEmail: '',
        meetingLink: '',
      });
      // Chuyển sang tab Lịch cá nhân để xem lịch mới
      setTabValue(2);
      // Trigger refresh dữ liệu trong PersonalCalendar
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      showToast(err.message || 'Đặt lịch thất bại!', 'error');
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <SessionsProvider>
      <div className={`${classes.wrapper} video-call-wrapper`}>
        <Button
          component={Link}
          to="/courses"
          variant="contained"
          color="primary"
          className={classes.backButton}
          startIcon={<ArrowBackIcon />}
        >
          Về trang khóa học
        </Button>
        
        <div className={classes.tabsContainer}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            className={classes.tabs}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab 
              icon={<VideoCallIcon />} 
              label="Video Call" 
              id="video-tab-0"
              aria-controls="video-tabpanel-0"
            />
            <Tab 
              icon={<HistoryIcon />} 
              label="Lịch sử" 
              id="video-tab-1"
              aria-controls="video-tabpanel-1"
            />
            <Tab 
              icon={<EventIcon />} 
              label="Lịch cá nhân" 
              id="video-tab-2"
              aria-controls="video-tabpanel-2"
            />
          </Tabs>

          <TabPanel value={tabValue} index={0} className={classes.tabPanel}>
            <div className={classes.videoCallContent}>
              <AppBar className={classes.appBar} position="static" color="inherit">
                <Typography variant="h4" align="center">Trò chuyện video</Typography>
              </AppBar>
              <VideoPlayer />
              <Sidebar>
                <Notifications />
              </Sidebar>
            </div>
          </TabPanel>

          <TabPanel value={tabValue} index={1} className={classes.tabPanel}>
            <PastSessions />
          </TabPanel>

          <TabPanel value={tabValue} index={2} className={classes.tabPanel}>
            <PersonalCalendar 
              onSwitchToVideoCall={() => setTabValue(0)}
              openCreateDialog={openCreateDialog}
              handleOpenCreateDialog={handleOpenCreateDialog}
              handleCloseCreateDialog={handleCloseCreateDialog}
              refreshTrigger={refreshTrigger}
            />
          </TabPanel>
        </div>
        {/* Luôn render Dialog tạo mới lịch ở ngoài */}
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
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Ngày"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={newSession.date}
                  onChange={e => handleNewSessionChange('date', e.target.value)}
                  margin="dense"
                  required
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
                  required
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
                  required
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
                  label="Thời lượng"
                  fullWidth
                  value={newSession.duration || ''}
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

        {/* Snackbar thông báo lỗi */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          message={snackbar.message}
        />
      </div>
    </SessionsProvider>
  );
};

export default VideoCallPage; 