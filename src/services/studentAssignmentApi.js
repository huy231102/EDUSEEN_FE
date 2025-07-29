import api from './api';

const studentAssignmentApi = {
  // Lấy chi tiết bài tập theo ID
  getDetail: (assignmentId) => api.get(`/api/assignments/${assignmentId}`),

  // Nộp bài tập
  studentSubmitAssignment: (assignmentId, payload) => api.put(`/api/studentSubmission/${assignmentId}`, payload),

  // Lấy thông tin bài nộp mới nhất của học sinh
  getSubmissionDetail: (assignmentId) => api.get(`/api/studentSubmission/${assignmentId}`),

  // Lấy lịch sử tất cả bài nộp của học sinh
  getSubmissionHistory: (assignmentId) => api.get(`/api/studentSubmission/${assignmentId}/history`),
};

export default studentAssignmentApi; 