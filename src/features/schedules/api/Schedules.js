import Firebase from 'firebase/app';
import FirestoreContainer from "unstated-ext/FirestoreContainer";
import NotLoaded from 'NotLoaded';

import Users from 'features/users/api/Users';
import CurrentUser from 'api/state/CurrentUser';
import sleep from '../../../util/sleep';

const MergeTrue = Object.freeze({ merge: true });
const EmptyArray = Object.freeze([]);
const EmptyObject = Object.freeze({});


class Schedules extends FirestoreContainer {
  static n = 'schedules';

  get refs() {
    return {
      times: this.db.collection('times')
    }
  }

  get values() {
    return {
      schedulesArray: { 
        ref: this.collection,
        map: snap => snap.docs.map(d => ({ scheduleId: d.id, ...d.data() }))
      }
    };
  }

  get queries() {
    return {
      getSchedulesWhere: {
        query(where) {
          let ref = this.collection;
          if (where) {
            for (const k in where) {
              const v = where[k];
              ref = ref.where(k, '==', v);
            }
          }
          return ref;
        },
        map(snap) {
          return snap.docs;
        }
      },

      scheduleById: {
        query: this.doc,
        map: snap => snap.data() || null
      },

      scheduleTimes: {
        query: (scheduleId, orderBy) => {
          let ref = this.ref.times.where('scheduleId', '==', scheduleId);
          if (orderBy) {
            ref = ref.orderBy(orderBy);
          }
          return ref;
        },
        map: (snapshot) => 
          snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        // ({
        //   list: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        // })
      },

      getScheduleStartTime: {
        query: (scheduleId) => {
          // get all times of schedule
          return this.ref.times.where('scheduleId', '==', scheduleId);
        },
        map: snap => {

          for (const doc of snap.docs) {
            
          }
        }
      }
    };
  }

  get selectors() {
    return {
      getScheduleIdsWhere(where) {
        const docs = this.getSchedulesWhere(where);
        if (docs === NotLoaded) {
          return NotLoaded;
        }

        return docs.map(doc => doc.id);
      },

      getSchedulesOfIds(scheduleIds) {
        return this.constructor.loadFromIds(
          scheduleIds, 'scheduleId', this.getSchedule
        );
      }
    };
  }

  get actions() {
    return {
      async createSchedule(name) {
        const schedule = {
          name,
          createdAt: Firebase.firestore.FieldValue.serverTimestamp()
        };

        return this.collection.add(schedule);
      },

      async createScheduleTime({ scheduleId, startTime, nRepeats, exceptions, duration, period }) {
        const time = {
          scheduleId,
          startTime,
          nRepeats,
          exceptions,
          period,
          duration
        };

        return this.refs.times.add(time);
      }
    };
  }
}

export default Schedules;