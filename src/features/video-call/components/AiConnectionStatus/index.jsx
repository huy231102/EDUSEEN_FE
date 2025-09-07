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

const AiConnectionStatus = () => {
  const classes = useStyles();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Xác định URL WebSocket AI – logic giống hook useSignLanguage
    const proto = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const host = process.env.REACT_APP_AI_HOST || window.location.hostname;
    const port = process.env.REACT_APP_AI_PORT || '8001';
    const path = process.env.REACT_APP_AI_SERVER_URL || `${proto}://${host}:${port}/ws/translate`;

    const ws = new WebSocket(path);
    ws.onopen = () => setIsConnected(true);
    ws.onclose = () => setIsConnected(false);
    ws.onerror = () => setIsConnected(false);

    return () => {
      ws.close();
    };
  }, []);

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
