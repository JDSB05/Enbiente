//import './App.css';
import api from './services/api';

import React, { useEffect, useState,useCallback } from 'react';
//import { Button, Modal } from 'react-bootstrap';
import { buttonStyles } from '././theme/components/button'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';

//import  Dashboard  from './pages/dashboard';
//import { Create } from './pages/Create';
import { Dashboard } from './layouts/admin/index';
import  RootLayout  from './layouts/RootLayout';
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index  element={<Dashboard />} />
    </Route>,
    
  )

);

function App() {

  return (
      <RouterProvider router={router}/>
  );
}

export default App;
