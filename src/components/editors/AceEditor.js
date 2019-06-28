// Use react-ace to offer full editing capabilities: https://github.com/securingsincity/react-ace

// TODO: support multiple modes (languages) using webpack dynamic imports - https://medium.com/front-end-weekly/webpack-and-dynamic-imports-doing-it-right-72549ff49234

// all modes: https://github.com/thlorenz/brace/tree/master/mode

import React, { Component }
  from "react";
import brace from "brace";
import NativeAceEditor from "react-ace";

import Loading from 'components/Loading';

/*eslint-disable no-alert, no-console */
import langTools from 'brace/ext/language_tools';
import "brace/ext/searchbox";
//console.log(langTools.addCompleter);

const modes = {};
const themes = {};

const LoadStatus = {
  NotLoaded: 0,
  Loading: 1,
  Loaded: 2
};

let _lastEditorId = 0;

// TODO: Better settings (enableBasicAutocompletion, enableLiveAutocompletion, tabSize)
// TODO: add list of languages + themes to choose from
// TODO: snippets!
// TODO: more extensions - https://github.com/thlorenz/brace/tree/master/ext

// all themes: https://github.com/thlorenz/brace/tree/master/theme
// all props: https://github.com/securingsincity/react-ace/blob/master/docs/Ace.md
class AceEditor extends Component {
  state = {}

  componentDidMount() {
    this.id = 'ace_' + (++_lastEditorId);
    this._updateProps(this.props);
  }

  componentDidUpdate() {
    this._updateProps(this.props);
  }

  async _updateProps(props) {
    // load modes and themes asynchronously
    const promises = [];
    if (!modes[props.mode]) {
      modes[props.mode] = LoadStatus.Loading;
      promises.push((async () => {
        await Promise.all([
          import(`brace/mode/${props.mode}`),
          //import(`brace/snippets/${props.mode}`)
        ]);
        console.log('loaded mode:', props.mode);
        modes[props.mode] = LoadStatus.Loaded;
      })());
    }
    if (!themes[props.theme]) {
      themes[props.theme] = LoadStatus.Loading;
      promises.push((async () => {
        await import(`brace/theme/${props.theme}`);
        console.log('loaded theme:', props.theme);
        themes[props.theme] = LoadStatus.Loaded;
      })());
    }

    if (promises.length) {
      // re-render after everything has been imported
      await Promise.all(promises);
      this.forceUpdate();
    }
  }

  render() {
    const {theme, mode} = this.props;
    if (modes[mode] !== LoadStatus.Loaded || themes[theme] !== LoadStatus.Loaded) {
      return <Loading centered />;
    }
    return (<NativeAceEditor className="full-width full-height" name={this.id}
      {...this.props}
    />);
  }
}

export default AceEditor;