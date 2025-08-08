import React, { useState } from 'react';
import { Button, Typography, makeStyles, Paper } from '@material-ui/core';
import { VideoCall, PlayArrow } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    padding: theme.spacing(3),
  },
  paper: {
    padding: theme.spacing(4),
    textAlign: 'center',
    borderRadius: '15px',
    background: 'rgba(255, 255, 255, 0.9)',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
    maxWidth: '500px',
  },
  icon: {
    fontSize: '4rem',
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(2),
  },
  title: {
    marginBottom: theme.spacing(2),
    color: theme.palette.text.primary,
  },
  description: {
    marginBottom: theme.spacing(3),
    color: theme.palette.text.secondary,
    lineHeight: 1.6,
  },
  loadButton: {
    backgroundColor: '#1eb2a6',
    color: 'white',
    padding: theme.spacing(1.5, 3),
    '&:hover': {
      backgroundColor: '#1a9f94',
    },
  },
}));

const LazyVideoCallWrapper = ({ children, onLoad }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const classes = useStyles();

  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) {
      onLoad();
    }
  };

  if (isLoaded) {
    return children;
  }

  return (
    <div className={classes.wrapper}>
      <Paper elevation={0} className={classes.paper}>
        <VideoCall className={classes.icon} />
        <Typography variant="h5" className={classes.title}>
          Video Call
        </Typography>
        <Typography variant="body1" className={classes.description}>
          Tính năng video call cho phép bạn trò chuyện trực tiếp với giáo viên và học sinh khác. 
          Kết nối sẽ được thiết lập khi bạn bắt đầu sử dụng.
        </Typography>
        <Button
          variant="contained"
          size="large"
          className={classes.loadButton}
          onClick={handleLoad}
          startIcon={<PlayArrow />}
        >
          Bắt đầu Video Call
        </Button>
      </Paper>
    </div>
  );
};

export default LazyVideoCallWrapper; 