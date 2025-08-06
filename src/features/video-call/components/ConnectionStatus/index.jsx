import React, { useContext } from 'react';
import { Button, Typography, makeStyles, Chip } from '@material-ui/core';
import { Wifi, WifiOff, Refresh } from '@material-ui/icons';

import { SocketContext } from 'features/video-call/contexts/SocketContext';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(2),
    padding: theme.spacing(1),
    borderRadius: theme.spacing(1),
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  statusText: {
    marginLeft: theme.spacing(1),
  },
  connectButton: {
    backgroundColor: '#4caf50',
    color: 'white',
    '&:hover': {
      backgroundColor: '#45a049',
    },
  },
  disconnectButton: {
    backgroundColor: '#f44336',
    color: 'white',
    '&:hover': {
      backgroundColor: '#da190b',
    },
  },
}));

const ConnectionStatus = () => {
  const { isSocketConnected, initializeSocket, cleanupSocket } = useContext(SocketContext);
  const classes = useStyles();

  const handleConnect = () => {
    initializeSocket();
  };

  const handleDisconnect = () => {
    cleanupSocket();
  };

  return (
    <div className={classes.container}>
      {isSocketConnected ? (
        <>
          <Wifi color="primary" />
          <Typography variant="body2" className={classes.statusText}>
            Đã kết nối với máy chủ
          </Typography>
          <Chip 
            label="Online" 
            color="primary" 
            size="small" 
            variant="outlined"
          />
          <Button
            variant="contained"
            size="small"
            className={classes.disconnectButton}
            onClick={handleDisconnect}
            startIcon={<WifiOff />}
          >
            Ngắt kết nối
          </Button>
        </>
      ) : (
        <>
          <WifiOff color="error" />
          <Typography variant="body2" className={classes.statusText}>
            Chưa kết nối với máy chủ
          </Typography>
          <Chip 
            label="Offline" 
            color="secondary" 
            size="small" 
            variant="outlined"
          />
          <Button
            variant="contained"
            size="small"
            className={classes.connectButton}
            onClick={handleConnect}
            startIcon={<Refresh />}
          >
            Kết nối
          </Button>
        </>
      )}
    </div>
  );
};

export default ConnectionStatus; 