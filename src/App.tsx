import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./Login";
import AuthCallback from "./AuthCallback";
import ForgotPassword from "./ForgotPassword";
import Register from "./Register";
import FormRequestsPage from "./pages/FormRequestsPage";
import NewRequestPage from "./pages/NewRequestPage";
import SettingsPage from "./pages/SettingsPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormRequestDetailPage from "./pages/FormRequestDetailPage";

// Helper to check token validity
function isTokenValid() {
  const token = localStorage.getItem("access_token");
  const expiresAt = localStorage.getItem("expires_in") || localStorage.getItem("expires_at");
  if (!token || !expiresAt) return false;
  // expires_in is seconds, expires_at is unix timestamp
  const now = Math.floor(Date.now() / 1000);
  const expiry = Number(expiresAt);
  return expiry > now;
}

// ProtectedRoute component
function ProtectedRoute({ children }: { children: JSX.Element }) {
  const location = useLocation();
  if (!isTokenValid()) {
    // Auto-logout: clear tokens
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("expires_in");
    localStorage.removeItem("token_type");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        {/* Protected routes */}
        <Route path="/form-requests" element={<ProtectedRoute><FormRequestsPage /></ProtectedRoute>} />
        <Route path="/new-request" element={<ProtectedRoute><NewRequestPage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route path="/form-requests/:id" element={<ProtectedRoute><FormRequestDetailPage /></ProtectedRoute>} />
        <Route path="/" element={<Navigate to="/form-requests" replace />} />
        <Route path="*" element={<Navigate to="/form-requests" replace />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </BrowserRouter>
  );
}

export default App;
