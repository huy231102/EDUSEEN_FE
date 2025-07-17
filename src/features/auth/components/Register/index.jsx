import React from 'react';
import { useState } from 'react';
import userApi from 'services/userApi';
import { useNavigate } from 'react-router-dom';
import { useToast } from 'components/common/Toast';
import '../common/style.css'

const RegisterForm = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await userApi.register({ email, username, password });
      showToast('Đăng ký thành công! Vui lòng kiểm tra email để xác thực OTP.', 'success');
      navigate('/auth/verify-otp', { state: { email } });
    } catch (err) {
      console.error(err);
      setError(err.message || 'Đăng ký thất bại');
      showToast(err.message || 'Đăng ký thất bại', 'error');
    }
  };

  return (
    <form className="auth-form" onSubmit={handleRegister}>
      <div className="form-group">
        <input
          type="text"
          placeholder="Tên người dùng"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoComplete="off"
        />
      </div>
      <div className="form-group">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="off"
        />
      </div>
      <div className="form-group password-group">
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
        />
        <i
          className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'} toggle-password`}
          onClick={() => setShowPassword(!showPassword)}
        ></i>
      </div>
      <button type="submit" className="primary-btn">
        Đăng ký
      </button>
      {error && <p className="error-text">{error}</p>}
    </form>
  );
};

export default RegisterForm; 