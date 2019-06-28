import React, { Component } from 'react';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { Link } from 'react-router-dom';

import renderLoadingIfNotLoaded from 'components/renderLoadingIfNotLoaded';

import connect from 'connect';

import Cohorts from '../api/Cohorts';
import CohortUsersTable from './CohortUsersTable';

@connect(Cohorts)
class CohortBreadCrumbs extends Component {
  render() {
    const { cohorts, cohortId } = this.props;
    const name = cohorts.getCohortName(cohortId);

    return (<div>
      <Breadcrumb>
        <BreadcrumbItem><Link to="/cohorts">Cohorts</Link></BreadcrumbItem>
        <BreadcrumbItem active>{name}</BreadcrumbItem>
      </Breadcrumb>
    </div>);
  }
}

@connect(Cohorts)
class CohortPanel extends Component {
  state = {}
  render() {
    const { cohortId, cohorts } = this.props;

    const cohort = cohorts.getCohort(cohortId);
    const loading = renderLoadingIfNotLoaded(cohort);
    if (loading) return loading;
    
    return (<div className="full-width">
        <CohortBreadCrumbs cohortId={cohortId} />
        <CohortUsersTable cohortId={cohortId} />
    </div>);
  }
}

export default CohortPanel;