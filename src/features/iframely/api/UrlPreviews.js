import FirestoreContainer from "unstated-ext/FirestoreContainer";

import { queryUrlData } from './iframely';

/**
 * Use iframely to get and store metadata and previews of any url.
 */
class UrlPreviews extends FirestoreContainer {
  static n = 'urlPreviews';
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
      queryUrl: async (url, format = 'oembed') => {
        return queryUrlData(url, format);
      }
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
export default UrlPreviews;