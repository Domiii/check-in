# TODO

* add `src` path alias!
* copy learn-learn files over


# NOTES

Steps taken
1. `npx create-react-app check-in`
1. `cd check-in`
1. Setup
  1. Firestore
    1. Create Firebase Project + Web App + Firestore database
    1. Add firestore config
    1. Add Google sign-on method
    1. `npm i -S firebase`
    1. `npm i -g firebase-tools`
  1. Add Domi's pre-developed features
    1. `cd .. && git clone https://github.com/Domiii/learn-learn.git && cd check-in`
    1. `npm link ../learn-learn/src/features # npm run domi-setup`
  1. unstated
    1. `npm i -S unstated`
    1. Add Domi's own `unstated-ext` scripts
      * `npm link ../learn-learn/src/unstated-ext/ # npm run domi-setup`
  1. react-router
    1. `npm i -S react-router`
  1. add module path [link](https://www.npmjs.com/package/app-module-path)
    1. `npm i -S app-module-path`
    1. NOTE: when setting up Jest et al, need to also add corresponding alias.
  1. [reactstrap](https://www.npmjs.com/package/reactstrap)
    1. `npm i -S bootstrap reactstrap`

1. Build App
  1. Navbar: `src/components/Navigation.js`
  1. Routes: `src/components/AppRoutes.js`

# Features (planned)

* Google sign-on
* Basic User management + User roles: Admin, User, Guest
* Basic Cohort management + Cohort roles: Contributor, Member
* Every user can check into their cohort
  * If cohort requires payment or other basic protocols, can enable that for a cohort as well
  * If enabled, user can document wha they did + cohort contributors can check
  * [Advanced] Double-checking by admin
* Cohort intro (using MD)
* Inidividual note-taking
  * Cohort contributors can see all
* 共筆紀錄


# Based on create-react-app

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
