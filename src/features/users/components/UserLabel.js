import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from 'reactstrap';
import Users from 'features/users/api/Users';

import connect from 'connect';
import renderLoadingIfNotLoaded from 'components/renderLoadingIfNotLoaded';
import UserName from './UserName';
import UserIcon from './UserIcon';

@connect(Users)
class UserLabel extends Component {
  render() {
    const { users, uid, iconSize, iconProps, nameProps, ...otherProps } = this.props;

    otherProps.color = otherProps.color || 'primary';

    const user = users.getUser(uid);
    const loading = renderLoadingIfNotLoaded(user);
    if (loading) {
      return (<Badge {...otherProps}>{loading}</Badge>);
    }

    const icon = <UserIcon uid={uid} iconSize={iconSize} {...iconProps} />;
    const name = <UserName uid={uid} {...nameProps} />;
    return (<Badge {...otherProps}>
      {icon} {name}
    </Badge>);
  }
}

export default UserLabel;