import isString from 'lodash/isString';

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Users from 'features/users/api/Users';

import connect from 'connect';
import renderLoadingIfNotLoaded from 'components/renderLoadingIfNotLoaded';
import { withStyles } from '@material-ui/core';

const styles = {
  icon: {
    borderRadius: '50%',
    maxWidth: '2rem',
    maxHeight: '2rem'
  }
};


@withStyles(styles)
@connect(Users)
class UserIcon extends Component {
  render() {
    const s = this.props.classes;
    let { users, uid, size } = this.props;

    const user = users.getUser(uid);
    const loading = renderLoadingIfNotLoaded(user);
    if (loading) { return loading; }

    const { photoURL } = user;

    let { customStyles } = this;
    if (!customStyles || (size && parseFloat(size) !== parseFloat(customStyles.maxSize))) {
      if (size && !isString(size)) {
        size += 'rem';
      }
      customStyles = this.customStyles = {
        maxWidth: size || '2rem',
        maxHeight: size || '2rem'
      };
    }

    const icon = <img src={photoURL} style={customStyles} className={s.icon} alt=" " />;
    return (<Link to={'/users/' + uid}>{icon}</Link>);
  }
}

export default UserIcon;