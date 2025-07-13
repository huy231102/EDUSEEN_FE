import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { AuthProvider } from './features/auth/contexts/AuthContext';
import { MyCoursesProvider } from './features/courses/contexts/MyCoursesContext';
import { ToastProvider } from './components/common/Toast';
import './assets/styles.css';

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <ToastProvider>
        <MyCoursesProvider>
          <App />
        </MyCoursesProvider>
      </ToastProvider>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
