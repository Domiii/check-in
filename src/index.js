// import global CSS
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "react-table/react-table.css";

import React from 'react';
import ReactDOM from 'react-dom';

import * as serviceWorker from './serviceWorker';

import App from './App';
import Loading from 'components/Loading';


import { onAuthStateChanged } from 'api/auth';


ReactDOM.render(<Loading centered />, document.getElementById('root'));

let rendered = false;

onAuthStateChanged(user => {
  //console.log('onAuthStateChanged', user);
  setTimeout(() => {
    if (!rendered) {
      rendered = true;
      ReactDOM.render(<App />, document.getElementById('root'));
    }
  });
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
