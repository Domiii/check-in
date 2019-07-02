import React, { Component } from 'react';

import connect from 'connect';

import Cohorts from 'features/cohorts/api/Cohorts';
import CohortCheckIns from 'features/cohorts/api/CohortCheckIns';
import Users from 'features/users/api/Users';

import BootstrapTable from 'react-bootstrap-table-next';
import Moment from 'react-moment';
import Flex from 'flexbox-react';
import { Button } from 'reactstrap';

import { getQueryString } from 'src/util/urlUtil';

import renderLoadingIfNotLoaded from '../../../components/renderLoadingIfNotLoaded';
import UserLabel from '../../users/components/UserLabel';
import CurrentUser from '../../../api/CurrentUser';
import CohortCheckInStatus from './CohortCheckInStatus';

@connect(Cohorts)
class LeaveCohortButton extends Component {
  state = {};

  onClick = async () => {
    const { uid, cohortId, cohorts } = this.props;
    if (window.confirm('Are you sure, you want to kick this user? (cannot UNDO)')) {
      this.setState({busy: true});
      const result = await cohorts.removeUserFromCohort(uid, cohortId);
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
    formatter: (cell, { uid, cohortId, admin, selected }) => (
      <Flex className="full-width" flexDirection="row" justifyContent="space-between">
        <Flex>
          <UserLabel uid={uid} />
        </Flex>

        {admin && <Flex justifyContent="flex-end">
          <Flex>
            <LeaveCohortButton uid={uid} cohortId={cohortId} />
          </Flex>
        </Flex>}
      </Flex>
    )
  },
  {
    dataField: 'joined',
    text: 'Joined',
    sort: true,
    classes: columnClasses,
    formatter: (cell, row) => {
      const date = cell && cell.toDate();
      return (<>
        <Moment fromNow>{date}</Moment> <span className="gray">(
          <Moment format="lll">{date}</Moment>
          )</span>
      </>);
    }
  },
  {
    dataField: 'lastCheckIn',
    text: 'Last CheckIn',
    sort: true,
    classes: columnClasses,
    formatter: (cell, {uid, cohortId, admin}) => {
      return (<CohortCheckInStatus canWrite={admin} uid={uid} cohortId={cohortId} />);
    }
  }
];

const defaultSorted = [{
  dataField: 'joined',
  order: 'desc'
}];

@connect(Cohorts, CohortCheckIns, Users, CurrentUser)
class CohortUsersTable extends Component {
  render() {
    const { cohorts, cohortCheckIns, users, currentUser, cohortId } = this.props;

    // load cohort user entries
    const entries = cohorts.getUserEntriesOfCohort(cohortId);
    let loading = renderLoadingIfNotLoaded(entries, { centered: true });
    if (loading) return loading;

    // load users
    const uids = Object.keys(entries);
    let rows = users.getUsersOfIds(uids);
    const lastCheckIns = cohortCheckIns.getAllLastCheckIns(uids, cohortId);

    loading = renderLoadingIfNotLoaded(rows && lastCheckIns, { centered: true });
    if (loading) return loading;

    rows = rows.map(
      (user, i) => {
        const {
          uid,
          displayName,
          role
        } = user;
        return {
          uid,
          displayName,
          role,
          cohortId,
          joined: entries[uid].createdAt,
          lastCheckIn: lastCheckIns[i],
          admin: !!getQueryString('admin'),
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