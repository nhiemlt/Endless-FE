/** Icons are imported separately to reduce build time */
import DocumentTextIcon from '@heroicons/react/24/outline/DocumentTextIcon'
import Squares2X2Icon from '@heroicons/react/24/outline/Squares2X2Icon'
import WalletIcon from '@heroicons/react/24/outline/WalletIcon'
import UserIcon from '@heroicons/react/24/outline/UserIcon'
import CalendarDaysIcon from '@heroicons/react/24/outline/CalendarDaysIcon'
import TicketIcon from '@heroicons/react/24/outline/TicketIcon'
import CubeIcon from '@heroicons/react/24/outline/CubeIcon'
import ChartBarIcon from '@heroicons/react/24/outline/ChartBarIcon'
import BanknotesIcon from '@heroicons/react/24/outline/BanknotesIcon'
import InboxIcon from '@heroicons/react/24/outline/InboxIcon'
import BuildingStorefrontIcon from '@heroicons/react/24/outline/BuildingStorefrontIcon'

const iconClasses = `h-6 w-6`

const customerRoutes = [
  {
    path: '/home',
    icon: <Squares2X2Icon className={iconClasses} />,
    name: 'Trang Chủ',
  },
  {
    path: '/account',
    icon: <UserIcon className={iconClasses} />,
    name: 'Tài Khoản',
  },
  {
    path: '/cart',
    icon: <InboxIcon className={iconClasses} />,
    name: 'Giỏ Hàng',
  },
  {
    path: '/help-center',
    icon: <DocumentTextIcon className={iconClasses} />,
    name: 'Trung Tâm Trợ Giúp',
  },
  {
    path: '/order',
    icon: <WalletIcon className={iconClasses} />,
    name: 'Đơn Hàng',
  },
  {
    path: '/pay',
    icon: <BanknotesIcon className={iconClasses} />,
    name: 'Thanh Toán',
  },
  {
    path: '/product-list',
    icon: <CubeIcon className={iconClasses} />,
    name: 'Danh Sách Sản Phẩm',
  },
  {
    path: '/product-detail',
    icon: <BuildingStorefrontIcon className={iconClasses} />,
    name: 'Chi Tiết Sản Phẩm',
  },
  {
    path: '/purchase',
    icon: <CalendarDaysIcon className={iconClasses} />,
    name: 'Mua Hàng',
  },
  {
    path: '/rating-customer',
    icon: <ChartBarIcon className={iconClasses} />,
    name: 'Đánh Giá',
  },
  {
    path: '/voucher-customer',
    icon: <TicketIcon className={iconClasses} />,
    name: 'Voucher',
  },
]

export default customerRoutes
