import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import HomePage from "@/scenes/Home/HomePage";
import LoginPage from "@/scenes/Auth/LoginPage";
import SignUpPage from "@/scenes/Auth/SignUpPage";
import VerifyEmailPage from "@/scenes/Auth/VerifyEmailPage";
import DashboardPage from "@/scenes/Dashboard/DashboardPage";
import CoursesPage from "@/scenes/Courses/CoursesPage";
import CourseDetailPage from "@/scenes/Courses/CourseDetailPage";
import MockTestPage from "@/scenes/MockTest/MockTestPage";
import TestRunnerPage from "@/scenes/MockTest/TestRunnerPage";
import TestResultPage from "@/scenes/MockTest/TestResultPage";
import ProfilePage from "@/scenes/Profile/ProfilePage";
import NotFoundPage from "@/scenes/NotFound/NotFoundPage";
import EducatorLayout from "@/components/layout/EducatorLayout";
import EducatorDashboard from "@/scenes/Educator/EducatorDashboard";
import EducatorCourses from "@/scenes/Educator/EducatorCourses";
import EducatorMaterials from "@/scenes/Educator/EducatorMaterials";
import EducatorProfile from "@/scenes/Educator/EducatorProfile";
import { useAuth } from "@/hooks/useAuth";

function AppContent() {
  // Initialize auth listener
  useAuth();

  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:id" element={<CourseDetailPage />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mock-tests"
          element={
            <ProtectedRoute>
              <MockTestPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mock-tests/:id"
          element={
            <ProtectedRoute>
              <TestRunnerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mock-tests/:id/result"
          element={
            <ProtectedRoute>
              <TestResultPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Educator routes - role protected */}
        <Route
          path="/educator"
          element={
            <ProtectedRoute requireRole="educator">
              <EducatorLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<EducatorDashboard />} />
          <Route path="courses" element={<EducatorCourses />} />
          <Route path="materials" element={<EducatorMaterials />} />
          <Route path="profile" element={<EducatorProfile />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
