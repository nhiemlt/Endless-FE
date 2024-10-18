import React, { useState, useEffect } from "react";
import axios from "axios";

function Role() {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [newRoleName, setNewRoleName] = useState("");
  const [activeTab, setActiveTab] = useState("createRole");

  useEffect(() => {
    loadRoles();
    loadPermissions();
  }, []);

  const loadRoles = async () => {
    try {
      const response = await axios.get("/api/roles");
      setRoles(response.data);
      console.log("Roles loaded:", response.data); // Debugging line
    } catch (error) {
      console.error("Error loading roles:", error);
    }
  };

  const loadPermissions = async () => {
    try {
      const response = await axios.get("/api/roles/permissions");
      setPermissions(response.data);
      console.log("Permissions loaded:", response.data); // Debugging line
    } catch (error) {
      console.error("Error loading permissions:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/roles/${id}`);
      setRoles(roles.filter((role) => role.roleId !== id));
    } catch (error) {
      console.error("Error deleting role:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/roles", { name: newRoleName });
      setRoles([...roles, response.data]); // Assuming API returns the newly created role
      setNewRoleName("");
    } catch (error) {
      console.error("Error creating role:", error);
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <div className="tabs mb-4">
        <button
          className={`tab ${activeTab === "createRole" ? "active" : ""}`}
          onClick={() => setActiveTab("createRole")}
        >
          Create Role
        </button>
        <button
          className={`tab ${activeTab === "assignRole" ? "active" : ""}`}
          onClick={() => setActiveTab("assignRole")}
        >
          Assign Role
        </button>
      </div>

      {activeTab === "createRole" && (
        <div className="card mb-4">
          <div className="card-header">
            <h5>Create New Role</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="roleName" className="form-label">
                  Role Name
                </label>
                <input
                  type="text"
                  className="form-input"
                  id="roleName"
                  placeholder="Enter role name"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Permissions</label>
                <div className="permission-switches">
                  {permissions.map((permission) => (
                    <div className="form-check" key={permission.permissionId}>
                      <label className="form-check-label" htmlFor={permission.permissionId}>
                        {permission.permissionName}
                      </label>
                      <label className="switch">
                        <input type="checkbox" />
                        <span className="slider"></span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <button type="submit" className="btn btn-primary">
                Create Role
              </button>
            </form>
          </div>
        </div>
      )}

      {activeTab === "assignRole" && (
        <div className="card mb-4">
          <div className="card-header">
            <h5>Assign Roles to Users</h5>
            <input
              type="text"
              className="form-input"
              placeholder="Search by role name"
            />
          </div>
          <div className="card-body">
            <table className="table w-full border-collapse">
              <thead>
                <tr>
                  <th>Role Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {roles.length > 0 ? (
                  roles.map((role) => (
                    <tr key={role.roleId}>
                      <td>{role.roleName}</td>
                      <td>
                        <button className="btn btn-warning btn-sm">Edit</button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(role.roleId)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2">No roles available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <style jsx>{`
        .tabs {
          display: flex;
          margin-bottom: 1rem;
          border-bottom: 2px solid #007bff;
        }

        .tab {
          cursor: pointer;
          border: 1px solid transparent;
          border-radius: 5px;
          transition: background-color 0.3s, color 0.3s;
        }

        .tab:hover {
          background-color: rgba(0, 123, 255, 0.1);
        }

        .tab.active {
          border: 1px solid #007bff;
          background-color: rgba(0, 123, 255, 0.2);
          color: #007bff;
        }

        .card {
          border: 1px solid #ccc;
          border-radius: 5px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .card-header {
          background: #32567d;
          color: white;
          padding: 1rem;
          font-weight: bold;
        }
        .form-input {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 5px;
          transition: border 0.3s;
        }
        .form-input:focus {
          border-color: #007bff;
          outline: none;
        }
        .btn {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          margin-top: 0.5rem;
          transition: background 0.3s;
        }
        .btn-primary {
          background: #007bff;
          color: white;
        }
        .btn-warning {
          background: #ffc107;
          color: black;
        }
        .btn-danger {
          background: #dc3545;
          color: white;
        }
        .permission-switches {
          display: flex;
          flex-direction: column;
        }
        .form-check {
          display: flex;
          align-items: center;
          margin-bottom: 0.5rem;
        }
        .form-check-label {
          margin-right: 1rem;
          font-weight: bold;
        }
        .switch {
          position: relative;
          display: inline-block;
          width: 50px;
          height: 24px;
        }
        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: 0.4s;
          border-radius: 24px;
        }
        .slider:before {
          position: absolute;
          content: "";
          height: 20px;
          width: 20px;
          left: 2px;
          bottom: 2px;
          background-color: white;
          transition: 0.4s;
          border-radius: 50%;
        }
        input:checked + .slider {
          background-color: #007bff;
        }
        input:checked + .slider:before {
          transform: translateX(26px);
        }
      `}</style>
    </div>
  );
}

export default Role;
