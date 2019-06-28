import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';

import CohortsAdminPanel from '../features/cohorts/components/CohortsAdminPanel';
import ScheduleAdminView from '../features/schedules/components/ScheduleAdminView';

class AdminButton extends Component {
  render() {
    const { purpose, title, selected} = this.props;
    const thisSelected = selected === purpose;
    return (
      <Button active={thisSelected} disabled={thisSelected} tag={Link} to={`/admin/${purpose}`}>
        {title}
      </Button>
    );
  }
}

//@connect(CurrentUser)
class AdminPage extends Component {
  state = {}
  render() {
    const { match: { params: { category } } } = this.props;

    let contentEl;
    switch (category) {
      case 'cohorts':
        contentEl = <CohortsAdminPanel />;
        break;
      case 'schedules':
        contentEl = <ScheduleAdminView />;
        break;
    }

    return (<div className="full-width">
      <AdminButton selected={category} purpose="cohorts" title="Cohorts" />{' '}
      <AdminButton selected={category} purpose="schedules" title="Schedules" />{' '}
      
      {contentEl && <><hr /> {contentEl}</>}
    </div>);
  }
}

export default AdminPage;