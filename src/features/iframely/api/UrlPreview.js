import FirestoreContainer from "unstated-ext/FirestoreContainer";

/**
 * Use iframely to get metadata and previews of any url.
 */
class UrlPreview extends FirestoreContainer {
  static n = 'urlPreview';
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
export default UrlPreview;