import React from 'react';
import ReactHtmlParser from 'react-html-parser';

const HTMLRenderer = ({ htmlContent }) => {
  // Sanitize and parse the HTML content to React components
  const renderedContent = ReactHtmlParser(htmlContent);

  return <div style={{color:"white"}}>{renderedContent}</div>;
};

export default HTMLRenderer;