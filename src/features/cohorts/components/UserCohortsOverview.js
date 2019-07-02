import zipObject from 'lodash/zipObject';
import mapValues from 'lodash/mapValues';
import maxBy from 'lodash/maxBy';

import React, { Component, useState, useCallback, useMemo } from 'react';

import { ListGroup, ListGroupItem, Button } from 'reactstrap';
import { withStyles } from '@material-ui/core';
import Flex from 'flexbox-react';
import Moment from 'react-moment';


import connect from 'connect';
import renderLoadingIfNotLoaded from 'components/renderLoadingIfNotLoaded';
import NoCohortNotification from './NoCohortNotification';
import CohortCheckInStatus from './CohortCheckInStatus';

import CurrentUser from 'api/CurrentUser';
import Cohorts from '../api/Cohorts';
import CohortCheckIns from '../api/CohortCheckIns';

const styles = {
  row: {
    '&:hover': {
      background: "lightyellow",
    }
  }
};

const CohortRow = withStyles(styles)(
  connect(Cohorts, CohortCheckIns)(
    function CohortRow({ uid, cohortId, cohorts, classes: s }) {
      const cohort = cohorts.getCohort(cohortId);

      const loading = renderLoadingIfNotLoaded(cohort, {centered: true});
      if (loading) return loading;

      return (
        <ListGroupItem className={s.row} tag="div">
          <Flex className="full-width" flexDirection="row" alignItems="center">
            <Flex>
              <h4>{cohort.name}</h4> <div className="width-2" />
            </Flex>
            <CohortCheckInStatus 
              canWrite={true} uid={uid} cohortId={cohortId}
              flexDirection="row" justifyContent="flex-end" 
              alignItems="center" flexGrow={1}/>
          </Flex>
        </ListGroupItem>
      );
    }
  )
)

@connect(CurrentUser, Cohorts, CohortCheckIns)
class UserCohortList extends Component {
  render() {
    const { uid, cohorts, cohortCheckIns } = this.props;

    // load cohort ids, then the actual cohorts
    const ids = cohorts.getCohortIdsOfUser(uid);
    const [cohortList, cohortUserEntries, checkIns] = !ids && [] || [
      cohorts.getCohortsOfIds(ids),
      cohorts.getAllCohortUserEntries(uid, ids),
      cohortCheckIns.getAllUserCheckIns(uid, ids)
    ];

    let loading = renderLoadingIfNotLoaded(
      cohortList && cohortUserEntries && checkIns || undefined, 
      { centered: true }
    );
    if (loading) return loading;

    // not in any cohort
    if (!cohortList || !cohortList.length) {
      return (<NoCohortNotification />);
    }

    // dirty: do some data manipulation and sorting here

    // create dictionaries from the given arrays
    const checkInsByCohort = zipObject(ids, ids
      .map(id => checkIns.find(list => list.length > 0 && list[0].cohortId === id)));
    //const cohortsById = zipObject(ids, ids.map(id => cohortList.find(c => c.cohortId === id)));
    const userEntriesByCohort = zipObject(ids, 
      ids.map(id => cohortUserEntries.find(c => c.cohortId === id))
    );


    // get most recent check-in dates of each of my cohorts.
    // If no check-in yet, get time when user joined cohort.
    // stored as dictionary by cohortId
    const mostRecent = mapValues(checkInsByCohort, (list, cohortId) =>
      list &&
      Math.max(...list.map(checkIn => (
        checkIn.when.toDate()
      ).getTime())) ||
      userEntriesByCohort[cohortId].createdAt.toDate().getTime()
    );

    // console.log(mapValues(mostRecent, (ticks, cohortId) => cohortsById[cohortId].name + ', ' + new Date(ticks).toLocaleTimeString()));
    // console.log(checkInsByCohort);

    // sort by most recent check in date
    ids.sort((a, b) => mostRecent[b] - mostRecent[a]);

    // list cohorts
    return (<ListGroup>
      {ids.map(cohortId => {
        return <CohortRow key={cohortId} uid={uid} cohortId={cohortId}/>
      })}
    </ListGroup>);
  }
}

class UserCohortsOverview extends Component {
  state = {};

  render() {
    const { uid } = this.props;
    return (<>
      <h2>My List</h2>
      <UserCohortList uid={uid} />
    </>);
  }
}

export default UserCohortsOverview;