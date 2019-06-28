import map from 'lodash/map';
import isFunction from 'lodash/isFunction';

import React, { Component } from 'react';

import connect from 'connect';

import Schedules from 'features/schedules/api/Schedules';

import BootstrapTable from 'react-bootstrap-table-next';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import { Button, Badge } from 'reactstrap';

import renderLoadingIfNotLoaded from '../../../components/renderLoadingIfNotLoaded';
import CurrentUser from '../../../api/state/CurrentUser';


@connect(Schedules)
class ScheduleNameCell extends Component {
  render() {
    const { schedules, scheduleId, admin } = this.props;
    const name = schedules.getScheduleName(scheduleId);
    const to = {
      pathname: '/schedule/' + scheduleId,
      search: admin && 'admin=1' || '' 
    };

    return (<Link to={to}>{name}</Link>);
  }
}



@connect(Schedules, CurrentUser)
class ScheduleCodeCell extends Component {
  render() {
    const { schedules, currentUser, scheduleId, admin } = this.props;
    const schedule = schedules.getSchedule(scheduleId);

    let loading = renderLoadingIfNotLoaded(schedule);
    if (loading) return loading;

    let { code, codeExpiresAt } = schedule;

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
      <Badge color="success">{code}</Badge> :
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
    text: 'Schedule',
    sort: true,
    classes: columnClasses,
    formatter: (cell, {scheduleId, admin}, rowIndex) => 
      <ScheduleNameCell scheduleId={scheduleId} admin={admin} />
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
    formatter: (code, { scheduleId, admin }) => {
      return <ScheduleCodeCell scheduleId={scheduleId} admin={admin} />
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

@connect(Schedules, CurrentUser)
class ScheduleTimeTable extends Component {
  render() {
    let { schedules, currentUser, scheduleId, admin } = this.props;

    // load times
    const rows = schedules.scheduleTimes(scheduleId);
    let loading = renderLoadingIfNotLoaded(rows, { centered: true });
    if (loading) return loading;

    rows.forEach(c => {
      
      c.admin = admin && currentUser.hasRole('Admin');
    });

    return (<BootstrapTable
      keyField="id"
      data={rows}
      {...defaultProps}
    />);
  }
}

export default ScheduleTimeTable;