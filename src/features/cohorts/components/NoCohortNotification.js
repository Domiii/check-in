import React, { Component } from 'react';

import { Alert } from 'reactstrap';
import CohortJoinButton from './CohortJoinButton';
import Flexbox from 'flexbox-react';

class NoCohortNotification extends Component {
  state = {};

  render() {
    return (<div className="full-width">
      <Flexbox className="full-center" flexDirection="column" >
        <Flexbox>
          <CohortJoinButton />
        </Flexbox>
        <Flexbox>
          <Alert className="inline-block" color="danger">
            You are not in any cohort :(
          </Alert>
        </Flexbox>
      </Flexbox>
    </div>);
  }
}

export default NoCohortNotification;