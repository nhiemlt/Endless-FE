import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import CustomerService from "../../../services/CustomerService";
import { showNotification } from "../../common/headerSlice";
import UploadFileService from "../../../services/UploadFileService"; // Import service tải ảnh

  const UpdateCustomerModal = ({ showModal, closeModal, customer, fetchCustomers}) => {
  const dispatch = useDispatch();
  const [customerData, setCustomerData] = useState({
    username: "",
    fullname: "",
    phone: "",
    email: "",
  });
  const [avatar, setAvatar] = useState(null);  // File ảnh upload
  const [avatarPreview, setAvatarPreview] = useState("");  // Preview ảnh
  const defaultAvatar = "https://example.com/default-avatar.png"; // Ảnh mặc định

  useEffect(() => {
    if (customer) {
      setCustomerData({
        avatar: customer.avatar || "",
        username: customer.username || "",
        fullname: customer.fullname || "",
        phone: customer.phone || "",
        email: customer.email || "",
      });
      // Nếu không có ảnh mới, giữ lại ảnh hiện tại hoặc ảnh mặc định
      setAvatarPreview(customer.avatar || defaultAvatar);
    }
  }, [customer]);

  // Hàm xử lý khi người dùng chọn ảnh mới
  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Hàm xử lý khi người dùng gửi form để cập nhật thông tin
  const handleUpdateCustomer = async (event) => {
    event.preventDefault();

    // Kiểm tra thông tin người dùng có hợp lệ không
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
      // Upload ảnh nếu có
      let avatarUrl = null;
      if (avatar) {
        avatarUrl = await UploadFileService.uploadUserImage(avatar);  // Upload ảnh lên server
      }
      console.log(avatarUrl);

      // Chuẩn bị dữ liệu khách hàng mới
      const updatedCustomerData = {
        ...customerData,
        avatar: avatarUrl,  // Đặt avatar mặc định nếu không có ảnh
      };


      // Gửi yêu cầu cập nhật thông tin người dùng
      await CustomerService.updateCustomer(customer.userID, updatedCustomerData);

      dispatch(
        showNotification({
          message: "Cập nhật người dùng thành công",
          status: 1,
        }),
        fetchCustomers()
      );

      closeModal(); // Đóng modal sau khi cập nhật thành công
    } catch (error) {
      console.error("Không thể cập nhật người dùng: ", error.response ? error.response.data : error.message);
      dispatch(
        showNotification({
          message: `Cập nhật người dùng thất bại: ${error.response.data.message || "Lỗi không xác định"
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
          <h2 className="font-bold text-lg mb-4">Cập nhật thông tin khách hàng</h2>

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
                  onClick={() => document.getElementById("upload_avatarUpdate").click()}
                >
                  <div className="bg-white/90 rounded-full w-6 h-6 text-center ml-28 mt-4">
                    <input
                      type="file"
                      id="upload_avatarUpdate"
                      hidden
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                    <label htmlFor="upload_avatarUpdate">
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
          
          {/* Các trường thông tin người dùng */}
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
