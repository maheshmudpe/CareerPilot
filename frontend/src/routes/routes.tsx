import { Route, Routes } from "react-router";
import AppLayout from "../components/layout/AppLayout";

import Login from "../app/auth/pages/Login";
import Register from "../app/auth/pages/Register";
import DashboardPage from "../app/dashboard/pages/DashboardPage";

import ApplicationsPage from "@/app/application/pages/ApplicationsPage";
import ApplicationDetailsPage from "@/app/application/pages/ApplicationDetailsPage";
import CompaniesPage from "@/app/company/Pages/CompaniesPage";
import CompanyDetailsPage from "@/app/company/Pages/CompanyDetailsPage";

import InterviewsPage from "@/app/interview/pages/InterviewsPage";
import InterviewDetailsPage from "@/app/interview/pages/InterviewDetailsPage";

import ProfilePage from "@/app/profile/Pages/ProfilePage";


import ProtectedRoute from "../app/auth/ProtectedRoute";

export function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected application routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />

          <Route
            path="/applications"
            element={<ApplicationsPage />}
          />

          <Route
            path="/applications/:id"
            element={<ApplicationDetailsPage />}
          />

          <Route
            path="/companies"
            element={<CompaniesPage />}
          />

          <Route
            path="/companies/:id"
            element={<CompanyDetailsPage />}
          />

          <Route
            path="/interviews"
            element={<InterviewsPage />}
          />

          <Route
            path="/interviews/:id"
            element={<InterviewDetailsPage />}
          />

          <Route
            path="/profile"
            element={<ProfilePage />}
          />
        </Route>
      </Route>
    </Routes>
  );
}