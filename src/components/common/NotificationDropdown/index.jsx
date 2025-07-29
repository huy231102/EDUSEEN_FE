import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from 'features/auth/contexts/AuthContext';
import { useNotifications } from 'features/notifications/contexts/NotificationContext';
import './style.css';

const NotificationDropdown = () => {
  const { user } = useAuth();
  const location = useLocation();
  const {
    notifications,
    unreadCount,
    loading,
    loadNotifications,
    loadNotificationCount,
    refreshNotifications,
    markAsRead,
    markMultipleAsRead,
    markAllAsRead,
    deleteNotification,
    deleteMultipleNotifications,
    deleteAllNotifications,
    createTestData
  } = useNotifications();
  
  const [isOpen, setIsOpen] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Kiểm tra xem click có phải bên ngoài dropdown và trigger không
      if (dropdownRef.current && 
          !dropdownRef.current.contains(e.target) && 
          triggerRef.current && 
          !triggerRef.current.contains(e.target)) {
        setIsOpen(false);
        setSelectedNotifications([]);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Load thông báo khi component mount hoặc user thay đổi
  useEffect(() => {
    if (user?.userId) {
      loadNotifications();
      loadNotificationCount();
    }
  }, [user?.userId]);

  // Reload notifications khi chuyển trang
  useEffect(() => {
    if (user?.userId) {
      loadNotificationCount(true);
      if (isOpen) {
        refreshNotifications();
      }
    }
  }, [location.pathname]);

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      refreshNotifications();
    }
  };

  // Ngăn chặn dropdown đóng khi click bên trong
  const handleDropdownClick = (e) => {
    e.stopPropagation();
  };

  const handleCreateTestData = async () => {
    try {
      await createTestData();
      showToastMessage('Đã tạo dữ liệu test thành công', 'success');
    } catch (error) {
      console.error('Lỗi khi tạo dữ liệu test:', error);
      showToastMessage('Lỗi khi tạo dữ liệu test', 'error');
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
      showToastMessage('Đã đánh dấu đã đọc', 'success');
    } catch (error) {
      console.error('Lỗi khi đánh dấu đã đọc:', error);
      showToastMessage('Lỗi khi đánh dấu đã đọc', 'error');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      showToastMessage('Đã đánh dấu tất cả đã đọc', 'success');
    } catch (error) {
      console.error('Lỗi khi đánh dấu tất cả đã đọc:', error);
      showToastMessage('Lỗi khi đánh dấu tất cả đã đọc', 'error');
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await deleteNotification(notificationId);
      showToastMessage('Đã xóa thông báo', 'success');
    } catch (error) {
      console.error('Lỗi khi xóa thông báo:', error);
      showToastMessage('Lỗi khi xóa thông báo', 'error');
    }
  };

  const handleDeleteAllNotifications = async () => {
    try {
      await deleteAllNotifications();
      showToastMessage('Đã xóa tất cả thông báo', 'success');
    } catch (error) {
      console.error('Lỗi khi xóa tất cả thông báo:', error);
      showToastMessage('Lỗi khi xóa tất cả thông báo', 'error');
    }
  };

  const handleSelectNotification = (notificationId, e) => {
    // Ngăn chặn event bubbling để không đóng dropdown
    e.stopPropagation();
    
    setSelectedNotifications(prev => 
      prev.includes(notificationId)
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedNotifications.length === 0) return;
    
    try {
      await deleteMultipleNotifications(selectedNotifications);
      setSelectedNotifications([]);
      showToastMessage(`Đã xóa ${selectedNotifications.length} thông báo`, 'success');
    } catch (error) {
      console.error('Lỗi khi xóa thông báo đã chọn:', error);
      showToastMessage('Lỗi khi xóa thông báo đã chọn', 'error');
    }
  };

  const handleMarkSelectedAsRead = async () => {
    const selectedUnreadNotifications = selectedNotifications.filter(id => {
      const notification = notifications.find(n => n.notificationId === id);
      return notification && !notification.isRead;
    });

    if (selectedUnreadNotifications.length === 0) return;

    try {
      await markMultipleAsRead(selectedUnreadNotifications);
      setSelectedNotifications([]);
      showToastMessage(`Đã đánh dấu ${selectedUnreadNotifications.length} thông báo đã đọc`, 'success');
    } catch (error) {
      console.error('Lỗi khi đánh dấu thông báo đã chọn:', error);
      showToastMessage('Lỗi khi đánh dấu thông báo đã chọn', 'error');
    }
  };

  const showToastMessage = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Vừa xong';
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} giờ trước`;
    return date.toLocaleDateString('vi-VN');
  };

  // Kiểm tra có thông báo chưa đọc nào được chọn không
  const hasSelectedUnread = selectedNotifications.some(id => {
    const notification = notifications.find(n => n.notificationId === id);
    return notification && !notification.isRead;
  });

  if (!user?.userId) return null;

  return (
    <>
      <div 
        className="notification-trigger" 
        ref={triggerRef}
        onClick={handleToggleDropdown}
        title="Thông báo"
      >
        <i className="fa fa-bell icon"></i>
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}

        {isOpen && (
          <div 
            className="notification-dropdown" 
            ref={dropdownRef}
            onClick={handleDropdownClick}
          >
            <div className="notification-header">
              <div className="header-left">
                <h3>Thông báo</h3>
                {selectedNotifications.length > 0 && (
                  <span className="selection-count">
                    Đã chọn {selectedNotifications.length}
                  </span>
                )}
              </div>
              <div className="notification-actions">
                {notifications.length === 0 && (
                  <button 
                    className="action-btn test-data-btn"
                    onClick={handleCreateTestData}
                    title="Tạo dữ liệu test"
                  >
                    <i className="fa fa-plus"></i>
                  </button>
                )}
                {notifications.length > 0 && (
                  <>
                    {hasSelectedUnread && (
                      <button 
                        className="action-btn mark-selected-btn"
                        onClick={handleMarkSelectedAsRead}
                        title="Đánh dấu đã chọn đã đọc"
                      >
                        <i className="fa fa-check-double"></i>
                      </button>
                    )}
                    <button 
                      className="action-btn delete-all-btn"
                      onClick={handleDeleteAllNotifications}
                      title="Xóa tất cả"
                    >
                      <i className="fa fa-trash"></i>
                    </button>
                  </>
                )}
              </div>
            </div>

            {loading ? (
              <div className="notification-loading">
                <i className="fa fa-spinner fa-spin"></i>
                <span>Đang tải...</span>
              </div>
            ) : notifications.length === 0 ? (
              <div className="notification-empty">
                <i className="fa fa-bell-slash"></i>
                <span>Không có thông báo</span>
                <button 
                  className="create-test-data-btn"
                  onClick={handleCreateTestData}
                >
                  Tạo dữ liệu test
                </button>
              </div>
            ) : (
              <div className="notification-list">
                {notifications.map(notification => (
                  <div 
                    key={notification.notificationId} 
                    className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                  >
                    <div className="notification-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedNotifications.includes(notification.notificationId)}
                        onChange={(e) => handleSelectNotification(notification.notificationId, e)}
                      />
                    </div>
                    
                    <div className="notification-content">
                      <div className="notification-message">
                        {notification.message}
                      </div>
                      <div className="notification-time">
                        {formatTime(notification.createdAt)}
                      </div>
                    </div>
                    
                    <div className="notification-actions">
                      {!notification.isRead && (
                        <button 
                          className="action-btn mark-read-btn"
                          onClick={() => handleMarkAsRead(notification.notificationId)}
                          title="Đánh dấu đã đọc"
                        >
                          <i className="fa fa-check"></i>
                        </button>
                      )}
                      <button 
                        className="action-btn delete-btn"
                        onClick={() => handleDeleteNotification(notification.notificationId)}
                        title="Xóa thông báo"
                      >
                        <i className="fa fa-times"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {showToast && (
        <div className={`simple-toast ${toastType}`}>
          {toastMessage}
        </div>
      )}
    </>
  );
};

export default NotificationDropdown;