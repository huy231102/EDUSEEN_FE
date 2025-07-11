import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../common/style.css';

const LoginForm = ({ onForgotPassword }) => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate API call and get user data based on the new schema
    const userData = {
      user_id: 1,
      username: 'johndoe',
      email: 'john.doe@example.com',
      first_name: 'John',
      last_name: 'Doe',
      avatar_url: 'https://i.pravatar.cc/150?u=johndoe',
      role_id: 2,
    };
    login(userData);
    navigate('/');
  };

  return (
    <form className="auth-form" onSubmit={handleLogin}>
      <div className="form-group">
        <input type="email" placeholder="Email" required />
      </div>
      <div className="form-group">
        <input type="password" placeholder="Mật khẩu" required />
      </div>
      <button type="submit" className="primary-btn">
        Đăng nhập
      </button>
      <p className="forgot-password">
        <a
          href="#!"
          onClick={(e) => {
            e.preventDefault();
            onForgotPassword();
          }}
        >
          Quên mật khẩu?
        </a>
      </p>
    </form>
  );
};

export default LoginForm; 