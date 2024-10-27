import React, { useState, useEffect } from "react";
import RoleService from "../../services/roleService";
import UserService from "../../services/UserService";
import { useDispatch } from "react-redux";
import { showNotification } from '../../features/common/headerSlice';

function Role() {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [users, setUsers] = useState([]);
  const [newRoleName, setNewRoleName] = useState("");
  const [activeTab, setActiveTab] = useState("manageRole");
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [currentRoleId, setCurrentRoleId] = useState(null);

  const dispatch = useDispatch(); // Khai báo dispatch

  useEffect(() => {
    loadRoles();
    loadPermissions();
    loadUsers();
  }, []);

  const loadRoles = async () => {
    try {
      const response = await RoleService.getAllRoles();
      setRoles(response);
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

  const loadUsers = async () => {
    try {
      const response = await UserService.getAllUser();
      setUsers(response.data);
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  const handleCreateRole = async (e) => {
    e.preventDefault();
    try {
      const response = await RoleService.createRole({
        roleName: newRoleName,
        permissionIds: permissions.filter((p) => p.selected).map((p) => p.permissionId),
      });
      setRoles([...roles, response]);
      setNewRoleName("");
      dispatch(showNotification({ message: "Role created successfully!", status: 1 }));
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
        permissionIds: permissions.filter((p) => p.selected).map((p) => p.permissionId),
      });
      const updatedRoles = roles.map(role => 
        role.roleId === currentRoleId ? response : role
      );
      setRoles(updatedRoles);
      setNewRoleName("");
      dispatch(showNotification({ message: "Role updated successfully!", status: 1 }));
      setActiveTab("manageRole");
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  const togglePermission = (permissionId) => {
    setPermissions((prevPermissions) =>
      prevPermissions.map((perm) =>
        perm.permissionId === permissionId
          ? { ...perm, selected: !perm.selected }
          : perm
      )
    );
  };

  const handleDeleteRole = async (roleId) => {
    try {
      await RoleService.deleteRole(roleId);
      setRoles(roles.filter(role => role.roleId !== roleId));
      dispatch(showNotification({ message: "Role deleted successfully!", status: 1 }));
    } catch (error) {
      console.error("Error deleting role:", error);
    }
  };

  const handleAssignRole = () => {
    // Logic to assign role to selected users
    console.log(`Assigning role ${currentRoleId} to users:`, selectedUsers);
    setShowModal(false);
    dispatch(showNotification({ message: "Users assigned successfully!", status: 1 }));
  };

  const resetFields = () => {
    setNewRoleName("");
    setPermissions(permissions.map(p => ({ ...p, selected: false }))); // Reset permissions
  };

  const handleEditClick = (role) => {
    setCurrentRoleId(role?.roleId);
    setNewRoleName(role?.roleName);
    // Set selected permissions based on the current role
    const updatedPermissions = permissions.map(p => ({
      ...p,
      selected: role.permissions.some(rp => rp.permissionId === p.permissionId),
    }));
    setPermissions(updatedPermissions);
    setActiveTab("createRole");
  };

  // Hàm tìm kiếm
  const filteredRoles = roles.filter(role => 
    role.roleName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto mt-8">
      {/* Tab Navigation */}
      <div className="tabs">
        <a
          className={`tab ${activeTab === "manageRole" ? "tab-active" : ""}`}
          onClick={() => {
            setActiveTab("manageRole");
            resetFields(); // Reset fields when switching to manageRole tab
          }}
        >
          Manage Roles
        </a>
        <a
          className={`tab ${activeTab === "createRole" ? "tab-active" : ""}`}
          onClick={() => {
            setActiveTab("createRole");
            resetFields(); // Reset fields when switching to createRole tab
          }}
        >
          Create Role
        </a>
      </div>

      {/* Manage Roles Tab */}
      {activeTab === "manageRole" && (
        <div className="mt-6">
          <div className="flex mb-4">
            <input
              type="text"
              className="input mr-2"
              placeholder="Search role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} // Cập nhật searchTerm khi nhập
            />
            <button
              className="btn btn-primary"
              onClick={() => setActiveTab("createRole")}
            >
              Create Role
            </button>
          </div>
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
                <tr key={role?.roleId}>
                  <td>{role?.roleName ? role.roleName : "Unknown Role"}</td>
                  <td>
                    {role?.userCount !== null && role?.userCount !== undefined
                      ? role.userCount
                      : "0"}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => handleEditClick(role)}
                    >
                      Edit
                    </button>
                    <button className="btn btn-sm btn-danger ml-2" onClick={() => handleDeleteRole(role?.roleId)}>
                      Delete
                    </button>
                    <button
                      className="btn btn-sm btn-success ml-2"
                      onClick={() => {
                        setCurrentRoleId(role?.roleId);
                        setShowModal(true);
                      }}
                    >
                      +
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Role Tab */}
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
                      onChange={() => togglePermission(permission.permissionId)}
                    />
                    <span className="label-text">
                      {permission.permissionName}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <button type="submit" className="btn btn-primary">
              {currentRoleId ? "Update Role" : "Save Role"}
            </button>
          </form>
        </div>
      )}

      {/* Modal for Assigning Users */}
      {showModal && (
        <div className="modal">
          <div className="modal-box">
            <h2 className="font-bold text-lg">Assign Users</h2>
            <div className="my-4">
              {users.map((user) => (
                <label key={user.id} className="flex items-center">
                  <input
                    type="checkbox"
                    className="checkbox mr-2"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => {
                      if (selectedUsers.includes(user.id)) {
                        setSelectedUsers(selectedUsers.filter((id) => id !== user.id));
                      } else {
                        setSelectedUsers([...selectedUsers, user.id]);
                      }
                    }}
                  />
                  <span>{user.name}</span>
                </label>
              ))}
            </div>
            <div className="modal-action">
              <button className="btn" onClick={() => setShowModal(false)}>Close</button>
              <button className="btn btn-primary" onClick={handleAssignRole}>Assign</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Role;
