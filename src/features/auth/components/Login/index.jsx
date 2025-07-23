import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'features/auth/contexts/AuthContext';
import { useToast } from 'components/common/Toast';
import userApi from 'services/userApi';
import '../common/style.css'

const LoginForm = ({ onForgotPassword }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  // Không còn dùng error state để hiển thị ra UI

  const handleLogin = async (e) => {
    e.preventDefault();
    // reset bất cứ trạng thái nội bộ nếu cần
    try {
      const res = await userApi.login(email, password);
      // API trả về { Message, Token: { AccessToken, RefreshToken }, User }
      const tokenObj = res.token || res.Token || {};
      const accessToken = tokenObj.accessToken || tokenObj.AccessToken;
      if (!accessToken) throw new Error('Không nhận được access token');

      // Lấy thông tin người dùng
      const userObj = res.user || null;
      console.log('userObj', userObj);

      // Lưu token và user vào context
      login(accessToken, userObj);
      showToast('Đăng nhập thành công', 'success');
      console.log('tokenObj', tokenObj)
      console.log('accessToken', accessToken);
      if (userObj && Number(userObj.roleId) === 2) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error(err);
      const apiMsg = err?.response?.data?.error || err?.response?.data?.message || err?.message;
      showToast(apiMsg || 'Đăng nhập thất bại', 'error');
    }
  };

  return (
    <form className="auth-form" onSubmit={handleLogin}>
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
          autoComplete="current-password"
        />
        <i
          className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'} toggle-password`}
          onClick={() => setShowPassword(!showPassword)}
        ></i>
      </div>
      <button type="submit" className="primary-btn">
        Đăng nhập
      </button>
      {/* Ẩn hiển thị lỗi chi tiết trên UI */}
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