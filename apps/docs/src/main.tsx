import React from 'react';
import ReactDOM from 'react-dom/client';
import { ToastProvider } from '@dossier-ui/react';
import '@dossier-ui/react/styles.css';
import './styles.css';
import { App } from './App';
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><ToastProvider><App /></ToastProvider></React.StrictMode>);
