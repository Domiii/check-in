# TODO



# Dev Log: How did I set things up?

1. `npx create-react-app check-in` 
1. `cd check-in`
1. Allow for `create-react-app` customizations through [`rescripts`](https://github.com/harrysolovay/rescripts)
    1. `npm i npm i -D @rescripts/cli @rescripts/rescript-env` 
    1. Fix up `.babelrc` to support experimental decorators and more
        1. `npm i --save-dev @babel/core @babel/node @babel/cli`
        1. `npm i -s core-js@3`
        1. `npm i --save-dev @babel/plugin-proposal-decorators @babel/plugin-proposal-class-properties @babel/plugin-proposal-function-bind @babel/plugin-syntax-export-default-from`
        1. add custom `.babelrc`
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
        * `npm link ./src/unstated-ext/` 
1. react-router
    1. `npm i -S react-router` 
    1. 
1. add module path [link](https://www.npmjs.com/package/app-module-path)
    1. `npm i -S app-module-path` 
    1. NOTE: when setting up Jest et al, need to also add corresponding alias.
1. Make things prettier
    1. Add Bootstrap + reactstrap
        1. See: https: //reactstrap.github.io/
            1. `npm i -S bootstrap reactstrap` 
    1. Add [flexbox-react](https://www.npmjs.com/package/flexbox-react) for simple, practical layouting
    1. Add [react-fontawesome](https://github.com/FortAwesome/react-fontawesome)

        * `npm i -s @fortawesome/fontawesome-svg-core @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons @fortawesome/free-regular-svg-icons` *
        https: //fontawesome.com/how-to-use/on-the-web/using-with/react

    1. Add [material-ui](https://material-ui.com/) - `npm i -s @material-ui/core` 


# Dev Log: App Structure?
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
