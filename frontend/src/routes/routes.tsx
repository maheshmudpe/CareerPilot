import { Route, Routes } from "react-router";
import AppLayout from "../components/layout/AppLayout";

import Login from "../app/auth/pages/Login";
import Register from "../app/auth/pages/Register";
import DashboardPage from "../app/dashboard/pages/DashboardPage";

import Applications from "../pages/Applications";
import ApplicationDetails from "../pages/ApplicationDetails";
import CompaniesPage from "@/app/company/Pages/CompaniesPage";
import Interviews from "../pages/Interviews";
import ProfilePage from "@/app/profile/Pages/ProfilePage";
import ProtectedRoute from "../app/auth/ProtectedRoute";

import CompanyDetailsPage from "@/app/company/Pages/CompanyDetailsPage";


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

          <Route path="/applications" element={<Applications />} />
          <Route
            path="/applications/:id"
            element={<ApplicationDetails />}
          />
          <Route path="/companies" element={<CompaniesPage />} />
          <Route
                path="/companies/:id"
                element={<CompanyDetailsPage />}
              />
          <Route path="/interviews" element={<Interviews />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>
    </Routes>
  );
}