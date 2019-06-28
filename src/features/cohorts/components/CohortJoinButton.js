import React, { Component } from 'react';

import { Button } from 'reactstrap';

import connect from 'connect';

import Cohorts from '../api/Cohorts';

@connect(Cohorts)
class CohortJoinButton extends Component {
  state = {}

  onClick = async evt => {
    const { cohorts } = this.props;
    this.setState({ busy: true });
    const code = window.prompt('Please enter a Cohort code');
    if (!code) {
      return;
    }
    const result = await cohorts.joinCohort(code);
    this.setState({
      busy: false,
      result
    });
    if (!result || result.error) {
      const error = result.error || 'something went wrong';
      alert(error + ' :(');
    }
  };

  render() {
    const { busy } = this.state;
    return (<Button disabled={busy}
      color="success" onClick={this.onClick}>
      Join Cohort
    </Button>);
  }
}

export default CohortJoinButton;