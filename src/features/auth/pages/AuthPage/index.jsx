import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LoginForm from 'features/auth/components/Login';
import RegisterForm from 'features/auth/components/Register';
import ForgotPasswordForm from 'features/auth/components/ForgotPassword';
import './style.css'
import Heading from 'components/common/Heading';

const AuthPage = () => {
  const location = useLocation();
  const [activeView, setActiveView] = useState('login');

  // Kiểm tra state từ navigation để chuyển về tab đăng ký nếu cần
  useEffect(() => {
    if (location.state?.activeView) {
      setActiveView(location.state.activeView);
    }
  }, [location.state]);

  const renderContent = () => {
    switch (activeView) {
      case 'login':
        return <LoginForm onForgotPassword={() => setActiveView('forgotPassword')} />;
      case 'register':
        return <RegisterForm />;
      case 'forgotPassword':
        return (
          <ForgotPasswordForm onBackToLogin={() => setActiveView('login')} />
        );
      default:
        return <LoginForm onForgotPassword={() => setActiveView('forgotPassword')} />;
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {activeView !== 'forgotPassword' ? (
          <>
            <Heading
              subtitle="Chào mừng"
              title={
                activeView === 'login'
                  ? 'Đăng nhập vào tài khoản của bạn'
                  : 'Tạo tài khoản mới'
              }
            />
            <div className="auth-tabs">
              <button
                className={`tab-btn ${
                  activeView === 'login' ? 'active' : ''
                }`}
                onClick={() => setActiveView('login')}
              >
                Đăng nhập
              </button>
              <button
                className={`tab-btn ${
                  activeView === 'register' ? 'active' : ''
                }`}
                onClick={() => setActiveView('register')}
              >
                Đăng ký
              </button>
            </div>
          </>
        ) : (
          <Heading
            subtitle="Quên mật khẩu?"
            title="Nhập email của bạn"
          />
        )}
        <div className="auth-content">{renderContent()}</div>
        <div className="back-to-home">
          <Link to="/">Quay lại trang chủ</Link>
        </div>
      </div>
    </div>
  );
};

export default AuthPage; 