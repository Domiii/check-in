import React, { Component } from 'react';

import { ListGroup, ListGroupItem } from 'reactstrap';
import { withStyles } from '@material-ui/core';

import Flex from 'flexbox-react';

import connect from 'connect';

import renderLoadingIfNotLoaded from 'components/renderLoadingIfNotLoaded';
import NoCohortNotification from './NoCohortNotification';

import CurrentUser from 'api/CurrentUser';
import Cohorts from '../api/Cohorts';

const styles = {
  row: {
    '&:hover': {
      background: "lightyellow",
    }
  }
};

@withStyles(styles)
class CohortRow extends Component {
  state = {};

  render() {
    const { cohort, classes: s } = this.props;

    return (
      <ListGroupItem className={s.row} tag="div">
        <Flex className="full-width" flexDirection="row">
          <Flex>
            <h3>{cohort.name}</h3> <div className="width-2" />
          </Flex>
          <Flex className="full-width" flexDirection="row" justifyContent="space-between">
            <Flex>1</Flex>
            <Flex>2</Flex>
          </Flex>
        </Flex>
      </ListGroupItem>
    );
  }
}

@connect(CurrentUser, Cohorts)
class MyCohortList extends Component {
  render() {
    const { currentUser, cohorts } = this.props;

    // load cohort ids, then the actual cohorts
    const ids = cohorts.getMyCohortIds();
    const cohortList = ids && cohorts.getCohortsOfIds(ids);

    // TODO: get check ins and sort by last check in date

    let loading = renderLoadingIfNotLoaded(cohortList, { centered: true });
    if (loading) return loading;

    // not in any cohort
    if (!cohortList || !cohortList.length) {
      return (<NoCohortNotification />);
    }

    // list cohorts
    return (<ListGroup>
      { cohortList.map(cohort => <CohortRow cohort={cohort} />) }
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