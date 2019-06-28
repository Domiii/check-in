import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import { withRouter } from 'react-router-dom';
import Moment from 'react-moment';
import connect from 'connect';
import Schedules from '../api/schedules';
import renderLoadingIfNotLoaded from '../../../components/renderLoadingIfNotLoaded';

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
    // formatter: (cell, { scheduleId, admin }, rowIndex) =>
    //   <ScheduleNameCell scheduleId={scheduleId} admin={admin} />
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
  }
];

const defaultSorted = [{
  dataField: 'createdAt',
  order: 'desc'
}];

const defaultProps = {
  bootstrap4: true,
  columns,
  defaultSorted,
  rowEvents: {
    onClick: (e, { scheduleId, onClick }) => {
      e.preventDefault();
      onClick(scheduleId);
    }
  }
};

@connect(Schedules)
@withRouter()
class ScheduleTable extends Component {
  state = {}
  
  onClickRow = scheduleId => {
    const { history } = this.props;
    history.push(`/admin/schedules/${scheduleId}`);
  }

  render() {
    const { schedules } = this.props;
    const { schedulesArray } = schedules;

    const loading = renderLoadingIfNotLoaded(schedulesArray, { centered: true })
    if (loading) return loading;

    const rows = schedulesArray.map(schedule => ({
      ...schedule,
      onClick: this.onClickRow
    }));

    return (<BootstrapTable
      keyfield="scheduleId"
      data={rows}
      {...defaultProps}
    />);
  }
}

export default ScheduleTable;