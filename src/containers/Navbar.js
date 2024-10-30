import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUnreadCount } from '../features/common/headerSlice'; // Nhập thunk
import BellIcon from '@heroicons/react/24/outline/BellIcon';
import Bars3Icon from '@heroicons/react/24/outline/Bars3Icon';
import MoonIcon from '@heroicons/react/24/outline/MoonIcon';
import SunIcon from '@heroicons/react/24/outline/SunIcon';
import { openRightDrawer } from '../features/common/rightDrawerSlice';
import { RIGHT_DRAWER_TYPES } from '../utils/globalConstantUtil';
import { Link } from 'react-router-dom';
import useCurrentUser from '../hooks/useCurrentUser';

function Navbar() {
    const dispatch = useDispatch();
    const { noOfNotifications } = useSelector(state => state.header);
    const { userInfo } = useSelector(state => state.user);
    const [currentTheme, setCurrentTheme] = useState(localStorage.getItem("theme") || "light");

    useCurrentUser();

    const longPolling = async () => {
        while (true) {
            await dispatch(fetchUnreadCount());
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    };

    useEffect(() => {
        const polling = longPolling();

        return () => {
            polling.cancel();
        };
    }, [dispatch]);

    const toggleTheme = () => {
        const newTheme = currentTheme === "light" ? "dark" : "light";
        setCurrentTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', currentTheme);
    }, []);

    const openNotification = () => {
        dispatch(openRightDrawer({ header: "Danh sách thông báo", bodyType: RIGHT_DRAWER_TYPES.NOTIFICATION }));
    };

    function logoutUser() {
        const deleteCookie = (name) => {
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        };
        deleteCookie("token");
        window.location.href = '/login';
    }

    return (
        <div className="navbar sticky top-0 bg-base-100 z-10 shadow-md">
            <div className="flex-1">
                <Link to="/" className="text-2xl font-semibold">Tên Website</Link>
                <div className="flex space-x-4 ml-4">
                    <Link to="/" className="btn btn-ghost">Trang Chủ</Link>
                    <Link to="/products" className="btn btn-ghost">Danh Sách Sản Phẩm</Link>
                    <Link to="/help" className="btn btn-ghost">Trung Tâm Trợ Giúp</Link>
                </div>
            </div>

            <div className="flex-none space-x-4">
                {/* Biểu tượng giỏ hàng */}
                <Link to="/cart" tabIndex="0" role="button" className="btn btn-ghost btn-circle">
                    <div className="indicator">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="badge badge-sm indicator-item">8</span>
                    </div>
                </Link>

                {/* Chế độ dark/light mode */}
                <label className="swap">
                    <input type="checkbox" checked={currentTheme === "dark"} onChange={toggleTheme} />
                    <SunIcon className={"fill-current w-6 h-6 " + (currentTheme === "dark" ? "swap-on" : "swap-off")} />
                    <MoonIcon className={"fill-current w-6 h-6 " + (currentTheme === "light" ? "swap-on" : "swap-off")} />
                </label>

                {/* Thông báo */}
                <button className="btn btn-ghost btn-circle" onClick={openNotification}>
                    <div className="indicator">
                        <BellIcon className="h-6 w-6" />
                        {noOfNotifications > 0 ? <span className="indicator-item badge badge-secondary badge-sm">{noOfNotifications}</span> : null}
                    </div>
                </button>

                {/* Avatar và menu dropdown */}
                <div className="dropdown dropdown-end ml-4">
                    <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full overflow-hidden">
                            <img 
                                src={userInfo?.avatar || 'https://example.com/default-avatar.png'} 
                                alt="profile"
                                className="object-cover w-full h-full"
                            />
                        </div>
                    </label>
                    <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                        <li className="justify-between">
                            <Link to={'/settings-profile'}>
                                Thông tin cá nhân
                            </Link>
                        </li>
                        <li><Link to={'/change-password'}>Thay đổi mật khẩu</Link></li>
                        <div className="divider mt-0 mb-0"></div>
                        <li><a onClick={logoutUser}>Đăng xuất</a></li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Navbar;
