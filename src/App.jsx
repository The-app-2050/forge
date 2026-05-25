import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Onboarding from "./pages/Onboarding";
import Boot from "./pages/Boot";
import Brief from "./pages/Brief";
import Recall from "./pages/Recall";
import ActivityLog from "./pages/ActivityLog";
import Security from "./pages/Security";
import Settings from "./pages/Settings";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/boot" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/boot" element={<ProtectedRoute><Boot /></ProtectedRoute>} />
        <Route path="/brief" element={<ProtectedRoute><Brief /></ProtectedRoute>} />
        <Route path="/recall" element={<ProtectedRoute><Recall /></ProtectedRoute>} />
        <Route path="/activity" element={<ProtectedRoute><ActivityLog /></ProtectedRoute>} />
        <Route path="/security" element={<ProtectedRoute><Security /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/onboarding" element={<Onboarding />} />
      </Routes>
    </Router>
  );
}
