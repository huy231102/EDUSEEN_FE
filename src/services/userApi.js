import api from './api';

const userApi = {
  // ===== AUTHENTICATION APIs =====

  // Đăng nhập
  login: (email, password) => api.post('/api/auth/login', { email, password }),

  // Đăng ký
  register: ({ email, username, password }) => api.post('/api/auth/register', {
    Email: email,
    UserName: username,
    Password: password,
  }),

  // Quên mật khẩu
  forgotPassword: (email) => api.post('/api/auth/forgot-password', { Email: email }),

  // Đặt lại mật khẩu
  resetPassword: (token, newPassword, confirmPassword) => api.post('/api/auth/reset-password', {
    token,
    newPassword,
    confirmPassword,
  }),

  // Xác thực OTP
  verifyOTP: (email, otp) => api.post('/api/auth/verify-otp', {
    Email: email,
    Otp: otp,
  }),

  // Đổi mật khẩu
  changePassword: (formData) => api.post('/api/auth/change-password', formData),

  // ===== PROFILE APIs =====

  // Cập nhật thông tin profile
  updateProfile: ({ firstName, lastName, avatarUrl }) => api.put('/api/profile', {
    firstName,
    lastName,
    avatarUrl,
  }),

  // Lấy thông tin profile (nếu có API riêng)
  getProfile: () => api.get('/api/profile'),
};

export default userApi; 