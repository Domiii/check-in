import zipObject from 'lodash/zipObject';
import NotLoaded from 'NotLoaded';

import FirestoreContainer from 'unstated-ext/FirestoreContainer';

const EmptyArray = Object.freeze([]);

class Users extends FirestoreContainer {
  static n = 'users';

  get values() {
    return {
      all: {
        ref: this.collection,
        map: snap => {
          const uids = snap.docs.map(d => d.id);
          const list = snap.docs.map(d =>
            Object.assign({ uid: d.id }, d.data())
          );
          return {
            list,
            byUid: zipObject(uids, list)
          };
        }
      }
    }
  }

  get queries() {
    return {
      userById: {
        query: this.doc,
        map: snap => snap.data()
      }
    };
  }

  get selectors() {
    return {
      getUser(uid) {
        const user = this.userById(uid);
        if (user === NotLoaded) {
          return NotLoaded;
        }
        return user;
      },
      getUserName(uid) {
        const user = this.userById(uid);
        if (user === NotLoaded) {
          return NotLoaded;
        }
        return user.displayName;
      },
      getUsersOfIds(uids) {
        uids = uids || EmptyArray;

        let users = uids.map(uid => this.getUser(uid));
        if (users.some(user => user === NotLoaded)) {
          // not done yet
          return NotLoaded;
        }

        return users.map((user, i) => (
          { uid: uids[i], ...user }
        ));
      }
    };
  }

  get actions() {
    return {
      async setRole(uid, role) {
        return this.doc(uid).update({
          role,
          displayRole: role
        });
      }
    };
  }
}

export default Users;