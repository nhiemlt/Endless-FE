import React, { useState } from "react";
import { useDispatch } from "react-redux";
import CustomerService from "../../../services/CustomerService";
import { showNotification } from "../../common/headerSlice";
import UploadFileService from "../../../services/UploadFileService";

const AddCustomerModal = ({ showModal, closeModal, fetchCustomers }) => {
  const dispatch = useDispatch();
  const [avatarFile, setAvatarFile] = useState(null); // Lưu file ảnh
  const [avatarPreview, setAvatarPreview] = useState(""); // Hiển thị preview
  const [avatar, setAvatar] = useState(null);

  const [customerData, setCustomerData] = useState({
    username: "",
    fullname: "",
    phone: "",
    email: "",
  });

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file)); // Hiển thị preview
    }
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();

    if (
      !customerData.name.trim() ||
      !customerData.email.trim() ||
      !customerData.phone.trim()
    ) {
      dispatch(
        showNotification({
          message: "Vui lòng điền đầy đủ thông tin",
          status: 0,
        })
      );
      return;
    }

    try {
      // Upload ảnh nếu có
      let avatarUrl = customerData.avatar; // URL ảnh (nếu có)
      if (avatarFile) {
        avatarUrl = await UploadFileService.uploadUserImage(avatarFile);
      }

      // Chuẩn bị dữ liệu khách hàng mới
      const newCustomer = { ...customerData, avatar: avatarUrl };

      // Gửi dữ liệu khách hàng đến API để lưu vào cơ sở dữ liệu
      await CustomerService.addCustomer(newCustomer); // Cần implement CustomerService

      // Hiển thị thông báo thành công
      dispatch(
        showNotification({ message: "Thêm khách hàng thành công", status: 1 })
      );

      // Reset trạng thái modal
      setCustomerData({
        name: "",
        email: "",
        phone: "",
        address: "",
        avatar: "",
      });
      setAvatarFile(null);
      setAvatarPreview("");
    } catch (error) {
      console.error("Lỗi khi thêm khách hàng:", error);
      dispatch(
        showNotification({ message: "Thêm khách hàng thất bại", status: 0 })
      );
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Kiểm tra thông tin khách hàng
    if (
      !customerData.username ||
      !customerData.fullname ||
      !customerData.email ||
      !customerData.phone
    ) {
      dispatch(
        showNotification({
          message: "Vui lòng điền đầy đủ thông tin.",
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

    try {
      // Tạo FormData để gửi dữ liệu bao gồm ảnh
      const formData = new FormData();
      formData.append("username", customerData.username);
      formData.append("fullname", customerData.fullname);
      formData.append("phone", customerData.phone);
      formData.append("email", customerData.email);
      if (avatar) formData.append("avatar", avatar);

      // Gửi yêu cầu tạo khách hàng
      const createdUser = await CustomerService.createCustomer(formData);

      // Thông báo thêm khách hàng thành công
      dispatch(
        showNotification({
          message: "Thêm khách hàng thành công.",
          status: 1,
        })
      );

      // Cập nhật danh sách khách hàng sau khi thêm mới mà không cần load lại trang
      fetchCustomers();

      // Reset form
      setCustomerData({
        username: "",
        fullname: "",
        phone: "",
        email: "",
      });
      setAvatar(null);
      setAvatarPreview(null);
      closeModal();
    } catch (error) {
      console.error(
        "Không thể thêm khách hàng:",
        error.response ? error.response.data : error.message
      );
      dispatch(
        showNotification({
          message: `Thêm khách hàng thất bại: ${
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
                    backgroundImage: `url(${
                      avatarPreview || "default-avatar.png"
                    })`,
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
