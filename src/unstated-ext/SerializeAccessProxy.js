import isFunction from 'lodash/isFunction';
import isString from 'lodash/isString';


class SerializeAccessState {
  constructor(root) {
    this.root = root;
    this.current = root;
    this.chain = [];
  }

  serialized() {
    return this.chain.map(s => isString(s) ? s : JSON.stringify(s)).join('');
  }
}

function _makeProxy(target, state) {
  // see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
  const p = new Proxy(target, {
    has(target, prop) {
      return !!state.current[prop];
    },

    get(target, prop) {
      switch (prop) {
        case '__result':
          return state.current;
        case '__serialized':
          return state.serialized();
      }

      if (this.has(target, prop)) {
        const val = state.current[prop];
        state.chain.push(prop);

        if (isFunction(val)) {
          return (...args) => {
            state.chain.push(args);

            const res = state.current[prop](...args);
            state.current = res;
            return p;
          };
        }
        else {
          state.current = val;
          return p;
        }
      }
    }
  });
  return p;
}


/**
 * Creates a new SerializeAccessProxy.
 * This proxy allows for function chaining on any arbitrary object `target`.
 * 
 * Generates two outputs:
 * 1. myProxy.__result - The returned value from the chain of calls on `target`.
 * 1. myProxy.__serialized - A string representing a serialized path of access.
 * 
 * See test for usage examples.
 */
export default function makeProxy(target) {
  return _makeProxy(target, new SerializeAccessState(target));
}
