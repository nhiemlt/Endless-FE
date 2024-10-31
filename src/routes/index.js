// routes.js
import adminRoutes from './adminRoutes';
import customerRoutes from './customerRoutes';
import commonRoutes from './commonRoutes';

const routes = [
  ...adminRoutes,
  ...customerRoutes,
  ...commonRoutes,
];

export default routes;
