import React, { Component } from 'react';

import { Redirect } from 'react-router-dom';

import CohortView from './CohortView';
import CohortsPanel from './CohortsPanel';
import CohortTable from './CohortTable';
import connect from 'connect';
import CurrentUser from 'api/CurrentUser';

import { getQueryString } from 'src/util/urlUtil';

@connect(CurrentUser)
class CohortPage extends Component {
  state = {}
  render() {
    const { currentUser, match: { params: { cohortId } } } = this.props;

    const admin = getQueryString('admin');

    // TODO: check if you are in this cohort

    if (cohortId) {
      return <CohortView admin={admin && currentUser.isAdmin()} cohortId={cohortId} />;
    }
    else {
      return (<Redirect to="/cohorts" />);
    }
  }
}

export default CohortPage;