import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../auth/contexts/AuthContext';
import userApi from 'services/userApi';
import { useToast } from 'components/common/Toast';
import ChangePasswordForm from '../../components/ChangePasswordForm';
import ImgContentUpload from 'components/common/ImgContentUpload';
import './style.css'

const ProfilePage = () => {
  const { user, login, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [showChangePassword, setShowChangePassword] = useState(false);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    avatar_url: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.firstName,
        last_name: user.lastName,
        avatar_url: user.avatarUrl,
      });
    } else {
      navigate('/auth');
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarUpload = (avatarUrl) => {
    setFormData((prev) => ({ ...prev, avatar_url: avatarUrl }));
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();

    try {
      // Map formData sang định dạng BE yêu cầu
      await userApi.updateProfile({
        firstName: formData.first_name,
        lastName: formData.last_name,
        avatarUrl: formData.avatar_url,
      });

      // Cập nhật context với dữ liệu mới
      const updatedUser = {
        ...user,
        firstName: formData.first_name,
        lastName: formData.last_name,
        avatarUrl: formData.avatar_url,
      };
      login(null, updatedUser);

      showToast('Cập nhật hồ sơ thành công', 'success');
    } catch (err) {
      console.error(err);
      showToast('Cập nhật hồ sơ thất bại', 'error');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="profile-page-background">
      <div className="profile-card-container">
        <Link to="/" className="back-icon" title="Back to Home">
          <i className="fa fa-arrow-left"></i>
        </Link>
        <div className="profile-card-content">
          <div className="profile-card-left">
            <div className="avatar-container">
              <img
                src={formData.avatar_url || '/images/default-avatar-profile.jpg'}
                alt="Avatar"
                className="avatar-image"
              />
            </div>
            <h2>
              {formData.first_name} {formData.last_name}
            </h2>
            <p>@{user.username}</p>
            <Link to="/my-courses" className="primary-btn" style={{ marginBottom: '10px' }}>
              Khóa học của tôi
            </Link>
            <button
              type="button"
              className="primary-btn change-password-btn"
              style={{ marginBottom: '10px' }}
              onClick={() => setShowChangePassword(true)}
            >
              Đổi mật khẩu
            </button>
            <button
              onClick={handleLogout}
              className="primary-btn logout-button"
            >
              Đăng xuất
            </button>
          </div>
          <div className="profile-card-right">
            <h3>Thông tin người dùng</h3>
            <form onSubmit={handleSaveChanges} className="profile-form">
              <div className="form-field">
                <ImgContentUpload
                  onUploaded={handleAvatarUpload}
                  defaultUrl={formData.avatar_url}
                  label="Ảnh đại diện"
                />
              </div>
              <div className="form-field">
                <label htmlFor="first_name">Họ</label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-field">
                <label htmlFor="last_name">Tên</label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-field static">
                <label>Tên người dùng</label>
                <span>{user.username}</span>
              </div>
              <div className="form-field static">
                <label>Email</label>
                <span>{user.email}</span>
              </div>
              <div className="form-field static">
                <label>Vai trò</label>
                <span>
                  {user.roleName === 'User' 
                    ? 'Học sinh' 
                    : user.roleName === 'Teacher' 
                    ? 'Giáo viên' 
                    : 'Quản trị viên'
                  }
                </span>
              </div>
              <div className="form-actions">
                <button type="submit" className="primary-btn save-btn">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
        {showChangePassword && <ChangePasswordForm onClose={() => setShowChangePassword(false)} />}
      </div>
    </div>
  );
};

export default ProfilePage; 