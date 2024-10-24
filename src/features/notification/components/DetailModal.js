import React, { useState } from 'react';

function DetailModal({ showModal, closeModal, notification }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const recipientsPerPage = 5; // Số lượng người nhận trên mỗi trang
  const maxPageButtons = 5; // Giới hạn số nút phân trang hiển thị

  if (!notification) return null;

  // Lọc người nhận dựa trên tìm kiếm username
  const filteredRecipients = notification.notifications.filter((recipient) =>
    recipient.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Tính toán số lượng trang
  const totalPages = Math.ceil(filteredRecipients.length / recipientsPerPage);

  // Lấy dữ liệu của trang hiện tại
  const currentRecipients = filteredRecipients.slice(
    (currentPage - 1) * recipientsPerPage,
    currentPage * recipientsPerPage
  );

  // Tạo danh sách các trang cần hiển thị
  const getPaginationButtons = () => {
    let startPage = Math.max(currentPage - Math.floor(maxPageButtons / 2), 1);
    let endPage = Math.min(startPage + maxPageButtons - 1, totalPages);

    // Điều chỉnh lại startPage nếu endPage ở cuối danh sách
    if (endPage - startPage + 1 < maxPageButtons) {
      startPage = Math.max(endPage - maxPageButtons + 1, 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  // Chuyển trang
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Chi tiết thông báo</h3>
            <div className="mb-4">
              <h4 className="font-semibold text-md">Tiêu đề: <span className="font-normal">{notification.title}</span></h4>
              <p><strong>Loại:</strong> <span className="font-normal">{notification.type}</span></p>
              <p>
                <strong>Ngày tạo: </strong>
                <span className="font-normal">
                  {new Date(notification.notificationDate).toLocaleString('vi-VN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                  })}
                </span>
              </p>
              <p><strong>Nội dung:</strong> <span className="font-normal"><br/>{notification.content}</span></p>
            </div>

            <div className="flex justify-between items-center mb-4">
              <h5 className="font-semibold text-md">Danh sách người nhận:</h5>
              <label className="input input-bordered flex items-center gap-2 w-50 max-w-xs">
                <input
                  type="text"
                  placeholder="Nhập vào username"
                  className="grow"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 opacity-70"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                    clipRule="evenodd"
                  />
                </svg>
              </label>
            </div>

            <table className="table w-full mt-2">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2">Tên người nhận</th>
                  <th className="px-4 py-2">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {currentRecipients.map((recipient) => (
                  <tr key={recipient.notificationRecipientID} className="hover:bg-gray-100">
                    <td className="px-4 py-2 flex items-center">
                      <img src={recipient.avatar || 'default-avatar-url'} alt={recipient.userName} className="w-8 h-8 rounded-full mr-2" />
                      {recipient.userName}
                    </td>
                    <td className="px-4 py-2">
                      <span className={`badge ${recipient.status === 'UNREAD' ? 'badge-warning' : 'badge-success'}`}>
                        {recipient.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Phân trang với điều kiện */}
            {totalPages >= 3 && (
              <div className="flex justify-center mt-4">
                <button
                  className="btn"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Previous
                </button>

                {getPaginationButtons().map((page) => (
                  <button
                    key={page}
                    className={`btn ${currentPage === page ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ))}

                <button
                  className="btn"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next
                </button>
              </div>
            )}

            <div className="modal-action mt-4">
              <button className="btn" onClick={closeModal}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DetailModal;
