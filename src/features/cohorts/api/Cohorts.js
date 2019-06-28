import Firebase from 'firebase/app';
import FirestoreContainer from "unstated-ext/FirestoreContainer";
import NotLoaded from 'NotLoaded';

import Users from 'features/users/api/Users';
import CurrentUser from 'api/state/CurrentUser';
import sleep from '../../../util/sleep';

const MergeTrue = Object.freeze({ merge: true });
const EmptyArray = Object.freeze([]);
const EmptyObject = Object.freeze({});

function genRandomString(len, chrs) {
  chrs = chrs || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const crypto = window.crypto || window.msCrypto;
  const array = new Uint32Array(len);
  crypto.getRandomValues(array);
  const result = Array.from(array).map(x => chrs[x % chrs.length]);
  return result.join('');
}

class Cohorts extends FirestoreContainer {
  static n = 'cohorts';
  static Dependencies = [CurrentUser, Users];

  get refs() {
    return {
      cohortUserEntries: this.db.collection('cohortUserEntries'),   // actual entry is stored here
      cohortIdsOfUser: this.db.collection('cohortIdsOfUser'),       // only for reverse lookup
    };
  }

  get values() {
    return {
      all: { ref: this.collection },
      allCohortsArray: {
        ref: this.collection,
        map(snap) {
          return snap.docs.map(d => ({ cohortId: d.id, ...d.data() }));
        }
      }
    };
  }

  get queries() {
    return {
      getCohort: {
        query: cohortId => this.doc(cohortId),
        map(snap) {
          return snap.exists && snap.data() || null;
        }
      },
      cohortUserEntries: cohortId => this.refs.cohortUserEntries.doc(cohortId),
      cohortIdsOfUser: uid => this.refs.cohortIdsOfUser.doc(uid),
      cohortIdsNotOfUser: uid => this.refs.cohortIdsOfUser.where(uid, '==', null),
      cohortsByCode: code => this.collection.where('code', '==', code)
    };
  }

  get selectors() {
    return {
      getCohortIdsOfUser(uid) {
        const snap = this.cohortIdsOfUser(uid);
        if (snap === NotLoaded) { return NotLoaded; }

        return snap.exists && Object.keys(snap.data()) || EmptyArray;
      },
      getCohortIdsWhereNotUser(uid) {
        const snap = this.cohortIdsNotOfUser(uid);
        if (snap === NotLoaded) { return NotLoaded; }

        return !snap.empty && Object.keys(snap.data()) || EmptyArray;
      },
      getAllCohortIds() {
        const { all } = this.state;
        if (all === NotLoaded) { return NotLoaded; }

        return all.docs.map(d => d.id);
      },
      getCohortName(cohortId) {
        const cohort = this.getCohort(cohortId);
        if (cohort === NotLoaded) { return NotLoaded; }

        return cohort && cohort.name || '';
      },
      getUserEntriesOfCohort(cohortId) {
        const snap = this.cohortUserEntries(cohortId);
        if (snap === NotLoaded) { return NotLoaded; }

        return snap.data() || EmptyObject;
      },
      getUidsOfCohort(cohortId) {
        const snap = this.cohortUserEntries(cohortId);
        if (snap === NotLoaded) { return NotLoaded; }

        return snap.exists && Object.keys(snap.data()) || EmptyArray;
      },
      getCohortUserEntry(cohortId, uid) {
        const snap = this.cohortUserEntries(cohortId);
        if (snap === NotLoaded) { return NotLoaded; }

        console.warn(snap, snap.data(), uid, snap.exists && snap.data()[uid] || null);

        return snap.exists && snap.data()[uid] || null;
      },
      getMyCohortIds() {
        const { uid } = this.deps.currentUser;
        if (uid === NotLoaded) { return NotLoaded; }

        return this.getCohortIdsOfUser(uid);
      },
      getNotMyCohortIds() {
        const { uid } = this.deps.currentUser;
        if (uid === NotLoaded) { return NotLoaded; }

        return this.getCohortIdsWhereNotUser(uid);
      },
      getCohortsOfIds(cohortIds) {
        return this.SelectorFunctions.loadFromIds(
          cohortIds, 'cohortId', this.getCohort
        );
      }
      // getUsersOfCohort(cohortId) {
      //   const { users } = this.deps;
      // }
    };
  }

  get actions() {
    return {
      // let currentUser join cohort
      async joinCohort(code) {
        const { uid } = this.deps.currentUser;
        if (!uid) {
          return null;
        }

        const snap = await this.collection.where('code', '==', code).get();

        if (snap.empty) {
          // invalid code
          return { error: 'Invalid code' };
        }

        // take id of first match (should not have more than one anyway)
        const doc = snap.docs[0];
        const cohortId = doc.id;
        const expires = doc.data().codeExpiresAt;
        if (expires && expires.toDate() < new Date()) {
          // expired
          return { error: 'Code expired' };
        }
        return await this.addUserToCohort(cohortId, uid);
      },

      // let currentUser leave cohort
      async leaveCohort(cohortId) {
        const { uid } = this.deps.currentUser;
        if (!uid) {
          return null;
        }

        return await this.removeUserFromCohort(cohortId, uid);
      },

      // create new cohort
      async createCohort(name) {
        const cohort = {
          name,
          userCount: 0,
          createdAt: Firebase.firestore.FieldValue.serverTimestamp()
        };

        return this.collection.add(cohort);
      },

      async newCode(cohortId) {
        const maxAge = 5 * 24 * 60 * 60 * 1000; // 5 days
        const CodeLength = 8;

        // see: https://developer.mozilla.org/en-US/docs/Web/API/Window/crypto
        const expireDate = new Date(Date.now() + maxAge);
        const codeExpiresAt = Firebase.firestore.Timestamp.fromDate(expireDate);
        const code = genRandomString(CodeLength);
        
        return this.doc(cohortId).update({
          codeExpiresAt,
          code
        });
      },

      async removeCode(cohortId) {
        return this.doc(cohortId).update({
          code: null
        });
      },

      async addUserToCohort(cohortId, uid) {
        // make sure, user has not been added already
        let existingEntry;
        while ((existingEntry = this.getCohortUserEntry(cohortId, uid)) === NotLoaded) {
          await sleep(50);
        }
        if (existingEntry) {
          return { error: 'Already in cohort' };
        }

        // see: https://firebase.google.com/docs/firestore/manage-data/transactions#batched-writes
        const batch = this.db.batch();

        // create new entry to add to cohortUserEntries
        const entry = {
          [uid]: {
            createdAt: Firebase.firestore.FieldValue.serverTimestamp()
          }
        }

        const Increment = Firebase.firestore.FieldValue.increment(1);

        batch.set(this.refs.cohortUserEntries.doc(cohortId), entry, MergeTrue);
        batch.set(this.refs.cohortIdsOfUser.doc(uid), { [cohortId]: 1 }, MergeTrue);
        batch.set(this.doc(cohortId), { userCount: Increment }, MergeTrue);

        batch.set(this.db.collection('users').doc(uid), { cohortId }, MergeTrue);

        await batch.commit();
        
        return { success: 1 };
      },

      async removeUserFromCohort(cohortId, uid) {
        // make sure, user has been added
        let existingEntry;
        while ((existingEntry = this.getCohortUserEntry(cohortId, uid)) === NotLoaded) {
          await sleep(50);
        }
        if (!existingEntry) {
          return { error: 'Not in cohort' };
        }

        // do it
        const batch = this.db.batch();

        const Decrement = Firebase.firestore.FieldValue.increment(-1);
        const Del = Firebase.firestore.FieldValue.delete();  // see: https://stackoverflow.com/a/46984847

        batch.update(this.refs.cohortUserEntries.doc(cohortId), { [uid]: Del });
        batch.update(this.refs.cohortIdsOfUser.doc(uid), { [cohortId]: Del });
        batch.update(this.doc(cohortId), { userCount: Decrement });

        batch.update(this.db.collection('users').doc(uid), { cohortId: Del });

        await batch.commit();

        return { success: 1 };
      }
    };
  }
}

export default Cohorts;