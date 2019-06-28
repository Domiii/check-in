import React, { Component } from 'react';

import ScheduleTimeTable from './ScheduleTimeTable';

import connect from 'connect';
import Schedules from './api/Schedules';
import renderLoadingIfNotLoaded from '../../../components/renderLoadingIfNotLoaded';

@connect(Schedules)
class ScheduleAdminView extends Component {
  state = {  }
  render() { 
    const { scheduleId, schedules } = this.props;
    const schedule = schedules.scheduleById(scheduleId);
    const loading = renderLoadingIfNotLoaded(schedule, {centered: true});
    if (loading) return loading;

    return (<>
      <h2>Schedule: {schedule.name}</h2>
      <ScheduleTimeTable scheduleId={scheduleId} />
    </>);
  }
}
 
export default ScheduleAdminView;