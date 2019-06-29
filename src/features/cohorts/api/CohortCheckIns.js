import Firebase from 'firebase/app';
import zipObject from 'lodash/zipObject';

import FirestoreContainer from "unstated-ext/FirestoreContainer";

import CurrentUser from 'api/CurrentUser';
import Users from 'features/users/api/Users';

import NotLoaded from 'unstated-ext/NotLoaded';

class CohortCheckIns extends FirestoreContainer {
  static n = 'cohortCheckIns';
  static Dependencies = [CurrentUser, Users];

  get refs() {
    return {

    };
  }

  get values() {
    return {
      all: { ref: this.collection }
    };
  }

  get queries() {
    return {
      checkInsOfUser: {
        query: (uid, cohortId, limit) => 
          this.collection
          .where('uid', '==', uid)
          .where('cohortId', '==', cohortId)
          .orderBy('when', 'desc')
          .limit(limit),
        map: snap => snap.docs.map(d => ({ checkInId: d.id, ...d.data() }))
      }
    };
  }

  get selectors() {
    return {
      getMyCheckIns: (cohortId, limit = 3) => {
        const { currentUser } = this.deps;
        const { uid } = currentUser;
        if (uid === NotLoaded) { return NotLoaded; }

        return this.checkInsOfUser(uid, cohortId, limit);
      },

      getAllMyCheckIns: (cohortIds, limit = 3) => {
        const { currentUser } = this.deps;
        const { uid } = currentUser;
        if (uid === NotLoaded) { return NotLoaded; }

        const checkIns = cohortIds.map(cohortId => this.checkInsOfUser(uid, cohortId, limit));
        if (!checkIns.reduce((acc, next) => !!acc && !!next, true)) {
          // make sure to only return all once all have loaded and not return partial results
          return NotLoaded;
        }
        return checkIns;
      }
    };
  }

  get actions() {
    return {
      checkIn(uid, cohortId) {
        const { currentUser } = this.deps;
        const { uid: byUid } = currentUser;
        if (byUid === NotLoaded) { return NotLoaded; }

        if (byUid !== uid && !currentUser.isAdmin()) {
          // TODO: allow cohort contributors to check in others as well
          throw new Error('401: Must be Admin to help others check in');
        }

        const checkIn = {
          uid,
          byUid,
          cohortId,
          when: Firebase.firestore.Timestamp.fromDate(new Date())
        };
        return this.collection.add(checkIn);
      }
    };
  }
}
export default CohortCheckIns;