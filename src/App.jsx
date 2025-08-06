import React, { Suspense, lazy } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';

import { ContextProvider } from './features/video-call/contexts/SocketContext';
import { NotificationProvider } from './features/notifications/contexts/NotificationContext';
import { ToastProvider } from './components/common/Toast';
const VideoCallPage = lazy(() => import('./features/video-call/pages/VideoCallPage'));
const CourseListPage = lazy(() => import('./features/courses/pages/CourseListPage'));
const CourseDetailPage = lazy(() => import('./features/courses/pages/CourseDetailPage'));
const CategoryPage = lazy(() => import('./features/courses/pages/CategoryPage'));
const CourseContentPage = lazy(() => import('./features/courses/pages/CourseContentPage'));
const MyCoursesPage = lazy(() => import('./features/courses/pages/MyCoursesPage'));
const AuthPage = lazy(() => import('./features/auth/pages/AuthPage'));
const VerifyOTPPage = lazy(() => import('./features/auth/pages/VerifyOTPPage'));
const ResetPasswordPage = lazy(() => import('./features/auth/pages/ResetPasswordPage'));
const ProfilePage = lazy(() => import('./features/profile/pages/ProfilePage'));
const TeacherDashboardPage = lazy(() => import('./features/courses/pages/TeacherDashboardPage'));
const CourseEditPage = lazy(() => import('./features/courses/pages/CourseEditPage'));
const CourseReviewsPage = lazy(() => import('./features/courses/pages/CourseReviewsPage'));
const CourseAnalyticsPage = lazy(() => import('./features/courses/pages/CourseAnalyticsPage'));
const AssignmentsDashboardPage = lazy(() => import('./features/courses/pages/AssignmentsDashboardPage'));
const AssignmentCreatePage = lazy(() => import('./features/courses/pages/AssignmentCreatePage'));
const AssignmentGradingPage = lazy(() => import('./features/courses/pages/AssignmentGradingPage'));
const AssignmentEditPage = lazy(() => import('./features/courses/pages/AssignmentEditPage'));
const AssignmentStatsPage = lazy(() => import('./features/courses/pages/AssignmentsDashboardPage/AssignmentStatsPage'));
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
      <ToastProvider>
        <NotificationProvider>
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
              <Route path="category/:categoryId" element={<CategoryPage />} />
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
              <Route path="teacher">
                <Route path="dashboard" element={<TeacherDashboardPage />} />
                <Route path="course">
                  <Route path="new" element={<CourseEditPage />} />
                  <Route path=":courseId/edit" element={<CourseEditPage />} />
                  <Route path=":courseId/reviews" element={<CourseReviewsPage />} />
                  <Route path=":courseId/analytics" element={<CourseAnalyticsPage />} />
                  <Route path=":courseId/assignments" element={<AssignmentsDashboardPage />} />
                  <Route path=":courseId/assignments/new" element={<AssignmentCreatePage />} />
                  <Route path=":courseId/assignments/:assignmentId" element={<AssignmentGradingPage />} />
                  <Route path=":courseId/assignments/:assignmentId/edit" element={<AssignmentEditPage />} />
                  <Route path=":courseId/assignments/:assignmentId/stats" element={<AssignmentStatsPage />} />
                </Route>
              </Route>
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
              path="/admin/*"
              element={
                <ProtectedRoute requiredRole={2}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/auth/verify-otp" element={<VerifyOTPPage />} />
            <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
        </NotificationProvider>
      </ToastProvider>
    </BrowserRouter>
  );
};

export default App; 