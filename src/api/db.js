import * as Firebase from 'firebase/app';

import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';


// Initialize Firebase
const config = {
  apiKey: "AIzaSyBqYSL9Ecnnnbb7o4O0V_KJ4ewqsjNDPcs",
  authDomain: "check-in-58b5a.firebaseapp.com",
  databaseURL: "https://check-in-58b5a.firebaseio.com",
  projectId: "check-in-58b5a",
  storageBucket: "check-in-58b5a.appspot.com",
  messagingSenderId: "9554933808",
  appId: "1:9554933808:web:5fb25c5303d47cfb"
};



export const firebase = Firebase.initializeApp(config);

const db = Firebase.firestore();
export default db;

// for dev + debugging purposes
/**
 * See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis
 */
var getGlobal = function () {
  if (typeof window !== 'undefined') { return window; }
  if (typeof global !== 'undefined') { return global; }
  throw new Error('unable to locate global object');
};

getGlobal().firebase = firebase;
getGlobal().db = db;