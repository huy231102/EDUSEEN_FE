import React from 'react';
import { Link } from 'react-router-dom';
import ResetPasswordForm from 'features/auth/components/ResetPassword';
import './style.css';
import Heading from 'components/common/Heading';

const ResetPasswordPage = () => {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <Heading
          subtitle="Đặt lại mật khẩu của bạn"
          title="Tạo mật khẩu mới"
        />
        <div className="auth-content">
            <ResetPasswordForm />
        </div>
        <div className="back-to-home">
          <Link to="/">Quay lại trang chủ</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage; 