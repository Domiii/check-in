import FirestoreContainer from 'unstated-ext/FirestoreContainer';
import loadedValue from 'unstated-ext/loadedValue';
import throttle from 'lodash/throttle';

export default class MarkdownTempStorage extends FirestoreContainer {
  static n = 'markdownTempStorage';
  _throttled = {};

  get values() {
    return {
    };
  }

  get queries() {
    return {
      byUser: {
        query: (uid) => {
          return this.collection.where('uid', '==', uid);
        }
      }
    };
  }

  get selectors() {
    return {
      getSource: docId => {
        const entry = this.state.byId(docId);
        if (entry) {
          return loadedValue(entry.source);
        }
        return entry;
      }
    };
  }
  
  get actions() {
    return {
      add: (entry) => {
        // if (!entry.uid) {
        //   throw new Error('invalid MarkdownTempStorage must have uid: ' + entry);
        // }
        this.collection.add(entry);
      },
      saveAs: (docId, entry) => {
        // if (!entry.uid) {
        //   throw new Error('invalid MarkdownTempStorage must have uid: ' + entry);
        // }
        return this.doc(docId).set(entry, { merge: true });
      },
      saveSourceThrottled: (docId, source, delay = 500) => {
        return new Promise((r, j) => {
          // for throttle example, see: https://codepen.io/anon/pen/gyqGrW?editors=0010
          let throttled = this._throttled[delay];
          if (!throttled) {
            this._throttled[delay] = throttled = throttle((...args) => {
              const result = this.state.saveSource(...args);
              r(result);
            }, delay, { leading: false });
          }

          // reset countodwn when it gets called again (only save the last version after nothing new came in for delay ms)
          throttled.cancel();
          return throttled(docId, source);
        });
      },
      saveSource: (docId, source) => {
        return this.state.saveAs(docId, { source });
      }
    };
  }
}