import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import { ContextProvider } from './features/video-call/contexts/SocketContext';
import VideoCallPage from './features/video-call/pages/VideoCallPage';
import CourseListPage from './features/courses/pages/CourseListPage';
import CourseDetailPage from './features/courses/pages/CourseDetailPage';
import CategoryPage from './features/courses/pages/CategoryPage';
import MainLayout from './components/layout/MainLayout';
import AuthPage from './features/auth/pages/AuthPage';
import ProfilePage from './features/profile/pages/ProfilePage';
import ProtectedRoute from './features/auth/components/ProtectedRoute';
import ScrollToTop from './components/common/ScrollToTop';
import CourseContentPage from './features/courses/pages/CourseContentPage';

const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route
          path="/video-call"
          element={
            <ContextProvider>
              <VideoCallPage />
            </ContextProvider>
          }
        />
        <Route path="/" element={<MainLayout />}>
          <Route index element={<CourseListPage />} />
          <Route path="category/:categorySlug" element={<CategoryPage />} />
          <Route path="courses" element={<CourseListPage />} />
          <Route path="courses/:courseId" element={<CourseDetailPage />} />
          <Route path="courses/:courseId/learn" element={<CourseContentPage />} />
        </Route>
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App; 