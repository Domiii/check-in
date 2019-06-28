import React, { Component } from 'react';

import connect from 'connect';

import Cohorts from 'features/cohorts/api/Cohorts';
import Users from 'features/users/api/Users';

import BootstrapTable from 'react-bootstrap-table-next';
import Moment from 'react-moment';
import Flexbox from 'flexbox-react';
import { Button } from 'reactstrap';

import renderLoadingIfNotLoaded from '../../../components/renderLoadingIfNotLoaded';
import UserLabel from '../../users/components/UserLabel';
import CurrentUser from '../../../api/state/CurrentUser';

@connect(Cohorts)
class LeaveCohortButton extends Component {
  state = {};

  onClick = async () => {
    const { cohorts, cohortId, uid } = this.props;
    if (window.confirm('Are you sure, you want to kick this user? (cannot UNDO)')) {
      this.setState({busy: true});
      const result = await cohorts.removeUserFromCohort(cohortId, uid);
      //this.setState({ busy: false });
      if (!result || result.error) {
        console.error(result);
        const msg = result && result.error || 'Something went wrong';
        alert(msg + ' :(');
      }
    }
  }

  render() {
    const {busy} = this.state;
    return <Button color="danger" size="sm" disabled={busy} onClick={this.onClick}>X</Button>;
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
    dataField: 'uid',
    hidden: true
  },
  {
    dataField: 'displayName',
    text: 'User',
    sort: true,
    classes: columnClasses,
    formatter: (cell, { cohortId, uid, admin, selected }) => (
      <Flexbox className="full-width" flexDirection="row" justifyContent="space-between">
        <Flexbox>
          <UserLabel uid={uid} />
        </Flexbox>

        {admin && <Flexbox>
          <LeaveCohortButton cohortId={cohortId} uid={uid} />
        </Flexbox>}
      </Flexbox>
    )
  },
  {
    dataField: 'joined',
    text: 'Joined',
    sort: true,
    classes: columnClasses,
    formatter: (cell, row, rowIndex) => {
      const date = cell && cell.toDate();
      return (<>
        <Moment fromNow>{date}</Moment> <span className="gray">(
          <Moment format="lll">{date}</Moment>
          )</span>
      </>);
    }
  }
];

const defaultSorted = [{
  dataField: 'joined',
  order: 'desc'
}];

@connect(Cohorts, Users, CurrentUser)
class CohortUsersTable extends Component {
  render() {
    const { cohorts, users, currentUser, cohortId } = this.props;

    // load cohort user entries
    const entries = cohorts.getUserEntriesOfCohort(cohortId);
    let loading = renderLoadingIfNotLoaded(entries, { centered: true });
    if (loading) return loading;

    // load users
    const uids = Object.keys(entries);
    let rows = users.getUsersOfIds(uids);

    loading = renderLoadingIfNotLoaded(rows, { centered: true });
    if (loading) return loading;

    rows = rows.map(
      user => {
        const {
          uid,
          displayName,
          role
        } = user;
        return {
          uid,
          cohortId,
          joined: entries[uid].createdAt,
          displayName,
          role,
          admin: !!new URLSearchParams(window.location.search.substring(1)).get('admin'),
          selected: currentUser.uid === uid
        };
      });

    return (<BootstrapTable
      bootstrap4
      keyField="uid"
      data={rows}
      columns={columns}
      defaultSorted={defaultSorted}
    />);
  }
}

export default CohortUsersTable;