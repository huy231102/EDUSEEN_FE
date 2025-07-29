import api from './api';

export const notificationApi = {
  // Tạo dữ liệu test (chỉ dùng cho development)
  createTestData: async () => {
    const response = await api.post('/api/notification/create-test-data');
    return response;
  },

  // Lấy danh sách thông báo của user
  getNotifications: async (params = {}) => {
    const { page = 1, pageSize = 20, isRead } = params;
    const queryParams = new URLSearchParams();
    
    if (page) queryParams.append('page', page);
    if (pageSize) queryParams.append('pageSize', pageSize);
    if (isRead !== undefined) queryParams.append('isRead', isRead);
    
    const response = await api.get(`/api/notification/user?${queryParams}`);
    return response;
  },

  // Lấy số lượng thông báo
  getNotificationCount: async () => {
    const response = await api.get('/api/notification/user/count');
    return response;
  },

  // Đánh dấu một thông báo đã đọc
  markAsRead: async (notificationId) => {
    const response = await api.put('/api/notification/mark-as-read', {
      notificationId
    });
    return response;
  },

  // Đánh dấu nhiều thông báo đã đọc
  markMultipleAsRead: async (notificationIds) => {
    const response = await api.put('/api/notification/mark-multiple-as-read', {
      notificationIds
    });
    return response;
  },

  // Đánh dấu tất cả thông báo đã đọc
  markAllAsRead: async () => {
    const response = await api.put('/api/notification/user/mark-all-as-read');
    return response;
  },

  // Xóa một thông báo
  deleteNotification: async (notificationId) => {
    const response = await api.delete('/api/notification/delete', {
      notificationId
    });
    return response;
  },

  // Xóa nhiều thông báo
  deleteMultipleNotifications: async (notificationIds) => {
    const response = await api.delete('/api/notification/delete-multiple', {
      notificationIds
    });
    return response;
  },

  // Xóa tất cả thông báo
  deleteAllNotifications: async () => {
    const response = await api.delete('/api/notification/user/delete-all');
    return response;
  }
};