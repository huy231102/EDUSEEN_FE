import React, { useState, useEffect } from 'react';
import { useSessions } from '../../contexts/SessionsContext';
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
import {
  PlayArrow,
  Schedule,
  AccessTime,
  Person,
  VideoCall,
  CalendarToday,
  Timer,
  History,
  Refresh,
  MoreVert
} from '@material-ui/icons';
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
  const { sessions, loading, getStatistics, resetSessions, generateCallTitle } = useSessions();
  const [selectedSession, setSelectedSession] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleSessionClick = (session) => {
    setSelectedSession(session);
    setOpenDialog(true);
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

  if (sessions.length === 0) {
    return (
      <div className={classes.emptyStateContainer}>
        <History className={classes.emptyStateIcon} />
        <Typography variant="h5" gutterBottom>
          Chưa có cuộc gọi nào
        </Typography>
        <Typography variant="body1" color="textSecondary" align="center">
          Bạn chưa có lịch sử cuộc gọi video nào. Hãy bắt đầu cuộc gọi đầu tiên!
        </Typography>
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h5" style={{ fontWeight: 600 }}>
            <VideoCall style={{ marginRight: '8px', color: '#1eb2a6', fontSize: '1.5rem' }} />
            Lịch sử cuộc gọi video
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<Refresh />}
            onClick={resetSessions}
            size="small"
            style={{ borderRadius: '20px', textTransform: 'none' }}
          >
            Làm mới
          </Button>
        </Box>
        <Typography variant="body2" color="textSecondary">
          Xem lại lịch sử các cuộc gọi video đã tham gia
        </Typography>
      </div>

      {/* Thống kê */}
      <Grid container spacing={2} className={classes.statsGrid}>
        <Grid item xs={12} sm={6}>
          <div className={classes.statCard}>
            <Schedule className={classes.statIcon} />
            <Typography variant="h5" style={{ fontWeight: 600, marginBottom: '4px' }}>
              {statistics.totalSessions}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Tổng số cuộc gọi
            </Typography>
          </div>
        </Grid>
        <Grid item xs={12} sm={6}>
          <div className={classes.statCard}>
            <Timer className={classes.statIcon} />
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
              <TableCell style={{ padding: '12px 16px' }}>Môn học</TableCell>
              <TableCell style={{ padding: '12px 16px' }}>Chi tiết</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sessions.map((session) => (
              <TableRow key={session.id} hover style={{ height: '60px' }}>
                <TableCell style={{ padding: '12px 16px' }}>
                  <Box display="flex" alignItems="center">
                    <VideoCall style={{ marginRight: '8px', color: '#1eb2a6', fontSize: '18px' }} />
                    <Typography variant="body2" style={{ fontWeight: 600 }}>
                      {generateCallTitle(session.participants)}
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
      >
        {selectedSession && (
          <>
            <DialogTitle>
              <Typography variant="h6">
                Chi tiết cuộc gọi: {generateCallTitle(selectedSession.participants)}
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
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Ghi chú
                  </Typography>
                  <Typography variant="body1">
                    {selectedSession.notes}
                  </Typography>
                </Grid>
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