import api from './api';

const categoryApi = {
  // Lấy tất cả categories với số lượng course
  getCategories: () => api.get('/api/category'),
  // Lấy danh sách khóa học theo categoryId
  getCoursesByCategory: (categoryId) => api.get(`/api/category/${categoryId}/courses`),
};

export default categoryApi; 