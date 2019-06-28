// import React, { Component } from 'react';
// import * as monaco from 'monaco-editor';

// window.MonacoEnvironment = {
// 	getWorkerUrl: function (moduleId, label) {
// 		if (label === 'json') {
// 			return './json.worker.bundle.js';
// 		}
// 		if (label === 'css') {
// 			return './css.worker.bundle.js';
// 		}
// 		if (label === 'html') {
// 			return './html.worker.bundle.js';
// 		}
// 		if (label === 'typescript' || label === 'javascript') {
// 			return './ts.worker.bundle.js';
// 		}
// 		return './editor.worker.bundle.js';
// 	}
// }


// class MonacoEditor extends Component {
//   state = {  }

//   constructor(...args) {
//     super(...args);
//     this.editorRef = React.createRef();
//   }

//   componentDidMount() {
//     const el = this.editorRef.current;

//     monaco.editor.create(el, {
//       value: [
//         'function x() {',
//         '\tconsole.log("Hello world!");',
//         '}'
//       ].join('\n'),
//       language: 'javascript'
//     });
//   }

//   render() { 
//     return (
//       <div className="full-width full-height" ref={this.editorRef} />
//     );
//   }
// }
 
// export default MonacoEditor;