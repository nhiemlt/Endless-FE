import { useState } from 'react';

function UserSelectionModal({ showModal, closeModal }) {
  const [searchTerm, setSearchTerm] = useState('');

  const users = [
    // Danh sách người dùng mẫu, bạn có thể thay bằng dữ liệu từ API
    { username: 'user1', fullName: 'Nguyễn Văn A', avatar: 'avatar1.png' },
    { username: 'user2', fullName: 'Trần Thị B', avatar: 'avatar2.png' },
    // Thêm người dùng khác...
  ];

  const filteredUsers = users.filter(user => 
    user.username.includes(searchTerm) || 
    user.fullName.includes(searchTerm)
  );

  return (
    <>
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Chọn người dùng</h3>
            <input 
              type="text" 
              className="input input-bordered w-full mb-4" 
              placeholder="Tìm kiếm người dùng..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Avatar</th>
                  <th>Username</th>
                  <th>Họ tên</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={index}>
                    <td>
                      <div className="avatar">
                        <div className="mask mask-squircle w-10 h-10">
                          <img src={user?.avatar} alt="Avatar" />
                        </div>
                      </div>
                    </td>
                    <td>{user?.username}</td>
                    <td>{user?.fullName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="modal-action">
              <button className="btn" onClick={closeModal}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default UserSelectionModal;
