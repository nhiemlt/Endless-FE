import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import CustomerService from "../../../services/CustomerService";
import { showNotification } from "../../common/headerSlice";
import GHNService from "../../../services/GHNService";
import UserAddressService from "../../../services/userAddressService";

const AddCustomerModal = ({ showModal, closeModal }) => {
  const dispatch = useDispatch();
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [provinceIDs, setProvinces] = useState([]);
  const [districtIDs, setDistricts] = useState([]);
  const [wardCodes, setWards] = useState([]);
  const [addresses, setAddresses] = useState([]);

  const [customerData, setCustomerData] = useState({
    username: "",
    fullname: "",
    phone: "",
    email: "",
  });

  const [newAddress, setNewAddress] = useState({
    detailAddress: "",
    provinceID: "",
    districtID: "",
    wardCode: "",
  });

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const data = await GHNService.getProvinces();
        const sortedProvinces = data.data.sort((a, b) =>
          a.ProvinceName.localeCompare(b.ProvinceName)
        );
        setProvinces(sortedProvinces);
      } catch (error) {
        console.error("Lỗi khi tìm Id tỉnh: ", error);
      }
    };

    fetchProvinces();
  }, []);

  const handleProvinceChange = async (provinceID, provinceName) => {
    setNewAddress((prevData) => ({
      ...prevData,
      provinceID: provinceID,
      provinceName: provinceName,
    }));
    try {
      const districtIDData = await GHNService.getDistrictsByProvince(
        provinceID
      );
      const sortedDistricts = districtIDData.data.sort((a, b) =>
        a.DistrictName.localeCompare(b.DistrictName)
      );
      setDistricts(sortedDistricts);
      resetDistrictAndWard();
    } catch (error) {
      console.error("Lỗi khi tìm Id quận/huyện:", error);
    }
  };

  const handleDistrictChange = async (districtID, districtName) => {
    setNewAddress((prevData) => ({
      ...prevData,
      districtID: districtID,
      districtName: districtName,
    }));

    try {
      const wardCodeData = await GHNService.getWardsByDistrict(districtID);
      const sortedWards = wardCodeData.data.sort((a, b) =>
        a.WardName.localeCompare(b.WardName)
      );
      setWards(sortedWards);
      resetWard();
    } catch (error) {
      console.error("Lỗi khi tìm Id phường/xã:", error);
    }
  };

  const resetDistrictAndWard = () => {
    setNewAddress((prevData) => ({ ...prevData, districtID: "" }));
    setWards([]);
  };

  const resetWard = () => {
    setNewAddress((prevData) => ({ ...prevData, wardCode: "" }));
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNewAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  // Hàm xử lý thêm địa chỉ mới
  const handleAddNewAddress = async (userID) => {
    if (!newAddress?.detailAddress) {
      dispatch(
        showNotification({
          message: "Vui lòng điền địa chỉ chi tiết.",
          status: 0,
        })
      );
      return;
    }
    if (!newAddress?.provinceID) {
      dispatch(
        showNotification({
          message: "Vui lòng chọn tỉnh.",
          status: 0,
        })
      );
      return;
    }
    if (!newAddress?.districtID) {
      dispatch(
        showNotification({
          message: "Vui lòng chọn quận/huyện.",
          status: 0,
        })
      );
      return;
    }
    if (!newAddress?.wardCode) {
      dispatch(
        showNotification({
          message: "Vui lòng chọn phường/xã.",
          status: 0,
        })
      );
      return;
    }

    try {
      // Thêm địa chỉ vào bảng `userAddress` với userID được truyền từ `handleSubmit`
      await UserAddressService.addUserAddressCurrent({
        ...newAddress,
        userID, // Lưu ý truyền ID của người dùng vào địa chỉ
      });
      dispatch(
        showNotification({ message: "Thêm địa chỉ thành công", status: 1 })
      );
      // Reset thông tin địa chỉ
      setNewAddress({
        detailAddress: "",
        wardCode: "",
        districtID: "",
        provinceID: "",
      });
      fetchAddresses();
    } catch (error) {
      console.error(
        "Không thể thêm địa chỉ mới:",
        error.response ? error.response.data : error.message
      );
      dispatch(
        showNotification({
          message: `Thêm địa chỉ thất bại: ${
            error.response?.data?.message || "Lỗi không xác định"
          }`,
          status: 0,
        })
      );
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const userAddresses = await UserAddressService.fetchUserAddresses();
      setAddresses(userAddresses);
    } catch (err) {
      console.error("Lỗi tìm địa chỉ:", err);
      dispatch(
        showNotification({
          message: "Không thể lấy danh sách địa chỉ.",
          status: 0,
        })
      );
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Kiểm tra thông tin khách hàng
    if (!customerData.username) {
      dispatch(
        showNotification({
          message: "Vui lòng điền tên người dùng.",
          status: 0,
        })
      );
      return;
    }
    if (!customerData.fullname) {
      dispatch(
        showNotification({
          message: "Vui lòng điền họ và tên.",
          status: 0,
        })
      );
      return;
    }
    if (!customerData.email) {
      dispatch(
        showNotification({
          message: "Vui lòng điền email.",
          status: 0,
        })
      );
      return;
    }
    if (!/\S+@\S+\.\S+/.test(customerData.email)) {
      dispatch(
        showNotification({
          message: "Email không hợp lệ.",
          status: 0,
        })
      );
      return;
    }
    if (!customerData.phone) {
      dispatch(
        showNotification({
          message: "Vui lòng điền số điện thoại.",
          status: 0,
        })
      );
      return;
    }

    try {
      // 1. Thêm người dùng vào bảng `user`
      const createdUser = await CustomerService.createCustomer(customerData);

      dispatch(
        showNotification({ message: "Thêm người dùng thành công", status: 1 })
      );

      // 2. Nếu người dùng đã được thêm, gọi hàm thêm địa chỉ
      await handleAddNewAddress(createdUser.data.userID); // Truyền ID người dùng mới vào hàm thêm địa chỉ

      // Reset thông tin người dùng sau khi thêm
      setCustomerData({
        username: "",
        fullname: "",
        email: "",
        phone: "",
      });
    } catch (error) {
      console.error(
        "Không thể thêm người dùng mới:",
        error.response ? error.response.data : error.message
      );
      dispatch(
        showNotification({
          message: `Thêm người dùng thất bại: ${
            error.response?.data?.message || "Lỗi không xác định"
          }`,
          status: 0,
        })
      );
    }
  };

  return (
    <div className={`modal ${showModal ? "modal-open" : ""}`}>
      <div className="modal-box w-full max-w-3xl lg:max-w-4xl">
        <form onSubmit={handleSubmit}>
          <h2 className="font-bold text-lg">Thêm khách hàng mới</h2>

          {/* Avatar Upload */}
          <div className="flex flex-col items-center mb-4 mt-5">
            <div className="avatar">
              <div className="ring-secondary ring-offset-base-100 rounded-full ring ring-offset-2">
                <div
                  className="mx-auto flex justify-center w-[141px] h-[141px] bg-blue-300/20 rounded-full cursor-pointer"
                  style={{
                    backgroundImage: `url(${avatarPreview || avatar})`,
                    backgroundSize: "cover",
                  }}
                  onClick={() =>
                    document.getElementById("upload_avatar").click()
                  }
                >
                  <div className="bg-white/90 rounded-full w-6 h-6 text-center ml-28 mt-4">
                    <input
                      type="file"
                      id="upload_avatar"
                      hidden
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                    <label htmlFor="upload_avatar">
                      <svg
                        className="w-6 h-5 text-blue-700"
                        fill="none"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                      </svg>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Các trường nhập liệu */}
          <input
            type="text"
            value={customerData.username}
            onChange={(e) =>
              setCustomerData({ ...customerData, username: e.target.value })
            }
            placeholder="Tên người dùng"
            className="input input-bordered w-full mb-4"
          />

          <input
            type="text"
            value={customerData.fullname}
            onChange={(e) =>
              setCustomerData({ ...customerData, fullname: e.target.value })
            }
            placeholder="Họ và tên"
            className="input input-bordered w-full mb-4"
          />

          <input
            type="email"
            value={customerData.email}
            onChange={(e) =>
              setCustomerData({ ...customerData, email: e.target.value })
            }
            placeholder="Email"
            className="input input-bordered w-full mb-4"
          />

          <input
            type="text"
            value={customerData.phone}
            onChange={(e) =>
              setCustomerData({ ...customerData, phone: e.target.value })
            }
            placeholder="Số điện thoại"
            className="input input-bordered w-full mb-4"
          />

          <h3 className="font-bold mt-4">Thông Tin Địa Chỉ</h3>

          <div className="flex gap-4 mb-4">
            <select
              name="provinceID"
              className="p-2 border-2 rounded-lg flex-1"
              value={newAddress.provinceID}
              onChange={(e) =>
                handleProvinceChange(
                  e.target.value,
                  e.target.options[e.target.selectedIndex].text
                )
              }
            >
              <option value="">Chọn tỉnh/thành phố</option>
              {provinceIDs.length > 0 ? (
                provinceIDs.map((provinceID) => (
                  <option
                    key={provinceID.ProvinceID}
                    value={provinceID.ProvinceID}
                  >
                    {provinceID.ProvinceName}
                  </option>
                ))
              ) : (
                <option value="">Không có tỉnh nào</option>
              )}
            </select>

            <select
              name="districtID"
              className="p-2 border-2 rounded-lg flex-1"
              value={newAddress.districtID}
              onChange={(e) =>
                handleDistrictChange(
                  e.target.value,
                  e.target.options[e.target.selectedIndex].text
                )
              }
              disabled={!newAddress.provinceID}
            >
              <option value="">Chọn quận/huyện</option>
              {districtIDs.map((districtID) => (
                <option
                  key={districtID.DistrictID}
                  value={districtID.DistrictID}
                >
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

            <input
              type="text"
              name="detailAddress"
              placeholder="Địa chỉ chi tiết"
              className="p-2 border-2 rounded-lg flex-1"
              value={newAddress.detailAddress}
              onChange={handleNewAddressChange}
            />
          </div>

          <div className="modal-action">
            <button type="submit" className="btn btn-primary">
              Thêm khách hàng
            </button>
            <button type="button" className="btn" onClick={closeModal}>
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCustomerModal;
