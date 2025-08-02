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
  const [timeLeft, setTimeLeft] = useState(600); // 10 phút = 600 giây
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      showToast('Không tìm thấy email. Vui lòng thử lại.', 'error');
      navigate('/auth/register');
    }
  }, [location.state, navigate, showToast]);

  // Lưu thông tin đăng ký vào localStorage khi component mount
  useEffect(() => {
    if (location.state?.registrationData) {
      localStorage.setItem('registrationData', JSON.stringify(location.state.registrationData));
    }
  }, [location.state]);

  // Đếm ngược thời gian
  useEffect(() => {
    // Chỉ start timer khi timeLeft > 0 và canResend = false
    if (timeLeft > 0 && !canResend) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            setCanResend(true);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft, canResend]); // Thêm dependencies để restart timer khi cần

  // Format thời gian hiển thị
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes === 0) {
      return `${remainingSeconds}s`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

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

  // Hàm gửi lại OTP
  const handleResendOTP = async () => {
    if (!canResend || isResending) return;

    setIsResending(true);
    try {
      // Lấy thông tin đăng ký từ localStorage
      const savedData = localStorage.getItem('registrationData');
      if (!savedData) {
        showToast('Không tìm thấy thông tin đăng ký. Vui lòng thử lại.', 'error');
        return;
      }

      const registrationData = JSON.parse(savedData);
      
      // Gọi API register để gửi lại OTP
      await userApi.resendOTP({
        email: registrationData.email,
        username: registrationData.username,
        password: registrationData.password
      });
      
      showToast('Đã gửi lại mã OTP mới! Vui lòng kiểm tra email.', 'success');
      
      // Reset timer và restart countdown
      setCanResend(false);
      setTimeLeft(600);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Gửi lại OTP thất bại';
      showToast(errorMessage, 'error');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <>
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
      
      {/* Phần gửi lại OTP */}
      <div className="resend-otp-section">
        <div className="timer-display">
          {!canResend ? (
            <span className="countdown">Mã OTP có hiệu lực trong: {formatTime(timeLeft)}</span>
          ) : (
            <span className="expired">Mã OTP đã hết hạn</span>
          )}
        </div>
        
        <button
          type="button"
          className={`resend-btn ${!canResend || isResending ? 'disabled' : ''}`}
          onClick={handleResendOTP}
          disabled={!canResend || isResending}
        >
          {isResending ? 'Đang gửi...' : 'Gửi lại mã OTP'}
        </button>
      </div>
    </>
  );
};

export default VerifyOTPForm; 