import React from 'react';
import '../styles/Spinner.css';

const Spinner = () => {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
      <p>Loading posts...</p>
    </div>
  );
};

export default Spinner;