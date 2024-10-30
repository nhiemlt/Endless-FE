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
  const StatisticalInventory = lazy(() => import('../pages/protected/StatisticalInventory'))
  const StatisticalProduct = lazy(() => import('../pages/protected/StatisticalProduct'))
  const StatisticalRevenue = lazy(() => import('../pages/protected/StatisticalRevenue'))
  const Voucher = lazy(() => import('../pages/protected/Voucher'))
  const Customer = lazy(() => import('../pages/protected/Customer'))
  const Employee = lazy(() => import('../pages/protected/Employee'))

  const Account = lazy(() => import('../pages/public/Account'))
  const Cart = lazy(() => import('../pages/public/Cart'))
  const HelpCenter = lazy(() => import('../pages/public/HelpCenter'))
  const Home = lazy(() => import('../pages/public/Home'))
  const Order = lazy(() => import('../pages/public/Order'))
  const Pay = lazy(() => import('../pages/public/Pay'))
  const ProductList = lazy(() => import('../pages/public/Product'))
  const ProductDetail = lazy(() => import('../pages/public/ProductDetail'))
  const Purchase = lazy(() => import('../pages/public/Purchase'))
  const RatingCustomer = lazy(() => import('../pages/public/Rating'))
  const VoucherCustomer = lazy(() => import('../pages/public/Voucher'))

  const routes = [
    {
      path: '/attribute', // the url
      component: Attribute, // view rendered
      role: 'admin'
    },
    {
      path: '/attribute-value', // the url
      component: AttributeValue, // view rendered
      role: 'admin'
    },
    {
      path: '/brand', // the url
      component: Brand, // view rendered
      role: 'admin'
    },
    {
      path: '/category', // the url
      component: Category, // view rendered
      role: 'admin'
    },
    {
      path: '/entry', // the url
      component: Entry, // view rendered
      role: 'admin'
    },
    {
      path: '/notification', // the url
      component: Notification, // view rendered
      role: 'admin'
    },
    {
      path: '/product', // the url
      component: Product, // view rendered
      role: 'admin'
    },
    {
      path: '/product-version', // the url
      component: ProductVersion, // view rendered
      role: 'admin'
    },
    {
      path: '/promotion', // the url
      component: Promotion, // view rendered
      role: 'admin'
    },
    {
      path: '/rating', // the url
      component: Rating, // view rendered
      role: 'admin'
    },
    {
      path: '/role', // the url
      component: Role, // view rendered
      role: 'admin'
    },
    {
      path: '/statistical-inventory', // the url
      component: StatisticalInventory, // view rendered
      role: 'admin'
    },
    {
      path: '/statistical-product', // the url
      component: StatisticalProduct, // view rendered
      role: 'admin'
    },
    {
      path: '/statistical-revenue', // the url
      component: StatisticalRevenue, // view rendered
      role: 'admin'
    },
    {
      path: '/voucher', // the url
      component: Voucher, // view rendered
      role: 'admin'
    },
    {
      path: '/customer', // the url
      component: Customer, // view rendered
      role: 'admin'
    },
    {
      path: '/employee', // the url
      component: Employee, // view rendered
      role: 'admin'
    },
    {
      path: '/dashboard', // the url
      component: Dashboard, // view rendered
      role: 'admin'
    },
    {
      path: '/welcome', // the url
      component: Welcome, // view rendered
      role: 'admin'
    },
    {
      path: '/leads',
      component: Leads,
      role: 'admin'
    },
    {
      path: '/settings-team',
      component: Team,
      role: 'admin'
    },
    {
      path: '/calendar',
      component: Calendar,
      role: 'admin'
    },
    {
      path: '/transactions',
      component: Transactions,
      role: 'admin'
    },
    {
      path: '/settings-profile',
      component: ProfileSettings,
      role: ['admin', 'customer'] 
    },
    {
      path: '/settings-billing',
      component: Bills,
      role: 'admin'
    },
    {
      path: '/getting-started',
      component: GettingStarted,
      role: ['admin', 'customer']
    },
    {
      path: '/features',
      component: DocFeatures,
      role: ['admin', 'customer']
    },
    {
      path: '/components',
      component: DocComponents,
      role: ['admin', 'customer']
    },
    {
      path: '/integration',
      component: Integration,
      role: ['admin', 'customer']
    },
    {
      path: '/charts',
      component: Charts,
      role: ['admin', 'customer']
    },
    {
      path: '/404',
      component: Page404,
      role: ['admin', 'customer']
    },
    {
      path: '/blank',
      component: Blank,
      role: ['admin', 'customer']
    },
    {
      path: '/account', // the url
      component: Account, // view rendered
    },
    {
      path: '/cart', // the url
      component: Cart, // view rendered
      role: 'customer'
    },
    {
      path: '/help-center', // the url
      component: HelpCenter, // view rendered
      role: 'customer'
    },
    {
      path: '/home', // the url
      component: Home, // view rendered
    },
    {
      path: '/order', // the url
      component: Order, // view rendered
      role: 'customer'
    },
    {
      path: '/pay', // the url
      component: Pay, // view rendered
      role: 'customer'
    },
    {
      path: '/product-list', // the url
      component: ProductList, // view rendered
    },
    {
      path: '/product-detail', // the url
      component: ProductDetail, // view rendered
    },
    {
      path: '/purchase', // the url
      component: Purchase, // view rendered
      role: 'customer'
    },
    {
      path: '/rating-customer', // the url
      component: RatingCustomer, // view rendered
      role: 'customer'
    },
    {
      path: '/voucher-customer', // the url
      component: VoucherCustomer, // view rendered
      role: 'customer'
    }
  ]

  export default routes
