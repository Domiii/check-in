import React, { Component } from 'react';

import connect from 'connect';
import CurrentUser from '../api/CurrentUser';
import MyCohortsOverview from '../features/cohorts/components/MyCohortsOverview';
import renderLoadingIfNotLoaded from '../components/renderLoadingIfNotLoaded';
import Loading from '../components/Loading';

@connect(CurrentUser)
class Home extends Component {
  state = {}
  render() {
    const { currentUser } = this.props;
    const { isLoaded } = currentUser;

    if (!isLoaded()) { return <Loading centered={true} />; }

    return <div className="full-width">
      <div className="space-2" />
      <MyCohortsOverview />
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