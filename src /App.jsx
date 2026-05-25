import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Boot from "./pages/Boot";
import Brief from "./pages/Brief";
import Recall from "./pages/Recall";
import ActivityLog from "./pages/ActivityLog";
import Security from "./pages/Security";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/boot" element={<Boot />} />
        <Route path="/brief" element={<Brief />} />
        <Route path="/recall" element={<Recall />} />
        <Route path="/activity" element={<ActivityLog />} />
        <Route path="/security" element={<Security />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}
