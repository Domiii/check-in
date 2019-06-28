import React, { Component } from 'react';

import connect from 'connect';
import CurrentUser from '../api/state/CurrentUser';
import NoCohortNotification from '../features/cohorts/components/NoCohortNotification';
import renderLoadingIfNotLoaded from '../components/renderLoadingIfNotLoaded';
import Loading from '../components/Loading';

@connect(CurrentUser)
class Home extends Component {
  state = {}
  render() {
    const { currentUser } = this.props;
    const { cohortId, isLoaded } = currentUser;

    if (!isLoaded()) { return <Loading centered={true} />; }

    const cohortEl = cohortId ?
      'hi' :
      (<NoCohortNotification />);

    return <div className="full-width">
      <div className="space-2" />
      {cohortEl}
    </div>
  }
}

export default Home;

// export default function Home() {
//   return (<div>
//     hi!

//     test

//     TODO: show current cohort info or "Join Cohort" button?
//   </div>);
// }