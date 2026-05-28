import { Toaster } from "@/components/ui/toaster"
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

// Import only the pages that exist in your /src/pages folder
import Boot from '@/pages/Boot';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Boot />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </Router>
  )
}

export default App;
