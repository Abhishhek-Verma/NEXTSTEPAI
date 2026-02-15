import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/landing-page";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import OnboardingPage from "./pages/onboarding/OnboardingPage";
import AcademicPage from "./pages/academic/AcademicPage";
import CodingPage from "./pages/coding/CodingPage";
import PsychometricPage from "./pages/psychometric/PsychometricPage";
import ProfilePage from "./pages/profile/ProfilePage";
import AnalyzePage from "./pages/analyze/AnalyzePage";
import RecommendationsPage from "./pages/recommendations/RecommendationsPage";
import RoadmapPage from "./pages/roadmap/RoadmapPage";
import ProjectsPage from "./pages/projects/ProjectsPage";
import NotFound from "./pages/NotFound";
import ErrorBoundary from "./components/ErrorBoundary";
import ScrollToTop from "./components/ScrollToTop";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <Routes>
          {/* Public routes WITHOUT Layout */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Clerk routing paths - let Clerk handle these */}
          <Route path="/auth/login/*" element={<LoginPage />} />
          <Route path="/auth/register/*" element={<RegisterPage />} />
          <Route path="/auth/sso-callback" element={<LoginPage />} />

          {/* Protected routes WITH Layout */}
          <Route element={<Layout />}>
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                  <OnboardingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/academic"
              element={
                <ProtectedRoute>
                  <AcademicPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/coding"
              element={
                <ProtectedRoute>
                  <CodingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/psychometric"
              element={
                <ProtectedRoute>
                  <PsychometricPage />
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
            <Route
              path="/analyze"
              element={
                <ProtectedRoute>
                  <AnalyzePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recommendations"
              element={
                <ProtectedRoute>
                  <RecommendationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/roadmap"
              element={
                <ProtectedRoute>
                  <RoadmapPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects"
              element={
                <ProtectedRoute>
                  <ProjectsPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default AppRoutes;
