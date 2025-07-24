import api from './api';

const categoryApi = {
  // Lấy tất cả categories với số lượng course
  getCategories: () => api.get('/api/category'),
  // Lấy danh sách khóa học theo categoryId
  getCoursesByCategory: (categoryId) => api.get(`/api/category/${categoryId}/courses`),
};

export default categoryApi; 
export const getCategories = () => api.get('/api/category');
export const createCategory = (formData) =>
  api.post('/api/category', formData);
export const updateCategory = (id, formData) =>
  api.put(`/api/category/${id}`, formData);
export const deleteCategory = (id) => api.delete(`/api/category/${id}`); 