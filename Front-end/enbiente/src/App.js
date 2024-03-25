//import './App.css';
import api from './services/api';

import React, { useEffect, useState, useCallback } from 'react';
//import { Button, Modal } from 'react-bootstrap';
import { buttonStyles } from '././theme/components/button'
import { createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
//import  Dashboard  from './pages/dashboard';
//import { Create } from './pages/Create';
import AuthLayout from './layouts/auth';
import RtlLayout from './layouts/rtl';
import Login from './views/auth/signIn/index.jsx';
import Alerts from './views/notfound/index';
import  Dashboard from './layouts/admin/index';
//import  RootLayout  from './layouts/RootLayout';
import Registar from './views/auth/Registar';
import ForgotPassword from 'views/auth/recuperarConta';
/*
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index  element={<Dashboard />} />
    </Route>,
    
  )

);*/

function App() {
  //const [header, setHeader] = useState(<HeaderSemLogin/>);
  const [carregando, setCarregando] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [showModal, setShowModal] = useState(true);
  const [cargo, setCargo] = useState(null);
 //teste
const handleModalClose = () => {
  setShowModal(false);
};
  const verificarAutenticacao = useCallback( async () => {

    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await api.get('/auth/checktoken');  
         
  
        // 0 administrador
        // 1 utilizador externo
        // 2 utilizador interno
        // 3 gestor de vendas (oportunidades)
        // 4 gestor de ideias
        // 5 RH
  /*
        const headersPorCargo = {
          0: <HeaderAdministrador />,   
          1: <HeaderUtilizador />,      
          2: <HeaderUtilizador />,     
          3: <HeaderGestorVendas />,      
          4: <HeaderGestorIdeias />, 
          5: <HeaderRH />,     
          default: <HeaderSemLogin />,
        };
  */
        //const header = headersPorCargo[cargo] || headersPorCargo.default;
  
        //setHeader(header);
  
       //console.log(response.data.message);
  
        localStorage.setItem('utilizador_nome', response.data.message.nome);
        localStorage.setItem('utilizador_id', response.data.message.utilizador_id);
        localStorage.setItem('cargo', response.data.message.cargo_id);
        localStorage.setItem('email', response.data.message.email);
        if (!isAuthenticated) {
          setIsAuthenticated(true);
        }
        
      } catch (error) {
  
        console.log(error);
        console.log('Erro ao verificar autenticação');
        //setHeader(<HeaderSemLogin />);
        if (isAuthenticated) {
          setIsAuthenticated(false);
        }
        
  
      }
    } else {
      //setHeader(<HeaderSemLogin />);
      if (isAuthenticated) {
        setIsAuthenticated(false);
      }
    }
  
    //setCarregando(false);
  }, [isAuthenticated]);
  return (
    <HashRouter>
      <Switch>
        <Route path="/auth" component={AuthLayout} />
        <Route path="/admin" component={Dashboard} />
        <Route path="/rtl" component={RtlLayout} />
        <Route path="/registar" component={Registar} />
        <Route path="/login" render={() => <Login verificarAutenticacao={verificarAutenticacao} />} />
        <Route path="/404" component={Alerts} />
        <Route path="/recuperarconta" component={ForgotPassword} />
        <Route exact path="/" render={() => <Redirect to="/login" />} />
        <Route render={() => <Redirect to="/404" />} />
      </Switch>
    </HashRouter>
  );
}

export default App;
