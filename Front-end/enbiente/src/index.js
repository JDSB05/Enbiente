import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastProvider } from './components/toasts/toast.js'
import ReactDOM from 'react-dom';
import './assets/css/App.css';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import AuthLayout from './layouts/auth';
import Dashboard from './pages/dashboard.js';
import RtlLayout from './layouts/rtl';
import Registar from './views/auth/Registar/index.jsx';
import Login from './views/auth/signIn/index.jsx';
import { ChakraProvider } from '@chakra-ui/react';
import theme from './theme/theme';
import { ThemeEditorProvider } from '@hypertheme-editor/chakra-ui';


ReactDOM.createRoot(document.getElementById('root')).render(
	<ChakraProvider theme={theme}>
		<React.StrictMode>
			<ThemeEditorProvider>
				<ToastProvider>
					<HashRouter>
						<Switch>
							<Route path={`/auth`} component={AuthLayout} />
							<Route path={`/admin`} component={Dashboard} />
							<Route path={`/rtl`} component={RtlLayout} />
							<Route path={`/registar`} component={Registar} />
							<Route path={`/login`} component={Login} />
							<Redirect from='/' to='/login' />
						</Switch>
					</HashRouter>
				</ToastProvider>
			</ThemeEditorProvider>
		</React.StrictMode>
	</ChakraProvider>
);
