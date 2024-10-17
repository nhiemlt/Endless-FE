import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { showNotification } from '../../common/headerSlice';
import TitleCard from "../../../components/Cards/TitleCard"

function ProfileSettings() {
    const dispatch = useDispatch();

    const [profileData, setProfileData] = useState({
        userID: "252e1a91-3413-4246-ae8d-d0f6ab18555c",
        username: "9QAF3BACtkguPJ182HWOo91wm0n2",
        fullname: "Thảo Nguyên Võ Thị",
        phone: null,
        email: "vothithaonguyen3426@gmail.com",
        avatar: "https://lh3.googleusercontent.com/a/ACg8ocIIMLxhXYgM_0xcyzxs949_zN3nANs21kqRi27hjq1NectqByfNNQ=s96-c",
        language: "vietnam",
    });

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
        <TitleCard>
            <div>
                <h1 className="lg:text-3xl md:text-2xl sm:text-xl xs:text-xl font-serif font-extrabold mb-2 dark:text-white">Profile</h1>
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
                            <label htmlFor="userID" className="mb-2 dark:text-gray-300">User ID</label>
                            <input type="text" name="userID" className="mt-2 p-4 w-full border-2 rounded-lg" placeholder="User ID" value={profileData.userID} readOnly />
                        </div>
                        <div className="w-full mb-4 lg:mt-6">
                            <label htmlFor="username" className="mb-2 dark:text-gray-300">Username</label>
                            <input type="text" name="username" className="mt-2 p-4 w-full border-2 rounded-lg" placeholder="Username" value={profileData.username} onChange={handleInputChange} />
                        </div>
                    </div>
                    <div className="flex lg:flex-row md:flex-col sm:flex-col xs:flex-col gap-2 justify-center w-full">
                        <div className="w-full mb-4">
                            <label htmlFor="fullname" className="mb-2 dark:text-gray-300">Full Name</label>
                            <input type="text" name="fullname" className="mt-2 p-4 w-full border-2 rounded-lg" placeholder="Full Name" value={profileData.fullname} onChange={handleInputChange} />
                        </div>
                        <div className="w-full mb-4">
                            <label htmlFor="email" className="mb-2 dark:text-gray-300">Email</label>
                            <input type="email" name="email" className="mt-2 p-4 w-full border-2 rounded-lg" placeholder="Email" value={profileData.email} onChange={handleInputChange} />
                        </div>
                    </div>
                    <div className="flex lg:flex-row md:flex-col sm:flex-col xs:flex-col gap-2 justify-center w-full">
                        <div className="w-full mb-4">
                            <label htmlFor="phone" className="mb-2 dark:text-gray-300">Phone</label>
                            <input type="tel" name="phone" className="mt-2 p-4 w-full border-2 rounded-lg" placeholder="Phone Number" value={profileData.phone} onChange={handleInputChange} />
                        </div>
                        <div className="w-full mb-4">
                            <label htmlFor="language" className="mb-2 dark:text-gray-300">Language</label>
                            <input type="text" name="language" className="mt-2 p-4 w-full border-2 rounded-lg" placeholder="Language" value={profileData.language} onChange={handleInputChange} />
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
