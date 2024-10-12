import { themeChange } from 'theme-change';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import BellIcon from '@heroicons/react/24/outline/BellIcon';
import Bars3Icon from '@heroicons/react/24/outline/Bars3Icon';
import MoonIcon from '@heroicons/react/24/outline/MoonIcon';
import SunIcon from '@heroicons/react/24/outline/SunIcon';
import { openRightDrawer } from '../features/common/rightDrawerSlice';
import { RIGHT_DRAWER_TYPES } from '../utils/globalConstantUtil';
import { Link, useLocation } from 'react-router-dom';

function Header() {
    const dispatch = useDispatch();
    const { noOfNotifications } = useSelector(state => state.header);
    const [currentTheme, setCurrentTheme] = useState(localStorage.getItem("theme"));
    const location = useLocation(); // Lấy đường dẫn hiện tại
    const [pageTitle, setPageTitle] = useState(''); // Khởi tạo state cho pageTitle

    useEffect(() => {
        themeChange(false);
        if (currentTheme === null) {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                setCurrentTheme("dark");
            } else {
                setCurrentTheme("light");
            }
        }
    }, []);

    useEffect(() => {
        // Cập nhật tiêu đề dựa trên đường dẫn hiện tại
        switch (location.pathname) {
            case '/app/dashboard':
            setPageTitle('Bảng điều khiển');
            break;
        case '/app/welcome':
            setPageTitle('Chào mừng');
            break;
        case '/app/leads':
            setPageTitle('Khách hàng tiềm năng');
            break;
        case '/app/settings-team':
            setPageTitle('Nhóm');
            break;
        case '/app/calendar':
            setPageTitle('Lịch');
            break;
        case '/app/transactions':
            setPageTitle('Giao dịch');
            break;
        case '/app/settings-profile':
            setPageTitle('Thông tin cá nhân');
            break;
        case '/app/settings-billing':
            setPageTitle('Hóa đơn');
            break;
        case '/app/getting-started':
            setPageTitle('Bắt đầu');
            break;
        case '/app/features':
            setPageTitle('Tính năng');
            break;
        case '/app/components':
            setPageTitle('Thành phần');
            break;
        case '/app/integration':
            setPageTitle('Tích hợp');
            break;
        case '/app/charts':
            setPageTitle('Biểu đồ');
            break;
        case '/app/404':
            setPageTitle('Trang không tồn tại');
            break;
        case '/app/blank':
            setPageTitle('Trang trống');
            break;
        case '/app/product-version':
            setPageTitle('Sản phẩm');
            break;
        case '/app/attribute':
            setPageTitle('Thuộc tính');
            break;
        case '/app/attribute-value':
            setPageTitle('Chi tiết thuộc tính');
            break;
        case '/app/category':
            setPageTitle('Danh mục');
            break;
        case '/app/brand':
            setPageTitle('Thương hiệu');
            break;
        case '/app/statistical-revenue':
            setPageTitle('Thống kê doanh thu');
            break;
        case '/app/statistical-product':
            setPageTitle('Thống kê sản phẩm');
            break;
        case '/app/statistical-inventory':
            setPageTitle('Thống kê kho');
            break;
        case '/app/rating':
            setPageTitle('Đánh giá');
            break;
        case '/app/user':
            setPageTitle('Tài khoản');
            break;
        case '/app/role':
            setPageTitle('Vai trò');
            break;
        case '/app/entry':
            setPageTitle('Nhập hàng');
            break;
        case '/app/voucher':
            setPageTitle('Voucher');
            break;
        case '/app/promotion':
            setPageTitle('Khuyến mãi');
            break;
        case '/app/notification':
            setPageTitle('Thông báo');
            break;
        default:
            setPageTitle('Không tìm thấy');
        }
    }, [location.pathname]); // Cập nhật pageTitle khi đường dẫn thay đổi

    // Mở thông báo
    const openNotification = () => {
        dispatch(openRightDrawer({ header: "Thông báo", bodyType: RIGHT_DRAWER_TYPES.NOTIFICATION }));
    };

    function logoutUser() {
        localStorage.clear();
        window.location.href = '/';
    }

    return (
        <div className="navbar sticky top-0 bg-base-100 z-10 shadow-md">
            <div className="flex-1">
                <label htmlFor="left-sidebar-drawer" className="btn btn-primary drawer-button lg:hidden">
                    <Bars3Icon className="h-5 inline-block w-5" />
                </label>
                <h1 className="text-2xl font-semibold ml-2">{pageTitle}</h1>
            </div>
            <div className="flex-none">
                <label className="swap">
                    <input type="checkbox" />
                    <SunIcon data-set-theme="light" data-act-class="ACTIVECLASS" className={"fill-current w-6 h-6 " + (currentTheme === "dark" ? "swap-on" : "swap-off")} />
                    <MoonIcon data-set-theme="dark" data-act-class="ACTIVECLASS" className={"fill-current w-6 h-6 " + (currentTheme === "light" ? "swap-on" : "swap-off")} />
                </label>
                <button className="btn btn-ghost ml-4 btn-circle" onClick={openNotification}>
                    <div className="indicator">
                        <BellIcon className="h-6 w-6" />
                        {noOfNotifications > 0 ? <span className="indicator-item badge badge-secondary badge-sm">{noOfNotifications}</span> : null}
                    </div>
                </button>
                <div className="dropdown dropdown-end ml-4">
                    <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                            <img src="https://scontent.fsgn10-2.fna.fbcdn.net/v/t39.30808-1/438231080_1679997752760769_814690727467529669_n.jpg?stp=dst-jpg_s200x200&_nc_cat=106&ccb=1-7&_nc_sid=50d2ac&_nc_ohc=B-N4CJiVMHMQ7kNvgHVbQQc&_nc_ht=scontent.fsgn10-2.fna&_nc_gid=AVzFsVWqXvMxmrvZQ-LPaS6&oh=00_AYBg1wL1O514-uk5iNVjR1PPh1jtAQlGXG0ApVgT8Dhbqg&oe=670E7608" alt="profile" />
                        </div>
                    </label>
                    <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                        <li className="justify-between">
                            <Link to={'/app/settings-profile'}>
                                Thông tin cá nhân
                            </Link>
                        </li>
                        <li className=''><Link to={'/app/settings-billing'}>Thay đổi mật khẩu</Link></li>
                        <div className="divider mt-0 mb-0"></div>
                        <li><a onClick={logoutUser}>Đăng xuất</a></li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Header;
