import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux'; // Import useDispatch để sử dụng trong component
import RoleService from '../../../services/roleService';
import PermissionService from '../../../services/PermissionService';
import { showNotification } from "../../common/headerSlice"; // Import showNotification

const AddRoleModal = ({ showModal, closeModal, onRoleCreated }) => {
  const dispatch = useDispatch(); // Khởi tạo useDispatch
  const [roleName, setRoleName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [permissionsByModule, setPermissionsByModule] = useState({});
  const [activeModule, setActiveModule] = useState('');

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const data = await PermissionService.searchPermissions();
        console.log("Permissions fetched:", data);
        const groupedPermissions = data.reduce((acc, permission) => {
          const module = permission.module || 'Khác';
          acc[module] = acc[module] || [];
          acc[module].push(permission);
          return acc;
        }, {});
        console.log("Grouped permissions:", groupedPermissions);
        setPermissionsByModule(groupedPermissions);
        setActiveModule(Object.keys(groupedPermissions)[0]);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách permissions:", error);
      }
    };

    if (showModal) {
      fetchPermissions();
      setRoleName(''); // Reset tên vai trò khi mở modal
      setSelectedPermissions([]); // Reset permissions khi mở modal
    }
  }, [showModal]);

  const handleCheckboxChange = (permissionId) => {
    setSelectedPermissions(prev => 
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Cấu trúc dữ liệu theo định dạng RoleModel
      const roleModel = {
        roleName,
        permissionIds: selectedPermissions
      };
      
      await RoleService.createRole(roleModel); // Gọi service để thêm vai trò
      dispatch(showNotification({ message: 'Thêm vai trò thành công!', status: 1 })); // Thông báo thành công
      onRoleCreated(); // Gọi hàm cập nhật danh sách vai trò
      closeModal();
    } catch (error) {
      console.error("Lỗi khi thêm vai trò:", error);
      dispatch(showNotification({ message: error.response.data, status: 0 })); // Thông báo lỗi
    }
  };

  const handleSelectAll = () => {
    const modulePermissions = permissionsByModule[activeModule] || [];
    const modulePermissionIds = modulePermissions.map(perm => perm.permissionID);

    const allSelected = modulePermissionIds.every(id => selectedPermissions.includes(id));

    setSelectedPermissions(prev => 
      allSelected
        ? prev.filter(id => !modulePermissionIds.includes(id))
        : [...prev, ...modulePermissionIds.filter(id => !prev.includes(id))]
    );
  };

  const renderPermissionsCheckboxes = () => {
    if (!activeModule || !permissionsByModule[activeModule]) return null;
    return permissionsByModule[activeModule].map(permission => (
      <label key={permission.permissionID} className="flex items-center">
        <input
          type="checkbox"
          checked={selectedPermissions.includes(permission.permissionID)}
          onChange={() => handleCheckboxChange(permission.permissionID)}
          className="mr-2"
        />
        {permission.permissionName}
      </label>
    ));
  };

  return (
    <div className={`modal ${showModal ? 'modal-open' : ''}`}>
      <div className="modal-box w-full max-w-3xl lg:max-w-4xl">
        <h2 className="font-bold text-lg">Thêm vai trò mới</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Tên vai trò</label>
            <input
              type="text"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              className="input input-bordered w-full"
              required // Thêm validation cho tên vai trò
            />
          </div>

          {/* Tabs cho các module */}
          <div role="tablist" className="tabs tabs-boxed overflow-x-auto mb-4">
            {Object.keys(permissionsByModule).map(module => (
              <a
                key={module}
                role="tab"
                className={`tab whitespace-nowrap ${activeModule === module ? 'tab-active' : ''}`}
                onClick={() => setActiveModule(module)}
              >
                {module}
              </a>
            ))}
          </div>

          {/* Button Chọn tất cả */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-md font-medium">{activeModule}</h3>
            <button
              type="button"
              className="btn btn-sm btn-outline"
              onClick={handleSelectAll}
            >
              Chọn tất cả
            </button>
          </div>

          {/* Hiển thị permissions thuộc module đang chọn */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {renderPermissionsCheckboxes()}
          </div>

          <div className="modal-action">
            <button type="button" className="btn" onClick={closeModal}>Đóng</button>
            <button type="submit" className="btn btn-primary">Thêm</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRoleModal;
