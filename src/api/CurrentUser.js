import Firebase from 'firebase/app';
import db from './db';
import RoleId, { hasRole } from './roles';
import auth, { onAuthStateChanged } from './auth';

import ContainerEx from 'unstated-ext/ContainerEx';

function selectPrivate(data) {
  const {
    email
  } = data;
  return {
    email
  };
}
function selectPublic(data) {
  const {
    displayName,
    photoURL,
    // role,
    // displayRole
  } = data;
  return {
    displayName,
    photoURL,
    // role: role || null,
    // displayRole: displayRole || null
  };
}

function needsUpdate(snap, current, sel) {
  //return !snap.exists || !isEqual(priv, sel(snapData));
  return !snap.exists;
}

export default class CurrentUser extends ContainerEx {
  static n = 'currentUser';
  state = {
    ...auth.currentUser,
    setDisplayRole: displayRole => {
      if (!(displayRole <= this.state.role)) {
        return;
      }
      db.collection('users').doc(this.state.uid).update({
        displayRole
      });
    },
    
    hasRole: (role) => {
      return hasRole(this.state, role);
    },

    isAdmin: () => {
      return this.state.hasRole(RoleId.Admin);
    }
  };

  _onUser = user => {
    if (user) {
      db.collection('usersPrivate').doc(user.uid).onSnapshot(snap => {
        const priv = selectPrivate(user);
        const snapData = snap.data() || {};
        if (needsUpdate(snap, priv, selectPrivate)) {
          // update private user data
          const obj = priv;
          obj.updatedAt = Firebase.firestore.Timestamp.fromDate(new Date());
          if (!snap.exists) {
            obj.createdAt = Firebase.firestore.Timestamp.fromDate(new Date());
          }
          db.collection('usersPrivate').doc(user.uid).set(obj, {merge: true});
        }
        console.log('privateLoaded');
        this.setState({privateLoaded: true});
        this.setState(snapData);
      });

      db.collection('users').doc(user.uid).onSnapshot(snap => {
        const pub = selectPublic(user);
        const snapData = snap.data() || {};
        if (needsUpdate(snap, pub, selectPublic)) {
          // update public user data
          //debugger;
          const obj = pub;
          obj.updatedAt = Firebase.firestore.Timestamp.fromDate(new Date());
          if (!snap.exists) {
            obj.createdAt = Firebase.firestore.Timestamp.fromDate(new Date());
          }
          db.collection('users').doc(user.uid).set(obj, {merge: true});
        }
        if (!snapData.displayRole) {
          snapData.displayRole = RoleId.Guest;
        }
        //console.log('publicLoaded');
        this.setState({ publicLoaded: true });
        this.setState(snapData);
      });
    }
  };

  constructor() {
    super();

    this.state.isLoaded = () => {
      //console.log('get isLoaded');
      return this.state.privateLoaded && this.state.publicLoaded;
    };

    //console.log('CurrentUser', this.state);
    onAuthStateChanged(user => {
      this._onUser(user);
      //console.log('onAuthStateChanged CurrentUser', user);
      if (user) {
        this.setState(user);
      }
    });
  }
}