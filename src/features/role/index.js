import React, { useState, useEffect } from "react";
import RoleService from "../../services/roleService";
import axios from "axios";

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
      const response = await axios.get("/api/users");
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
        permissionIds: permissions
          .filter((p) => p.selected)
          .map((p) => p.permissionId),
      });
      setRoles([...roles, response]);
      setNewRoleName("");
      setActiveTab("manageRole");
    } catch (error) {
      console.error("Error creating role:", error);
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

  const handleAssignRole = () => {
    console.log(`Assigning role ${currentRoleId} to users:`, selectedUsers);
    setShowModal(false);
  };

  return (
    <div className="container mx-auto mt-8">
      {/* Tab Navigation */}
      <div className="tabs">
        <a
          className={`tab ${activeTab === "manageRole" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("manageRole")}
        >
          Manage Roles
        </a>
        <a
          className={`tab ${activeTab === "createRole" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("createRole")}
        >
          Create Role
        </a>
        <a
          className={`tab ${activeTab === "assignRole" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("assignRole")}
        >
          Assign Role
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
              {roles.map((role) => (
                <tr key={role.roleId}>
                  <td>{role.roleName}</td>
                  <td>{role.userCount}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => {
                        setNewRoleName(role.roleName);
                        setActiveTab("createRole");
                      }}
                    >
                      Edit
                    </button>
                    <button className="btn btn-sm btn-danger ml-2">
                      Delete
                    </button>
                    <button
                      className="btn btn-sm btn-success ml-2"
                      onClick={() => {
                        setCurrentRoleId(role.roleId);
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
          <form onSubmit={handleCreateRole}>
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
              Save Role
            </button>
          </form>
        </div>
      )}

      {/* Assign Role Tab */}
      {activeTab === "assignRole" && (
        <div className="mt-6">
          <h5 className="text-lg font-bold">Assign Roles to Users</h5>
          <table className="table w-full">
            <thead>
              <tr>
                <th>Role</th>
                <th>Assign</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
                <tr key={role.roleId}>
                  <td>{role.roleName}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => {
                        setCurrentRoleId(role.roleId); // Lưu roleId vào state
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

      {/* Modal for Assigning Users */}
      {showModal && (
        <div className="modal">
          <div className="modal-box">
            <h2 className="font-bold text-lg">Assign Users</h2>
            <input
              type="text"
              placeholder="Search user..."
              className="input mb-4"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="max-h-40 overflow-y-auto mb-4">
              {users
                .filter((user) =>
                  user.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((user) => (
                  <label key={user.id} className="cursor-pointer block">
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => {
                        setSelectedUsers((prev) =>
                          prev.includes(user.id)
                            ? prev.filter((id) => id !== user.id)
                            : [...prev, user.id]
                        );
                      }}
                    />
                    {user.name}
                  </label>
                ))}
            </div>
            <button className="btn btn-primary" onClick={handleAssignRole}>
              Add Member
            </button>
            <button className="btn" onClick={() => setShowModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Role;
