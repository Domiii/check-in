import map from 'lodash/map';
import isFunction from 'lodash/isFunction';

import React, { Component } from 'react';

import connect from 'connect';

import Cohorts from 'features/cohorts/api/Cohorts';

import BootstrapTable from 'react-bootstrap-table-next';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import { Button, Badge } from 'reactstrap';

import renderLoadingIfNotLoaded from '../../../components/renderLoadingIfNotLoaded';
import CurrentUser from '../../../api/state/CurrentUser';


@connect(Cohorts)
class CohortNameCell extends Component {
  render() {
    const { cohorts, cohortId, admin } = this.props;
    const name = cohorts.getCohortName(cohortId);
    const to = {
      pathname: '/cohort/' + cohortId,
      search: admin && 'admin=1' || '' 
    };

    return (<Link to={to}>{name}</Link>);
  }
}


@connect(Cohorts, CurrentUser)
class CohortCodeCell extends Component {
  newCode = () => {
    const { cohorts, cohortId } = this.props;
    cohorts.newCode(cohortId);
  }
  removeCode = () => {
    const { cohorts, cohortId } = this.props;
    if (window.confirm('Are you sure, you want to disable sign up for this Cohort?')) {
      cohorts.removeCode(cohortId);
    }
  }
  render() {
    const { cohorts, currentUser, cohortId, admin } = this.props;
    const cohort = cohorts.getCohort(cohortId);

    let loading = renderLoadingIfNotLoaded(cohort);
    if (loading) return loading;

    let { code, codeExpiresAt } = cohort;

    const expireDate = codeExpiresAt && codeExpiresAt.toDate();

    if (!expireDate || expireDate < new Date()) {
      // time's up!
      code = null;
    }

    let btn;
    if (admin) {
      btn = code ?
        <Button color="danger" onClick={this.removeCode}>X</Button> :
        <Button color="success" onClick={this.newCode}>New</Button>;
    }

    const expireEl = code && (<>
      <span className="gray" >(<Moment fromNow ago>{expireDate}</Moment>)
      </span>
    </>);
    
    const codeEl = code ?
      <h4 className="inline-block"><Badge color="success">{code}</Badge></h4> :
      <Badge color="secondary">(sign up disabled)</Badge>;


    return (<>
      {codeEl} {expireEl} {btn}
    </>);
  }
}

function columnClasses(cell, row, rowIndex, colIndex) {
  if (row.selected) {
    return 'bg-lightyellow';
  }
  return '';
}

const columns = [
  {
    dataField: 'id',
    hidden: true
  }, {
    dataField: 'name',
    text: 'Cohort',
    sort: true,
    classes: columnClasses,
    formatter: (cell, {cohortId, admin}, rowIndex) => 
      <CohortNameCell cohortId={cohortId} admin={admin} />
  }, {
    dataField: 'userCount',
    text: 'Users',
    sort: true,
    classes: columnClasses
  }, {
    dataField: 'createdAt',
    text: 'Created',
    sort: true,
    classes: columnClasses,
    formatter: (createdAt) => {
      const date = createdAt && createdAt.toDate();
      return (<>
        <Moment fromNow>{date}</Moment> <span className="gray">(
          <Moment format="lll">{date}</Moment>
        )</span>
      </>);
    }
  }, {
    dataField: 'code',
    text: 'Code',
    sort: true,
    classes: columnClasses,
    sortFunc: (a, b, order) => {
      if (order === 'asc') return !!a - !!b;
      else return !!b - !!a;
    },
    formatter: (code, { cohortId, admin }) => {
      return <CohortCodeCell cohortId={cohortId} admin={admin} />
    }
  }
];

const defaultSorted = [{
  dataField: 'createdAt',
  order: 'desc'
}];

const defaultProps = {
  bootstrap4: true,
  columns,
  defaultSorted
};

@connect(Cohorts, CurrentUser)
class CohortTable extends Component {
  render() {
    let { cohorts, currentUser, selector, admin } = this.props;
    selector = selector || 'getAllCohortIds';
    const getter = cohorts[selector];
    if (!getter) {
      const valid = map(cohorts, (_, key) => key).filter(k => isFunction(cohorts[k]));
      throw new Error(`invalid selector "${selector}" does not exist - valid: ${valid.join(',')}`);
    }

    // load ids
    const ids = getter();
    let loading = renderLoadingIfNotLoaded(ids, { centered: true });
    if (loading) return loading;

    // load actual cohorts
    const rows = cohorts.getCohortsOfIds(ids);
    loading = renderLoadingIfNotLoaded(rows, { centered: true });
    if (loading) return loading;

    rows.forEach(c => {
      c.selected = c.cohortId === currentUser.cohortId;
      c.admin = admin && currentUser.hasRole('Admin');
    });

    //console.warn(list);

    return (<BootstrapTable
      keyField="cohortId"
      data={rows}
      {...defaultProps}
    />);
  }
}

export default CohortTable;