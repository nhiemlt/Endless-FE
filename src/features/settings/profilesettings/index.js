import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { showNotification } from '../../common/headerSlice';
import TitleCard from "../../../components/Cards/TitleCard";
import ProfileService from '../../../services/profileService';
import GHNService from '../../../services/GHNService';
import UserAddressService from "../../../services/userAddressService";

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


    // State cho avatar và tab hiện tại
    const [avatarFile, setAvatarFile] = useState(null);
    const [activeTab, setActiveTab] = useState("info");

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
                console.log(setProfileData.avatar)
                setAddresses(userAddresses);
            } catch (error) {
                dispatch(showNotification({ message: "Failed to load user data", status: 0 }));
            }
        };

        fetchUserData();
    }, [dispatch]);


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




    // State cho danh sách tỉnh, quận/huyện, phường/xã
    const [provinceIDs, setProvinces] = useState([]);
    const [districtIDs, setDistricts] = useState([]);
    const [wardCodes, setWards] = useState([]);

    // Lấy danh sách tỉnh
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const data = await GHNService.getProvinces();
                console.log(data); // Thêm dòng này để kiểm tra dữ liệu
                setProvinces(data.data); // Giả định API trả về { data: [...] }
            } catch (error) {
                console.error("Error fetching provinceIDs: ", error);
            }
        };

        fetchProvinces();
    }, []);

    // Thay đổi tỉnh và lấy danh sách quận/huyện
    const handleProvinceChange = async (provinceID) => {
        setNewAddress((prevData) => ({ ...prevData, provinceID: provinceID }));
        try {
            const districtIDData = await GHNService.getDistrictsByProvince(provinceID);
            setDistricts(districtIDData.data);
            resetDistrictAndWard();
        } catch (error) {
            console.error("Error fetching districtIDs:", error);
        }
    };

    // Thay đổi quận/huyện và lấy danh sách phường/xã
    const handleDistrictChange = async (districtID) => {
        setNewAddress((prevData) => ({ ...prevData, districtID: districtID }));
        try {
            const wardCodeData = await GHNService.getWardsByDistrict(districtID);
            setWards(wardCodeData.data);
            resetWard();
        } catch (error) {
            console.error("Error fetching wardCodes:", error);
        }
    };

    // Reset trạng thái quận/huyện và phường/xã
    const resetDistrictAndWard = () => {
        setNewAddress((prevData) => ({ ...prevData, districtID: "" }));
        setWards([]);
    };

    const resetWard = () => {
        setNewAddress((prevData) => ({ ...prevData, wardCode: "" }));
    };

    // State quản lý danh sách địa chỉ và thông tin địa chỉ mới
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newAddress, setNewAddress] = useState({
        detailAddress: '',
        wardCode: '',
        districtID: '',
        provinceID: '',
    });


    // Hàm xử lý thay đổi input cho địa chỉ mới
    const handleNewAddressChange = (e) => {
        const { name, value } = e.target;
        setNewAddress((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Hàm xử lý thêm địa chỉ mới
    const handleAddNewAddress = async (e) => {
        e.preventDefault();

        // Kiểm tra các trường có hợp lệ không
        if (!newAddress?.detailAddress || !newAddress?.provinceID || !newAddress?.districtID || !newAddress?.wardCode) {
            dispatch(showNotification({ message: "Vui lòng điền đầy đủ thông tin địa chỉ", status: 0 }));
            return;
        }

        try {
            await UserAddressService.addUserAddressCurrent(newAddress);
            dispatch(showNotification({ message: "Thêm địa chỉ thành công", status: 1 }));
            setNewAddress({ detailAddress: '', wardCode: '', districtID: '', provinceID: '' });
        } catch (error) {
            console.error('Failed to add new address:', error.response ? error.response.data : error.message);
            if (error.response && error.response.data) {
                dispatch(showNotification({ message: `Thêm địa chỉ thất bại: ${error.response.data.message}`, status: 0 }));
            } else {
                dispatch(showNotification({ message: "Thêm địa chỉ thất bại", status: 0 }));
            }
        }
    };

    // Hàm để fetch danh sách địa chỉ
    const fetchAddresses = async () => {
        try {
            setLoading(true); // Bắt đầu tải dữ liệu
            const userAddresses = await UserAddressService.fetchUserAddresses(); // Gọi service để lấy địa chỉ (không cần userID)
            setAddresses(userAddresses); // Cập nhật state với danh sách địa chỉ
        } catch (err) {
            console.error('Error fetching addresses:', err);
            setError('Không thể lấy danh sách địa chỉ.'); // Cập nhật state khi gặp lỗi
        } finally {
            setLoading(false); // Kết thúc tải dữ liệu
        }
    };

    // Sử dụng useEffect để fetch dữ liệu khi component được render
    useEffect(() => {
        fetchAddresses(); // Gọi hàm fetchAddresses ngay khi component được render
    }, []); // Không cần phụ thuộc vào userID nữa


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

            {/* Form thông tin cá nhân*/}
            <form onSubmit={handleUpdateProfile}>
                {activeTab === "info" && (
                    <div>
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
            </form>

            {/* Form địa chỉ*/}
            <form onSubmit={handleAddNewAddress}>
                {activeTab === "addresses" && (
                    <div>
                        <div className="mb-4 mt-5">
                            <div className="flex gap-4">
                                <label htmlFor="detailAddress">Địa chỉ chi tiết:</label>
                                <input
                                    type="text"
                                    name="detailAddress"
                                    className="p-2 border-2 rounded-lg flex-1"
                                    value={newAddress.detailAddress}
                                    onChange={handleNewAddressChange}
                                    required></input>
                                <select
                                    name="provinceID"
                                    className="p-2 border-2 rounded-lg flex-1"
                                    value={newAddress.provinceID}
                                    onChange={(e) => handleProvinceChange(e.target.value)}
                                >
                                    <option value="">Chọn tỉnh/thành phố</option>
                                    {provinceIDs.length > 0 ? (
                                        provinceIDs.map((provinceID) => (
                                            <option key={provinceID.ProvinceID} value={provinceID.ProvinceID}>
                                                {provinceID.ProvinceName}
                                            </option>
                                        ))
                                    ) : (
                                        <option value="">Không có tỉnh nào</option> // Nếu dữ liệu chưa sẵn sàng
                                    )}
                                </select>
                                <select
                                    name="districtID"
                                    className="p-2 border-2 rounded-lg flex-1"
                                    value={newAddress.districtID}
                                    onChange={(e) => handleDistrictChange(e.target.value)}
                                    disabled={!newAddress.provinceID}
                                >
                                    <option value="">Chọn quận/huyện</option>
                                    {districtIDs.map((districtID) => (
                                        <option key={districtID.DistrictID} value={districtID.DistrictID}>
                                            {districtID.DistrictName}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    name="wardCode"
                                    className="p-2 border-2 rounded-lg flex-1"
                                    value={newAddress.wardCode}
                                    onChange={handleNewAddressChange}
                                    disabled={!newAddress.districtID}
                                >
                                    <option value="">Chọn phường/xã</option>
                                    {wardCodes.map((wardCode) => (
                                        <option key={wardCode.WardCode} value={wardCode.WardCode}>
                                            {wardCode.WardName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex justify-center mt-5 mb-5">
                                <button className="btn btn-primary" type="submit">Thêm địa chỉ mới</button>
                            </div>
                            <hr></hr>
                            <div>
                                <h2>Danh sách địa chỉ của bạn</h2>
                                {loading ? (
                                    <p>Đang tải dữ liệu...</p> // Hiển thị thông báo khi dữ liệu đang được tải
                                ) : error ? (
                                    <p>{error}</p> // Hiển thị lỗi nếu có
                                ) : addresses.length > 0 ? (
                                    <ul>
                                        {addresses.map((address) => (
                                            <li key={address.id}>
                                                <p>{address.detailAddress}, {address.wardCode}, {address.districtID}, {address.provinceID}</p><hr></hr>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>Bạn chưa có địa chỉ nào.</p> // Hiển thị khi không có địa chỉ nào
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </form>
        </TitleCard>
    );
}

export default ProfileSettings;
