import api from './api';

const teacherCourseApi = {
  // Lấy chi tiết khóa học cho giáo viên (bao gồm Sections & Lectures)
  getDetail: (courseId) => api.get(`/api/teacher/course/${courseId}`),
};

export default teacherCourseApi; 