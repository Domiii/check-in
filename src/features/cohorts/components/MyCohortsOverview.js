import zipObject from 'lodash/zipObject';
import mapValues from 'lodash/mapValues';
import maxBy from 'lodash/minBy';

import React, { Component } from 'react';

import { ListGroup, ListGroupItem, Button } from 'reactstrap';
import { withStyles } from '@material-ui/core';

import Flex from 'flexbox-react';

import connect from 'connect';

import renderLoadingIfNotLoaded from 'components/renderLoadingIfNotLoaded';
import NoCohortNotification from './NoCohortNotification';

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

@withStyles(styles)
@connect(CohortCheckIns, CurrentUser)
class CohortRow extends Component {
  state = {};

  checkIn = async () => {
    const { cohortCheckIns, currentUser: { uid }, cohort: { cohortId } } = this.props;

    this.setState({ busy: true });
    try {
      await cohortCheckIns.checkIn(uid, cohortId);
    }
    finally {
      this.setState({ busy: false });
    }
  }

  render() {
    const { cohort, classes: s } = this.props;
    const { busy } = this.state;

    return (
      <ListGroupItem className={s.row} tag="div">
        <Flex className="full-width" flexDirection="row" alignItems="center">
          <Flex>
            <h4>{cohort.name}</h4> <div className="width-2" />
          </Flex>
          <Flex className="full-width" flexDirection="row-reverse" alignItems="center">
            <Flex>
              <Button disabled={busy} color="success" onClick={this.checkIn}>
                Check in!
              </Button>
            </Flex>
            <Flex className="width-1" />
            <Flex>
              hi
            </Flex>
          </Flex>
        </Flex>
      </ListGroupItem>
    );
  }
}

@connect(CurrentUser, Cohorts, CohortCheckIns)
class MyCohortList extends Component {
  render() {
    const { currentUser, cohorts, cohortCheckIns } = this.props;

    const { uid } = currentUser;

    // load cohort ids, then the actual cohorts
    const ids = cohorts.getMyCohortIds();
    const [cohortList, checkIns, cohortUserEntries] = !ids && [] ||
      [cohorts.getCohortsOfIds(ids), cohortCheckIns.getAllMyCheckIns(ids), cohorts.getAllCohortEntriesOfUser(ids, uid)];

    let loading = renderLoadingIfNotLoaded(cohortList && checkIns && cohortUserEntries || undefined, { centered: true });
    if (loading) return loading;

    // not in any cohort
    if (!cohortList || !cohortList.length) {
      return (<NoCohortNotification />);
    }

    // dirty: do some data manipulation and sorting here

    // create dictionaries from the given arrays
    const checkInsByCohort = zipObject(ids, ids
      .map(id => checkIns.find(list => list.length > 0 && list[0].cohortId === id)));
    const cohortsById = zipObject(ids, ids.map(id => cohortList.find(c => c.cohortId === id)));
    const userEntriesByCohort = zipObject(ids, ids.map(id => cohortUserEntries.find(c => c.cohortId === id)));


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

    console.log(mapValues(mostRecent, (ticks, cohortId) => cohortsById[cohortId].name + ', ' + new Date(ticks).toLocaleTimeString()));
    console.log(checkInsByCohort);

    // sort by most recent check in date
    ids.sort((a, b) => mostRecent[b] - mostRecent[a]);

    // list cohorts
    return (<ListGroup>
      {ids.map(id => {
        const cohort = cohortsById[id];
        const checkIns = checkInsByCohort[id];
        return <CohortRow key={id} cohort={cohort} checkIns={checkIns} />
      })}
    </ListGroup>);
  }
}

class MyCohortsOverview extends Component {
  state = {};

  render() {
    return (<>
      <h2>My Cohorts</h2>
      <MyCohortList />
    </>);
  }
}

export default MyCohortsOverview;