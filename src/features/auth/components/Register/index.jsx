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
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      showToast('Mật khẩu nhập lại không khớp', 'error');
      return;
    }
    try {
      await userApi.register({ email, username, password });
      showToast('Đăng ký thành công! Vui lòng kiểm tra email để xác thực OTP.', 'success');
      navigate('/auth/verify-otp', { state: { email } });
    } catch (err) {
      console.error(err);
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
      <div className="form-group password-group">
        <input
          type={showConfirmPassword ? 'text' : 'password'}
          placeholder="Nhập lại mật khẩu"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          autoComplete="new-password"
        />
        <i
          className={`fa ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'} toggle-password`}
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        ></i>
      </div>
      <button type="submit" className="primary-btn">
        Đăng ký
      </button>
    </form>
  );
};

export default RegisterForm; 