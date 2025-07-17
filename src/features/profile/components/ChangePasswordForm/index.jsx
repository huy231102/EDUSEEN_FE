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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmNewPassword) {
      showToast('Mật khẩu mới không khớp.', 'error');
      return;
    }
    try {
      await userApi.changePassword(formData);
      showToast('Đổi mật khẩu thành công!', 'success');
      onClose();
    } catch (err) {
      const message = err.response?.data?.message || 'Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu hiện tại.';
      showToast(message, 'error');
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