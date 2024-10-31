import React, { useState, useEffect } from "react";
import RoleService from "../../services/roleService";
import { useDispatch } from "react-redux";
import { showNotification } from "../../features/common/headerSlice";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import PencilIcon from "@heroicons/react/24/outline/PencilIcon";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";
import TitleCard from "../../components/Cards/TitleCard";
import ManageUserModal from "./components/ManageUserModal";

function Role() {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [newRoleName, setNewRoleName] = useState("");
  const [activeTab, setActiveTab] = useState("manageRole");
  const [currentRoleId, setCurrentRoleId] = useState(null);
  const [refreshData, setRefreshData] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [usersInRole, setUsersInRole] = useState([]); // Danh sách người dùng trong vai trò
  const [permissionSearchTerm, setPermissionSearchTerm] = useState("");
  const [showManageUserModal, setShowManageUserModal] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    loadRoles();
    loadPermissions();
  }, [refreshData]);

  const loadRoles = async () => {
    try {
      const rolesResponse = await RoleService.getAllRoles();
      const rolesWithCountPromises = rolesResponse.map(async (role) => {
        const userCountResponse = await RoleService.getUserCountByRole(
          role.roleId
        );
        const permissionsResponse = await RoleService.getRoleWithPermissions(
          role.roleId
        );
        return {
          ...role,
          userCount: userCountResponse,
          permissions: permissionsResponse,
        };
      });
      const rolesWithCount = await Promise.all(rolesWithCountPromises);
      setRoles(rolesWithCount);
    } catch (error) {
      console.error("Error loading roles:", error);
    }
  };

  const loadPermissions = async () => {
    try {
      const response = await RoleService.getAllPermissions();
      setPermissions(response);
    } catch (error) {
      console.error("Error loading permissions:", error);
    }
  };  

  const handleCreateRole = async (e) => {
  e.preventDefault();
  try {
    const selectedPermissionIds = permissions
      .filter((p) => p.selected)
      .map((p) => p.permissionId);

    const response = await RoleService.createRole({
      roleName: newRoleName,
      permissionIds: selectedPermissionIds,
    });

    if (response && response.roleId) {
      const newRole = {
        ...response,
        userCount: 0,
      };

      setRoles((prevRoles) => [...prevRoles, newRole]);
      setNewRoleName("");
      dispatch(showNotification({ message: "Role created successfully!", status: 1 }));
      setActiveTab("manageRole");
    }
  } catch (error) {
    console.error("Error creating role:", error);
    dispatch(showNotification({ message: "Failed to create role", status: 0 }));
  }
};

  
  const handleEditRole = async (e) => {
    e.preventDefault(); // Ngăn chặn reload trang
    try {
      const response = await RoleService.updateRole({
        roleId: currentRoleId,
        roleName: newRoleName,
        permissionIds: permissions
          .filter((p) => p.selected)
          .map((p) => p.permissionId),
      });
      const updatedRoles = roles.map((role) =>
        role.roleId === currentRoleId ? response : role
      );
      setRoles(updatedRoles);
      setNewRoleName("");
      dispatch(
        showNotification({ message: "Role updated successfully!", status: 1 })
      );
      setActiveTab("manageRole");
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };  

  const handleDeleteRole = async (roleId) => {
    try {
      await RoleService.deleteRole(roleId);
      setRoles(roles.filter((role) => role.roleId !== roleId));
      dispatch(
        showNotification({ message: "Role deleted successfully!", status: 1 })
      );
    } catch (error) {
      console.error("Error deleting role:", error);
    }
  };

  const resetFields = () => {
    setNewRoleName("");
    setPermissions(permissions.map((p) => ({ ...p, selected: false })));
  };

  const handleEditClick = (role) => {
    setCurrentRoleId(role.roleId);
    setNewRoleName(role.roleName);
  
    const updatedPermissions = permissions.map((p) => ({
      ...p,
      selected: Array.isArray(role.permissions) && role.permissions.some((rp) => rp.permissionId === p.permissionId),
    }));
  
    setPermissions(updatedPermissions);
    setActiveTab("createRole");
    resetFields();
  };
  

  const filteredRoles = roles.filter((role) =>
    role.roleName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const loadUsersInRole = async (roleId) => {
    try {
      const users = await RoleService.getUsersByRole(roleId);
      setUsersInRole(users);
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await RoleService.deleteUserFromRole(currentRoleId, userId);
      setUsersInRole(usersInRole.filter((user) => user.userID !== userId));
      dispatch(
        showNotification({
          message: "User removed from role successfully!",
          status: 1,
        })
      );
    } catch (error) {
      console.error("Error deleting user from role:", error);
      dispatch(
        showNotification({
          message: "Failed to remove user from role",
          status: 0,
        })
      );
    }
  };

  const openManageUserModal = async (roleId) => {
    await loadUsersInRole(roleId);
    resetFields();
    setShowManageUserModal(true);
  };

  const closeManageUserModal = () => {
    resetFields();
    setShowManageUserModal(false);
  };

  const handleTogglePermission = (permissionId) => {
    const updatedPermissions = permissions.map((module) => ({
      ...module,
      permissions: module.permissions.map((p) =>
        p.permissionId === permissionId
          ? { ...p, selected: !p.selected }
          : p
      ),
    }));
    setPermissions(updatedPermissions);
  };  

  return (
    <TitleCard title="Thông báo" topMargin="mt-2">
      <div className="container mx-auto mt-8">
        <div className="tabs">
          <button
            className={`tab ${activeTab === "manageRole" ? "tab-active" : ""}`}
            onClick={() => {
              setActiveTab("manageRole");
              resetFields();
            }}
          >
            Quản lý vai trò
          </button>
          <button
            className={`tab ${activeTab === "createRole" ? "tab-active" : ""}`}
            onClick={() => {
              setActiveTab("createRole");
              resetFields();
            }}
          >
            Tạo vai trò
          </button>
        </div>

        {activeTab === "manageRole" && (
          <div className="mt-6">
            {/* Tìm kiếm role */}
            <input
              style={{
                backgroundColor: "#16171a",
                border: "1px solid #16171a",
                borderRadius: "4px",
                padding: "8px",
              }}
              type="text"
              placeholder="Tìm vai trò..."
              className="input mb-4 "
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="btn btn-primary ml-4"
              onClick={() => {
                resetFields();
                setActiveTab("createRole");
              }}
            >
              Tạo vai trò
            </button>
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Tên vai trò</th>
                  <th>Thành viên</th>
                </tr>
              </thead>
              <tbody>
                {filteredRoles.map((role) => (
                  <tr key={role.roleId}>
                    <td>{role.roleName || "Unknown Role"}</td>
                    <td>{role.userCount || 0}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning"
                        onClick={() => handleEditClick(role)}
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        className="btn btn-sm btn-danger ml-2"
                        onClick={() => handleDeleteRole(role.roleId)}
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                      <button
                        className="btn btn-sm btn-success ml-2"
                        onClick={() => openManageUserModal(role.roleId)}
                      >
                        <PlusIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "createRole" && (
          <div className="mt-6">
            <h5 className="text-lg font-bold">Tạo/Cập nhật vai trò</h5>
            <form onSubmit={currentRoleId ? handleEditRole : handleCreateRole}>
              <button type="submit" className="btn btn-primary mb-4 mt-3">
                {currentRoleId ? "Cập nhật vai trò" : "Tạo vai trò"}
              </button>
              <div className="mb-4 flex flex-col">
                <input
                  type="text"
                  style={{
                    backgroundColor: "#16171a",
                    border: "1px solid #16171a",
                    borderRadius: "4px",
                    padding: "8px",
                    width: "80%",
                    maxWidth: "300px",
                  }}
                  className="input"
                  placeholder="Nhập tên vai trò"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                />
              </div>
              <div className="mb-4 flex flex-col">
                <input
                  type="text"
                  style={{
                    backgroundColor: "#16171a",
                    border: "1px solid #16171a",
                    borderRadius: "4px",
                    padding: "8px",
                    width: "80%",
                    maxWidth: "300px",
                  }}
                  className="input"
                  placeholder="Tìm kiếm quyền..."
                  value={permissionSearchTerm}
                  onChange={(e) => setPermissionSearchTerm(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <span className="label-text">Permissions</span>
                <div className="grid grid-cols-1 gap-4">
                  {permissions
                    .filter((module) =>
                      module.permissions.some(
                        (permission) =>
                          permission.permissionName &&
                          permission.permissionName
                            .toLowerCase()
                            .includes(permissionSearchTerm.toLowerCase())
                      )
                    )
                    .map((module) => (
                      <div
                        key={module.moduleId}
                        className="p-4 rounded-md"
                        style={{
                          border: "2px solid #4a5568",
                        }}
                      >
                        <h6 className="font-bold">{module.moduleName}</h6>
                        <div className="grid grid-cols-1 gap-2 mt-2">
                          {module.permissions.map((permission) => (
                            <label
                              className="cursor-pointer flex items-center"
                              key={permission.permissionId}
                            >
                              <input
                                type="checkbox"
                                className="checkbox mr-2"
                                checked={permission.selected || false}
                                onChange={() =>
                                  handleTogglePermission(
                                    permission.permissionId
                                  )
                                }
                              />
                              {permission.permissionName}
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Hiển thị modal quản lý người dùng */}
        {showManageUserModal && (
          <ManageUserModal
            usersInRole={usersInRole}
            onClose={closeManageUserModal}
            handleDeleteUser={handleDeleteUser}
          />
        )}
      </div>
    </TitleCard>
  );
}

export default Role;
