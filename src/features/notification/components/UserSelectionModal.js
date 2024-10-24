import React, { useEffect, useState } from 'react';
import UserService from '../../../services/UserService';

function UserSelectionModal({ showModal, closeModal, onUserSelect }) {
  const [users, setUsers] = useState([]); // Danh sách người dùng
  const [selectedUserIds, setSelectedUserIds] = useState([]); // ID người dùng đã chọn

  useEffect(() => {
    const fetchUsers = async () => {
      // Giả sử có một hàm fetchUsers để lấy danh sách người dùng từ API
      const userList = await UserService.getUsers(); // Thay thế với logic lấy người dùng từ API
      setUsers(userList);
    };

    if (showModal) {
      fetchUsers();
    }
  }, [showModal]);

  const handleCheckboxChange = (userId) => {
    setSelectedUserIds((prev) => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId); // Bỏ chọn người dùng
      } else {
        return [...prev, userId]; // Chọn người dùng
      }
    });
  };

  const handleConfirmSelection = () => {
    onUserSelect(selectedUserIds); // Truyền danh sách ID người dùng đã chọn
    closeModal(); // Đóng modal
  };

  return (
    <>
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Chọn người dùng</h3>
            <div className="max-h-60 overflow-y-auto">
              {users.map(user => (
                <div key={user.id} className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={selectedUserIds.includes(user?.id)} 
                    onChange={() => handleCheckboxChange(user?.id)} 
                    className="mr-2" 
                  />
                  <span>{user?.fullName} ({user?.username})</span>
                </div>
              ))}
            </div>
            <div className="modal-action">
              <button type="button" className="btn btn-primary" onClick={handleConfirmSelection}>
                Xác nhận
              </button>
              <button type="button" className="btn" onClick={closeModal}>
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default UserSelectionModal;
