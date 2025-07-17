import api from './api';

const categoryApi = {
  // Lấy tất cả categories với số lượng course
  getCategories: () => api.get('/api/category'),
};

export default categoryApi; 