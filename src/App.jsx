import { Toaster } from "@/components/ui/toaster";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Boot from '@/pages/Boot';
import Brief from '@/pages/Brief';
import ForgotPassword from '@/pages/ForgotPassword';
import ActivityLog from '@/pages/ActivityLog';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Boot />} />
        <Route path="/brief" element={<Brief />} />
        <Route path="/onboarding" element={<Navigate to="/" replace />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/activity-log" element={<ActivityLog />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </Router>
  )
}

export default App;
