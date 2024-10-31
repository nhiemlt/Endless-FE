import React from "react";
import { TrashIcon } from "@heroicons/react/24/outline";

const ManageUserModal = ({ usersInRole, onClose, handleDeleteUser }) => {
  return (
    <div className="modal">
      <div className="modal-box">
        <h5 className="text-lg font-bold">Users in Role</h5>
        {usersInRole.length === 0 ? (
          <p>Hiện tại role này chưa có thành viên nào</p>
        ) : (
          <table className="table w-full">
            <thead>
              <tr>
                <th>Avatar</th>
                <th>Tên</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {usersInRole.map((user) => (
                <tr key={user.userID}>
                  <td>
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-10 h-10 rounded-full"
                    />
                  </td>
                  <td>
                    <div>
                      <span className="font-bold">
                        {user.fullname || "Unknown User"}
                      </span>
                      <br />
                      <span className="text-sm text-gray-500">
                        {user.username}
                      </span>
                    </div>
                  </td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteUser(user.userID)}
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="modal-action">
          <button className="btn" onClick={onClose}>Đóng</button>
        </div>
      </div>
    </div>
  );
};

export default ManageUserModal;