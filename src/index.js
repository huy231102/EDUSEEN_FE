import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { AuthProvider } from './features/auth/contexts/AuthContext';
import { MyCoursesProvider } from './features/courses/contexts/MyCoursesContext';
import { ToastProvider } from './components/common/Toast';
import './assets/styles.css';

// Polyfill cho biến process trong trình duyệt (CRA v5 bỏ tự động)
import process from 'process/browser';

// Đảm bảo process tồn tại ở scope toàn cục để các thư viện node có thể dùng
if (!window.process) {
  window.process = process;
}

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
