import React, { useState, useContext } from 'react';
import { Button, TextField, Grid, Typography, Container, Paper } from '@material-ui/core';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Assignment, Phone, PhoneDisabled } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

import { SocketContext } from '../../contexts/SocketContext';

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
  const { me, callAccepted, name, setName, callEnded, leaveCall, callUser } = useContext(SocketContext);
  const [idToCall, setIdToCall] = useState('');
  const classes = useStyles();

  return (
    <Container className={classes.container}>
      <Paper elevation={0} className={classes.paper}>
        <form className={classes.root} noValidate autoComplete="off">
          <Grid container className={classes.gridContainer}>
            <Grid item xs={12} md={6} className={classes.padding}>
              <Typography gutterBottom variant="h6">Thông tin tài khoản</Typography>
              <TextField label="Tên của bạn" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
              <CopyToClipboard text={me} className={classes.margin}>
                <Button variant="contained" style={{ backgroundColor: '#1eb2a6', color: '#fff' }} fullWidth startIcon={<Assignment fontSize="large" />}>
                  Sao chép ID
                </Button>
              </CopyToClipboard>
            </Grid>
            <Grid item xs={12} md={6} className={classes.padding}>
              <Typography gutterBottom variant="h6">Thực hiện cuộc gọi</Typography>
              <TextField label="ID người nhận" value={idToCall} onChange={(e) => setIdToCall(e.target.value)} fullWidth />
              {callAccepted && !callEnded ? (
                <Button variant="contained" color="secondary" startIcon={<PhoneDisabled fontSize="large" />} fullWidth onClick={leaveCall} className={classes.margin}>
                  Kết thúc
                </Button>
              ) : (
                <Button variant="contained" style={{ backgroundColor: '#1eb2a6', color: '#fff' }} startIcon={<Phone fontSize="large" />} fullWidth onClick={() => callUser(idToCall, name)} className={classes.margin}>
                  Gọi
                </Button>
              )}
            </Grid>
          </Grid>
        </form>
        {children}
      </Paper>
    </Container>
  );
};

export default Sidebar; 