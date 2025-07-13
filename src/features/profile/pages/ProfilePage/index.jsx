import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../auth/contexts/AuthContext';
import api from 'services/api';
import { useToast } from 'components/common/Toast';
import './style.css'

const ProfilePage = () => {
  const { user, login, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

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

  const handleSaveChanges = async (e) => {
    e.preventDefault();

    try {
      // Map formData sang định dạng BE yêu cầu
      const body = {
        // Chỉ gửi các trường cho phép cập nhật
        firstName: formData.first_name,
        lastName: formData.last_name,
        avatarUrl: formData.avatar_url,
      };

      await api.put('/api/profile', body);

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
                src={formData.avatar_url || 'https://i.pravatar.cc/150'}
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
              onClick={handleLogout}
              className="primary-btn logout-button"
            >
              Đăng xuất
            </button>
          </div>
          <div className="profile-card-right">
            <h3>User Profile</h3>
            <form onSubmit={handleSaveChanges} className="profile-form">
              <div className="form-field">
                <label htmlFor="avatar_url">Avatar URL</label>
                <input
                  type="text"
                  id="avatar_url"
                  name="avatar_url"
                  value={formData.avatar_url}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-field">
                <label htmlFor="first_name">First Name</label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-field">
                <label htmlFor="last_name">Last Name</label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-field static">
                <label>Username</label>
                <span>{user.username}</span>
              </div>
              <div className="form-field static">
                <label>Email</label>
                <span>{user.email}</span>
              </div>
              <div className="form-field static">
                <label>Role</label>
                <span>{user.roleName}</span>
              </div>
              <div className="form-actions">
                <button type="submit" className="primary-btn save-btn">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 