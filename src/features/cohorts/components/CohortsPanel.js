import React, { Component } from 'react';

import CohortsAdminPanel from './CohortsAdminPanel';
import CohortTable from './CohortTable';
import connect from 'connect';
import CurrentUser from 'api/state/CurrentUser';
import CohortJoinButton from './CohortJoinButton';

@connect(CurrentUser)
class CohortPage extends Component {
  state = {}
  render() {
    const { currentUser } = this.props;
    return (<div className="full-width">
      <h2>My Cohorts</h2>
      <CohortTable selector="getMyCohortIds" />
      <div>
        <CohortJoinButton />
      </div>
      {/* {currentUser.hasRole('Admin') && <>
        <hr />
        <CohortsAdminPanel />
      </>} */}
    </div>);
  }
}

export default CohortPage;