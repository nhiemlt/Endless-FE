// customerRoutes.js
import { lazy } from 'react';

const Cart = lazy(() => import('../pages/public/Cart'));
const HelpCenter = lazy(() => import('../pages/public/HelpCenter'));
const Order = lazy(() => import('../pages/public/Order'));
const Pay = lazy(() => import('../pages/public/Pay'));
const Purchase = lazy(() => import('../pages/public/Purchase'));
const RatingCustomer = lazy(() => import('../pages/public/Rating'));
const VoucherCustomer = lazy(() => import('../pages/public/Voucher'));
const ProfileSettings = lazy(() => import('../pages/protected/ProfileSettings'));
const Home = lazy(() => import('../pages/public/Home'));
const ProductList = lazy(() => import('../pages/public/Product'));
const ProductDetail = lazy(() => import('../pages/public/ProductDetail'));
const GettingStarted = lazy(() => import('../pages/GettingStarted'));
const DocFeatures = lazy(() => import('../pages/DocFeatures'));
const DocComponents = lazy(() => import('../pages/DocComponents'));
const Integration = lazy(() => import('../pages/protected/Integration'));
const Charts = lazy(() => import('../pages/protected/Charts'));
const Page404 = lazy(() => import('../pages/protected/404'));
const Blank = lazy(() => import('../pages/protected/Blank'));
const ChangePassword = lazy(() => import('../pages/protected/ChangePassword'));

const customerRoutes = [
  { path: '/', component: Home },
  { path: '/cart', component: Cart, role: 'customer' },
  { path: '/help', component: HelpCenter, role: 'customer' },
  { path: '/order', component: Order, role: 'customer' },
  { path: '/pay', component: Pay, role: 'customer' },
  { path: '/purchase', component: Purchase, role: 'customer' },
  { path: '/rating', component: RatingCustomer, role: 'customer' },
  { path: '/voucher', component: VoucherCustomer, role: 'customer' },
  { path: '/settings-profile', component: ProfileSettings, role: ['customer'] },
  { path: '/home', component: Home },
  { path: '/products', component: ProductList },
  { path: '/product-detail', component: ProductDetail },
  { path: '/404', component: Page404, role: ['customer'] },
  { path: '/blank', component: Blank, role: ['customer'] },
  { path: '/change-password', component: ChangePassword, role: 'customer' }
];

export default customerRoutes;
