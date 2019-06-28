import React, { Component } from 'react';

import { Card, CardHeader, CardBody, Collapse, Button } from 'reactstrap';

import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import CohortTable from './CohortTable';
import connect from 'connect';
import CurrentUser from 'api/state/CurrentUser';
import Cohorts from '../api/Cohorts';

const cardStyle = {
  marginBottom: '1rem'
};

@connect(Cohorts)
class AddCohortButton extends Component {
  onClick = evt => {
    const name = window.prompt('Please enter new Cohort\'s name');

    if (name) {
      const { cohorts } = this.props;
      cohorts.addCohort(name);
    }
  }

  render() {
    return (
      <Button color="success" onClick={this.onClick}>
        Add new Cohort <FontAwesomeIcon icon={faPlus} />
      </Button>
    );
  }
}

class CohortsAdminPanel extends Component {
  state = { collapse: 1 };
  
  toggle = (e) => {
    let event = e.target.dataset.event;
    const collapse = this.state.collapse === Number(event) ? 0 : Number(event);
    this.setState({ collapse });
  }

  render() {
    const { collapse } = this.state;
    const key = 1;
    return (<Card style={cardStyle} key={key}>
      <CardHeader onClick={this.toggle} data-event={key}>Cohorts Admin</CardHeader>
      <Collapse isOpen={collapse === key}>
        <CardBody>
          <CohortTable admin={true} />
          <AddCohortButton />
        </CardBody>
      </Collapse>
    </Card>);
  }
}

export default CohortsAdminPanel;