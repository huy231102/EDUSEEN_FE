import api from './api';

export const courseApi = {
  // Lấy top reviews
  getTopReviews: () => api.get('/api/course/top-review'),
};

export default courseApi; 