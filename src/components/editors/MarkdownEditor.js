import AceEditor from './AceEditor';
import React, { Component } from "react";

function onChange(newValue) {
  console.log("change", newValue);
}

const config = {
  $blockScrolling: true
};

/**
 * - uses ACE for editing
 */
// TODO: use react-markdown for rendering - https://github.com/rexxars/react-markdown
// add HTML support - https://github.com/rexxars/react-markdown#parsing-html
// add security features for HTML support (because it uses dangerouslySetInnerHTML)
// TODO: add link support (should have link support already;  if not: https://github.com/godaddy/react-markdown-github)
// TODO: add improved Codeblock support: https://github.com/Domiii/self-asssessment-app/blob/5ff1af4951476b9699d503f7967f06c4ff5d0aa8/src/views/components/markdown/CodeBlock.js
class MarkdownEditor extends Component {
  static defaultProps = {
    mode: "markdown",
    theme: "tomorrow",
    ///onChange: ...,
    editorProps: {
      config
    }
  };

  state = {};

  render() {
    // see: https:// github.com/securingsincity/react-ace/blob/master/docs/Ace.md#available-props
    const { value = '', ...props } = this.props;
    
    return (<AceEditor
      value={value}
      {...props}
    />);
  }
}

export default MarkdownEditor;