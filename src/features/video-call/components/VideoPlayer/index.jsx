import React, { useContext } from 'react';
import { Grid, Typography, Paper, makeStyles } from '@material-ui/core';

import { SocketContext } from 'features/video-call/contexts/SocketContext';
import useSignLanguage from '../../hooks/useSignLanguage';
import SubtitleDisplay from '../SubtitleDisplay';

const useStyles = makeStyles((theme) => ({
  video: {
    width: '550px',
    [theme.breakpoints.down('xs')]: {
      width: '300px',
    },
  },
  gridContainer: {
    justifyContent: 'center',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
  },
  paper: {
    padding: '10px',
    border: 'none',
    margin: '10px',
    position: 'relative',
    borderRadius: '15px',
    background: 'rgba(255, 255, 255, 0.9)',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
  },
}));

const VideoPlayer = ({ signLanguageEnabled = true, subtitleEnabled = true, wsUrl = null }) => {
  const { name, callAccepted, myVideo, userVideo, callEnded, stream, call, partnerName, mySubtitles, partnerSubtitles, setMySubtitles } = useContext(SocketContext);
  const classes = useStyles();
  // Kết nối AI, cập nhật phụ đề của chính mình và gửi cho partner
  useSignLanguage(myVideo, setMySubtitles, signLanguageEnabled, wsUrl);

  // console.log('VideoPlayer render - stream:', stream, 'myVideo ref:', myVideo);

  return (
    <Grid container className={classes.gridContainer}>
      <Paper elevation={0} className={classes.paper}>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom>{name || 'Bạn'}</Typography>
          <video playsInline muted ref={myVideo} autoPlay className={classes.video} />
          {/* Phụ đề cho chính mình – bật/tắt theo switch */}
          <SubtitleDisplay text={mySubtitles} enabled={subtitleEnabled} />
        </Grid>
      </Paper>
      {callAccepted && !callEnded && (
        <Paper elevation={0} className={classes.paper}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>{partnerName || call.name || 'Người tham gia'}</Typography>
            <video playsInline ref={userVideo} autoPlay className={classes.video} />
            {/* Luôn hiển thị phụ đề đối tác để mình đọc */}
            <SubtitleDisplay text={partnerSubtitles} enabled={true} />
          </Grid>
        </Paper>
      )}
    </Grid>
  );
};

export default VideoPlayer; 