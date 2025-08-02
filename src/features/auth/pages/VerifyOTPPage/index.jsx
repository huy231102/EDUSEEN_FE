import React from 'react';
import { Link } from 'react-router-dom';
import VerifyOTPForm from 'features/auth/components/VerifyOTP';
import './style.css';
import Heading from 'components/common/Heading';

const VerifyOTPPage = () => {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <Heading
          subtitle="Xác thực tài khoản của bạn"
          title="Nhập mã OTP"
        />
        <div className="auth-content">
            <VerifyOTPForm />
        </div>
        <div className="back-to-home">
          <Link to="/auth" state={{ fromOTP: true, activeView: 'register' }}>Quay lại đăng ký</Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTPPage; 