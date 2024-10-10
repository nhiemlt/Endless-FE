// // src/App.jsx
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// // Import các trang
// import AdminLogin from './pages/admin/AdminLogin';
// import Dashboard from './pages/admin/Dashboard';
// import OrderManagement from './pages/admin/OrderManagement/OrderList';
// import PurchaseOrder from './pages/admin/PurchaseOrder/PurchaseOrderList';
// import NotificationManagement from './pages/admin/NotificationManagement/NotificationList';
// import UserManagement from './pages/admin/UserManagement/UserList';
// import AttributeManagement from './pages/admin/AttributeManagement/AttributeList';
// import BrandManagement from './pages/admin/BrandManagement/BrandList';
// import CategoryManagement from './pages/admin/CategoryManagement/CategoryList';
// import ProductManagement from './pages/admin/ProductManagement/ProductList';
// import ProductVersionManagement from './pages/admin/ProductVersionManagement/ProductVersionList';
// import PromotionManagement from './pages/admin/PromotionManagement/PromotionList';
// import VoucherManagement from './pages/admin/VoucherManagement/VoucherList';
// import RatingManagement from './pages/admin/RatingManagement/RatingList';
// import RoleManagement from './pages/admin/RoleManagement/RoleList';
// import UserAddressManagement from './pages/admin/UserAddressManagement/UserAddressList';
// import Home from './pages/user/Home';
// import VoucherList from './pages/user/VoucherList';
// import Rating from './pages/user/Rating';
// import FavoriteProducts from './pages/user/FavoriteProducts';
// import Cart from './pages/user/Cart';
// import Login from './pages/auth/Login';
// import Register from './pages/auth/Register';
// import ForgotPassword from './pages/auth/ForgotPassword';
// import NotFound from './pages/NotFound';

// const App = () => {
//   return (
//     <Router>
//       <Routes>
//         {/* Routes cho Admin */}
//         <Route path="/admin/login" element={<AdminLogin />} />
//         <Route path="/admin/dashboard" element={<Dashboard />} />
//         <Route path="/admin/orders" element={<OrderManagement />} />
//         <Route path="/admin/purchase-orders" element={<PurchaseOrder />} />
//         <Route path="/admin/notifications" element={<NotificationManagement />} />
//         <Route path="/admin/users" element={<UserManagement />} />
//         <Route path="/admin/attributes" element={<AttributeManagement />} />
//         <Route path="/admin/brands" element={<BrandManagement />} />
//         <Route path="/admin/categories" element={<CategoryManagement />} />
//         <Route path="/admin/products" element={<ProductManagement />} />
//         <Route path="/admin/product-versions" element={<ProductVersionManagement />} />
//         <Route path="/admin/promotions" element={<PromotionManagement />} />
//         <Route path="/admin/vouchers" element={<VoucherManagement />} />
//         <Route path="/admin/ratings" element={<RatingManagement />} />
//         <Route path="/admin/roles" element={<RoleManagement />} />
//         <Route path="/admin/user-addresses" element={<UserAddressManagement />} />
        
//         {/* Routes cho User */}
//         <Route path="/" element={<Home />} />
//         <Route path="/vouchers" element={<VoucherList />} />
//         <Route path="/ratings" element={<Rating />} />
//         <Route path="/favorites" element={<FavoriteProducts />} />
//         <Route path="/cart" element={<Cart />} />
        
//         {/* Routes cho xác thực */}
//         <Route path="/auth/login" element={<Login />} />
//         <Route path="/auth/register" element={<Register />} />
//         <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        
//         {/* Route cho trang 404 */}
//         <Route path="*" element={<NotFound />} />
//       </Routes>
//     </Router>
//   );
// };

// export default App;

import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
