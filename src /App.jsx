import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/lib/AuthContext';

import Boot from '@/pages/Boot';
import Onboarding from '@/pages/Onboarding';
import Brief from '@/pages/Brief';
import Security from '@/pages/Security';
import Recall from '@/pages/Recall';
import ActivityLog from '@/pages/ActivityLog';
import Settings from '@/pages/Settings';

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <Routes>
            <Route path="/" element={<Boot />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/brief" element={<Brief />} />
            <Route path="/security" element={<Security />} />
            <Route path="/recall" element={<Recall />} />
            <Route path="/activity" element={<ActivityLog />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
