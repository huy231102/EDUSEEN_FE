import api from './api';

const assignmentApi = {
  // Tạo bài tập mới
  create: (payload) => api.post('/api/assignments/create', payload),

  // Lấy danh sách bài tập của sinh viên đang đăng nhập
  getStudentAssignments: () => api.get('/api/assignments/student/assignments'),

  // Lấy chi tiết bài tập theo ID
  getDetail: (assignmentId) => api.get(`/api/assignments/${assignmentId}`),

  // Cập nhật bài tập
  update: (assignmentId, payload) => api.put(`/api/assignments/${assignmentId}`, payload),
};

export default assignmentApi; 