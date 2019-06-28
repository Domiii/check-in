import FirestoreContainer from "unstated-ext/FirestoreContainer";

export default class CohortUsers extends FirestoreContainer {
  get values() {
    return {
      all: { ref: this.collection }
    };
  }

  get queries() {
    return {
      cohortIdsOfUser: this.doc
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