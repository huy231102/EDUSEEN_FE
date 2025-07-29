import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from 'features/auth/contexts/AuthContext';
import { notificationApi } from 'services/notificationApi';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(0);

  const loadNotifications = async (forceRefresh = false) => {
    if (!user?.userId) return;
    
    // Cache trong 30 giây
    const now = Date.now();
    if (!forceRefresh && now - lastUpdate < 30000) {
      return;
    }
    
    try {
      setLoading(true);
      const response = await notificationApi.getNotifications({
        page: 1,
        pageSize: 10
      });
      setNotifications(response.notifications || []);
      setLastUpdate(now);
    } catch (error) {
      console.error('Lỗi khi tải thông báo:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadNotificationCount = async (forceRefresh = false) => {
    if (!user?.userId) return;
    
    // Cache trong 30 giây
    const now = Date.now();
    if (!forceRefresh && now - lastUpdate < 30000) {
      return;
    }
    
    try {
      const response = await notificationApi.getNotificationCount();
      setUnreadCount(response.unreadCount || 0);
      setLastUpdate(now);
    } catch (error) {
      console.error('Lỗi khi tải số lượng thông báo:', error);
    }
  };

  const refreshNotifications = async () => {
    if (!user?.userId) return;
    
    try {
      setLoading(true);
      const [notificationsResponse, countResponse] = await Promise.all([
        notificationApi.getNotifications({ page: 1, pageSize: 10 }),
        notificationApi.getNotificationCount()
      ]);
      
      setNotifications(notificationsResponse.notifications || []);
      setUnreadCount(countResponse.unreadCount || 0);
      setLastUpdate(Date.now());
    } catch (error) {
      console.error('Lỗi khi refresh thông báo:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await notificationApi.markAsRead(notificationId);
      
      setNotifications(prev => 
        prev.map(notif => 
          notif.notificationId === notificationId 
            ? { ...notif, isRead: true }
            : notif
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Lỗi khi đánh dấu đã đọc:', error);
      throw error;
    }
  };

  const markMultipleAsRead = async (notificationIds) => {
    try {
      await notificationApi.markMultipleAsRead(notificationIds);
      
      const unreadCount = notifications.filter(n => 
        notificationIds.includes(n.notificationId) && !n.isRead
      ).length;
      
      setNotifications(prev => 
        prev.map(notif => 
          notificationIds.includes(notif.notificationId)
            ? { ...notif, isRead: true }
            : notif
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - unreadCount));
    } catch (error) {
      console.error('Lỗi khi đánh dấu nhiều thông báo đã đọc:', error);
      throw error;
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, isRead: true }))
      );
      
      setUnreadCount(0);
    } catch (error) {
      console.error('Lỗi khi đánh dấu tất cả đã đọc:', error);
      throw error;
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await notificationApi.deleteNotification(notificationId);
      
      const deletedNotification = notifications.find(n => n.notificationId === notificationId);
      setNotifications(prev => prev.filter(n => n.notificationId !== notificationId));
      
      if (deletedNotification && !deletedNotification.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Lỗi khi xóa thông báo:', error);
      throw error;
    }
  };

  const deleteMultipleNotifications = async (notificationIds) => {
    try {
      await notificationApi.deleteMultipleNotifications(notificationIds);
      
      const deletedUnreadCount = notifications.filter(n => 
        notificationIds.includes(n.notificationId) && !n.isRead
      ).length;
      
      setNotifications(prev => 
        prev.filter(n => !notificationIds.includes(n.notificationId))
      );
      
      setUnreadCount(prev => Math.max(0, prev - deletedUnreadCount));
    } catch (error) {
      console.error('Lỗi khi xóa nhiều thông báo:', error);
      throw error;
    }
  };

  const deleteAllNotifications = async () => {
    try {
      await notificationApi.deleteAllNotifications();
      
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error('Lỗi khi xóa tất cả thông báo:', error);
      throw error;
    }
  };

  const createTestData = async () => {
    try {
      await notificationApi.createTestData();
      await refreshNotifications();
    } catch (error) {
      console.error('Lỗi khi tạo dữ liệu test:', error);
      throw error;
    }
  };

  // Load notifications và count khi user thay đổi
  useEffect(() => {
    if (user?.userId) {
      loadNotifications();
      loadNotificationCount();
    }
  }, [user?.userId]);

  const value = {
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
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};