import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './theme/halloween.css';
import { applyHalloweenClass } from './theme/halloween.js';

applyHalloweenClass();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
