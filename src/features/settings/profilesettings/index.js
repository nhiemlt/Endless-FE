import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { showNotification } from '../../common/headerSlice';
import TitleCard from "../../../components/Cards/TitleCard";
import axios from "axios";

function ProfileSettings() {
    const dispatch = useDispatch();

    const [profileData, setProfileData] = useState({
        userID: "",
        username: "",
        fullname: "",
        phone: "",
        email: "",
        avatar: "",
        language: "",
    });

    // Gọi API để lấy thông tin người dùng hiện tại
    useEffect(() => {
        axios.get("http://localhost:8080/api/users/current")
            .then(response => {
                const userData = response.data;
                console.log("User data from API:", userData); // Thêm log để kiểm tra dữ liệu trả về
                setProfileData({
                    userID: userData.userID,
                    username: userData.username,
                    fullname: userData.fullname || "",
                    phone: userData.phone || "",
                    email: userData.email,
                    avatar: userData.avatar || "",
                    language: userData.language || "",
                });
            })
            .catch(error => {
                console.error("Error fetching user data:", error);
                dispatch(showNotification({ message: "Failed to load user data", status: 0 }));
            });
    }, [dispatch]);


    const updateProfile = (e) => {
        e.preventDefault();
        // Call API here to update the profile

        dispatch(showNotification({ message: "Profile Updated", status: 1 }));
    };

    // Cập nhật giá trị form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData({ ...profileData, [name]: value });
    };

    return (
        <TitleCard title={"Thông tin cá nhân"}>
            <div>
                <form onSubmit={updateProfile}>
                    <div className="flex flex-col items-center mb-4">
                        <div className="mx-auto flex justify-center w-[141px] h-[141px] bg-blue-300/20 rounded-full" style={{ backgroundImage: `url(${profileData.avatar})` }}>
                            <div className="bg-white/90 rounded-full w-6 h-6 text-center ml-28 mt-4">
                                <input type="file" name="profileImage" id="upload_profile" hidden onChange={handleInputChange} />
                                <label htmlFor="upload_profile">
                                    <svg data-slot="icon" className="w-6 h-5 text-blue-700" fill="none" strokeWidth="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175..."></path>
                                    </svg>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="flex lg:flex-row md:flex-col sm:flex-col xs:flex-col gap-2 justify-center w-full">
                        <div className="w-full mb-4 mt-6">
                            <label htmlFor="userID" className="mb-2 dark:text-gray-300">ID người dùng</label>
                            <input type="text" name="userID" className="mt-2 p-4 w-full border-2 rounded-lg" value={profileData.userID} readOnly />
                        </div>
                        <div className="w-full mb-4 lg:mt-6">
                            <label htmlFor="username" className="mb-2 dark:text-gray-300">Tên người dùng</label>
                            <input type="text" name="username" className="mt-2 p-4 w-full border-2 rounded-lg" value={profileData.username} readOnly/>
                        </div>
                    </div>
                    <div className="flex lg:flex-row md:flex-col sm:flex-col xs:flex-col gap-2 justify-center w-full">
                        <div className="w-full mb-4">
                            <label htmlFor="fullname" className="mb-2 dark:text-gray-300">Họ và Tên:</label>
                            <input type="text" name="fullname" className="mt-2 p-4 w-full border-2 rounded-lg" placeholder="Nhập họ tên" value={profileData.fullname} onChange={handleInputChange} />
                        </div>
                        <div className="w-full mb-4">
                            <label htmlFor="email" className="mb-2 dark:text-gray-300">Email</label>
                            <input type="email" name="email" className="mt-2 p-4 w-full border-2 rounded-lg" placeholder="Nhập email" value={profileData.email} onChange={handleInputChange} />
                        </div>
                    </div>
                    <div className="flex lg:flex-row md:flex-col sm:flex-col xs:flex-col gap-2 justify-center w-full">
                        <div className="w-full mb-4">
                            <label htmlFor="phone" className="mb-2 dark:text-gray-300">Số điện thoại</label>
                            <input type="tel" name="phone" className="mt-2 p-4 w-full border-2 rounded-lg" placeholder="Nhập số điện thoại" value={profileData.phone} onChange={handleInputChange} />
                        </div>
                        <div className="w-full mb-4">
                            <label htmlFor="language" className="mb-2 dark:text-gray-300">Ngôn ngữ</label>
                            <input type="text" name="language" className="mt-2 p-4 w-full border-2 rounded-lg" placeholder="Nhập ngôn ngữ" value={profileData.language} onChange={handleInputChange} />
                        </div>
                    </div>
                    <div className="w-full rounded-lg bg-blue-500 mt-4 text-white text-lg font-semibold">
                        <button type="submit" className="w-full p-4">Cập nhật</button>
                    </div>
                </form>
            </div>
        </TitleCard>
    );
}

export default ProfileSettings;
