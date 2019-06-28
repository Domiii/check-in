import React, { Component } from 'react';
import Stackedit from 'stackedit-js';


class StackEdit extends Component {
  state = {  }

  constructor(...args) {
    super(...args);
    this.editorRef = React.createRef();
  }

  componentDidMount() {
    const el = this.editorRef.current;
    const stackedit = new Stackedit();

    // Open the iframe
    stackedit.openFile({
      name: 'Filename', // with an optional filename
      content: {
        text: el.value, // and the Markdown content.
        // properties: {
        //   extensions: {
        //     preset: 'commonmark'
        //   }
        // }
      }
    });
  
    // Listen to StackEdit events and apply the changes to the textarea.
    stackedit.on('fileChange', (file) => {
      console.log('fileChange', file);
      el.value = file.content.text;
    });
  }

  render() { 
    return (
      <div className="full-width full-height" ref={this.editorRef} />
    );
  }
}
 
export default StackEdit;