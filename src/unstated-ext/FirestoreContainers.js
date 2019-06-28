// import React from 'react';
// import { Subscribe, Container } from 'unstated';

// import firebase, { fs } from 'api/firebase';
// import mapValues from 'lodash/mapValues';
// import isFunction from 'lodash/isFunction';
// import isPlainObject from 'lodash/isPlainObject';


// const Config = {
//   CacheLinger: 60 * 1000
// };

// const FirestoreContainers = new Map();

// function noop() { }

// function newNode(Parent, name, config) {
//   let Node;

//   const fullName = Parent ? Parent.name + '_' + name : name;

//   if (isFunction(config)) {
//     Node = newLeaf(fullName, config);
//   }
//   else if (isPlainObject(config)) {
//     Node = newSubTree(fullName);
//     Node.addChildren(config);
//   }
//   else {
//     throw new Error('Invalid FirestoreContainer config must be plain object or function:' + 
//       fullName + ' - ' + JSON.stringify(config));
//   }

//   // add to containers
//   FirestoreContainers.set(fullName, Node);

//   Object.defineProperty(Node, 'name', { value: 'Firestore_' + fullName });
// }

// export class FirestoreContainer extends Container {}

// /**
//  * Create leaf to the Firestore container hierarchy.
//  */
// function newLeaf(name, query) {
//   return class Node extends FirestoreContainer {
//     unsub = null;

//     constructor() {
//       super();

//       this.name = name;
//       this.query = query;
//     }

//     _startQuery() {
//       const { query } = this;
//       if (!query) {
//         throw new Error(`invalid query: ${this.name}: ${query}`);
//       }
//       else if (query.onSnapshot) {
//         // listen for real-time updates
//         this.unsub = query.onSnapshot(this._storeResult);
//         if (!(isFunction(this.unsub))) {
//           throw new Error(`invalid query: ${this.name} onSnapshot did not return a function - ${query} - ${this.unsub}`);
//         }
//       }
//       else if (query.get) {
//         // one-shot query
//         this._getOnce();
//         this.unsub = noop;  // TODO: consider invalidating cache after some time
//       }
//       else {
//         throw new Error(`invalid query: ${this.name} does not have get or onSnapshot function: ${query}`);
//       }
//     }

//     _storeResult = (snap) => {
//       // TODO: big problem here because the actual path depends on input parameters
//       this.setState({ value: snap });
//     }

//     _getOnce = async () => {
//       const snap = await query.get();
//       this._storeResult(snap);
//     }

//     // manage subscriptions
//     subscribe = (listener) => {
//       super.subscribe(listener);

//       if (!this.unsub) {
//         // Component got mounted the first time
//         // register new listener

//         // TODO: inject props and other containers
//         this._startQuery();
//       }

//       if (this.unsubTimer) {
//         clearTimeout(this.unsubTimer);
//         this.unsubTimer = null;
//       }
//     };

//     // this doesn't work because `unsubscribe` is not called when component unmounts
//     // unsubscribe = (listener) => {
//     //   super.unsubscribe(listener);

//     //   if (!this.unsub) {
//     //     console.error('[Internal ERROR] unsucribed from container without matching snapshot listener');
//     //     debugger;
//     //     return;
//     //   }

//     //   if (this._listeners.length === 0) {
//     //     this.unsubTimer = setTimeout(() => {
//     //       this.unsub();
//     //       this.unsub = null;
//     //     }, Config.CacheLinger);
//     //   }
//     // };
//   }
// }

// /**
//  * Create sub tree for the Firestore container hierarchy.
//  */
// function newSubTree(fullName) {
//   class Node extends FirestoreContainer {
//     children = new Map();

//     constructor() {
//       super();
//       this.name = fullName;
//     }
//   }

//   Node.addChildren = (config) => {
//     for (const queryName in config) {
//       Node.addChild(queryName, config);
//     }
//   };

//   Node.addChild = (queryName, config) => {
//     const node = Node[queryName] = newNode(Node, queryName, config);
//     this.children.set(queryName, node);
//   };

//   return Node;
// }

// export function addFirestoreContainers(options) {
//   for (const name in options) {
//     const config = options[name];
//     addFirestoreContainer(name, config);
//   }
// };

// export function addFirestoreContainer(name, config) {
//   newNode(FirestoreContainers, '', name, config);
// };

// export default FirestoreContainers;
