import React from 'react';
import '../common/style.css';

const RegisterForm = () => {
  return (
    <form className="auth-form">
      <div className="form-group">
        <input type="text" placeholder="Họ và tên" required />
      </div>
      <div className="form-group">
        <input type="email" placeholder="Email" required />
      </div>
      <div className="form-group">
        <input type="password" placeholder="Mật khẩu" required />
      </div>
      <div className="form-group">
        <input type="password" placeholder="Xác nhận mật khẩu" required />
      </div>
      <button type="submit" className="primary-btn">
        Đăng ký
      </button>
    </form>
  );
};

export default RegisterForm; 