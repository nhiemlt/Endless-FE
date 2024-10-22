import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { showNotification } from '../../common/headerSlice';
import TitleCard from "../../../components/Cards/TitleCard";
import ProfileService from '../../../services/profileService';
import GHNService from '../../../services/GHNService';

function ProfileSettings() {
    const dispatch = useDispatch();

    // State quản lý dữ liệu profile
    const [profileData, setProfileData] = useState({
        userID: "",
        username: "",
        fullname: "",
        phone: "",
        email: "",
        avatar: "",
    });

    // State quản lý danh sách địa chỉ và thông tin địa chỉ mới
    const [addresses, setAddresses] = useState([]);
    const [newAddress, setNewAddress] = useState({
        houseNumberStreet: "",
        province: "",
        district: "",
        ward: "",
    });

    // State cho avatar và tab hiện tại
    const [avatarFile, setAvatarFile] = useState(null);
    const [activeTab, setActiveTab] = useState("info");

    // State cho danh sách tỉnh, quận/huyện, phường/xã
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    // Lấy thông tin người dùng và địa chỉ
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await ProfileService.fetchCurrentUser();
                setProfileData({
                    userID: userData.userID,
                    username: userData.username,
                    fullname: userData.fullname || "",
                    phone: userData.phone || "",
                    email: userData.email,
                    avatar: userData.avatar || "",
                });

                const userAddresses = await ProfileService.getUserAddresses(userData.userID);
                setAddresses(userAddresses);
            } catch (error) {
                dispatch(showNotification({ message: "Failed to load user data", status: 0 }));
            }
        };

        fetchUserData();
    }, [dispatch]);

    // Lấy danh sách tỉnh
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const data = await GHNService.getProvinces();
                console.log(data); // Thêm dòng này để kiểm tra dữ liệu
                setProvinces(data.data); // Giả định API trả về { data: [...] }
            } catch (error) {
                console.error("Error fetching provinces: ", error);
            }
        };

        fetchProvinces();
    }, []);

    // Thay đổi tỉnh và lấy danh sách quận/huyện
    const handleProvinceChange = async (provinceId) => {
        setNewAddress((prevData) => ({ ...prevData, province: provinceId }));
        try {
            const districtData = await GHNService.getDistrictsByProvince(provinceId);
            setDistricts(districtData.data);
            resetDistrictAndWard();
        } catch (error) {
            console.error("Error fetching districts:", error);
        }
    };

    // Thay đổi quận/huyện và lấy danh sách phường/xã
    const handleDistrictChange = async (districtId) => {
        setNewAddress((prevData) => ({ ...prevData, district: districtId }));
        try {
            const wardData = await GHNService.getWardsByDistrict(districtId);
            setWards(wardData.data);
            resetWard();
        } catch (error) {
            console.error("Error fetching wards:", error);
        }
    };

    // Reset trạng thái quận/huyện và phường/xã
    const resetDistrictAndWard = () => {
        setNewAddress((prevData) => ({ ...prevData, district: "" }));
        setWards([]);
    };

    const resetWard = () => {
        setNewAddress((prevData) => ({ ...prevData, ward: "" }));
    };

    // Cập nhật thông tin địa chỉ mới
    const handleNewAddressChange = (e) => {
        const { name, value } = e.target;
        setNewAddress((prevData) => ({ ...prevData, [name]: value }));
    };

    // Thêm địa chỉ mới
    const handleAddNewAddress = async (e) => {
        e.preventDefault();
        if (!newAddress.houseNumberStreet || !newAddress.province || !newAddress.district || !newAddress.ward) {
            dispatch(showNotification({ message: "Vui lòng điền đầy đủ thông tin địa chỉ", status: 0 }));
            return;
        }

        try {
            await ProfileService.addAddress(newAddress);
            const updatedAddresses = await ProfileService.getUserAddresses(profileData.userID);
            setAddresses(updatedAddresses);
            resetNewAddressForm();
            dispatch(showNotification({ message: "Thêm địa chỉ thành công", status: 1 }));
        } catch (error) {
            dispatch(showNotification({ message: "Thêm địa chỉ thất bại", status: 0 }));
        }
    };

    // Reset form thêm địa chỉ mới
    const resetNewAddressForm = () => {
        setNewAddress({
            houseNumberStreet: "",
            province: "",
            district: "",
            ward: "",
        });
    };

    // Cập nhật thông tin người dùng
    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "profileImage" && files.length > 0) {
            const file = files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileData((prevData) => ({ ...prevData, avatar: reader.result }));
                setAvatarFile(file);
            };
            reader.readAsDataURL(file);
        } else {
            setProfileData((prevData) => ({ ...prevData, [name]: value }));
        }
    };

    // Cập nhật thông tin profile
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        const updatedData = { ...profileData };
        try {
            await ProfileService.updateCurrentUser(updatedData);
            if (avatarFile) {
                const formData = new FormData();
                formData.append("avatar", avatarFile);
                await ProfileService.updateAvatar(formData);
            }
            dispatch(showNotification({ message: "Cập nhật thông tin thành công", status: 1 }));
        } catch (error) {
            dispatch(showNotification({ message: "Cập nhật thông tin thất bại", status: 0 }));
        }
    };

    return (
        <TitleCard title="Thông tin cá nhân">
            {/* Tabs */}
            <div role="tablist" className="tabs tabs-bordered">
                <a
                    role="tab"
                    className={`tab ${activeTab === "info" ? "tab-active" : ""}`}
                    onClick={() => setActiveTab("info")}
                >
                    Thông tin cá nhân
                </a>
                <a
                    role="tab"
                    className={`tab ${activeTab === "addresses" ? "tab-active" : ""}`}
                    onClick={() => setActiveTab("addresses")}
                >
                    Địa chỉ
                </a>
            </div>

            {/* Form */}
            <form onSubmit={activeTab === "info" ? handleUpdateProfile : handleAddNewAddress}>
                {activeTab === "info" && (
                    <div>
                        {/* Form Thông tin cá nhân */}
                        <div className="flex flex-col items-center mb-4 mt-5">
                            <div
                                className="mx-auto flex justify-center w-[141px] h-[141px] bg-blue-300/20 rounded-full cursor-pointer"
                                style={{ backgroundImage: `url(${profileData.avatar})`, backgroundSize: 'cover' }}
                                onClick={() => document.getElementById('upload_profile').click()}
                            >
                                <div className="bg-white/90 rounded-full w-6 h-6 text-center ml-28 mt-4">
                                    <input
                                        type="file"
                                        name="profileImage"
                                        id="upload_profile"
                                        hidden
                                        onChange={handleInputChange}
                                    />
                                    <label htmlFor="upload_profile">
                                        <svg
                                            className="w-6 h-5 text-blue-700"
                                            fill="none"
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                            aria-hidden="true"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175..."></path>
                                        </svg>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2 justify-center w-full">
                            <div className="w-full mb-4">
                                <label htmlFor="username" className="mb-2 dark:text-gray-300">Tên người dùng</label>
                                <input
                                    type="text"
                                    name="username"
                                    className="mt-2 p-4 w-full border-2 rounded-lg"
                                    value={profileData.username}
                                    readOnly
                                />
                            </div>
                            <div className="w-full mb-4">
                                <label htmlFor="fullname" className="mb-2 dark:text-gray-300">Họ và tên</label>
                                <input
                                    type="text"
                                    name="fullname"
                                    className="mt-2 p-4 w-full border-2 rounded-lg"
                                    value={profileData.fullname}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="flex gap-2 justify-center w-full">
                            <div className="w-full mb-4">
                                <label htmlFor="phone" className="mb-2 dark:text-gray-300">Số điện thoại</label>
                                <input
                                    type="text"
                                    name="phone"
                                    className="mt-2 p-4 w-full border-2 rounded-lg"
                                    value={profileData.phone}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="w-full mb-4">
                                <label htmlFor="email" className="mb-2 dark:text-gray-300">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="mt-2 p-4 w-full border-2 rounded-lg"
                                    value={profileData.email}
                                    readOnly
                                />
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <button className="btn btn-primary" type="submit">Cập nhật thông tin</button>
                        </div>
                    </div>
                )}

                {activeTab === "addresses" && (
                    <div>
                        {/* Form Địa chỉ */}
                        <div className="mb-4 mt-5">
                            <div className="flex gap-4">
                                <label htmlFor="houseNumberStreet">Số nhà, Đường</label>
                                <input
                                    type="text"
                                    name="houseNumberStreet"
                                    className="p-2 border-2 rounded-lg flex-1"
                                    value={newAddress.houseNumberStreet}
                                    onChange={handleNewAddressChange}></input>
                                <select
                                    name="province"
                                    className="p-2 border-2 rounded-lg flex-1"
                                    value={newAddress.province}
                                    onChange={(e) => handleProvinceChange(e.target.value)}
                                >
                                    <option value="">Chọn tỉnh/thành phố</option>
                                    {provinces.length > 0 ? (
                                        provinces.map((province) => (
                                            <option key={province.ProvinceID} value={province.ProvinceID}>
                                                {province.ProvinceName}
                                            </option>
                                        ))
                                    ) : (
                                        <option value="">Không có tỉnh nào</option> // Nếu dữ liệu chưa sẵn sàng
                                    )}
                                </select>
                                <select
                                    name="district"
                                    className="p-2 border-2 rounded-lg flex-1"
                                    value={newAddress.district}
                                    onChange={(e) => handleDistrictChange(e.target.value)}
                                    disabled={!newAddress.province}
                                >
                                    <option value="">Chọn quận/huyện</option>
                                    {districts.map((district) => (
                                        <option key={district.DistrictID} value={district.DistrictID}>
                                            {district.DistrictName}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    name="ward"
                                    className="p-2 border-2 rounded-lg flex-1"
                                    value={newAddress.ward}
                                    onChange={handleNewAddressChange}
                                    disabled={!newAddress.district}
                                >
                                    <option value="">Chọn phường/xã</option>
                                    {wards.map((ward) => (
                                        <option key={ward.WardCode} value={ward.WardCode}>
                                            {ward.WardName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex justify-center mt-5 mb-5">
                                <button className="btn btn-primary" type="submit">Thêm địa chỉ mới</button>
                            </div>
                            <hr></hr>
                            <div>
                                <h2>Địa chỉ:</h2>
                                <p>Số nhà/đường, phường/xã, quận/huyện/, tỉnh/thành phố</p>
                                <p>Không có địa chỉ nào !!!</p>
                            </div>
                        </div>
                    </div>
                )}
            </form>
        </TitleCard>
    );
}

export default ProfileSettings;
