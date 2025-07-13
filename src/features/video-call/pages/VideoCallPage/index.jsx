import React, { useState } from 'react';
import { 
  Typography, 
  AppBar, 
  Button, 
  Tabs, 
  Tab, 
  Box 
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
      hidden={value !== index}
      id={`video-tabpanel-${index}`}
      aria-labelledby={`video-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

const VideoCallPage = () => {
  const classes = useStyles();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
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
            <PersonalCalendar onSwitchToVideoCall={() => setTabValue(0)} />
          </TabPanel>
        </div>
      </div>
    </SessionsProvider>
  );
};

export default VideoCallPage; 