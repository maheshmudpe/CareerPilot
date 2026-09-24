import { Route, Routes } from "react-router";
import AppLayout from "../components/layout/AppLayout";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Applications from "../pages/Applications";
import ApplicationDetails from "../pages/ApplicationDetails";
import Companies from "../pages/Companies";
import Interviews from "../pages/Interviews";
import Profile from "../pages/Profile";

export function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Application routes */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/applications/:id" element={<ApplicationDetails />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/interviews" element={<Interviews />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}