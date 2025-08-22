import React from 'react';
import { useState, useEffect } from 'react';
import userApi from 'services/userApi';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from 'components/common/Toast';
import '../common/style.css'

const RegisterForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);

  // Khôi phục thông tin đăng ký từ localStorage nếu có
  useEffect(() => {
    const savedData = localStorage.getItem('registrationData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setUsername(parsedData.username || '');
        setEmail(parsedData.email || '');
        setPassword(parsedData.password || '');
        setConfirmPassword(parsedData.confirmPassword || '');
        
        // Xóa dữ liệu đã lưu sau khi khôi phục
        localStorage.removeItem('registrationData');
      } catch (error) {
        console.error('Lỗi khi khôi phục dữ liệu đăng ký:', error);
      }
    }
  }, []);

  // Kiểm tra nếu quay lại từ OTP và có dữ liệu đăng ký
  useEffect(() => {
    if (location.state?.fromOTP) {
      const savedData = localStorage.getItem('registrationData');
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          setUsername(parsedData.username || '');
          setEmail(parsedData.email || '');
          setPassword(parsedData.password || '');
          setConfirmPassword(parsedData.confirmPassword || '');
          
          // Xóa dữ liệu đã lưu sau khi khôi phục
          localStorage.removeItem('registrationData');
        } catch (error) {
          console.error('Lỗi khi khôi phục dữ liệu đăng ký:', error);
        }
      }
    }
  }, [location.state]);

  // Hàm validate form trước khi gọi API
  const validateForm = () => {
    const errors = [];

    // Validate username
    if (!username.trim()) {
      errors.push('Tên người dùng là bắt buộc.');
    } else if (username.trim().length < 3) {
      errors.push('Tên người dùng phải có ít nhất 3 ký tự.');
    } else if (username.trim().length > 50) {
      errors.push('Tên người dùng không được vượt quá 50 ký tự.');
    } else if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) {
      errors.push('Tên người dùng chỉ được chứa chữ cái, số và dấu gạch dưới.');
    }

    // Validate email
    if (!email.trim()) {
      errors.push('Email là bắt buộc.');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('Email không hợp lệ.');
    } else if (email.length > 255) {
      errors.push('Email không được dài quá 255 ký tự.');
    }

    // Validate password
    if (!password) {
      errors.push('Mật khẩu là bắt buộc.');
    } else if (password.length < 8) {
      errors.push('Mật khẩu phải có ít nhất 8 ký tự.');
    } else if (password.length > 128) {
      errors.push('Mật khẩu không được dài quá 128 ký tự.');
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
      errors.push('Mật khẩu phải chứa ít nhất 1 chữ cái in hoa, 1 chữ cái thường, 1 số và 1 ký tự đặc biệt (@$!%*?&).');
    }

    // Validate confirm password
    if (password !== confirmPassword) {
      errors.push('Mật khẩu nhập lại không khớp.');
    }

    return errors;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate form trước khi gọi API
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      // Hiển thị lỗi đầu tiên qua Toast
      showToast(validationErrors[0], 'error');
      return;
    }

    try {
      await userApi.register({ email, username, password });
      showToast('Đăng ký thành công! Vui lòng kiểm tra email để xác thực OTP.', 'success');
      
      // Lưu thông tin đăng ký để có thể khôi phục nếu cần
      const registrationData = {
        username,
        email,
        password,
        confirmPassword
      };
      
      navigate('/auth/verify-otp', { 
        state: { 
          email,
          registrationData 
        } 
      });
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Đăng ký thất bại', 'error');
    }
  };

  return (
    <form className="auth-form" onSubmit={handleRegister}>
      <div>
        <input
          type="text"
          placeholder="Tên người dùng"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoComplete="off"
        />
      </div>
      <div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="off"
        />
      </div>
      <div className="password-group">
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Mật khẩu"
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
      <div className="password-group">
        <input
          type={showConfirmPassword ? 'text' : 'password'}
          placeholder="Nhập lại mật khẩu"
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
        Đăng ký
      </button>
    </form>
  );
};

export default RegisterForm; 