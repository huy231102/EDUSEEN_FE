import React, { useEffect, useState } from 'react';
import { Typography, makeStyles, Chip } from '@material-ui/core';
import { CheckCircle, Cancel } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(1),
    padding: theme.spacing(1),
    borderRadius: theme.spacing(1),
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  statusText: {
    marginLeft: theme.spacing(1),
  },
}));

const AiConnectionStatus = ({ wsUrl }) => {
  const classes = useStyles();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!wsUrl) {
      setIsConnected(false);
      return; // Không cố gắng kết nối nếu không truyền wsUrl
    }

    const ws = new WebSocket(wsUrl);

    let isSubscribed = true; // Cờ theo dõi mount/unmount để tránh memory-leak

    ws.onopen = () => {
      if (isSubscribed) setIsConnected(true);
    };
    ws.onclose = () => {
      if (isSubscribed) setIsConnected(false);
    };
    ws.onerror = () => {
      if (isSubscribed) setIsConnected(false);
    };

    return () => {
      isSubscribed = false;
      ws.close();
    };
  }, [wsUrl]);

  return (
    <div className={classes.container}>
      {isConnected ? (
        <>
          <CheckCircle color="primary" />
          <Typography variant="body2" className={classes.statusText}>
            AI Server: Đã kết nối
          </Typography>
          <Chip label="Online" color="primary" size="small" variant="outlined" />
        </>
      ) : (
        <>
          <Cancel color="error" />
          <Typography variant="body2" className={classes.statusText}>
            AI Server: Chưa kết nối
          </Typography>
          <Chip label="Offline" color="secondary" size="small" variant="outlined" />
        </>
      )}
    </div>
  );
};

export default AiConnectionStatus;
