import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from 'features/auth/contexts/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isLoggedIn, user } = useAuth();

  console.log('user in ProtectedRoute', user);

  if (!isLoggedIn) {
    return <Navigate to="/auth" />;
  }

  if (requiredRole) {
    // Nếu requiredRole là số, so sánh với user.roleId
    if (typeof requiredRole === 'number' && Number(user?.roleId) !== requiredRole) {
      return <Navigate to="/" />;
    }
    // Nếu requiredRole là chuỗi, so sánh với user.roleName hoặc user.role
    if (typeof requiredRole === 'string' && user && user.roleName !== requiredRole && user.role !== requiredRole) {
      return <Navigate to="/" />;
    }
  }

  return children;
};

export default ProtectedRoute; 