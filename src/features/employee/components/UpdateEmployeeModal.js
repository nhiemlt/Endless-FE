import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import EmployeeService from "../../../services/StaffService";
import { showNotification } from "../../common/headerSlice";
import UploadFileService from "../../../services/UploadFileService";
import RoleService from '../../../services/roleService';

const UpdateEmployeeModal = ({ showModal, closeModal, employee, fetchEmployees }) => {
  const dispatch = useDispatch();
  const [employeeData, setEmployeeData] = useState({
    username: "",
    fullname: "",
    phone: "",
    email: "",
    position: "",
  });
  const [avatar, setAvatar] = useState(null); // File ảnh upload
  const [avatarPreview, setAvatarPreview] = useState(""); // Preview ảnh
  const defaultAvatar = "https://example.com/default-avatar.png"; // Ảnh mặc định

  useEffect(() => {
    if (employee) {
      setEmployeeData({
        avatar: employee.avatar || "",
        username: employee.username || "",
        fullname: employee.fullname || "",
        phone: employee.phone || "",
        email: employee.email || "",
        position: employee.position || "",
      });
      setAvatarPreview(employee.avatar || defaultAvatar);
    }
  }, [employee]);

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateEmployee = async (event) => {
    event.preventDefault();

    if (
      !employeeData.username ||
      !employeeData.fullname ||
      !employeeData.email ||
      !employeeData.phone ||
      !employeeData.position
    ) {
      dispatch(
        showNotification({
          message: "Vui lòng điền đầy đủ thông tin.",
          status: 0,
        })
      );
      return;
    }

    if (!/\S+@\S+\.\S+/.test(employeeData.email)) {
      dispatch(
        showNotification({
          message: "Email không hợp lệ.",
          status: 0,
        })
      );
      return;
    }

    try {
      let avatarUrl = null;
      if (avatar) {
        avatarUrl = await UploadFileService.uploadUserImage(avatar);
      }

      const updatedEmployeeData = {
        ...employeeData,
        avatar: avatarUrl || employee.avatar,
      };

      await EmployeeService.updateEmployee(employee.userID, updatedEmployeeData);

      dispatch(
        showNotification({
          message: "Cập nhật nhân viên thành công",
          status: 1,
        })
      );

      fetchEmployees();
      closeModal();
    } catch (error) {
      console.error("Không thể cập nhật nhân viên: ", error.response ? error.response.data : error.message);
      dispatch(
        showNotification({
          message: `Cập nhật nhân viên thất bại: ${error.response?.data?.message || "Lỗi không xác định"}`,
          status: 0,
        })
      );
    }
  };

  return (
    <div className={`modal ${showModal ? "modal-open" : ""}`}>
      <div className="modal-box w-full max-w-3xl lg:max-w-4xl">
        <form onSubmit={handleUpdateEmployee}>
          <h2 className="font-bold text-lg mb-4">Cập nhật thông tin nhân viên</h2>

          <div className="flex flex-col items-center mb-4 mt-5">
            <div className="avatar">
              <div className="ring-secondary ring-offset-base-100 rounded-full ring ring-offset-2">
                <div
                  className="mx-auto flex justify-center w-[141px] h-[141px] bg-blue-300/20 rounded-full cursor-pointer"
                  style={{
                    backgroundImage: `url(${avatarPreview || defaultAvatar})`,
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

          <div className="mb-4">
            <label className="label">Tên người dùng:</label>
            <input
              type="text"
              placeholder="Tên người dùng"
              value={employeeData.username}
              onChange={(e) =>
                setEmployeeData({ ...employeeData, username: e.target.value })
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
              value={employeeData.fullname}
              onChange={(e) =>
                setEmployeeData({ ...employeeData, fullname: e.target.value })
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
              value={employeeData.email}
              onChange={(e) =>
                setEmployeeData({ ...employeeData, email: e.target.value })
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
              value={employeeData.phone}
              onChange={(e) =>
                setEmployeeData({ ...employeeData, phone: e.target.value })
              }
              className="input input-bordered w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="label">Chức vụ:</label>
            <input
              type="text"
              placeholder="Chức vụ"
              value={employeeData.position}
              onChange={(e) =>
                setEmployeeData({ ...employeeData, position: e.target.value })
              }
              className="input input-bordered w-full"
              required
            />
          </div>

          <div className="modal-action">
            <button type="submit" className="btn btn-primary">
              Cập nhật nhân viên
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

export default UpdateEmployeeModal;
