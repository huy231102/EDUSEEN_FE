import React, { useState, useEffect } from "react";
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, IconButton, TextField, Tooltip, Dialog, DialogTitle, 
  DialogContent, DialogActions, TablePagination, Avatar, InputAdornment, 
  Chip, Button, Grid
} from "@material-ui/core";
import { 
  Search, Info, Edit, Delete, Refresh, PlayArrow, AccessTime, 
  TrendingUp, CheckCircle, Block, School, Person 
} from "@material-ui/icons";
import { format } from 'date-fns';
import api from "services/api";

// Import CSS
import './style.css';

import { useAdmin } from "../../contexts/AdminContext.jsx";

const CourseManagementPage = () => {
  const { courses, loading, fetchCourses, deleteCourse, toggleCourseStatus } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Đang tải dữ liệu khóa học...');
        await fetchCourses();
        console.log('Dữ liệu khóa học đã được tải:', courses);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu khóa học:', error);
        setToast({ open: true, message: 'Lỗi khi tải dữ liệu khóa học!', severity: 'error' });
      }
    };
    loadData();
  }, [fetchCourses]);

  // Debug logging
  useEffect(() => {
    console.log('Courses state updated:', courses);
    console.log('Loading state:', loading);
  }, [courses, loading]);

  // Auto-hide toast
  useEffect(() => {
    if (toast.open) {
      const timer = setTimeout(() => {
        setToast(prev => ({ ...prev, open: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.open]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDetail = (course) => {
    setSelectedCourse(course);
    setOpenDetail(true);
  };

  const handleCloseDetail = () => setOpenDetail(false);

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khóa học này?')) {
      try {
        const result = await deleteCourse(courseId);
        if (result.success) {
          setToast({ open: true, message: 'Xóa khóa học thành công!', severity: 'success' });
        } else {
          setToast({ open: true, message: 'Xóa khóa học thất bại!', severity: 'error' });
        }
      } catch (error) {
        setToast({ open: true, message: 'Xóa khóa học thất bại!', severity: 'error' });
      }
    }
  };

  const handleToggleCourseStatus = async (courseId, currentStatus) => {
    try {
      const result = await toggleCourseStatus(courseId, currentStatus);
      if (result.success) {
        setToast({ open: true, message: 'Cập nhật trạng thái thành công!', severity: 'success' });
      } else {
        setToast({ open: true, message: 'Cập nhật trạng thái thất bại!', severity: 'error' });
      }
    } catch (error) {
      setToast({ open: true, message: 'Cập nhật trạng thái thất bại!', severity: 'error' });
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || course.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const paginatedCourses = filteredCourses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const uniqueCategories = [...new Set(courses.map(course => course.category))];

  return (
    <Box>
      {/* Header Section */}
      <Box className="course-management-header">
        <Button
          variant="contained"
          startIcon={<Refresh />}
          onClick={fetchCourses}
          className="course-management-refresh-btn"
        >
          Làm mới
        </Button>
      </Box>

      {/* Filters Section */}
      <Paper elevation={2} className="course-management-filters">
        <Box display="flex" gap={2} flexWrap="wrap">
          <TextField
            label="Tìm kiếm khóa học"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            className="course-management-search-field"
          />
          
                     <TextField
            select
            label="Danh mục"
            variant="outlined"
            size="small"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="course-management-filter-select"
          >
            <option value="">Tất cả</option>
            {uniqueCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </TextField>
        </Box>
      </Paper>

      {/* Courses Table */}
      <Paper elevation={2} className="course-management-table">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Khóa học</TableCell>
                <TableCell>Giáo viên</TableCell>
                <TableCell>Danh mục</TableCell>
                <TableCell>Học viên</TableCell>
                <TableCell>Đánh giá</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
                             {loading ? (
                 <TableRow>
                   <TableCell colSpan={7} align="center">
                     <Box display="flex" justifyContent="center" alignItems="center" py={4}>
                       <Typography variant="body1">Đang tải dữ liệu...</Typography>
                     </Box>
                   </TableCell>
                 </TableRow>
               ) : paginatedCourses.length === 0 ? (
                 <TableRow>
                   <TableCell colSpan={7} align="center">
                     <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" py={4}>
                       <Typography variant="body1" color="textSecondary">
                         {courses.length === 0 ? 'Không có khóa học nào' : 'Không tìm thấy khóa học phù hợp'}
                       </Typography>
                       <Typography variant="caption" color="textSecondary" mt={1}>
                         {courses.length === 0 ? 'Hãy thử làm mới trang hoặc kiểm tra kết nối mạng' : 'Thử thay đổi bộ lọc tìm kiếm'}
                       </Typography>
                     </Box>
                   </TableCell>
                 </TableRow>
              ) : (
                paginatedCourses.map((course) => (
                <TableRow key={course.id} hover>
                  <TableCell>
                    <Box className="course-info-cell">
                      <Avatar 
                        src={course.thumbnailUrl} 
                        variant="rounded"
                        className="course-avatar"
                      >
                        <School />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" className="course-name">
                          {course.name}
                        </Typography>
                        <Typography variant="caption" className="course-description">
                          {course.description?.substring(0, 50)}...
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box className="course-teacher-cell">
                      <Person className="course-teacher-icon" />
                      <Typography variant="body2">{course.teacher}</Typography>
                    </Box>
                  </TableCell>
                                     <TableCell>
                     <Chip
                       label={course.category}
                       size="small"
                       className="course-category-chip"
                     />
                   </TableCell>
                   <TableCell>
                    <Box className="course-students-cell">
                      <Typography variant="body2" className="course-students-count">
                        {course.students}
                      </Typography>
                      <Typography variant="caption" className="course-students-label">
                        học viên
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box className="course-rating-cell">
                      <CheckCircle className="course-rating-icon" />
                      <Typography variant="body2" className="course-rating-value">
                        {course.averageRating ? course.averageRating.toFixed(1) : '0.0'}
                      </Typography>
                      <Typography variant="caption" className="course-rating-count">
                        ({course.reviewCount})
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {course.createdAt ? format(new Date(course.createdAt), 'dd/MM/yyyy') : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Box className="course-action-buttons">
                      <Tooltip title="Xem chi tiết">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDetail(course)}
                          className="course-action-btn info"
                        >
                          <Info />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={course.status === "Đã duyệt" ? "Hủy duyệt" : "Duyệt khóa học"}>
                        <IconButton
                          size="small"
                          onClick={() => handleToggleCourseStatus(course.id, course.status)}
                          className={`course-action-btn toggle ${course.status === "Đã duyệt" ? 'edit' : 'info'}`}
                        >
                          {course.status === "Đã duyệt" ? <Block /> : <CheckCircle />}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa khóa học">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteCourse(course.id)}
                          className="course-action-btn delete"
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[8, 12, 16]}
          component="div"
          count={filteredCourses.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Khóa học mỗi trang:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} của ${count}`}
          className="course-management-pagination"
        />
      </Paper>

      {/* Course Detail Dialog */}
      <Dialog open={openDetail} onClose={handleCloseDetail} maxWidth="md" fullWidth className="course-detail-dialog">
        <DialogTitle>Chi tiết khóa học</DialogTitle>
        <DialogContent>
          {selectedCourse && (
            <Box>
              <Box className="course-detail-header">
                <Avatar 
                  src={selectedCourse.thumbnailUrl} 
                  variant="rounded"
                  className="course-detail-cover"
                >
                  <School style={{ fontSize: 60 }} />
                </Avatar>
                <Box className="course-detail-info">
                  <Typography variant="h5" className="course-detail-title">
                    {selectedCourse.name}
                  </Typography>
                  <Typography variant="body1" className="course-detail-teacher">
                    {selectedCourse.description}
                  </Typography>
                  <Box className="course-detail-chips">
                                         <Chip
                       label={selectedCourse.category}
                       className="course-category-chip"
                     />
                     <Chip
                       label={selectedCourse.level}
                       className="course-level-chip"
                     />
                  </Box>
                </Box>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper elevation={1} className="course-detail-card">
                    <Typography variant="h6" className="course-detail-card-title">
                      Thông tin cơ bản
                    </Typography>
                    <Box className="course-detail-fields">
                      <Box className="course-detail-field">
                        <Typography variant="body2" className="course-detail-label">Mã khóa học:</Typography>
                        <Typography variant="body2" className="course-detail-value">
                          {selectedCourse.code}
                        </Typography>
                      </Box>
                      <Box className="course-detail-field">
                        <Typography variant="body2" className="course-detail-label">Giáo viên:</Typography>
                        <Typography variant="body2" className="course-detail-value">
                          {selectedCourse.teacher}
                        </Typography>
                      </Box>
                      <Box className="course-detail-field">
                        <Typography variant="body2" className="course-detail-label">Ngày tạo:</Typography>
                        <Typography variant="body2" className="course-detail-value">
                          {selectedCourse.createdAt ? format(new Date(selectedCourse.createdAt), 'dd/MM/yyyy HH:mm') : 'N/A'}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper elevation={1} className="course-detail-card">
                    <Typography variant="h6" className="course-detail-card-title">
                      Thống kê
                    </Typography>
                    <Box className="course-detail-fields">
                      <Box className="course-detail-field">
                        <Typography variant="body2" className="course-detail-label">Số học viên:</Typography>
                        <Typography variant="body2" className="course-detail-value">
                          {selectedCourse.students} học viên
                        </Typography>
                      </Box>
                      <Box className="course-detail-field">
                        <Typography variant="body2" className="course-detail-label">Số chương:</Typography>
                        <Typography variant="body2" className="course-detail-value">
                          {selectedCourse.sectionCount} chương
                        </Typography>
                      </Box>
                      <Box className="course-detail-field">
                        <Typography variant="body2" className="course-detail-label">Số bài giảng:</Typography>
                        <Typography variant="body2" className="course-detail-value">
                          {selectedCourse.lectureCount} bài
                        </Typography>
                      </Box>
                      <Box className="course-detail-field">
                        <Typography variant="body2" className="course-detail-label">Đánh giá trung bình:</Typography>
                        <Typography variant="body2" className="course-detail-value">
                          {selectedCourse.averageRating ? selectedCourse.averageRating.toFixed(1) : '0.0'} 
                          ({selectedCourse.reviewCount} đánh giá)
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetail}>Đóng</Button>
        </DialogActions>
      </Dialog>

      {/* Toast Notification */}
      {toast.open && (
        <Box
          position="fixed"
          top={20}
          right={20}
          zIndex={9999}
          bgcolor={toast.severity === 'success' ? '#4caf50' : '#f44336'}
          color="white"
          px={3}
          py={2}
          borderRadius={1}
          boxShadow={3}
        >
          <Typography variant="body2">{toast.message}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default CourseManagementPage; 