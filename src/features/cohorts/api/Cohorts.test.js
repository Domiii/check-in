import React, { Component } from 'react';

import { Provider } from 'unstated';

import Cohorts from './Cohorts';
import connect from 'connect';
import NotLoaded from 'NotLoaded';

import { mount } from 'enzyme';

Cohorts.collectionName = 'test_cohorts'; // hacky-mc-hack-hack!

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForValueChange(...args) {
  let [getter, orig] = args;
  if (args.length === 1) {
    orig = getter();
  }

  let next;

  do {
    console.warn('waiting...', next, orig);
    await sleep(20);
  }
  while ((next = getter()) === orig);
  return next;
}

async function waitForStateChange(comp, key, ...moreArgs) {
  return waitForValueChange(() => comp.state(key), ...moreArgs);
}

async function waitForPropChange(comp, key, ...moreArgs) {
  return waitForValueChange(() => comp.prop(key), ...moreArgs);
}


class CohortsComp extends Component {
  render() {
    const { cohorts } = this.props;
    return '' + !!cohorts;
  }
}
const Wrap1 = connect(Cohorts)(CohortsComp);
function Wrapper() {
  return (<Provider><Wrap1 /></Provider>);
}


it('can create cohorts', async () => {
  CohortsComp.displayName = 'CohortsComp';
  const root = mount(<Wrapper />);
  const comp = root.find(CohortsComp);
  //console.log(comp.debug());

  expect(comp.length).toEqual(1);
  //expect(comp).toMatchSnapshot();

  const props = comp.props();

  let { cohorts } = props;

  // start loading
  let allCohortsArray = cohorts.allCohortsArray;
  expect(allCohortsArray).toEqual(NotLoaded);

  allCohortsArray = await waitForValueChange(() => cohorts.allCohortsArray, allCohortsArray);

  // add cohort
  const cohortDoc = await cohorts.createCohort('testCohort' + allCohortsArray.length);

  // new cohort must be in array
  let newCohorts = await waitForValueChange(() => cohorts.allCohortsArray, allCohortsArray);
  expect(newCohorts.filter(c => c.cohortId === cohortDoc.id).length).toEqual(1);
});
