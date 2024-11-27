import React, { useEffect, useState } from "react";
import { showNotification } from "../../../features/common/headerSlice";
import { useDispatch } from "react-redux";
import GHNService from "../../../services/GHNService";
import UserAddressService from "../../../services/userAddressService";

function CreateNewAddress({ isModalOpen, onCancel, onAddNewAddress, fetchUserData }) {
    const dispatch = useDispatch();

    // State cho danh sách tỉnh, quận/huyện, phường/xã
    const [provinceIDs, setProvinces] = useState([]);
    const [districtIDs, setDistricts] = useState([]);
    const [wardCodes, setWards] = useState([]);

    // Lấy danh sách tỉnh
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const data = await GHNService.getProvinces();
                const sortedProvinces = data.data.sort((a, b) => a.ProvinceName.localeCompare(b.ProvinceName));
                setProvinces(sortedProvinces);
            } catch (error) {
                console.error("Lỗi khi tìm Id tỉnh: ", error);
            }
        };

        fetchProvinces();
    }, []);

    // Thay đổi tỉnh và lấy danh sách quận/huyện
    const handleProvinceChange = async (provinceID, provinceName) => {
        setNewAddress((prevData) => ({
            ...prevData,
            provinceID: provinceID,
            provinceName: provinceName // Lưu tên tỉnh
        }));
        try {
            const districtIDData = await GHNService.getDistrictsByProvince(provinceID);
            const sortedDistricts = districtIDData.data.sort((a, b) => a.DistrictName.localeCompare(b.DistrictName));
            setDistricts(sortedDistricts);
            resetDistrictAndWard();
        } catch (error) {
            console.error("Lỗi khi tìm Id quận/huyện:", error);
        }
    };

    // Thay đổi quận/huyện và lấy danh sách phường/xã
    const handleDistrictChange = async (districtID, districtName) => {
        setNewAddress((prevData) => ({
            ...prevData,
            districtID: districtID,
            districtName: districtName // Lưu tên quận/huyện
        }));
        try {
            const wardCodeData = await GHNService.getWardsByDistrict(districtID);
            const sortedWards = wardCodeData.data.sort((a, b) => a.WardName.localeCompare(b.WardName));
            setWards(sortedWards);
            resetWard();
        } catch (error) {
            console.error("Lỗi khi tìm Id phường/xã:", error);
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
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [newAddress, setNewAddress] = useState({
        detailAddress: '',
        wardCode: '',
        wardName: '',
        districtID: '',
        districtName: '',
        provinceID: '',
        provinceName: '',
    });

    // Hàm xử lý thay đổi input cho địa chỉ mới
    const handleNewAddressChange = (e) => {
        const { name, value, options } = e.target;
        const selectedOption = options ? options[e.target.selectedIndex] : null;

        if (name === "wardCode") {
            setNewAddress((prevData) => ({
                ...prevData,
                wardCode: value,
                wardName: selectedOption ? selectedOption.text : "" // Lưu tên phường/xã
            }));
        } else {
            setNewAddress((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
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
            const addedAddress = await UserAddressService.addUserAddressCurrent(newAddress); // Thêm địa chỉ vào database
            dispatch(showNotification({ message: "Thêm địa chỉ thành công", status: 1 }));
    
            // Gọi callback để cập nhật danh sách địa chỉ
            onAddNewAddress(addedAddress);
    
            // Reset state
            setNewAddress({
                detailAddress: '',
                wardCode: '',
                wardName: '',
                districtID: '',
                districtName: '',
                provinceID: '',
                provinceName: '',
            });
    
            onCancel(); // Đóng modal
            fetchUserData();
        } catch (error) {
            console.error('Không thể thêm địa chỉ mới:', error.response ? error.response.data : error.message);
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
            const userAddresses = await UserAddressService.fetchUserAddresses(); // Gọi service để lấy địa chỉ
            setAddresses(userAddresses); // Cập nhật state với danh sách địa chỉ
        } catch (err) {
            console.error('Lỗi tìm địa chỉ:', err);
            setError('Không thể lấy danh sách địa chỉ.'); // Cập nhật state khi gặp lỗi
        } finally {
            setLoading(false); // Kết thúc tải dữ liệu
        }
    };

    return (
        <dialog id="my_modal_3" className={`modal ${isModalOpen ? "modal-open" : ""}`}>
            <div className="modal-box">
                <button type="button" className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={onCancel}>
                    ✕
                </button>
                <h3 className="font-bold text-lg mb-4">Thêm địa chỉ mới</h3>
                <div className="grid grid-cols-2 gap-4">
                    {/* Các trường nhập địa chỉ */}
                    <div className="flex flex-col">
                        <label htmlFor="provinceID" className="mb-3">Tỉnh/Thành phố</label>
                        <select name="provinceID" className="p-2 border-2 rounded-lg flex-1" onChange={(e) => handleProvinceChange(e.target.value, e.target.options[e.target.selectedIndex].text)}>
                            <option value="">Chọn tỉnh</option>
                            {provinceIDs.map((province) => (
                                <option key={province.ProvinceID} value={province.ProvinceID}>
                                    {province.ProvinceName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="districtID" className="mb-3">Quận/Huyện</label>
                        <select name="districtID" className="p-2 border-2 rounded-lg flex-1" onChange={(e) => handleDistrictChange(e.target.value, e.target.options[e.target.selectedIndex].text)}>
                            <option value="">Chọn quận</option>
                            {districtIDs.map((district) => (
                                <option key={district.DistrictID} value={district.DistrictID}>
                                    {district.DistrictName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="wardCode" className="mb-3">Phường/Xã</label>
                        <select name="wardCode" className="p-2 border-2 rounded-lg flex-1" onChange={handleNewAddressChange}>
                            <option value="">Chọn phường/xã</option>
                            {wardCodes.map((ward) => (
                                <option key={ward.WardCode} value={ward.WardCode}>
                                    {ward.WardName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="detailAddress" className="mb-3">Địa chỉ chi tiết</label>
                        <input
                            autoComplete="off"
                            type="text"
                            name="detailAddress"
                            className="p-2 border-2 rounded-lg flex-1"
                            value={newAddress.detailAddress}
                            onChange={handleNewAddressChange}
                            placeholder="Số nhà, tên đường"
                        />
                    </div>
                </div>
                <div className="modal-action">
                    <button type="button" className="btn btn-primary" onClick={handleAddNewAddress}>Thêm địa chỉ mới</button>
                </div>
            </div>

        </dialog>
    );
}
export default CreateNewAddress;