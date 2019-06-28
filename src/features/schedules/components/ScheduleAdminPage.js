import React, { Component } from 'react';

import ScheduleAdminView from './ScheduleAdminView';

class ScheduleAdminPage extends Component {
  state = {  }
  render() {
    const { match: { params: { scheduleId } } } = this.props; 
    return (<ScheduleAdminView scheduleId={scheduleId} /> );
  }
}
 
export default ScheduleAdminPage;