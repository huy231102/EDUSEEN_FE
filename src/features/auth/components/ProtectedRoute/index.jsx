import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from 'features/auth/contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/auth" />;
  }

  return children;
};

export default ProtectedRoute; 