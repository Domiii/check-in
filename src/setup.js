import chalk from 'chalk';


// ########################################################
// Init firebase and API stuff
// ########################################################
import './api';


/**
 * Run some code in the beginning to setup everything
 */

// ########################################################
// Node output coloring with chalk
// ########################################################
const consoleError = console.error;

(function() {
  console.error = (...args) => {
    consoleError(...args.map(a => chalk.red(a)));
  };
})();