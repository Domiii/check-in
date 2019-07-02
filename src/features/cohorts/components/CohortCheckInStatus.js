import maxBy from 'lodash/maxBy';

import React, { Component, useState, useCallback, useMemo } from 'react';

import { ListGroup, ListGroupItem, Button } from 'reactstrap';
import { withStyles } from '@material-ui/core';
import Flex from 'flexbox-react';
import Moment from 'react-moment';


import connect from 'connect';
import renderLoadingIfNotLoaded from 'components/renderLoadingIfNotLoaded';
import NoCohortNotification from './NoCohortNotification';

import CurrentUser from 'api/CurrentUser';
import Cohorts from '../api/Cohorts';
import CohortCheckIns from '../api/CohortCheckIns';

const styles = {
};

const CheckInButton = withStyles(styles)(
  connect(CohortCheckIns)(
    (
      { uid, cohortId, className,
        cohortCheckIns, classes: s, ...otherProps }
    ) => {
      const [busy, setBusy] = useState(false);

      //const checkIns = cohortCheckIns.checkInsOfUser(uid, cohortId, 3);
      const lastCheckIn = cohortCheckIns.getLastCheckIn(uid, cohortId);
      const lastCheckInTime = lastCheckIn && lastCheckIn.when.toDate();

      const readyToCheckIn = cohortCheckIns.canCheckInAgain(lastCheckInTime);

      const checkIn = useCallback(async () => {
        setBusy(true);
        try {
          if (readyToCheckIn) {
            await cohortCheckIns.checkIn(uid, cohortId);
          }
          else if (lastCheckIn) {
            if (cohortCheckIns.shouldNotDeleteCheckIn(lastCheckInTime)) {
              if (!window.confirm('Are you sure, you want to undo past check-in?')) {
                return;
              }
            }
            await cohortCheckIns.deleteCheckIn(lastCheckIn && lastCheckIn.checkInId);
          }
        }
        finally {
          setBusy(false);
        }
      }, [cohortCheckIns, uid, cohortId, lastCheckIn, readyToCheckIn, lastCheckInTime]);


      const btnText = readyToCheckIn && 'Check in!' || 'Checked in 🥳🥳🥳';
      const btnColor = readyToCheckIn && 'primary' || 'success';

      return (
        <Button className="trans-2" disabled={busy} color={btnColor} onClick={checkIn}>
          {btnText}
        </Button>
      );
    }
  )
);

let CohortCheckInStatus = (
  { canWrite, uid, cohortId, className,
    cohortCheckIns, classes: s, ...otherProps }
) => {
  const lastCheckIn = cohortCheckIns.getLastCheckIn(uid, cohortId);
  const lastCheckInTime = lastCheckIn && lastCheckIn.when.toDate();

  return (
    <Flex className={className}
      flexDirection="row" alignItems="center"
      {...otherProps}>
      {canWrite && <>
        <Flex>
          <CheckInButton uid={uid} cohortId={cohortId} />
        </Flex>
        <Flex className="width-1" />
      </>}
      {lastCheckInTime && <Flex className="gray">
        <Moment format="lll">{lastCheckInTime}</Moment>
      </Flex>}
    </Flex>
  );
}



CohortCheckInStatus = withStyles(styles)(
  connect(CohortCheckIns)(
    CohortCheckInStatus
  )
);

export default CohortCheckInStatus;