import React, { useState, useEffect } from "react";
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, IconButton, TextField, Tooltip, Dialog, DialogTitle, 
  DialogContent, DialogActions, Button, Avatar, Chip, Grid, FormControl, 
  InputLabel, Select, MenuItem
} from "@material-ui/core";
import { 
  Add, Edit, Delete, Refresh
} from "@material-ui/icons";
import ImageS3Upload from 'components/common/ImageS3Upload';

// Import CSS
import './style.css';

import { useAdmin } from "../../contexts/AdminContext";

const CategoryManagementPage = () => {
  const { categories, loading, fetchCategories, createCategory, updateCategory, deleteCategory } = useAdmin();
  const [openDialog, setOpenDialog] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [form, setForm] = useState({ 
    categoryName: '', 
    description: '', 
    cover: '', 
    hoverCover: '' 
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });



  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenDialog = (cat = null) => {
    if (cat) {
      setEditCategory(cat);
      setForm({
        categoryName: cat.name,
        description: cat.description || '',
        cover: cat.cover || '',
        hoverCover: cat.hoverCover || ''
      });
    } else {
      setEditCategory(null);
      setForm({
        categoryName: '',
        description: '',
        cover: '',
        hoverCover: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditCategory(null);
    setForm({
      categoryName: '',
      description: '',
      cover: '',
      hoverCover: ''
    });
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCoverUploaded = (url) => {
    setForm(prev => ({ ...prev, cover: url }));
  };

  const handleHoverCoverUploaded = (url) => {
    setForm(prev => ({ ...prev, hoverCover: url }));
  };

  const handleSubmit = async () => {
    if (!form.categoryName.trim()) {
      setSnackbar({ open: true, message: 'Vui lòng nhập tên danh mục!', severity: 'error' });
      return;
    }

    setSubmitLoading(true);
    try {
      const categoryData = {
        CategoryName: form.categoryName,
        Cover: form.cover,
        HoverCover: form.hoverCover
      };

      let result;
      if (editCategory) {
        result = await updateCategory(editCategory.id, categoryData);
        if (result.success) {
          setSnackbar({ open: true, message: 'Cập nhật danh mục thành công!', severity: 'success' });
        } else {
          setSnackbar({ open: true, message: 'Cập nhật thất bại!', severity: 'error' });
        }
      } else {
        result = await createCategory(categoryData);
        if (result.success) {
          setSnackbar({ open: true, message: 'Tạo danh mục thành công!', severity: 'success' });
        } else {
          setSnackbar({ open: true, message: 'Tạo danh mục thất bại!', severity: 'error' });
        }
      }

      if (result.success) {
        handleCloseDialog();
      }
    } catch (error) {
      console.error('Lỗi khi lưu danh mục:', error);
      setSnackbar({ 
        open: true, 
        message: editCategory ? 'Cập nhật thất bại!' : 'Tạo danh mục thất bại!', 
        severity: 'error' 
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (cat) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa danh mục "${cat.name}"?`)) {
      try {
        const result = await deleteCategory(cat.id);
        if (result.success) {
          setSnackbar({ open: true, message: 'Xóa danh mục thành công!', severity: 'success' });
        } else {
          setSnackbar({ open: true, message: 'Xóa danh mục thất bại!', severity: 'error' });
        }
      } catch (error) {
        console.error('Lỗi khi xóa danh mục:', error);
        setSnackbar({ open: true, message: 'Xóa danh mục thất bại!', severity: 'error' });
      }
    }
  };



  return (
    <Box>
      {/* Header Section */}
      <Box className="category-management-header">
        <Box display="flex" gap={2} className="category-management-buttons">
          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={fetchCategories}
            disabled={loading}
            className="category-management-refresh-btn"
          >
            {loading ? 'Đang tải...' : 'Làm mới'}
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
            className="category-management-add-btn"
          >
            Thêm danh mục
          </Button>
        </Box>
      </Box>

      {/* Categories Table */}
      <Paper elevation={2} className="category-management-table">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Danh mục</TableCell>
                <TableCell>Mô tả</TableCell>
                
                <TableCell>Ảnh cover</TableCell>
                <TableCell>Số khóa học</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id} hover>
                  <TableCell>
                    <Box className="category-info-cell">
                      <Avatar 
                        src={category.cover} 
                        variant="rounded"
                        className="category-avatar"
                      >
                        {category.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" className="category-name">
                          {category.name}
                        </Typography>
                        <Typography variant="caption" className="category-id">
                          ID: {category.id}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" className="category-description">
                      {category.description || 'Không có mô tả'}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Box className="category-images-cell">
                      {category.cover && (
                        <Avatar 
                          src={category.cover} 
                          variant="rounded"
                          className="category-image"
                        />
                      )}
                      {category.hoverCover && (
                        <Avatar 
                          src={category.hoverCover} 
                          variant="rounded"
                          className="category-image"
                        />
                      )}
                      {!category.cover && !category.hoverCover && (
                        <Typography variant="caption" className="category-no-image">
                          Chưa có ảnh
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={category.courseCount || 0}
                      size="small"
                      className="category-course-count-chip"
                    />
                  </TableCell>
                  <TableCell>
                    <Box className="category-action-buttons">
                      <Tooltip title="Chỉnh sửa">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(category)}
                          className="category-action-btn edit"
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa danh mục">
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(category)}
                          className="category-action-btn delete"
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add/Edit Category Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth className="category-dialog">
        <DialogTitle>
          {editCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} className="category-form">
            <Grid item xs={12}>
              <TextField
                name="categoryName"
                label="Tên danh mục"
                variant="outlined"
                fullWidth
                value={form.categoryName}
                onChange={handleChange}
                required
                className="category-form-input"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="description"
                label="Mô tả"
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                value={form.description}
                onChange={handleChange}
                className="category-form-input"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" className="category-form-label">
                Ảnh cover chính
              </Typography>
              <Box className="category-image-upload">
                <ImageS3Upload
                  onUploaded={handleCoverUploaded}
                  defaultUrl={form.cover}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" className="category-form-label">
                Ảnh cover hover
              </Typography>
              <Box className="category-image-upload">
                <ImageS3Upload
                  onUploaded={handleHoverCoverUploaded}
                  defaultUrl={form.hoverCover}
                />
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} className="category-dialog-cancel-btn">Hủy</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={submitLoading}
            className="category-dialog-save-btn"
          >
            {submitLoading ? 'Đang lưu...' : (editCategory ? 'Cập nhật' : 'Tạo mới')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CategoryManagementPage; 