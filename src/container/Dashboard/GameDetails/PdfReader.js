import React, { useState } from 'react';


const PdfReader = ({ item }) => {

  return (
    <div>

      <iframe
        src={item}
        style={{ width: '100%', height: "500px" }}
      />

    </div>
  );
};

export default PdfReader;