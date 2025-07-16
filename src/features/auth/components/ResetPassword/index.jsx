import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from 'services/api';
import { useToast } from 'components/common/Toast';
import '../common/style.css';

const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();

  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      showToast('Token không hợp lệ hoặc đã hết hạn.', 'error');
      navigate('/auth');
    }
  }, [searchParams, navigate, showToast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showToast('Mật khẩu không khớp.', 'error');
      return;
    }

    try {
      await api.post('/api/auth/reset-password', {
        token,
        newPassword: password,
        confirmPassword: confirmPassword,
      });
      showToast('Mật khẩu đã được đặt lại thành công!', 'success');
      navigate('/auth');
    } catch (error) {
      showToast('Đặt lại mật khẩu thất bại. Vui lòng thử lại.', 'error');
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="password"
          placeholder="Mật khẩu mới"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
        />
      </div>
      <div className="form-group">
        <input
          type="password"
          placeholder="Xác nhận mật khẩu mới"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          autoComplete="new-password"
        />
      </div>
      <button type="submit" className="primary-btn">
        Đặt lại mật khẩu
      </button>
    </form>
  );
};

export default ResetPasswordForm; 