import React, { useContext } from 'react';
import { Button, Typography, makeStyles } from '@material-ui/core';

import { SocketContext } from '../../contexts/SocketContext';

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
}));

const Notifications = () => {
  const { answerCall, call, callAccepted } = useContext(SocketContext);
  const classes = useStyles();

  return (
    <>
      {call.isReceivingCall && !callAccepted && (
        <div className={classes.container}>
          <Typography variant="h6">{call.name} is calling:</Typography>
          <Button variant="contained" color="primary" onClick={answerCall}>
            Answer
          </Button>
        </div>
      )}
    </>
  );
};

export default Notifications; 