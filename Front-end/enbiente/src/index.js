import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastProvider } from './components/toasts/toast.js'
import ReactDOM from 'react-dom';
import './assets/css/App.css';

import AuthLayout from './layouts/auth';
import Dashboard from './pages/dashboard.js';
import RtlLayout from './layouts/rtl';
import Registar from './views/auth/Registar/index.jsx';
import Login from './views/auth/signIn/index.jsx';
import { ChakraProvider } from '@chakra-ui/react';
import theme from './theme/theme';
import { ThemeEditorProvider } from '@hypertheme-editor/chakra-ui';
import App from 'App.js';


ReactDOM.createRoot(document.getElementById('root')).render(
	<ChakraProvider theme={theme}>
		<React.StrictMode>
			<ThemeEditorProvider>
				<ToastProvider>
					<App />
				</ToastProvider>
			</ThemeEditorProvider>
		</React.StrictMode>
	</ChakraProvider>
);
