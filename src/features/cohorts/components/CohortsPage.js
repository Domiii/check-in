import React, { Component } from 'react';

import CohortView from './CohortView';
import CohortsPanel from './CohortsPanel';
import CohortTable from './CohortTable';
import connect from 'connect';
import CurrentUser from 'api/CurrentUser';

//@connect(CurrentUser)
class CohortsPage extends Component {
  state = {}
  render() {
    //const { match: { params: { mine } } } = this.props;

    // if (cohortId) {
    //   return <CohortView cohortId={cohortId} />;
    // }
    // else 
    {
      return (<CohortsPanel />);
    }
  }
}

export default CohortsPage;