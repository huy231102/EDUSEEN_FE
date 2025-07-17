import React, { useState } from 'react';
import userApi from 'services/userApi';
import { useToast } from 'components/common/Toast';
import '../common/style.css';

const ForgotPasswordForm = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await userApi.forgotPassword(email);
      showToast(
        'Nếu email của bạn tồn tại, một liên kết đặt lại mật khẩu đã được gửi.',
        'success'
      );
      onBackToLogin();
    } catch (error) {
      showToast('Gửi yêu cầu thất bại. Vui lòng thử lại.', 'error');
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="email"
          placeholder="Nhập email của bạn"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="primary-btn">
        Gửi yêu cầu
      </button>
      <p className="back-to-login">
        <a
          href="#!"
          onClick={(e) => {
            e.preventDefault();
            onBackToLogin();
          }}
        >
          Quay lại đăng nhập
        </a>
      </p>
    </form>
  );
};

export default ForgotPasswordForm; 