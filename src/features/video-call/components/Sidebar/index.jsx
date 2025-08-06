import React, { useState, useContext } from 'react';
import { Button, TextField, Grid, Typography, Container, Paper } from '@material-ui/core';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Assignment, Phone, PhoneDisabled } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

import { SocketContext } from 'features/video-call/contexts/SocketContext';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  gridContainer: {
    width: '100%',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
  },
  container: {
    width: '600px',
    margin: '35px 0',
    padding: 0,
    [theme.breakpoints.down('xs')]: {
      width: '80%',
    },
  },
  margin: {
    marginTop: 20,
  },
  padding: {
    padding: 20,
  },
  paper: {
    padding: '20px',
    border: 'none',
    borderRadius: '15px',
    background: 'rgba(255, 255, 255, 0.9)',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
  },
}));

const Sidebar = ({ children }) => {
  const { me, callAccepted, name, setName, callEnded, leaveCall, callUser, isSocketConnected, initializeSocket } = useContext(SocketContext);
  const [idToCall, setIdToCall] = useState('');
  const classes = useStyles();

  const handleCallUser = () => {
    if (!name.trim()) {
      alert('Vui lòng nhập tên của bạn trước khi gọi');
      return;
    }
    
    if (!idToCall.trim()) {
      alert('Vui lòng nhập ID người nhận');
      return;
    }

    // Khởi tạo socket connection nếu chưa có
    if (!isSocketConnected) {
      initializeSocket();
    }
    
    callUser(idToCall, name);
  };

  return (
    <Container className={classes.container}>
      <Paper elevation={0} className={classes.paper}>
        <form className={classes.root} noValidate autoComplete="off">
          <Grid container className={classes.gridContainer}>
            <Grid item xs={12} md={6} className={classes.padding}>
              <Typography gutterBottom variant="h6">
                Tên của bạn
              </Typography>
              <TextField 
                label="Tên" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                fullWidth 
              />
              {children}
            </Grid>
            <Grid item xs={12} md={6} className={classes.padding}>
              <Typography gutterBottom variant="h6">
                Gọi cho ai
              </Typography>
              <TextField 
                label="ID người nhận" 
                value={idToCall} 
                onChange={(e) => setIdToCall(e.target.value)} 
                fullWidth 
              />
              <Grid container className={classes.margin}>
                {callAccepted && !callEnded ? (
                  <Button 
                    variant="contained" 
                    color="secondary" 
                    startIcon={<PhoneDisabled />} 
                    fullWidth 
                    onClick={leaveCall} 
                    className={classes.margin}
                  >
                    Kết thúc cuộc gọi
                  </Button>
                ) : (
                  <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<Phone />} 
                    fullWidth 
                    onClick={handleCallUser} 
                    className={classes.margin}
                  >
                    Gọi
                  </Button>
                )}
              </Grid>
            </Grid>
          </Grid>
        </form>
        {me && (
          <CopyToClipboard text={me} style={{ marginTop: 20 }}>
            <Button variant="contained" color="primary" fullWidth startIcon={<Assignment />}>
              Copy ID của bạn
            </Button>
          </CopyToClipboard>
        )}
      </Paper>
    </Container>
  );
};

export default Sidebar; 