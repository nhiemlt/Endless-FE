import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUnreadCount } from '../features/common/headerSlice';
import BellIcon from '@heroicons/react/24/outline/BellIcon';
import MoonIcon from '@heroicons/react/24/outline/MoonIcon';
import SunIcon from '@heroicons/react/24/outline/SunIcon';
import { openRightDrawer } from '../features/common/rightDrawerSlice';
import { RIGHT_DRAWER_TYPES } from '../utils/globalConstantUtil';
import { Link } from 'react-router-dom';
import useCurrentUser from '../hooks/useCurrentUser';
import CartService from "../services/CartService";

function Navbar() {
    const dispatch = useDispatch();
    const { noOfNotifications } = useSelector(state => state.header);
    const { userInfo } = useSelector(state => state.user);
    const [currentTheme, setCurrentTheme] = useState(localStorage.getItem("theme") || "light");
    const [totalCartQuantity, setTotalCartQuantity] = useState(0);

    useCurrentUser();

    const longPolling = async () => {
        while (true) {
            await dispatch(fetchUnreadCount());
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    };

    useEffect(() => {
        if (userInfo) { // Chỉ chạy longPolling nếu người dùng đã đăng nhập
            longPolling();
        }
    }, [dispatch, userInfo]);

    const toggleTheme = () => {
        const newTheme = currentTheme === "light" ? "dark" : "light";
        setCurrentTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', currentTheme);
    }, [currentTheme]);

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

    useEffect(() => {
        // Hàm gọi API để lấy tổng số lượng sản phẩm
        const fetchTotalCartQuantity = async () => {
            try {
                const quantity = await CartService.getTotalCartQuantity();
                setTotalCartQuantity(quantity);
            } catch (error) {
                console.error("Lỗi khi lấy số lượng sản phẩm trong giỏ hàng:", error);
            }
        };

        // Gọi hàm fetchTotalCartQuantity mỗi 3 giây
        const intervalId = setInterval(fetchTotalCartQuantity, 1000);

        // Xóa interval khi component unmount
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="lg:px-32 navbar bg-base-100 sticky top-0 z-10 shadow-md">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} className="btn btn-ghost lg:hidden">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                        <li><Link to="/">Trang Chủ</Link></li>
                        <li><Link to="/products">Danh Sách Sản Phẩm</Link></li>
                        <li><Link to="/help">Trung Tâm Trợ Giúp</Link></li>
                        <li><Link to="/about-us">Về chúng tôi</Link></li>
                    </ul>
                </div>
                <Link to="/" className="btn btn-ghost text-xl"><img className="h-full" src="./logo-theme.png" alt="Logo" /></Link>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    <li><Link to="/">Trang Chủ</Link></li>
                    <li><Link to="/products">Danh Sách Sản Phẩm</Link></li>
                    <li><Link to="/help">Trung Tâm Trợ Giúp</Link></li>
                    <li><Link to="/about-us">Về chúng tôi</Link></li>
                </ul>
            </div>
            <div className="navbar-end flex items-center space-x-2">
                {userInfo && ( // Chỉ hiển thị nút giỏ hàng và thông báo khi đã đăng nhập
                    <>
                        <Link to="/cart" className="btn btn-ghost btn-circle">
                            <div className="indicator">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                                {totalCartQuantity > 0 && (
                                    <span className="badge badge-sm badge-secondary indicator-item">{totalCartQuantity}</span>
                                )}
                            </div>
                        </Link>

                        <button className="btn btn-ghost btn-circle" onClick={openNotification}>
                            <div className="indicator">
                                <BellIcon className="h-6 w-6" />
                                {noOfNotifications > 0 && <span className="indicator-item badge badge-secondary badge-sm">{noOfNotifications}</span>}
                            </div>
                        </button>
                    </>
                )}

                <label className="swap">
                    <input type="checkbox" checked={currentTheme === "dark"} onChange={toggleTheme} />
                    <SunIcon className={`fill-current w-6 h-6 ${currentTheme === "dark" ? "swap-on" : "swap-off"}`} />
                    <MoonIcon className={`fill-current w-6 h-6 ${currentTheme === "light" ? "swap-on" : "swap-off"}`} />
                </label>

                <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                        <div className="w-6 rounded-full overflow-hidden ">
                            <img
                                src={userInfo?.avatar || './default-avatar.jpg'}
                                alt="profile"
                                className="object-cover w-full h-full"
                            />
                        </div>
                    </label>
                    <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                        {userInfo ? (
                            <>
                                <li><Link to={'/settings-profile'}>Thông tin cá nhân</Link></li>
                                <li><Link to={'/order'}>Lịch sử mua hàng</Link></li>
                                <li><Link to={'/voucher'}>Danh sách voucher</Link></li>
                                <li><Link to={'/change-password'}>Thay đổi mật khẩu</Link></li>
                                <div className="divider mt-0 mb-0"></div>
                                <li><a onClick={logoutUser}>Đăng xuất</a></li>
                            </>
                        ) : (
                            <>
                                <li><Link to="/login">Đăng nhập</Link></li>
                                <li><Link to="/register">Đăng ký</Link></li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Navbar;
