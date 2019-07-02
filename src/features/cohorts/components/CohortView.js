import React, { Component } from 'react';
import { Button, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import Flex from 'flexbox-react';

import { faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import renderLoadingIfNotLoaded from 'components/renderLoadingIfNotLoaded';

import connect from 'connect';

import CurrentUser from 'api/CurrentUser';
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
class CohortEditButton extends Component {
  state = {};

  onClick = async () => {
    const { cohortId, cohorts } = this.props;
    const cohort = cohorts.getCohort(cohortId);

    try {
      this.setState({ busy: true });
      const { name: oldName } = cohort;
      const newName = window.prompt("Enter a new name", oldName);

      if (newName && newName !== oldName) {
        await cohorts.updateCohort(cohortId, {
          name: newName
        });
      }
    }
    finally {
      this.setState({ busy: false });
    }
  }

  render() {
    const { busy } = this.state;

    return (
      <Flex>
        <Button disabled={busy} onClick={this.onClick}>
          <FontAwesomeIcon icon={faPen} />
        </Button>
      </Flex>);
  }
}

@connect(Cohorts, CurrentUser)
class CohortView extends Component {
  state = {}
  render() {
    const { cohortId, cohorts, currentUser, admin } = this.props;

    const cohort = cohorts.getCohort(cohortId);
    const loading = renderLoadingIfNotLoaded(cohort && currentUser.isLoaded() || undefined);
    if (loading) return loading;

    return (<div className="full-width">
      <CohortBreadCrumbs cohortId={cohortId} />
      <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
        <Flex>
          <h2 className="d-inline">{cohort.name}</h2>
        </Flex>
        {admin && <Flex>
          <CohortEditButton cohortId={cohortId} />
        </Flex>}
      </Flex>
      <CohortUsersTable cohortId={cohortId} />
    </div>);
  }
}

export default CohortView;