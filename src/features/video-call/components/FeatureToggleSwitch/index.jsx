import React from 'react';
import { FormControlLabel, Switch, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: theme.spacing(1),
    borderRadius: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

/**
 * Switch với label bên cạnh. Dùng cho các tính năng bật/tắt.
 * @param {string} label
 * @param {boolean} checked
 * @param {function} onChange
 */
const FeatureToggleSwitch = ({ label, checked, onChange }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <FormControlLabel
        control={<Switch checked={checked} onChange={onChange} color="primary" />}
        label={label}
      />
    </div>
  );
};

export default FeatureToggleSwitch;
