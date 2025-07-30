import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import userApi from 'services/userApi';
import { useToast } from 'components/common/Toast';
import '../common/style.css';

const VerifyOTPForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      showToast('Không tìm thấy email. Vui lòng thử lại.', 'error');
      navigate('/auth/register');
    }
  }, [location.state, navigate, showToast]);

  // Hàm validate form trước khi gọi API
  const validateForm = () => {
    const errors = [];

    // Validate OTP
    if (!otp.trim()) {
      errors.push('Mã OTP là bắt buộc.');
    } else if (!/^\d{6}$/.test(otp.trim())) {
      errors.push('Mã OTP phải có đúng 6 chữ số.');
    }

    return errors;
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    // Validate form trước khi gọi API
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      // Hiển thị lỗi đầu tiên qua Toast
      showToast(validationErrors[0], 'error');
      return;
    }

    try {
      await userApi.verifyOTP(email, otp);
      showToast('Xác thực OTP thành công! Vui lòng đăng nhập.', 'success');
      navigate('/auth');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Xác thực OTP thất bại';
      showToast(errorMessage, 'error');
    }
  };

  return (
    <form className="auth-form" onSubmit={handleVerifyOtp}>
      <div className="form-group">
        <input
          type="email"
          placeholder="Email"
          value={email}
          disabled
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          placeholder="Nhập mã OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="primary-btn">
        Xác thực
      </button>
    </form>
  );
};

export default VerifyOTPForm; 