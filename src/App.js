import React, { lazy, useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { themeChange } from 'theme-change';
import checkAuth from './app/auth';
import initializeApp from './app/init';

// Importing layouts and pages
const Layout = lazy(() => import('./containers/Layout'));
const CustomerLayout = lazy(() => import('./containers/CustomerLayout'));
const Login = lazy(() => import('./pages/Login'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const Register = lazy(() => import('./pages/Register'));
const Documentation = lazy(() => import('./pages/Documentation'));

initializeApp();

function App() {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    themeChange(false);
  }, []);

  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        const authData = await checkAuth();
        setToken(authData.token);
        setRole(authData.role || 'guest'); // Gán "guest" nếu role không tồn tại
      } catch (error) {
        console.error("Error checking authentication:", error);
      } finally {
        setLoading(false);
      }
    };
  
    checkUserAuth();
  }, []);
  
  if (loading) {
    return <div>Loading...</div>;
  }

  const getRedirectPath = () => {
    if (!token) return "/login";
    if (role === 'admin') return "/app/welcome";
    return "/home";
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/documentation" element={<Documentation />} />

        {/* Chỉ admin mới vào được Layout */}
        <Route path="/app/*" element={role === 'admin' ? <Layout /> : <Navigate to={getRedirectPath()} replace />} />

        {/* Customer và Guest dùng CustomerLayout, ngăn admin truy cập */}
        <Route 
          path="/*" 
          element={role === 'admin' ? <Navigate to={getRedirectPath()} replace /> : <CustomerLayout />} 
        />

        {/* Redirect tất cả các route không hợp lệ */}
        <Route path="*" element={<Navigate to={getRedirectPath()} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
