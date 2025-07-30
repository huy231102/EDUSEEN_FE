import React, { useState } from 'react';
import userApi from 'services/userApi';
import { useToast } from 'components/common/Toast';
import './style.css';

const ChangePasswordForm = ({ onClose }) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Hàm validate form trước khi gọi API
  const validateForm = () => {
    const errors = [];

    // Validate current password
    if (!formData.currentPassword) {
      errors.push('Mật khẩu hiện tại là bắt buộc.');
    }

    // Validate new password
    if (!formData.newPassword) {
      errors.push('Mật khẩu mới là bắt buộc.');
    } else if (formData.newPassword.length < 8) {
      errors.push('Mật khẩu mới phải có ít nhất 8 ký tự.');
    } else if (formData.newPassword.length > 128) {
      errors.push('Mật khẩu mới không được dài quá 128 ký tự.');
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(formData.newPassword)) {
      errors.push('Mật khẩu mới phải chứa ít nhất 1 chữ cái in hoa, 1 chữ cái thường, 1 số và 1 ký tự đặc biệt (@$!%*?&).');
    }

    // Validate confirm new password
    if (formData.newPassword !== formData.confirmNewPassword) {
      errors.push('Mật khẩu mới nhập lại không khớp.');
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
      await userApi.changePassword(formData);
      showToast('Đổi mật khẩu thành công!', 'success');
      onClose();
    } catch (err) {
      const apiMsg = err?.response?.data?.message || err?.response?.data?.error || err?.message;
      showToast(apiMsg || 'Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu hiện tại.', 'error');
      console.error(err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Đổi mật khẩu</h3>
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-field">
            <label htmlFor="currentPassword">Mật khẩu hiện tại</label>
            <div className="password-input-wrapper">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                required
              />
              <i
                className={`fa ${showCurrentPassword ? 'fa-eye-slash' : 'fa-eye'} toggle-password`}
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              ></i>
            </div>
          </div>
          <div className="form-field">
            <label htmlFor="newPassword">Mật khẩu mới</label>
            <div className="password-input-wrapper">
              <input
                type={showNewPassword ? 'text' : 'password'}
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                required
              />
              <i
                className={`fa ${showNewPassword ? 'fa-eye-slash' : 'fa-eye'} toggle-password`}
                onClick={() => setShowNewPassword(!showNewPassword)}
              ></i>
            </div>
          </div>
          <div className="form-field">
            <label htmlFor="confirmNewPassword">Xác nhận mật khẩu mới</label>
            <div className="password-input-wrapper">
              <input
                type={showConfirmNewPassword ? 'text' : 'password'}
                id="confirmNewPassword"
                name="confirmNewPassword"
                value={formData.confirmNewPassword}
                onChange={handleInputChange}
                required
              />
              <i
                className={`fa ${showConfirmNewPassword ? 'fa-eye-slash' : 'fa-eye'} toggle-password`}
                onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
              ></i>
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="secondary-btn" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="primary-btn save-btn">
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordForm; 