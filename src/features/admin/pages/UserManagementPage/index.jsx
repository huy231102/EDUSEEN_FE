import React, { useState, useEffect } from "react";
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, IconButton, TextField, Tooltip, Dialog, DialogTitle, 
  DialogContent, DialogActions, MenuItem, Select, FormControl, InputLabel, 
  TablePagination, Avatar, InputAdornment, Chip, Button
} from "@material-ui/core";
import { 
  Search, Info, Edit, Delete, Lock, LockOpen, Refresh, 
  Person, Block, CheckCircle 
} from "@material-ui/icons";
import { format } from 'date-fns';
import api from "services/api";

// Import CSS
import './style.css';

const statusColor = {
  "Hoạt động": "#4caf50",
  "Đã khóa": "#f44336",
  "Chờ duyệt": "#ff9800",
  "Đã duyệt": "#1eb2a6",
};

import { useAdmin } from "../../contexts/AdminContext";

const UserManagementPage = () => {
  const { users, loading, fetchUsers, updateUser, toggleUserStatus } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDetail, setOpenDetail] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDetail = (user) => {
    setSelectedUser(user);
    setOpenDetail(true);
  };

  const handleCloseDetail = () => setOpenDetail(false);

  const handleOpenEdit = (user) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    });
    setOpenEdit(true);
  };

  const handleCloseEdit = () => setOpenEdit(false);

  const handleEditChange = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveEdit = async () => {
    try {
      const result = await updateUser(selectedUser.id, editForm);
      if (result.success) {
        setToast({ open: true, message: 'Cập nhật thành công!', severity: 'success' });
        handleCloseEdit();
      } else {
        setToast({ open: true, message: 'Cập nhật thất bại!', severity: 'error' });
      }
    } catch (error) {
      setToast({ open: true, message: 'Cập nhật thất bại!', severity: 'error' });
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      const result = await toggleUserStatus(userId, currentStatus);
      if (result.success) {
        setToast({ open: true, message: 'Cập nhật trạng thái thành công!', severity: 'success' });
      } else {
        setToast({ open: true, message: 'Cập nhật trạng thái thất bại!', severity: 'error' });
      }
    } catch (error) {
      setToast({ open: true, message: 'Cập nhật trạng thái thất bại!', severity: 'error' });
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || user.status === statusFilter;
    const matchesRole = !roleFilter || user.role === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });

  const paginatedUsers = filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const getStatusChipClass = (status) => {
    switch (status) {
      case "Hoạt động": return "status-chip status-active";
      case "Đã khóa": return "status-chip status-locked";
      case "Chờ duyệt": return "status-chip status-pending";
      case "Đã duyệt": return "status-chip status-approved";
      default: return "status-chip";
    }
  };

  const getRoleChipClass = (role) => {
    switch (role) {
      case "Quản trị viên": return "role-chip role-admin";
      case "Giáo viên": return "role-chip role-teacher";
      case "Học sinh": return "role-chip role-student";
      default: return "role-chip";
    }
  };

  return (
    <Box>
      {/* Header Section */}
      <Box className="user-management-header">
        <Button
          variant="contained"
          startIcon={<Refresh />}
          onClick={fetchUsers}
          className="user-management-refresh-btn"
        >
          Làm mới
        </Button>
      </Box>

      {/* Filters Section */}
      <Paper elevation={2} className="user-management-filters">
        <Box display="flex" gap={2} flexWrap="wrap">
          <TextField
            label="Tìm kiếm"
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
            className="user-management-search-field"
          />
          
          <FormControl variant="outlined" size="small" className="user-management-filter-select">
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="Trạng thái"
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="Hoạt động">Hoạt động</MenuItem>
              <MenuItem value="Đã khóa">Đã khóa</MenuItem>
              <MenuItem value="Chờ duyệt">Chờ duyệt</MenuItem>
            </Select>
          </FormControl>

          <FormControl variant="outlined" size="small" className="user-management-filter-select">
            <InputLabel>Vai trò</InputLabel>
            <Select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              label="Vai trò"
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="Học sinh">Học sinh</MenuItem>
              <MenuItem value="Giáo viên">Giáo viên</MenuItem>
              <MenuItem value="Quản trị viên">Quản trị viên</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* Users Table */}
      <Paper elevation={2} className="user-management-table">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Người dùng</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Vai trò</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Ngày tham gia</TableCell>
                <TableCell>Hoạt động cuối</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedUsers.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>
                    <Box className="user-info-cell">
                      <Avatar src={user.avatar} className="user-avatar">
                        {user.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" className="user-name">
                          {user.name}
                        </Typography>
                        <Typography variant="caption" className="user-username">
                          @{user.username}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.role}
                      size="small"
                      className={getRoleChipClass(user.role)}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.status}
                      size="small"
                      className={getStatusChipClass(user.status)}
                    />
                  </TableCell>
                  <TableCell>
                    {user.joined ? format(new Date(user.joined), 'dd/MM/yyyy') : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {user.lastActive !== "Chưa đăng nhập" 
                      ? format(new Date(user.lastActive), 'dd/MM/yyyy HH:mm')
                      : user.lastActive
                    }
                  </TableCell>
                  <TableCell>
                    <Box className="user-action-buttons">
                      <Tooltip title="Xem chi tiết">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDetail(user)}
                          className="user-action-btn info"
                        >
                          <Info />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Chỉnh sửa">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenEdit(user)}
                          className="user-action-btn edit"
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={user.status === "Hoạt động" ? "Khóa tài khoản" : "Mở khóa tài khoản"}>
                        <IconButton
                          size="small"
                          onClick={() => handleToggleStatus(user.id, user.status)}
                          className={`user-action-btn ${user.status === "Hoạt động" ? 'lock' : 'unlock'}`}
                        >
                          {user.status === "Hoạt động" ? <Lock /> : <LockOpen />}
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Hàng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} của ${count}`}
          className="user-management-pagination"
        />
      </Paper>

      {/* User Detail Dialog */}
      <Dialog open={openDetail} onClose={handleCloseDetail} maxWidth="sm" fullWidth className="user-detail-dialog">
        <DialogTitle>Chi tiết người dùng</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box>
              <Box className="user-detail-header">
                <Avatar src={selectedUser.avatar} className="user-detail-avatar">
                  {selectedUser.name.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h6">{selectedUser.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    @{selectedUser.username}
                  </Typography>
                </Box>
              </Box>
              
              <Box className="user-detail-info">
                <Box className="user-detail-field">
                  <Typography variant="subtitle2" className="user-detail-label">Email</Typography>
                  <Typography>{selectedUser.email}</Typography>
                </Box>
                <Box className="user-detail-field">
                  <Typography variant="subtitle2" className="user-detail-label">Vai trò</Typography>
                  <Chip
                    label={selectedUser.role}
                    size="small"
                    className={getRoleChipClass(selectedUser.role)}
                  />
                </Box>
                <Box className="user-detail-field">
                  <Typography variant="subtitle2" className="user-detail-label">Trạng thái</Typography>
                  <Chip
                    label={selectedUser.status}
                    size="small"
                    className={getStatusChipClass(selectedUser.status)}
                  />
                </Box>
                <Box className="user-detail-field">
                  <Typography variant="subtitle2" className="user-detail-label">Ngày tham gia</Typography>
                  <Typography>
                    {selectedUser.joined ? format(new Date(selectedUser.joined), 'dd/MM/yyyy HH:mm') : 'N/A'}
                  </Typography>
                </Box>
                <Box className="user-detail-field">
                  <Typography variant="subtitle2" className="user-detail-label">Hoạt động cuối</Typography>
                  <Typography>
                    {selectedUser.lastActive !== "Chưa đăng nhập" 
                      ? format(new Date(selectedUser.lastActive), 'dd/MM/yyyy HH:mm')
                      : selectedUser.lastActive
                    }
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetail}>Đóng</Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={openEdit} onClose={handleCloseEdit} maxWidth="sm" fullWidth className="user-edit-dialog">
        <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
        <DialogContent>
          <Box className="user-edit-form">
            <TextField
              label="Tên"
              variant="outlined"
              fullWidth
              value={editForm.name || ''}
              onChange={(e) => handleEditChange('name', e.target.value)}
            />
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              value={editForm.email || ''}
              onChange={(e) => handleEditChange('email', e.target.value)}
            />
            <FormControl variant="outlined" fullWidth>
              <InputLabel>Vai trò</InputLabel>
              <Select
                value={editForm.role || ''}
                onChange={(e) => handleEditChange('role', e.target.value)}
                label="Vai trò"
              >
                <MenuItem value="Học sinh">Học sinh</MenuItem>
                <MenuItem value="Giáo viên">Giáo viên</MenuItem>
                <MenuItem value="Quản trị viên">Quản trị viên</MenuItem>
              </Select>
            </FormControl>
            <FormControl variant="outlined" fullWidth>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={editForm.status || ''}
                onChange={(e) => handleEditChange('status', e.target.value)}
                label="Trạng thái"
              >
                <MenuItem value="Hoạt động">Hoạt động</MenuItem>
                <MenuItem value="Đã khóa">Đã khóa</MenuItem>
                <MenuItem value="Chờ duyệt">Chờ duyệt</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit}>Hủy</Button>
          <Button 
            onClick={handleSaveEdit} 
            variant="contained"
            className="user-edit-save-btn"
          >
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagementPage; 