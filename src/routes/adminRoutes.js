// adminRoutes.js
import { lazy } from 'react';

const Dashboard = lazy(() => import('../pages/protected/Dashboard'));
const Welcome = lazy(() => import('../pages/protected/Welcome'));
const Attribute = lazy(() => import('../pages/protected/Attribute'));
const Brand = lazy(() => import('../pages/protected/Brand'));
const Category = lazy(() => import('../pages/protected/Category'));
const Entry = lazy(() => import('../pages/protected/Entry'));
const Notification = lazy(() => import('../pages/protected/Notification'));
const Product = lazy(() => import('../pages/protected/Product'));
const ProductVersion = lazy(() => import('../pages/protected/ProductVersion'));
const Promotion = lazy(() => import('../pages/protected/Promotion'));
const Rating = lazy(() => import('../pages/protected/Rating'));
const Role = lazy(() => import('../pages/protected/Role'));
const StatisticalInventory = lazy(() => import('../pages/protected/StatisticalInventory'));
const StatisticalProduct = lazy(() => import('../pages/protected/StatisticalProduct'));
const StatisticalRevenue = lazy(() => import('../pages/protected/StatisticalRevenue'));
const Voucher = lazy(() => import('../pages/protected/Voucher'));
const Customer = lazy(() => import('../pages/protected/Customer'));
const Employee = lazy(() => import('../pages/protected/Employee'));
const Leads = lazy(() => import('../pages/protected/Leads'));
const Team = lazy(() => import('../pages/protected/Team'));
const Calendar = lazy(() => import('../pages/protected/Calendar'));
const Transactions = lazy(() => import('../pages/protected/Transactions'));
const ProfileSettings = lazy(() => import('../pages/protected/ProfileSettings'));
const ChangePassword = lazy(() => import('../pages/protected/ChangePassword'));

const adminRoutes = [
  { path: '/dashboard', component: Dashboard, role: 'admin' },
  { path: '/welcome', component: Welcome, role: 'admin' },
  { path: '/attribute', component: Attribute, role: 'admin' },
  { path: '/brand', component: Brand, role: 'admin' },
  { path: '/category', component: Category, role: 'admin' },
  { path: '/entry', component: Entry, role: 'admin' },
  { path: '/notification', component: Notification, role: 'admin' },
  { path: '/product', component: Product, role: 'admin' },
  { path: '/product-version', component: ProductVersion, role: 'admin' },
  { path: '/promotion', component: Promotion, role: 'admin' },
  { path: '/rating', component: Rating, role: 'admin' },
  { path: '/role', component: Role, role: 'admin' },
  { path: '/statistical-inventory', component: StatisticalInventory, role: 'admin' },
  { path: '/statistical-product', component: StatisticalProduct, role: 'admin' },
  { path: '/statistical-revenue', component: StatisticalRevenue, role: 'admin' },
  { path: '/voucher', component: Voucher, role: 'admin' },
  { path: '/customer', component: Customer, role: 'admin' },
  { path: '/employee', component: Employee, role: 'admin' },
  { path: '/leads', component: Leads, role: 'admin' },
  { path: '/settings-team', component: Team, role: 'admin' },
  { path: '/calendar', component: Calendar, role: 'admin' },
  { path: '/transactions', component: Transactions, role: 'admin' },
  { path: '/settings-profile', component: ProfileSettings, role: ['admin'] },
  { path: '/change-password', component: ChangePassword, role: 'admin' }
];

export default adminRoutes;
