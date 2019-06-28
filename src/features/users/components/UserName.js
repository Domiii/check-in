import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Users from '../api/Users';

import connect from 'connect';
import renderLoadingIfNotLoaded from 'components/renderLoadingIfNotLoaded';

@connect(Users)
class UserName extends Component {
  render() {
    const { users, uid } = this.props;
    const name = users.getUserName(uid);

    const loading = renderLoadingIfNotLoaded(name);
    if (loading) { return loading; }

    return name;
  }
}

export default UserName;