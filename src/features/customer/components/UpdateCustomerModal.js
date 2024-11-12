import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import CustomerService from "../../../services/CustomerService";
import { showNotification } from "../../common/headerSlice";
import GHNService from "../../../services/GHNService";

const UpdateCustomerModal = ({ showModal, closeModal, customerId }) => {
  const dispatch = useDispatch();
  const [customerData, setCustomerData] = useState({
    username: "",
    fullname: "",
    phone: "",
    email: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const defaultAvatar = "https://example.com/default-avatar.png";

  // Hàm lấy thông tin khách hàng và các tỉnh
  const fetchData = async () => {
    if (customerId) {
      try {
        const data = await CustomerService.getCustomerById(customerId);
        setCustomerData({
          username: data.username || "",
          fullname: data.fullname || "",
          phone: data.phone || "",
          email: data.email || "",
        });
        if (data.avatar) {
          setAvatarPreview(data.avatar);
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin khách hàng:", error);
        dispatch(
          showNotification({
            message: "Không thể lấy thông tin khách hàng.",
            status: 0,
          })
        );
      }
    }
  };

  useEffect(() => {
    if (showModal) {
      fetchData();
    }
    console.log("Dữ liệu khách hàng:", customerId);
  }, [showModal, customerId]);

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

  const handleUpdateCustomer = async (event) => {
    event.preventDefault();

    if (!customerData.username || !customerData.fullname || !customerData.email || !customerData.phone) {
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
      await CustomerService.updateCustomer(customerId, customerData); // Gọi hàm cập nhật khách hàng
      dispatch(
        showNotification({
          message: "Cập nhật người dùng thành công",
          status: 1,
        })
      );
      closeModal(); // Đóng modal sau khi cập nhật thành công
    } catch (error) {
      console.error(
        "Không thể cập nhật người dùng: ",
        error.response ? error.response.data : error.message
      );
      dispatch(
        showNotification({
          message: `Cập nhật người dùng thất bại: ${
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
        <form onSubmit={handleUpdateCustomer}>
          <h2 className="font-bold text-lg mb-4">
            Cập nhật thông tin khách hàng
          </h2>

          {/* Avatar Upload */}
          <div className="flex flex-col items-center mb-4 mt-5">
            <div className="avatar">
              <div className="ring-secondary ring-offset-base-100 rounded-full ring ring-offset-2">
                <div
                  className="mx-auto flex justify-center w-[141px] h-[141px] bg-blue-300/20 rounded-full cursor-pointer"
                  style={{
                    backgroundImage: `url(${avatarPreview || defaultAvatar})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
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
                        <path d="M12 6v6l4 2" />
                      </svg>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Thông tin người dùng */}
          <div className="mb-4">
            <label className="label">Tên người dùng:</label>
            <input
              type="text"
              placeholder="Tên người dùng"
              value={customerData.username}
              onChange={(e) =>
                setCustomerData({
                  ...customerData,
                  username: e.target.value,
                })
              }
              className="input input-bordered w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="label">Họ và tên:</label>
            <input
              type="text"
              placeholder="Họ và tên"
              value={customerData.fullname}
              onChange={(e) =>
                setCustomerData({
                  ...customerData,
                  fullname: e.target.value,
                })
              }
              className="input input-bordered w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="label">Email:</label>
            <input
              type="email"
              placeholder="Email"
              value={customerData.email}
              onChange={(e) =>
                setCustomerData({
                  ...customerData,
                  email: e.target.value,
                })
              }
              className="input input-bordered w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="label">Số điện thoại:</label>
            <input
              type="tel"
              placeholder="Số điện thoại"
              value={customerData.phone}
              onChange={(e) =>
                setCustomerData({
                  ...customerData,
                  phone: e.target.value,
                })
              }
              className="input input-bordered w-full"
              required
            />
          </div>

          <div className="modal-action">
            <button type="submit" className="btn btn-primary">
              Cập nhật khách hàng
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

export default UpdateCustomerModal;
