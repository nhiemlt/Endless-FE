/** Icons are imported separatly to reduce build time */
import DocumentTextIcon from '@heroicons/react/24/outline/DocumentTextIcon'
import Squares2X2Icon from '@heroicons/react/24/outline/Squares2X2Icon'
import TableCellsIcon from '@heroicons/react/24/outline/TableCellsIcon'
import WalletIcon from '@heroicons/react/24/outline/WalletIcon'
import CodeBracketSquareIcon from '@heroicons/react/24/outline/CodeBracketSquareIcon'
import DocumentIcon from '@heroicons/react/24/outline/DocumentIcon'
import ExclamationTriangleIcon from '@heroicons/react/24/outline/ExclamationTriangleIcon'
import CalendarDaysIcon from '@heroicons/react/24/outline/CalendarDaysIcon'
import ArrowRightOnRectangleIcon from '@heroicons/react/24/outline/ArrowRightOnRectangleIcon'
import Cog6ToothIcon from '@heroicons/react/24/outline/Cog6ToothIcon'
import BoltIcon from '@heroicons/react/24/outline/BoltIcon'
import DocumentDuplicateIcon from '@heroicons/react/24/outline/DocumentDuplicateIcon'

import GiftIcon from '@heroicons/react/24/outline/GiftIcon'
import BellAlertIcon from '@heroicons/react/24/outline/BellAlertIcon'
import UserIcon from '@heroicons/react/24/outline/UserIcon'
import UserCircleIcon from '@heroicons/react/24/outline/UserCircleIcon'
import KeyIcon from '@heroicons/react/24/outline/KeyIcon'
import RectangleStackIcon from '@heroicons/react/24/outline/RectangleStackIcon'
import ListBulletIcon from '@heroicons/react/24/outline/ListBulletIcon'
import BuildingStorefrontIcon from '@heroicons/react/24/outline/BuildingStorefrontIcon'
import InboxStackIcon from '@heroicons/react/24/outline/InboxStackIcon'
import InboxIcon from '@heroicons/react/24/outline/InboxIcon'
import TicketIcon from '@heroicons/react/24/outline/TicketIcon'
import CubeIcon from '@heroicons/react/24/outline/CubeIcon'
import CubeTransparentIcon from '@heroicons/react/24/outline/CubeTransparentIcon'
import ChartBarIcon from '@heroicons/react/24/outline/ChartBarIcon'
import CurrencyDollarIcon from '@heroicons/react/24/outline/CurrencyDollarIcon'
import ArchiveBoxIcon from '@heroicons/react/24/outline/ArchiveBoxIcon'
import StarIcon from '@heroicons/react/24/outline/StarIcon'
import BanknotesIcon from '@heroicons/react/24/outline/BanknotesIcon'

const iconClasses = `h-6 w-6`
const submenuIconClasses = `h-5 w-5`

const routes = [

  {
    path: '/app/dashboard',
    icon: <Squares2X2Icon className={iconClasses} />,
    name: 'BẢNG ĐIỀU KHIỂN',
  },
  {
    path: '', //no url needed as this has submenu
    icon: <InboxIcon className={`${iconClasses} inline`} />, // icon component
    name: 'Sản phẩm', // name that appear in Sidebar
    submenu: [
      {
        path: '/app/product-version', // url
        icon: <InboxIcon className={submenuIconClasses} />, // icon component
        name: 'Sản phẩm', // name that appear in Sidebar
      },
      {
        path: '/app/product-version', // url
        icon: <InboxStackIcon className={submenuIconClasses} />, // icon component
        name: 'Phiên bản sản phẩm', // name that appear in Sidebar
      },
      {
        path: '/app/attribute',
        icon: <CubeIcon className={submenuIconClasses} />,
        name: 'Thuộc tính',
      },
      {
        path: '/app/attribute-value',
        icon: <CubeTransparentIcon className={submenuIconClasses} />,
        name: 'Chi tiết thuộc tính',
      }
    ]
  },
  {
    path: '', //no url needed as this has submenu
    icon: <RectangleStackIcon className={`${iconClasses} inline`} />, // icon component
    name: 'Danh mục và Thương hiệu', // name that appear in Sidebar
    submenu: [

      {
        path: '/app/category', // url
        icon: <ListBulletIcon className={iconClasses} />, // icon component
        name: 'Danh mục', // name that appear in Sidebar
      },
      {
        path: '/app/brand', // url
        icon: <BuildingStorefrontIcon className={iconClasses} />, // icon component
        name: 'Thương hiệu', // name that appear in Sidebar
      },
    ]
  },
  {
    path: '', //no url needed as this has submenu
    icon: <ChartBarIcon className={`${iconClasses} inline`} />, // icon component
    name: 'Thống kê', // name that appear in Sidebar
    submenu: [
      {
        path: '/app/statistical-revenue',
        icon: <CurrencyDollarIcon className={submenuIconClasses} />,
        name: 'Thống kê doanh thu',
      },
      {
        path: '/app/statistical-product', //url
        icon: <InboxIcon className={submenuIconClasses} />, // icon component
        name: 'Thống kê sản phẩm', // name that appear in Sidebar
      },
      {
        path: '/app/statistical-inventory', //url
        icon: <ArchiveBoxIcon className={submenuIconClasses} />, // icon component
        name: 'Thống kê kho', // name that appear in Sidebar
      },
      {
        path: '/app/rating', // url
        icon: <StarIcon className={iconClasses} />, // icon component
        name: 'Đánh giá', // name that appear in Sidebar
      },
    ]
  },
  {
    path: '', //no url needed as this has submenu
    icon: <UserIcon className={`${iconClasses} inline`} />, // icon component
    name: 'Người dùng', // name that appear in Sidebar
    submenu: [
      {
        path: '/app/user', // url
        icon: <UserCircleIcon className={iconClasses} />, // icon component
        name: 'Tài khoản', // name that appear in Sidebar
      },
      {
        path: '/app/role', // url
        icon: <KeyIcon className={iconClasses} />, // icon component
        name: 'Vai trò', // name that appear in Sidebar
      },
    ]
  },
  {
    path: '/app/transactions', // url
    icon: <BanknotesIcon className={iconClasses} />, // icon component
    name: 'Giao dịch', // name that appear in Sidebar
  },
  {
    path: '/app/entry', // url
    icon: <CalendarDaysIcon className={iconClasses} />, // icon component
    name: 'Nhập Hàng', // name that appear in Sidebar
  },
  {
    path: '/app/voucher', // url
    icon: <TicketIcon className={iconClasses} />, // icon component
    name: 'Voucher', // name that appear in Sidebar
  },
  {
    path: '/app/promotion', // url
    icon: <BoltIcon className={iconClasses} />, // icon component
    name: 'Khuyến Mãi', // name that appear in Sidebar
  },
  {
    path: '/app/notification', // url
    icon: <BellAlertIcon className={iconClasses} />, // icon component
    name: 'Thông Báo', // name that appear in Sidebar
  },
]

export default routes


