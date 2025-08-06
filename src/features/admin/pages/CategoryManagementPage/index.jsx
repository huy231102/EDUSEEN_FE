import React, { useState, useEffect } from "react";
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, IconButton, TextField, Tooltip, Dialog, DialogTitle, 
  DialogContent, DialogActions, Button, Avatar, Chip, Grid, FormControl, 
  InputLabel, Select, MenuItem
} from "@material-ui/core";
import { 
  Add, Edit, Delete, Refresh, Folder, Book, 
  EmojiObjects, Language 
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
    iconType: 'folder',
    cover: '', 
    hoverCover: '' 
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const iconOptions = [
    { label: 'Folder', value: 'folder', icon: <Folder style={{ color: '#1eb2a6' }} /> },
    { label: 'Book', value: 'book', icon: <Book style={{ color: '#ff9800' }} /> },
    { label: 'Lightbulb', value: 'light', icon: <EmojiObjects style={{ color: '#fbc02d' }} /> },
    { label: 'Language', value: 'lang', icon: <Language style={{ color: '#2196f3' }} /> },
  ];

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleOpenDialog = (cat = null) => {
    if (cat) {
      setEditCategory(cat);
      setForm({
        categoryName: cat.name,
        description: cat.description || '',
        iconType: cat.iconType || 'folder',
        cover: cat.cover || '',
        hoverCover: cat.hoverCover || ''
      });
    } else {
      setEditCategory(null);
      setForm({
        categoryName: '',
        description: '',
        iconType: 'folder',
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
      iconType: 'folder',
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

  const getIconByType = (type) => {
    const found = iconOptions.find(i => i.value === type);
    return found ? found.icon : <Folder style={{ color: '#1eb2a6' }} />;
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
                <TableCell>Icon</TableCell>
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
                        {getIconByType(category.iconType)}
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
                    <Box className="category-icon-cell">
                      {getIconByType(category.iconType)}
                      <Typography variant="body2" className="category-icon-label">
                        {iconOptions.find(i => i.value === category.iconType)?.label || 'Folder'}
                      </Typography>
                    </Box>
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
            <Grid item xs={12} md={6}>
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
            <Grid item xs={12} md={6}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel>Loại icon</InputLabel>
                <Select
                  name="iconType"
                  value={form.iconType}
                  onChange={handleChange}
                  label="Loại icon"
                  className="category-form-input"
                >
                  {iconOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      <Box className="category-icon-option">
                        {option.icon}
                        {option.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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