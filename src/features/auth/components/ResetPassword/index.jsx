import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import userApi from 'services/userApi';
import { useToast } from 'components/common/Toast';
import '../common/style.css';

const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();

  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      showToast('Token không hợp lệ hoặc đã hết hạn.', 'error');
      navigate('/auth');
    }
  }, [searchParams, navigate, showToast]);

  // Hàm validate form trước khi gọi API
  const validateForm = () => {
    const errors = [];

    // Validate password
    if (!password) {
      errors.push('Mật khẩu mới là bắt buộc.');
    } else if (password.length < 8) {
      errors.push('Mật khẩu mới phải có ít nhất 8 ký tự.');
    } else if (password.length > 128) {
      errors.push('Mật khẩu mới không được dài quá 128 ký tự.');
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
      errors.push('Mật khẩu mới phải chứa ít nhất 1 chữ cái in hoa, 1 chữ cái thường, 1 số và 1 ký tự đặc biệt (@$!%*?&).');
    }

    // Validate confirm password
    if (password !== confirmPassword) {
      errors.push('Mật khẩu nhập lại không khớp.');
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
      await userApi.resetPassword(token, password, confirmPassword);
      showToast('Mật khẩu đã được đặt lại thành công!', 'success');
      navigate('/auth');
    } catch (error) {
      const apiMsg = error?.response?.data?.message || error?.message;
      showToast(apiMsg || 'Đặt lại mật khẩu thất bại. Vui lòng thử lại.', 'error');
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="form-group password-group">
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Mật khẩu mới"
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
          placeholder="Xác nhận mật khẩu mới"
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
        Đặt lại mật khẩu
      </button>
    </form>
  );
};

export default ResetPasswordForm; 