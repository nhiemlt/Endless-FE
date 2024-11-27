import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Select from "react-select";
import StaffService from "../../../services/StaffService";
import { showNotification } from "../../common/headerSlice";
import UploadFileService from "../../../services/UploadFileService";
import RoleService from "../../../services/roleService";

const AddEmployeeModal = ({ showModal, closeModal, fetchEmployees }) => {
  const dispatch = useDispatch();
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [roles, setRoles] = useState([]);
  const [employeeData, setEmployeeData] = useState({
    username: "",
    fullname: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (showModal) {
      const fetchRoles = async () => {
        try {
          const data = await RoleService.getAllRoles();
          setRoles(
            data.content.map((role) => ({
              value: role.id,
              label: role.roleName,
            }))
          );
        } catch (error) {
          console.error("Error fetching roles:", error);
        }
      };
      fetchRoles();
    }
  }, [showModal]);

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAddEmployee = async (event) => {
    event.preventDefault();

    if (
      !employeeData.username ||
      !employeeData.fullname ||
      !employeeData.email ||
      !employeeData.phone
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
      dispatch(showNotification({ message: "Email không hợp lệ.", status: 0 }));
      return;
    }

    if (!/^\d{10}$/.test(employeeData.phone)) {
      dispatch(
        showNotification({
          message: "Số điện thoại phải là 10 chữ số.",
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

      const newEmployee = {
        ...employeeData,
        roles: selectedRoles.map((role) => role.value), // Lấy danh sách ID vai trò
        avatar: avatarUrl || "https://example.com/default-avatar.png",
      };

      await StaffService.addEmployee(newEmployee);

      dispatch(
        showNotification({ message: "Thêm nhân viên thành công.", status: 1 })
      );

      fetchEmployees();

      setEmployeeData({
        username: "",
        fullname: "",
        email: "",
        phone: "",
      });
      setAvatar(null);
      setAvatarPreview("");
      setSelectedRoles([]);
      closeModal();
    } catch (error) {
      console.error(
        "Không thể thêm nhân viên:",
        error.response ? error.response.data : error.message
      );
      dispatch(
        showNotification({
          message: `Thêm nhân viên thất bại: ${
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
        <form onSubmit={handleAddEmployee}>
          <h2 className="font-bold text-lg">Thêm nhân viên mới</h2>

          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-4 mt-5">
            <div className="avatar">
              <div className="ring-secondary ring-offset-base-100 rounded-full ring ring-offset-2">
                <div
                  className="mx-auto flex justify-center w-[141px] h-[141px] bg-blue-300/20 rounded-full cursor-pointer"
                  style={{
                    backgroundImage: `url(${
                      avatarPreview || "https://example.com/default-avatar.png"
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
                          d="M12 6v6l4 2"
                        />
                      </svg>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Input Fields Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              value={employeeData.username}
              onChange={(e) =>
                setEmployeeData({ ...employeeData, username: e.target.value })
              }
              placeholder="Tên người dùng"
              className="input input-bordered w-full"
            />
            <input
              type="text"
              value={employeeData.fullname}
              onChange={(e) =>
                setEmployeeData({ ...employeeData, fullname: e.target.value })
              }
              placeholder="Họ và tên"
              className="input input-bordered w-full"
            />
            <input
              type="email"
              value={employeeData.email}
              onChange={(e) =>
                setEmployeeData({ ...employeeData, email: e.target.value })
              }
              placeholder="Email"
              className="input input-bordered w-full"
            />
            <input
              type="tel"
              value={employeeData.phone}
              onChange={(e) =>
                setEmployeeData({ ...employeeData, phone: e.target.value })
              }
              placeholder="Số điện thoại"
              className="input input-bordered w-full"
            />
          </div>

          {/* Role Dropdown Section */}
          <div className="mb-4">
            <label className="block mb-2 font-medium">Chọn vai trò:</label>
            <Select
              options={roles}
              isMulti
              value={selectedRoles}
              onChange={setSelectedRoles}
              placeholder="Nhập để tìm kiếm vai trò..."
            />
          </div>

          {/* Actions Section */}
          <div className="modal-action">
            <button type="submit" className="btn btn-primary">
              Thêm nhân viên
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

export default AddEmployeeModal;
