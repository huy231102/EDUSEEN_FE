import React from 'react';
import { Typography, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  subtitlePaper: {
    position: 'absolute',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    color: 'white',
    padding: '5px 15px',
    borderRadius: '10px',
    zIndex: 100,
    maxWidth: '80%',
    textAlign: 'center',
  },
}));

const SubtitleDisplay = ({ text, enabled = true }) => {
  const classes = useStyles();

  // Ẩn phụ đề khi tắt chức năng hoặc khi không có nội dung
  if (!enabled || !text) {
    return null;
  }

  return (
    <Paper className={classes.subtitlePaper}>
      <Typography variant="h6">{text}</Typography>
    </Paper>
  );
};

export default SubtitleDisplay; 