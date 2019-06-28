import React, { Component } from 'react';
import Moment from 'react-moment';

import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Avatar from '@material-ui/core/Avatar';

import { Button, ButtonGroup } from 'reactstrap';

import Loading from 'components/Loading';

import connect from 'connect';
import CurrentUser from 'api/CurrentUser';
import Users from 'features/users/api/Users';

import { getRoleName, hasRole, RoleId } from 'api/roles';

const styles = theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },

  ava: {
    width: 'inherit',
    height: 'inherit'
  }
});


@connect(Users, CurrentUser)
class UserPrivBtn extends Component {
  onClick = () => {
    const { currentUser, uid, users, priv } = this.props;
    if (currentUser.uid === uid) return;

    users.setRole(uid, RoleId[priv]);
  };

  render() {
    const { currentUser, uid, role, children, priv } = this.props;
    const has = hasRole(role, priv);
    return (<Button
      color={has && 'success' || 'danger'}
      active={has}
      disabled={currentUser.uid === uid}
      onClick={this.onClick}
    >{children}</Button>);
  }
}

@withStyles(styles)
@connect(Users)
class UsersList extends Component {
  onChangePrivs = (evt) => {
    console.log(evt);
  };

  render() {
    const s = this.props.classes;
    const { all } = this.props.users;

    if (!all) {
      return (<Loading centered />);
    }
    const { list } = all;
    console.log(this.props.users.all_values);

    return (
      <List className={s.root}>
        {list.map(user => (<ListItem key={user.uid}>
          <Avatar>
            <img className={s.ava} src={user.photoURL} alt="" />
          </Avatar>
          {/* <Moment date={user.createdAt.toDate()} /> */}
          <ListItemText primary={user.displayName}
            secondary={getRoleName(user.displayRole)} />
          <ListItemSecondaryAction>
            <ButtonGroup>
              <UserPrivBtn priv="Guest" {...user}>Guest</UserPrivBtn>
              <UserPrivBtn priv="User" {...user}>User</UserPrivBtn>
              <UserPrivBtn priv="Admin" {...user}>Admin</UserPrivBtn>
            </ButtonGroup>
          </ListItemSecondaryAction>
        </ListItem>))}
      </List>
    );
  }
}

export default function UserPage() {
  return (<div className="full-width">
    <UsersList />
  </div>);
}