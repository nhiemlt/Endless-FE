import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import EmployeeService from "../../../services/StaffService";
import { showNotification } from "../../common/headerSlice";
import UploadFileService from "../../../services/UploadFileService";

const UpdateEmployeeModal = ({
  showModal,
  closeModal,
  employee,
  fetchEmployees,
}) => {
  const dispatch = useDispatch();
  const [employeeData, setEmployeeData] = useState({
    username: "",
    fullname: "",
    phone: "",
    email: "",
    position: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Trạng thái cập nhật
  const defaultAvatar = "https://example.com/default-avatar.png";

  useEffect(() => {
    if (employee) {
      console.log("Employee data updated:", employee);
      setEmployeeData({
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
    setIsLoading(true);

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
      setIsLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(employeeData.email)) {
      dispatch(showNotification({ message: "Email không hợp lệ.", status: 0 }));
      setIsLoading(false);
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
      await EmployeeService.updateEmployee(
        employee.userID,
        updatedEmployeeData
      );

      dispatch(
        showNotification({
          message: "Cập nhật nhân viên thành công",
          status: 1,
        })
      );
      fetchEmployees();
      closeModal();
    } catch (error) {
      dispatch(
        showNotification({
          message: `Cập nhật nhân viên thất bại: ${
            error.response?.data?.message || "Lỗi không xác định"
          }`,
          status: 0,
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`modal ${showModal ? "modal-open" : ""}`}>
      <div className="modal-box w-full max-w-3xl lg:max-w-4xl">
        <form onSubmit={handleUpdateEmployee}>
          <h2 className="font-bold text-lg mb-4">
            Cập nhật thông tin nhân viên
          </h2>

          {/* Avatar */}
          <div className="flex flex-col items-center mb-6">
            <div
              className="relative w-[140px] h-[140px] rounded-full bg-gray-200"
              style={{
                backgroundImage: `url(${avatarPreview})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              onClick={() =>
                document.getElementById("upload_avatarUpdate").click()
              }
              title="Thay đổi ảnh đại diện"
            >
              <input
                type="file"
                id="upload_avatarUpdate"
                hidden
                accept="image/*"
                onChange={handleAvatarChange}
              />
              <span className="absolute bottom-2 right-2 bg-white p-1 rounded-full text-blue-600 cursor-pointer">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </span>
            </div>
          </div>

          {/* Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            {[
              {
                label: "Tên người dùng",
                field: "username",
                type: "text",
                placeholder: "Tên người dùng",
              },
              {
                label: "Họ và tên",
                field: "fullname",
                type: "text",
                placeholder: "Họ và tên",
              },
              {
                label: "Email",
                field: "email",
                type: "email",
                placeholder: "Email",
              },
              {
                label: "Số điện thoại",
                field: "phone",
                type: "tel",
                placeholder: "Số điện thoại",
              },
              {
                label: "Chức vụ",
                field: "position",
                type: "text",
                placeholder: "Chức vụ",
              },
            ].map(({ label, field, type, placeholder }, idx) => (
              <div key={idx} className="mb-4">
                <label className="label">{label}:</label>
                <input
                  type={type}
                  placeholder={placeholder}
                  value={employeeData[field]}
                  onChange={(e) =>
                    setEmployeeData({
                      ...employeeData,
                      [field]: e.target.value,
                    })
                  }
                  className="input input-bordered w-full"
                  required
                />
              </div>
            ))}
          </div>

          <div className="modal-action">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? "Đang cập nhật..." : "Cập nhật nhân viên"}
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
