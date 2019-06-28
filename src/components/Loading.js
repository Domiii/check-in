import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

export default function Loading({centered}) {
  if (centered) {
    return (<div className="full-center full-height">
    <CircularProgress
      variant="indeterminate"
      color="secondary"
    />
    </div>);
  }
  return (<CircularProgress
    variant="indeterminate"
    color="secondary"
  />);
}