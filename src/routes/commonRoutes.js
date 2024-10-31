// commonRoutes.js
import { lazy } from 'react';

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

const commonRoutes = [
  { path: '/home', component: Home },
  { path: '/product-list', component: ProductList },
  { path: '/product-detail', component: ProductDetail },
  { path: '/getting-started', component: GettingStarted, role: ['admin', 'customer'] },
  { path: '/features', component: DocFeatures, role: ['admin', 'customer'] },
  { path: '/components', component: DocComponents, role: ['admin', 'customer'] },
  { path: '/integration', component: Integration, role: ['admin', 'customer'] },
  { path: '/charts', component: Charts, role: ['admin', 'customer'] },
  { path: '/404', component: Page404, role: ['admin', 'customer'] },
  { path: '/blank', component: Blank, role: ['admin', 'customer'] },
];

export default commonRoutes;
