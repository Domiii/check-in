import React, { Component } from 'react';

import CohortPanel from './CohortPanel';
import CohortsPanel from './CohortsPanel';
import CohortTable from './CohortTable';
import connect from 'connect';
import CurrentUser from 'api/state/CurrentUser';

//@connect(CurrentUser)
class CohortPage extends Component {
  state = {}
  render() {
    const { match: { params: { cohortId } } } = this.props;

    // TODO: check if you are in this cohort

    if (cohortId) {
      return <CohortPanel cohortId={cohortId} />;
    }
    else {
      return (<CohortsPanel />);
    }
  }
}

export default CohortPage;