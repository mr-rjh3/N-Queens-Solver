import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App'; // Imports the App function from app.js
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root')); // Creates a root element by finding the element with id 'root' in index.html

root.render( // Renders the App function from app.js into the root element in index.html
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
