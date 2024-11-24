import React, { useState } from "react";
import { useDispatch } from "react-redux";
import CustomerService from "../../../services/CustomerService";
import { showNotification } from "../../common/headerSlice";
import UploadFileService from "../../../services/UploadFileService";

const AddCustomerModal = ({ showModal, closeModal, fetchCustomers }) => {
  const dispatch = useDispatch();
  const [avatar, setAvatar] = useState(null);  // File ảnh upload
  const [avatarPreview, setAvatarPreview] = useState("");  // Preview ảnh
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

  const handleAddCustomer = async (event) => {
    event.preventDefault();

    // Kiểm tra thông tin đầu vào
    if (!customerData.username || !customerData.fullname || !customerData.email || !customerData.phone) {
      dispatch(showNotification({
        message: "Vui lòng điền đầy đủ thông tin.",
        status: 0,
      }));
      return;
    }

    if (!/\S+@\S+\.\S+/.test(customerData.email)) {
      dispatch(showNotification({
        message: "Email không hợp lệ.",
        status: 0,
      }));
      return;
    }

    try {
      // Upload ảnh nếu có
      let avatarUrl = null;
      if (avatar) {
        avatarUrl = await UploadFileService.uploadUserImage(avatar);  // Upload ảnh lên server
      }

      // Chuẩn bị dữ liệu khách hàng mới
      const newCustomer = {
        ...customerData,
        avatar: avatarUrl || "https://example.com/default-avatar.png",  // Đặt avatar mặc định nếu không có ảnh
      };

      // Gửi dữ liệu khách hàng đến API
      await CustomerService.addCustomer(newCustomer);

      // Thông báo thành công
      dispatch(showNotification({
        message: "Thêm khách hàng thành công.",
        status: 1,
      }));

      // Cập nhật danh sách khách hàng
      fetchCustomers();

      // Reset form và đóng modal
      setCustomerData({
        username: "",
        fullname: "",
        phone: "",
        email: "",
      });
      setAvatar(null);
      setAvatarPreview("");
      closeModal();
    } catch (error) {
      console.error("Không thể thêm khách hàng:", error.response ? error.response.data : error.message);
      dispatch(showNotification({
        message: `Thêm khách hàng thất bại: ${error.response?.data?.message || "Lỗi không xác định"}`,
        status: 0,
      }));
    }
  };

  return (
    <div className={`modal ${showModal ? "modal-open" : ""}`}>
      <div className="modal-box w-full max-w-3xl lg:max-w-4xl">
        <form onSubmit={handleAddCustomer}>
          <h2 className="font-bold text-lg">Thêm khách hàng mới</h2>

          {/* Avatar Upload */}
          <div className="flex flex-col items-center mb-4 mt-5">
            <div className="avatar">
              <div className="ring-secondary ring-offset-base-100 rounded-full ring ring-offset-2">
                <div
                  className="mx-auto flex justify-center w-[141px] h-[141px] bg-blue-300/20 rounded-full cursor-pointer"
                  style={{
                    backgroundImage: `url(${avatarPreview || "https://example.com/default-avatar.png"})`,
                    backgroundSize: "cover",
                  }}
                  onClick={() => document.getElementById("upload_avatar").click()}
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
                          d="M12 6v6l4 2"
                        />
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
            onChange={(e) => setCustomerData({ ...customerData, username: e.target.value })}
            placeholder="Tên người dùng"
            className="input input-bordered w-full mb-4"
          />

          <input
            type="text"
            value={customerData.fullname}
            onChange={(e) => setCustomerData({ ...customerData, fullname: e.target.value })}
            placeholder="Họ và tên"
            className="input input-bordered w-full mb-4"
          />

          <input
            type="email"
            value={customerData.email}
            onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
            placeholder="Email"
            className="input input-bordered w-full mb-4"
          />

          <input
            type="tel"
            value={customerData.phone}
            onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
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
