import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import { AdminProvider } from "../../contexts/AdminContext";
import DashboardPage from "../DashboardPage";
import UserManagementPage from "../UserManagementPage";
import CourseManagementPage from "../CourseManagementPage";
import CategoryManagementPage from "../CategoryManagementPage";

const AdminDashboard = () => {
  return (
    <AdminProvider>
      <AdminLayout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/users" element={<UserManagementPage />} />
          <Route path="/courses" element={<CourseManagementPage />} />
          <Route path="/categories" element={<CategoryManagementPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AdminLayout>
    </AdminProvider>
  );
};

export default AdminDashboard;