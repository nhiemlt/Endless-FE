// All components mapping with path for internal routes

import { lazy } from 'react'

const Dashboard = lazy(() => import('../pages/protected/Dashboard'))
const Welcome = lazy(() => import('../pages/protected/Welcome'))
const Page404 = lazy(() => import('../pages/protected/404'))
const Blank = lazy(() => import('../pages/protected/Blank'))
const Charts = lazy(() => import('../pages/protected/Charts'))
const Leads = lazy(() => import('../pages/protected/Leads'))
const Integration = lazy(() => import('../pages/protected/Integration'))
const Calendar = lazy(() => import('../pages/protected/Calendar'))
const Team = lazy(() => import('../pages/protected/Team'))
const Transactions = lazy(() => import('../pages/protected/Transactions'))
const Bills = lazy(() => import('../pages/protected/Bills'))
const ProfileSettings = lazy(() => import('../pages/protected/ProfileSettings'))
const GettingStarted = lazy(() => import('../pages/GettingStarted'))
const DocFeatures = lazy(() => import('../pages/DocFeatures'))
const DocComponents = lazy(() => import('../pages/DocComponents'))
const Attribute = lazy(() => import('../pages/protected/Attribute'))
const AttributeValue = lazy(() => import('../pages/protected/AttributeValue'))
const Brand = lazy(() => import('../pages/protected/Brand'))
const Category = lazy(() => import('../pages/protected/Category'))
const Entry = lazy(() => import('../pages/protected/Entry'))
const Notification = lazy(() => import('../pages/protected/Notification'))
const Product = lazy(() => import('../pages/protected/Product'))
const ProductVersion = lazy(() => import('../pages/protected/ProductVersion'))
const Promotion = lazy(() => import('../pages/protected/Promotion'))
const Rating = lazy(() => import('../pages/protected/Rating'))
const Role = lazy(() => import('../pages/protected/Role'))
const StatisticalInvendory = lazy(() => import('../pages/protected/StatisticalInvendory'))
const StatisticalProduct = lazy(() => import('../pages/protected/StatisticalProduct'))
const StatisticalRevenue = lazy(() => import('../pages/protected/StatisticalRevenue'))
const Voucher = lazy(() => import('../pages/protected/Voucher'))

const routes = [
  {
    path: '/attribute', // the url
    component: Attribute, // view rendered
  },
  {
    path: '/attribute-value', // the url
    component: AttributeValue, // view rendered
  },
  {
    path: '/brand', // the url
    component: Brand, // view rendered
  },
  {
    path: '/category', // the url
    component: Category, // view rendered
  },
  {
    path: '/entry', // the url
    component: Entry, // view rendered
  },
  {
    path: '/notification', // the url
    component: Notification, // view rendered
  },
  {
    path: '/product', // the url
    component: Product, // view rendered
  },
  {
    path: '/product-version', // the url
    component: ProductVersion, // view rendered
  },
  {
    path: '/promotion', // the url
    component: Promotion, // view rendered
  },
  {
    path: '/rating', // the url
    component: Rating, // view rendered
  },
  {
    path: '/role', // the url
    component: Role, // view rendered
  },
  {
    path: '/statistical-invendory', // the url
    component: StatisticalInvendory, // view rendered
  },
  {
    path: '/statistical-product', // the url
    component: StatisticalProduct, // view rendered
  },
  {
    path: '/statistical-revenue', // the url
    component: StatisticalRevenue, // view rendered
  },
  {
    path: '/voucher', // the url
    component: Voucher, // view rendered
  },
  {
    path: '/dashboard', // the url
    component: Dashboard, // view rendered
  },
  {
    path: '/welcome', // the url
    component: Welcome, // view rendered
  },
  {
    path: '/leads',
    component: Leads,
  },
  {
    path: '/settings-team',
    component: Team,
  },
  {
    path: '/calendar',
    component: Calendar,
  },
  {
    path: '/transactions',
    component: Transactions,
  },
  {
    path: '/settings-profile',
    component: ProfileSettings,
  },
  {
    path: '/settings-billing',
    component: Bills,
  },
  {
    path: '/getting-started',
    component: GettingStarted,
  },
  {
    path: '/features',
    component: DocFeatures,
  },
  {
    path: '/components',
    component: DocComponents,
  },
  {
    path: '/integration',
    component: Integration,
  },
  {
    path: '/charts',
    component: Charts,
  },
  {
    path: '/404',
    component: Page404,
  },
  {
    path: '/blank',
    component: Blank,
  },
]

export default routes
