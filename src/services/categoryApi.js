import api from './api';

const categoryApi = {
  // Lấy tất cả categories với số lượng course
  getCategories: () => api.get('/api/category'),
  // Lấy danh sách khóa học theo categoryId
  getCoursesByCategory: (categoryId) => api.get(`/api/category/${categoryId}/courses`),
};

export default categoryApi; 
export const getCategories = () => api.get('/api/category');
export const createCategory = (categoryData) =>
  api.post('/api/category', categoryData);
export const updateCategory = (id, categoryData) =>
  api.put(`/api/category/${id}`, categoryData);
export const deleteCategory = (id) => api.delete(`/api/category/${id}`); 