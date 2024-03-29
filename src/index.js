// import global CSS
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import React from 'react';
import ReactDOM from 'react-dom';

import * as serviceWorker from './serviceWorker';

import Loading from 'components/Loading';

import { onAuthStateChanged } from 'api/auth';


ReactDOM.render(<Loading centered />, document.getElementById('root'));

let rendered = false;

onAuthStateChanged(user => {
  //console.log('onAuthStateChanged', user);
  setTimeout(async () => {
    if (!rendered) {
      rendered = true;
      const App = (await import('./App')).default;
      ReactDOM.render(<App />, document.getElementById('root'));
    }
  });
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
