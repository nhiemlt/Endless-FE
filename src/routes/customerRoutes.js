// customerRoutes.js
import { lazy } from 'react';

const Cart = lazy(() => import('../pages/public/Cart'));
const HelpCenter = lazy(() => import('../pages/public/HelpCenter'));
const AboutUs = lazy(() => import('../pages/public/AboutUs'));
const Order = lazy(() => import('../pages/public/Order'));
const Pay = lazy(() => import('../pages/public/Pay'));
const Purchase = lazy(() => import('../pages/public/Purchase'));
const RatingCustomer = lazy(() => import('../pages/public/Rating'));
const VoucherCustomer = lazy(() => import('../pages/public/Voucher'));
const ProfileSettings = lazy(() => import('../pages/protected/ProfileSettings'));
const Home = lazy(() => import('../pages/public/Home'));
const ProductList = lazy(() => import('../pages/public/Product'));
const ProductDetail = lazy(() => import('../pages/public/ProductDetail'));
const Page404 = lazy(() => import('../pages/protected/404'));
const Blank = lazy(() => import('../pages/protected/Blank'));
const ChangePassword = lazy(() => import('../pages/protected/ChangePassword'));

const customerRoutes = [
  { path: '/', component: Home },
  { path: '/cart', component: Cart, role: 'customer' },
  { path: '/help', component: HelpCenter, role: 'customer' },  
  { path: '/about-us', component: AboutUs, role: 'customer' },
  { path: '/order', component: Order, role: 'customer' },
  { path: '/pay', component: Pay, role: 'customer' },
  { path: '/purchase', component: Purchase, role: 'customer' },
  { path: '/rating', component: RatingCustomer, role: 'customer' },
  { path: '/voucher', component: VoucherCustomer, role: 'customer' },
  { path: '/settings-profile', component: ProfileSettings, role: ['customer'] },
  { path: '/home', component: Home },
  { path: '/products', component: ProductList },
  { path: '/product-detail/:id', component: ProductDetail }, 
  { path: '/404', component: Page404, role: ['customer'] },
  { path: '/blank', component: Blank, role: ['customer'] },
  { path: '/change-password', component: ChangePassword, role: 'customer' }
];

export default customerRoutes;
