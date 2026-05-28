import { Toaster } from "@/components/ui/toaster";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Boot from '@/pages/Boot';
import Brief from '@/pages/Brief';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Onboarding from '@/pages/Onboarding';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import ActivityLog from '@/pages/ActivityLog';
import Recall from '@/pages/Recall';
import Security from '@/pages/Security';
import Settings from '@/pages/Settings';
import PageNotFound from '@/pages/PageNotFound';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Boot />} />
        <Route path="/brief" element={<Brief />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/activity-log" element={<ActivityLog />} />
        <Route path="/recall" element={<Recall />} />
        <Route path="/security" element={<Security />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Toaster />
    </Router>
  )
}

export default App;
