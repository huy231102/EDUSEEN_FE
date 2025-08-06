import React, { useState, useEffect } from "react";
import {
  Box, Drawer, List, ListItem, ListItemIcon, ListItemText, 
  AppBar, Toolbar, Typography, Avatar, IconButton, Collapse
} from "@material-ui/core";
import {
  Dashboard, People, School, Category, ExitToApp,
  ExpandLess, ExpandMore
} from "@material-ui/icons";
import { useNavigate, useLocation } from 'react-router-dom';
import './style.css';

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedMenu, setSelectedMenu] = useState("dashboard");
  const [userAdmin, setUserAdmin] = useState({
    username: "Admin",
    avatar: ""
  });

  useEffect(() => {
    // Lấy thông tin user từ localStorage hoặc context
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    setUserAdmin({
      username: userInfo.username || "Admin",
      avatar: userInfo.avatarUrl || ""
    });

    // Xác định menu hiện tại từ URL
    const path = location.pathname;
    if (path.includes('/admin/users')) setSelectedMenu("users");
    else if (path.includes('/admin/courses')) setSelectedMenu("courses");
    else if (path.includes('/admin/categories')) setSelectedMenu("categories");
    else setSelectedMenu("dashboard");
  }, [location]);

  const menuItems = [
    { 
      text: "Bảng điều khiển", 
      icon: <Dashboard />, 
      path: "/admin",
      key: "dashboard"
    },
    { 
      text: "Quản lý người dùng", 
      icon: <People />, 
      path: "/admin/users",
      key: "users"
    },
    { 
      text: "Quản lý khóa học", 
      icon: <School />, 
      path: "/admin/courses",
      key: "courses"
    },
    { 
      text: "Quản lý danh mục", 
      icon: <Category />, 
      path: "/admin/categories",
      key: "categories"
    }
  ];

  const handleMenuClick = (item) => {
    setSelectedMenu(item.key);
    navigate(item.path);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    navigate('/auth');
  };

  return (
    <Box className="admin-layout-root">
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        className="admin-sidebar"
      >
        {/* Logo & User Info */}
        <Box className="admin-sidebar-header">
          <Box className="admin-user-info">
            <Avatar className="admin-user-avatar">
              {userAdmin.username.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="body2" className="admin-user-greeting">
              Xin chào, {userAdmin.username}
            </Typography>
          </Box>
        </Box>

        {/* Menu Items */}
        <List className="admin-sidebar-menu">
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.key}
              selected={selectedMenu === item.key}
              onClick={() => handleMenuClick(item)}
              className={`admin-sidebar-item ${selectedMenu === item.key ? 'admin-sidebar-item-active' : ''}`}
            >
              {selectedMenu === item.key && (
                <Box className="admin-sidebar-indicator" />
              )}
              <ListItemIcon className="admin-sidebar-icon">
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}

          {/* Logout Button */}
          <ListItem
            button
            onClick={handleLogout}
            className="admin-sidebar-item admin-logout-item"
          >
            <ListItemIcon className="admin-sidebar-icon">
              <ExitToApp />
            </ListItemIcon>
            <ListItemText primary="Đăng xuất" />
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box component="main" className="admin-main-content">
        <AppBar 
          position="static" 
          elevation={0}
          className="admin-appbar"
        >
          <Toolbar>
            <Typography variant="h6" component="div" className="admin-page-title">
              {menuItems.find(item => item.key === selectedMenu)?.text || 'Admin Dashboard'}
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Page Content */}
        <Box className="admin-content-area">
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout; 