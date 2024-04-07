import './App.css';
import api from './services/api';
import React, { useEffect, useState, useCallback } from 'react';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import AuthLayout from './layouts/auth';
import Alerts from './views/notfound/index';
import AdminLayout from './layouts/admin/index';
import UserLayout from './layouts/user/index';
import Registar from './views/auth/Registar';
import Login from './views/auth/signIn/index.jsx';
import ForgotPassword from './views/auth/recuperarConta';
import ConfirmPassword from './views/auth/ConfirmarPassword';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const verificarAutenticacao = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await api.get('/auth/checktoken');
        const { nome, utilizador_id, cargo_id, email, foto } = response.data.message;

        localStorage.setItem('utilizador_nome', nome);
        localStorage.setItem('utilizador_id', utilizador_id);
        localStorage.setItem('cargo', cargo_id);
        localStorage.setItem('email', email);
        localStorage.setItem('foto', foto);

        setIsAuthenticated(true);
      } catch (error) {
        console.error('Erro ao verificar autenticação', error);
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    verificarAutenticacao();
  }, [verificarAutenticacao]);

  return (
    <HashRouter>
      <Switch>
        <Route path="/auth" component={AuthLayout} />
        <Route path="/admin" component={AdminLayout} />
        <Route path="/user" component={UserLayout} />
        <Route path="/registar" component={Registar} />
        <Route path="/login" render={() => <Login verificarAutenticacao={verificarAutenticacao} />} />
        <Route path="/404" component={Alerts} />
        <Route path="/recuperarconta" component={ForgotPassword} />
        <Route path="/recuperarpassword" component={ConfirmPassword} />
        <Route exact path="/" render={() => <Redirect to="/login" />} />
        <Route render={() => <Redirect to="/404" />} />
      </Switch>
    </HashRouter>
  );
}

export default App;
