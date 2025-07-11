import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../auth/contexts/AuthContext';
import './style.css';

const ProfilePage = () => {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    avatar_url: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        avatar_url: user.avatar_url,
      });
    } else {
      navigate('/auth');
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();
    const updatedUser = { ...user, ...formData };
    login(updatedUser); // Update user data in context
    alert('Profile updated successfully!');
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
            <p>@{formData.username}</p>
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
              <div className="form-field">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-field static">
                <label>Email</label>
                <span>{user.email}</span>
              </div>
              <div className="form-field static">
                <label>Role</label>
                <span>{user.role_id === 1 ? 'Admin' : 'User'}</span>
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