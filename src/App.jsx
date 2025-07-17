import React, { Suspense, lazy } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';

import { ContextProvider } from './features/video-call/contexts/SocketContext';
const VideoCallPage = lazy(() => import('./features/video-call/pages/VideoCallPage'));
const CourseListPage = lazy(() => import('./features/courses/pages/CourseListPage'));
const CourseDetailPage = lazy(() => import('./features/courses/pages/CourseDetailPage'));
const CategoryPage = lazy(() => import('./features/courses/pages/CategoryPage'));
const CourseContentPage = lazy(() => import('./features/courses/pages/CourseContentPage'));
const MyCoursesPage = lazy(() => import('./features/courses/pages/MyCoursesPage'));
const AuthPage = lazy(() => import('./features/auth/pages/AuthPage'));
const ProfilePage = lazy(() => import('./features/profile/pages/ProfilePage'));
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './features/auth/components/ProtectedRoute';
import ScrollToTop from './components/common/ScrollToTop';
import Loader from 'components/common/Loader';
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const AdminDashboard = lazy(() => import('./features/admin/pages/AdminDashboard'));

const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<Loader />}>
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
            <Route
              path="my-courses"
              element={
                <ProtectedRoute>
                  <MyCoursesPage />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole={2}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App; 