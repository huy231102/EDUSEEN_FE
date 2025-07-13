import React from 'react';
import { Typography, AppBar, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import VideoPlayer from 'features/video-call/components/VideoPlayer';
import Sidebar from 'features/video-call/components/Sidebar';
import Notifications from 'features/video-call/components/Notifications';
import './style.css'

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
}));

const VideoCallPage = () => {
  const classes = useStyles();

  return (
    <div className={`${classes.wrapper} videoCallWrapper`}>
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
      <AppBar className={classes.appBar} position="static" color="inherit">
        <Typography variant="h4" align="center">Trò chuyện video</Typography>
      </AppBar>
      <VideoPlayer />
      <Sidebar>
        <Notifications />
      </Sidebar>
    </div>
  );
};

export default VideoCallPage; 