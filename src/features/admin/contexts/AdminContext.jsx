import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from 'services/api';
import { getCategories, createCategory, updateCategory, deleteCategory } from 'services/categoryApi';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [userStatistics, setUserStatistics] = useState({});
  const [courseStatistics, setCourseStatistics] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    try {
      const response = await api.get("/api/admin/user");
      const data = Array.isArray(response) ? response : (response?.data || []);
      
      if (Array.isArray(data) && data.length > 0) {
        const mappedUsers = data.map(user => ({
          id: user.userId,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          email: user.email,
          username: user.username,
          role: user.roleId === 1 ? "Học sinh" : user.roleId === 2 ? "Quản trị viên" : "Giáo viên",
          status: user.isActive ? "Hoạt động" : "Đã khóa",
          joined: user.createdAt,
          lastActive: user.updatedAt || "Chưa đăng nhập",
          avatar: user.avatarUrl || "",
        }));
        setUsers(mappedUsers);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách người dùng:', error);
      setUsers([]);
    }
  }, []);

  // Fetch courses
  const fetchCourses = useCallback(async () => {
    try {
      const response = await api.get("/api/admin/course");
      const data = Array.isArray(response) ? response : (response?.data || []);
      
      if (Array.isArray(data) && data.length > 0) {
        const mappedCourses = data.map(course => ({
          id: course.courseId,
          name: course.title,
          code: course.courseId.toString(),
          teacher: course.teacherName || 'Chưa có giáo viên',
          createdAt: course.createdAt,
          status: course.isActive ? 'Đã duyệt' : 'Chờ duyệt',
          students: course.studentCount || 0,
          description: course.description,
          category: course.categoryName,
          level: course.level,
          sectionCount: course.sectionCount || 0,
          lectureCount: course.lectureCount || 0,
          averageRating: course.averageRating,
          reviewCount: course.reviewCount || 0,
          thumbnailUrl: course.thumbnailUrl
        }));
        setCourses(mappedCourses);
      } else {
        setCourses([]);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách khóa học:', error);
      setCourses([]);
    }
  }, []);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const response = await getCategories();
      setCategories(response || []);
    } catch (error) {
      console.error('Lỗi khi tải danh mục:', error);
      setCategories([]);
    }
  }, []);

  // Fetch user statistics
  const fetchUserStatistics = useCallback(async () => {
    try {
      const response = await api.get("/api/admin/user/statistics");
      const data = response?.data || response;
      setUserStatistics(data || {});
    } catch (error) {
      console.error('Lỗi khi tải thống kê người dùng:', error);
      setUserStatistics({});
    }
  }, []);

  // Fetch course statistics
  const fetchCourseStatistics = useCallback(async () => {
    try {
      const response = await api.get("/api/admin/course/statistics");
      setCourseStatistics(response.data || {});
    } catch (error) {
      console.error('Lỗi khi tải thống kê khóa học:', error);
      setCourseStatistics({});
    }
  }, []);

  // Update user
  const updateUser = useCallback(async (userId, userData) => {
    try {
      await api.put(`/api/admin/user/${userId}`, userData);
      await fetchUsers();
      return { success: true };
    } catch (error) {
      console.error('Lỗi khi cập nhật người dùng:', error);
      return { success: false, error: error.message };
    }
  }, [fetchUsers]);

  // Update course
  const updateCourse = useCallback(async (courseId, courseData) => {
    try {
      await api.put(`/api/admin/course/${courseId}`, courseData);
      await fetchCourses();
      return { success: true };
    } catch (error) {
      console.error('Lỗi khi cập nhật khóa học:', error);
      return { success: false, error: error.message };
    }
  }, [fetchCourses]);

  // Delete course
  const deleteCourse = useCallback(async (courseId) => {
    try {
      await api.delete(`/api/admin/course/${courseId}`);
      await fetchCourses();
      return { success: true };
    } catch (error) {
      console.error('Lỗi khi xóa khóa học:', error);
      return { success: false, error: error.message };
    }
  }, [fetchCourses]);

  // Toggle user status
  const toggleUserStatus = useCallback(async (userId, currentStatus) => {
    try {
      const newStatus = currentStatus === "Hoạt động" ? "Đã khóa" : "Hoạt động";
      await api.put(`/api/admin/user/${userId}/status`, { status: newStatus });
      await fetchUsers();
      return { success: true };
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái người dùng:', error);
      return { success: false, error: error.message };
    }
  }, [fetchUsers]);

  // Toggle course status
  const toggleCourseStatus = useCallback(async (courseId, currentStatus) => {
    try {
      const newStatus = currentStatus === "Đã duyệt" ? "Chờ duyệt" : "Đã duyệt";
      await api.put(`/api/admin/course/${courseId}/status`, { status: newStatus });
      await fetchCourses();
      return { success: true };
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái khóa học:', error);
      return { success: false, error: error.message };
    }
  }, [fetchCourses]);

  // Create category
  const createCategoryHandler = useCallback(async (categoryData) => {
    try {
      await createCategory(categoryData);
      await fetchCategories();
      return { success: true };
    } catch (error) {
      console.error('Lỗi khi tạo danh mục:', error);
      return { success: false, error: error.message };
    }
  }, [fetchCategories]);

  // Update category
  const updateCategoryHandler = useCallback(async (categoryId, categoryData) => {
    try {
      await updateCategory(categoryId, categoryData);
      await fetchCategories();
      return { success: true };
    } catch (error) {
      console.error('Lỗi khi cập nhật danh mục:', error);
      return { success: false, error: error.message };
    }
  }, [fetchCategories]);

  // Delete category
  const deleteCategoryHandler = useCallback(async (categoryId) => {
    try {
      await deleteCategory(categoryId);
      await fetchCategories();
      return { success: true };
    } catch (error) {
      console.error('Lỗi khi xóa danh mục:', error);
      return { success: false, error: error.message };
    }
  }, [fetchCategories]);

  useEffect(() => {
    fetchAllData();
  }, [fetchUsers, fetchCourses, fetchCategories, fetchUserStatistics, fetchCourseStatistics]);

  const value = {
    users,
    courses,
    categories,
    userStatistics,
    courseStatistics,
    loading,
    fetchUsers,
    fetchCourses,
    fetchCategories,
    fetchUserStatistics,
    fetchCourseStatistics,
    updateUser,
    updateCourse,
    deleteCourse,
    toggleUserStatus,
    toggleCourseStatus,
    createCategory: createCategoryHandler,
    updateCategory: updateCategoryHandler,
    deleteCategory: deleteCategoryHandler,
    refreshAll: fetchAllData
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}; 