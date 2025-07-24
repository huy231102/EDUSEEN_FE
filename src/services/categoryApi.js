import api from './api';

export const getCategories = () => api.get('/api/category');
export const createCategory = (formData) =>
  api.post('/api/category', formData);
export const updateCategory = (id, formData) =>
  api.put(`/api/category/${id}`, formData);
export const deleteCategory = (id) => api.delete(`/api/category/${id}`); 