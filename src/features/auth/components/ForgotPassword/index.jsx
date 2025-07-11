import React from 'react';
import '../common/style.css';

const ForgotPasswordForm = ({ onBackToLogin }) => {
  return (
    <form className="auth-form">
      <div className="form-group">
        <input type="email" placeholder="Nhập email của bạn" required />
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