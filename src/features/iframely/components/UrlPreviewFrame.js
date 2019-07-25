import React, { Component } from 'react';

import UrlPreviews from '../api/UrlPreviews';
import connect from 'connect';
import renderLoadingIfNotLoaded from 'components/renderLoadingIfNotLoaded';

import CodeBlock from 'components/editors/CodeBlock';

import Flex from 'flexbox-react';

@connect(UrlPreviews)
class UrlPreviewFrame extends Component {
  state = {}

  componentDidUpdate() {
    const { url, urlPreviews } = this.props;
    const data = urlPreviews.queryUrl(url);
    if (data && this.preview) {
      this.preview.innerHTML = data.html;
    }
  }

  render() {
    const { url, urlPreviews } = this.props;

    const data = urlPreviews.queryUrl(url);

    const loading = renderLoadingIfNotLoaded(data, { centered: true });
    if (loading) return loading;

    if (!url) {
      return '';
    }

    return (<Flex flexDirection="column" className="full-width">
      <Flex>
        <div className="full-width" ref={el => (this.preview = el)} />
      </Flex>
      <Flex>
        <CodeBlock language="json" value={JSON.stringify(data, null, 2)} />
      </Flex>
    </Flex>
    );
  }
}

export default UrlPreviewFrame;