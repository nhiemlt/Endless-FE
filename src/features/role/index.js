import React, { useState, useEffect } from "react";
import RoleService from "../../services/roleService";
import { useDispatch } from "react-redux";
import { showNotification } from "../../features/common/headerSlice";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import PencilIcon from "@heroicons/react/24/outline/PencilIcon";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";
import UserRoleModal from "./modal";

function Role() {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [newRoleName, setNewRoleName] = useState("");
  const [activeTab, setActiveTab] = useState("manageRole");
  const [showModal, setShowModal] = useState(false);
  const [currentRoleId, setCurrentRoleId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [usersInRole, setUsersInRole] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    loadRoles();
    loadPermissions();
  }, []);

  const loadRoles = async () => {
    try {
      const rolesResponse = await RoleService.getAllRoles();
      const rolesWithCountPromises = rolesResponse.map(async (role) => {
        const userCountResponse = await RoleService.getUserCountByRole(
          role.roleId
        );
        return { ...role, userCount: userCountResponse };
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
      const response = await RoleService.createRole({
        roleName: newRoleName,
        permissionIds: permissions
          .filter((p) => p.selected)
          .map((p) => p.permissionId),
      });
      setRoles([...roles, { ...response, userCount: 0 }]);
      setNewRoleName("");
      dispatch(
        showNotification({ message: "Role created successfully!", status: 1 })
      );
      setActiveTab("manageRole");
    } catch (error) {
      console.error("Error creating role:", error);
    }
  };

  const handleEditRole = async () => {
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
      selected: role.permissions.some(
        (rp) => rp.permissionId === p.permissionId
      ),
    }));
    setPermissions(updatedPermissions);
    setActiveTab("createRole");
  };

  const handleAssignUsers = async (assignedUsers) => {
    try {
      await RoleService.assignUsersToRole(currentRoleId, assignedUsers);
      dispatch(
        showNotification({
          message: "Users added to role successfully!",
          status: 1,
        })
      );
      setShowModal(false);
      loadUsersInRole(currentRoleId);
    } catch (error) {
      console.error("Error assigning users:", error);
      dispatch(
        showNotification({ message: "Error adding users to role.", status: 0 })
      );
    }
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

  return (
    <div className="container mx-auto mt-8">
      <div className="tabs">
        <button
          className={`tab ${activeTab === "manageRole" ? "tab-active" : ""}`}
          onClick={() => {
            setActiveTab("manageRole");
            resetFields();
          }}
        >
          Manage Roles
        </button>
        <button
          className={`tab ${activeTab === "createRole" ? "tab-active" : ""}`}
          onClick={() => {
            setActiveTab("createRole");
            resetFields();
          }}
        >
          Create Role
        </button>
        <button
          className={`tab ${activeTab === "manageUser" ? "tab-active" : ""}`}
          onClick={() => {
            loadUsersInRole(currentRoleId);
            setActiveTab("manageUser");
          }}
        >
          Manage User
        </button>
      </div>

      {activeTab === "manageRole" && (
        <div className="mt-6">
          <input
            type="text"
            placeholder="Search roles..."
            className="input mb-4"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="btn btn-primary mb-4"
            onClick={() => {
              resetFields();
              setActiveTab("createRole");
            }}
          >
            Create Role
          </button>
          <table className="table w-full">
            <thead>
              <tr>
                <th>Role Name</th>
                <th>User Count</th>
                <th>Actions</th>
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
                      onClick={() => {
                        setCurrentRoleId(role.roleId);
                        setActiveTab("manageUser");
                        loadUsersInRole(role.roleId);
                      }}
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
          <h5 className="text-lg font-bold">Create/Edit Role</h5>
          <form onSubmit={currentRoleId ? handleEditRole : handleCreateRole}>
            <div className="mb-4">
              <label className="label">
                <span className="label-text">Role Name</span>
                <input
                  type="text"
                  className="input"
                  placeholder="Enter role name"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                />
              </label>
            </div>
            <div className="mb-4">
              <span className="label-text">Permissions</span>
              <div className="grid grid-cols-2 gap-4">
                {permissions.map((permission) => (
                  <label
                    className="cursor-pointer flex items-center"
                    key={permission.permissionId}
                  >
                    <input
                      type="checkbox"
                      className="checkbox mr-2"
                      checked={permission.selected || false}
                      onChange={() => {
                        const updatedPermissions = permissions.map((p) =>
                          p.permissionId === permission.permissionId
                            ? { ...p, selected: !p.selected }
                            : p
                        );
                        setPermissions(updatedPermissions);
                      }}
                    />
                    {permission.permissionName}
                  </label>
                ))}
              </div>
            </div>
            <button className="btn btn-primary" type="submit">
              {currentRoleId ? "Update Role" : "Create Role"}
            </button>
          </form>
        </div>
      )}

      {activeTab === "manageUser" && (
        <div className="mt-6">
          <h5 className="text-lg font-bold">Users in Role</h5>
          <button
            className="btn btn-primary mb-4"
            onClick={() => setShowModal(true)}
          >
            Add User
          </button>
          <table className="table w-full">
            <thead>
              <tr>
                <th>User Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {usersInRole.map((user) => (
                <tr key={user.userId}>
                  <td>{user.username || "Unknown User"}</td>
                  <td>
                    <button className="btn btn-sm btn-danger">Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <UserRoleModal
          onClose={() => setShowModal(false)}
          onAssignUsers={handleAssignUsers}
          userSearchTerm={userSearchTerm}
          setUserSearchTerm={setUserSearchTerm}
        />
      )}
    </div>
  );
}

export default Role;
