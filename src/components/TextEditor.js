import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const TextEditor = ({ text, setText }) => {


  // Load the saved text from local storage on component mount
  // useEffect(() => {
  //   const savedText = localStorage.getItem('text');
  //   if (savedText) {
  //     setText(savedText);
  //   }
  // }, []);

  // Save the current text to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('text', text);
  }, [text]);

  // Quill modules without image tool
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ align: [] }],
      [{ color: [] }, { background: [] }],
      ['link'], // intentionally NO 'image'
      ['clean']
    ]
  };

  // Allowed formats (exclude 'image')
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'align', 'color', 'background',
    'link'
  ];

  const editorStyle = {
    height: '200px', // Set the desired height here
  };
  return (
    <div>
      <ReactQuill
        value={text}
        onChange={setText}
        style={editorStyle}
        modules={modules}
        formats={formats}
      />
    </div>
  );
};

export default TextEditor;
