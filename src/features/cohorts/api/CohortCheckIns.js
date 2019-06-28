import FirestoreContainer from "unstated-ext/FirestoreContainer";

class CohortCheckIns extends FirestoreContainer {
  static n = 'cohortcheckins';
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
      
    };
  }

  get selectors() {
    return {
    };
  }

  get actions() {
    return {
    };
  }
}
export default CohortCheckIns;