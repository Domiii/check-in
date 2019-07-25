import React, { Component } from 'react';

import { Button, Alert } from 'reactstrap';
import Flex from 'flexbox-react';
import UrlPreviewFrame from './UrlPreviewFrame';

class UrlPreviewSandboxPage extends Component {
  state = { }

  sendQuery = () => {
    const url = window.prompt("Please enter the URL to query");
    if (url) {
      this.setState({
        url
      });
    }
  };

  clearQuery = () => {
    this.setState({
      url: null
    })
  }

  render() { 
    const { url } = this.state;

    return (<Flex className="full-width" flexDirection="column">
      <div className="space-2" />
      <Flex flexDirection="row" justifyContent="center" alignItems="center">
        <Button color="success" onClick={this.sendQuery}>Query!</Button>
        <div className="space-2"/>
        <Button color="warning" disabled={!url} onClick={this.clearQuery}>Clear</Button>
      </Flex>
      <Flex>
        { !url && 
          <Alert color="info">Ready</Alert> || 
          <UrlPreviewFrame url={url} />
        }
      </Flex>
    </Flex> );
  }
}
 
export default UrlPreviewSandboxPage;