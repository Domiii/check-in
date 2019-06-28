import React, { Component } from 'react';
import Flexbox from 'flexbox-react';

import connect from 'connect';
import NotLoaded from 'unstated-ext/NotLoaded';
import MarkdownTempStorage from 'state/MarkdownTempStorage';

import MarkdownEditor from './MarkdownEditor';
import MarkdownViewer from './MarkdownViewer';
import Loading from 'components/Loading';


@connect(MarkdownTempStorage)
class MarkdownEditorWithPreview extends Component {
  static defaultProps = {
    // auto save within this amount of milliseconds
    autoSaveThrottleDelay: 1000
  };
  state = {
    source: NotLoaded
  };
  _lastSavedSource = NotLoaded;

  componentDidMount() {
    this._onUpdate();
  }

  componentDidUpdate({ sourceName: oldSourceName }) {
    const { sourceName } = this.props;
    if (sourceName !== oldSourceName) {
      throw new Error(`Invalid sourceName must not be empty and must not change in ${this.constructor.name}: ${sourceName}`);
    }

    this._onUpdate();
  }

  _onUpdate() {
    const { sourceName, markdownTempStorage } = this.props;
    if (!sourceName) {
      throw new Error(`Invalid sourceName must not be empty and must not change in ${this.constructor.name}: ${sourceName}`);
    }
    const { source } = this.state;
    const remoteSource = markdownTempStorage.getSource(sourceName);
    //if (remoteSource !== source && remoteSource !== this._lastSavedSource) {
    if (remoteSource !== source && source === NotLoaded) {
      // TODO: support real-time remote updates
      // for now: only take remote source if source was not loaded before
      //console.log('_onUpdate', remoteSource);
      // source changed in database (or got loaded for the first time)
      // (make sure, we ignore the case where the callback got raised for the source we last saved)
      this.setState({ source: remoteSource });
    }
  }

  onEdit = (newSource, ...args) => {
    console.warn('onEdit', newSource, ...args)
    const { sourceName, markdownTempStorage, autoSaveThrottleDelay } = this.props;
    this._lastSavedSource = newSource;
    this.setState({ source: newSource });
    markdownTempStorage.saveSourceThrottled(sourceName, newSource, autoSaveThrottleDelay);
  };

  render() {
    let { source } = this.state;
    if (source === NotLoaded) {
      return <Loading centered />;
    }
    if (source === null) {
      source = '';
    }

    return (
      <Flexbox className="full-width" flexDirection="column">
        {/* Editor + Preview */}
        <Flexbox className="full-width" flexDirection="row">
          <Flexbox className="full-width">
            <MarkdownEditor onChange={this.onEdit} value={source} />
          </Flexbox>
          <div className="full-width">
            <MarkdownViewer source={source} />
          </div>
        </Flexbox>

        {/* Toolbar */}
        {/* <Flexbox className="full-width" flexDirection="row" justifyContent="space-evenly">
          <MUIButton className=""
            color="inherit"
            disabled={}
            onClick={this.save}>
            <span>Save</span>
          </MUIButton>
        </Flexbox> */}
      </Flexbox>);
  }
}

export default MarkdownEditorWithPreview;