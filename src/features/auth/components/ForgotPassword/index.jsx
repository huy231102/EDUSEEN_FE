import React, { useState } from 'react';
import userApi from 'services/userApi';
import { useToast } from 'components/common/Toast';
import '../common/style.css';

const ForgotPasswordForm = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const { showToast } = useToast();

  // Hàm validate form trước khi gọi API
  const validateForm = () => {
    const errors = [];

    // Validate email
    if (!email.trim()) {
      errors.push('Email là bắt buộc.');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('Email không hợp lệ.');
    } else if (email.length > 255) {
      errors.push('Email không được dài quá 255 ký tự.');
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form trước khi gọi API
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      // Hiển thị lỗi đầu tiên qua Toast
      showToast(validationErrors[0], 'error');
      return;
    }

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