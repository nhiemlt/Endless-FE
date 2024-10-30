import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUnreadCount } from '../features/common/headerSlice';
import { openRightDrawer } from '../features/common/rightDrawerSlice';
import { RIGHT_DRAWER_TYPES } from '../utils/globalConstantUtil';
import { Link } from 'react-router-dom';
import useCurrentUser from '../hooks/useCurrentUser';
import BellIcon from '@heroicons/react/24/outline/BellIcon';
import MoonIcon from '@heroicons/react/24/outline/MoonIcon';
import SunIcon from '@heroicons/react/24/outline/SunIcon';

function Navbar() {
    const dispatch = useDispatch();
    const { noOfNotifications, pageTitle } = useSelector(state => state.header);
    const { userInfo } = useSelector(state => state.user);
    const [currentTheme, setCurrentTheme] = useState(localStorage.getItem("theme"));

    useCurrentUser();

    // Hàm long polling
    useEffect(() => {
        const longPolling = async () => {
            while (true) {
                await dispatch(fetchUnreadCount());
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        };

        longPolling();

        // Clean up function (if needed)
        return () => {
            // Cleanup logic here if necessary
        };
    }, [dispatch]);

    const openNotification = () => {
        dispatch(openRightDrawer({ header: "Danh sách thông báo", bodyType: RIGHT_DRAWER_TYPES.NOTIFICATION }));
    };

    const logoutUser = () => {
        const deleteCookie = (name) => {
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        };
        deleteCookie("token");
        window.location.href = '/login';
    };

    return (
        <div className="navbar sticky top-0 bg-base-100 z-10 shadow-md">
            <div className="flex-1">
                <Link to="/" className="text-2xl font-semibold ml-2">Logo</Link>
                <h1 className="ml-2">{pageTitle}</h1>
            </div>

            <div className="flex-none">
                <label className="swap">
                    <input type="checkbox" />
                    <SunIcon data-set-theme="light" className={`fill-current w-6 h-6 ${currentTheme === "dark" ? "swap-on" : "swap-off"}`} />
                    <MoonIcon data-set-theme="dark" className={`fill-current w-6 h-6 ${currentTheme === "light" ? "swap-on" : "swap-off"}`} />
                </label>

                <button className="btn btn-ghost ml-4 btn-circle" onClick={openNotification}>
                    <div className="indicator">
                        <BellIcon className="h-6 w-6" />
                        {noOfNotifications > 0 && <span className="indicator-item badge badge-secondary badge-sm">{noOfNotifications}</span>}
                    </div>
                </button>

                <div className="dropdown dropdown-end ml-4">
                    <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full overflow-hidden">
                            <img 
                                src={userInfo?.avatar || 'https://th.bing.com/th/id/R.8914f8408a735b357b399d9f3a89a960?rik=%2bsWx0BlA%2bOW9lQ&pid=ImgRaw&r=0'} 
                                alt="profile"
                                className="object-cover w-full h-full"
                            />
                        </div>
                    </label>
                    <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                        <li><Link to={'/app/settings-profile'}>Thông tin cá nhân</Link></li>
                        <li><Link to={'/app/settings-billing'}>Thay đổi mật khẩu</Link></li>
                        <div className="divider mt-0 mb-0"></div>
                        <li><a onClick={logoutUser}>Đăng xuất</a></li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Navbar;
