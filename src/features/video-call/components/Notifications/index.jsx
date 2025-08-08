import React, { useContext } from 'react';
import { Button, Typography, makeStyles } from '@material-ui/core';

import { SocketContext } from 'features/video-call/contexts/SocketContext';

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
}));

const Notifications = () => {
  const { answerCall, call, callAccepted, isSocketConnected, initializeSocket } = useContext(SocketContext);
  const classes = useStyles();

  const handleAnswerCall = () => {
    // Khởi tạo socket connection nếu chưa có
    if (!isSocketConnected) {
      initializeSocket();
    }
    answerCall();
  };

  return (
    <>
      {call.isReceivingCall && !callAccepted && (
        <div className={classes.container}>
          <Typography variant="h6">{call.name} đang gọi:</Typography>
          <Button variant="contained" color="primary" onClick={handleAnswerCall}>
            Trả lời
          </Button>
        </div>
      )}
    </>
  );
};

export default Notifications; 