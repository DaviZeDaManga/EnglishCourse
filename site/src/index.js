import './index.scss'

import React from 'react';
import ReactDOM from 'react-dom/client';

import Routess from './Routes.js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ToastContainer />
    <Routess />
  </React.StrictMode>
);



