import api from './api';

export const courseApi = {
  // Lấy top reviews
  getTopReviews: () => api.get('/api/course/top-review'),
  // Lưu khóa học yêu thích
  saveFavorite: (courseId) => api.post(`/api/course/favorite/${courseId}`),
  // Lấy top courses
  getTopCourses: (count = 9) => api.get(`/api/course/top-courses?count=${count}`),
  // Lấy chi tiết khóa học
  getCourseDetail: (courseId) => api.get(`/api/course/detail/${courseId}`),
  // Đăng ký khoá học
  enrollCourse: (courseId) => api.post(`/api/course/enroll/${courseId}`),
};

export default courseApi; 