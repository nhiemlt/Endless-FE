import React, { useEffect, useState } from 'react';
import UserService from '../../../services/UserService';
import NotificationService from '../../../services/NotificationService'; // Nhập NotificationService
import { showNotification } from "../../common/headerSlice";
import { useDispatch } from "react-redux";

function UserSelectionModal({ showModal, closeModal, title, content, close }) {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [size, setSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await UserService.getInfor(currentPage, size, searchTerm);
      setUsers(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách người dùng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showModal) {
      fetchUsers();
    }
  }, [showModal, currentPage, size, searchTerm]);

  const handleCheckboxChange = (userId) => {
    setSelectedUserIds((prev) => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const handleSendNotification = async () => {
    if (!title || !content) {
      alert('Vui lòng nhập tiêu đề và nội dung thông báo.');
      return;
    }

    try {
      await NotificationService.sendNotification({
        title,
        content,
        userIds: selectedUserIds,
      });
      dispatch(showNotification({ message: 'Thông báo đã được gửi thành công!', status: 1 }));
      closeModal();
      close();
    } catch (error) {
      console.error("Lỗi khi gửi thông báo:", error);
      dispatch(showNotification({ message: 'Đã xảy ra lỗi khi gửi thông báo.', type: 'error' }));
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(0);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const renderPagination = () => {
    const maxPageButtons = 5;
    const halfMax = Math.floor(maxPageButtons / 2);
    let startPage = Math.max(0, currentPage - halfMax);
    let endPage = Math.min(totalPages - 1, currentPage + halfMax);

    if (endPage - startPage < maxPageButtons - 1) {
      if (startPage === 0) {
        endPage = Math.min(maxPageButtons - 1, totalPages - 1);
      } else if (endPage === totalPages - 1) {
        startPage = Math.max(0, totalPages - maxPageButtons);
      }
    }

    return (
      <div className="join mt-4 flex justify-center w-full">
        <button onClick={() => handlePageChange(currentPage - 1)} className="join-item btn" disabled={currentPage === 0}>
          Previous
        </button>
        {Array.from({ length: endPage - startPage + 1 }, (_, index) => {
          const page = startPage + index;
          return (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`join-item btn ${currentPage === page ? 'btn-primary' : ''}`}
            >
              {page + 1}
            </button>
          );
        })}
        <button onClick={() => handlePageChange(currentPage + 1)} className="join-item btn" disabled={currentPage === totalPages - 1}>
          Next
        </button>
      </div>
    );
  };

  return (
    <>
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Chọn người dùng</h3>

            <div className="flex justify-between mb-4">
              <input
                type="text"
                placeholder="Tìm kiếm người dùng"
                className="input input-bordered"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>

            {loading ? (
              <p>Đang tải danh sách người dùng...</p>
            ) : (
              <div className="max-h-60 overflow-y-auto">
                <table className="table table-xs">
                  <thead>
                    <tr>
                      <th></th>
                      <th>Thông tin người dùng</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.userID}>
                        <td>
                          <input 
                            type="checkbox" 
                            checked={selectedUserIds.includes(user.userID)} 
                            onChange={() => handleCheckboxChange(user.userID)} 
                          />
                        </td>
                        <td>
                          <div className="flex items-center space-x-3">
                            <div className="avatar">
                              <div className="mask mask-squircle w-12 h-12">
                                <img src={user.avatar} alt="Avatar" />
                              </div>
                            </div>
                            <div>
                              <div className="font-bold">{user.fullName}</div>
                              <div className="text-sm opacity-50">{user.username}</div>
                            </div>
                          </div>
                        </td>
                        <td>{user.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {renderPagination()}
              </div>
            )}
            
            <div className="modal-action">
              <button className="btn btn-primary" onClick={handleSendNotification}>
                Gửi
              </button>
              <button className="btn" onClick={closeModal}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default UserSelectionModal;
