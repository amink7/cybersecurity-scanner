import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import ClientInfoPage from "./pages/ClientInfoPage";
import ScanPage from "./pages/ScanPage";
import ReportsPage from "./pages/ReportsPage";
import PortScanPage from "./pages/PortScanPage";
import WebVulnScanPage from "./pages/WebVulnScanPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/client-info" element={<ProtectedRoute><ClientInfoPage /></ProtectedRoute>} />
        <Route path="/scan" element={<ProtectedRoute><ScanPage /></ProtectedRoute>} />
        <Route path="/ports" element={<ProtectedRoute><PortScanPage /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
        <Route path="/web-vuln" element={<ProtectedRoute><WebVulnScanPage /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
