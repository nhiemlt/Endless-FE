import React, { lazy, useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { themeChange } from 'theme-change';
import checkAuth from './app/auth';
import initializeApp from './app/init';

// Importing pages
const Layout = lazy(() => import('./containers/Layout'));
const CustomerLayout = lazy(() => import('./containers/CustomerLayout'));
const Login = lazy(() => import('./pages/Login'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const Register = lazy(() => import('./pages/Register'));
const Documentation = lazy(() => import('./pages/Documentation'));

// Initializing different libraries
initializeApp();

function App() {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true); // State để quản lý trạng thái tải

  useEffect(() => {
    themeChange(false);
  }, []);

  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        const authData = await checkAuth(); // Gọi checkAuth để lấy token và role
        setToken(authData.token);
        setRole(authData.role);
      } catch (error) {
        console.error("Error checking authentication:", error);
      } finally {
        setLoading(false); // Đặt loading thành false khi hoàn tất kiểm tra
      }
    };

    checkUserAuth(); // Gọi hàm xác thực người dùng
  }, []); // Chạy một lần khi component mount

  console.log(role); // Ghi log giá trị của role

  if (loading) {
    return <div>Loading...</div>; // Hiển thị loading trong khi đang xác thực
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/documentation" element={<Documentation />} />
        {/* Place new routes over this */}
        <Route path="/app/*" element={role === 'admin' ? <Layout /> : <CustomerLayout />} />
        <Route path="*" element={<Navigate to={token ? (role === 'admin' ? "/app/welcome" : "/home") : "/login"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
