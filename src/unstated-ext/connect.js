/**
 * A connect decorator for unstated.
 * @see https://github.com/jamiebuilds/unstated/blob/master/src/unstated.js
 * Based on: https://github.com/fabiospampinato/unstated-with-containers/blob/master/src/index.tsx
 */

import React from 'react';
import { Subscribe, Container } from 'unstated';
import zipObject from 'lodash/zipObject';
import isPlainObject from 'lodash/isPlainObject';

const EmptyArray = Object.freeze([]);

/**
 * HOC decorator for Unstated (behaving similar to Redux's connect).
 */
export default function unstatedConnect(...input) {
  const C = Container;
  let ContainerTypes;
  let ContainerNames;
  if (input[0].prototype instanceof Container) {
    ContainerTypes = input;
    ContainerNames = ContainerTypes.map(c => {
      if (!c.n) {
        throw new Error(c + ' Container must (but did not) define `static n` property (indicating the name its data gets assigned when added as a property)');
      }
      return c.n;
    });
  }
  else if (isPlainObject(input[0])) {
    const config = input[0];

    ContainerNames = Object.keys(config);
    ContainerTypes = ContainerNames.map(name => config[name]);
  }
  else {
    throw new Error('Invalid unstatedConnect call: Arguments must be many Containers (varargs) or a single object of many name -> ContainerType');
  }

  const AllContainerTypes = ContainerTypes.concat(
    ...ContainerTypes.map(Type => 
      Type.getAllDependenciesRecursively && Type.getAllDependenciesRecursively() || EmptyArray
    )
  );

  return function unstatedConnectWrapper(WrappedComponent) {
    return class ContainersProvider extends React.Component {
      doRender = (...containers) => {
        // resolve dependencies
        for (let cont of containers) {
          const DepTypes = cont.constructor.getAllDependenciesRecursively && cont.constructor.getAllDependenciesRecursively() || EmptyArray;
          if (DepTypes && !cont.deps) {
            // assign deps
            const deps = containers.filter(c => DepTypes.includes(c.constructor));
            const depNames = deps.map(d => d.constructor.n);
            cont.deps = zipObject(depNames, deps.map(d => d.state));
            //console.log('[DEP]', cont.constructor.n, depNames, DepTypes);
          }
        }

        // zip up + render
        containers = containers.map(c => c.state);
        const containerProps = zipObject(ContainerNames, containers);
        return (
          <WrappedComponent {...containerProps} {...this.props} />
        );
      };

      render() {
        return (
          <Subscribe to={AllContainerTypes}>
            {this.doRender}
          </Subscribe>
        );
      }
    }
  };
}