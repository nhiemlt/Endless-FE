import { useEffect, useState } from 'react';
import TitleCard from "../../components/Cards/TitleCard";
import NotificationModal from './components/AddNotificationModal';
import DetailModal from './components/DetailModal';
import NotificationService from '../../services/NotificationService';
import EyeIcon from '@heroicons/react/24/solid/EyeIcon';

function Notification() {
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [notificationDetails, setNotificationDetails] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sortBy, setSortBy] = useState('notificationDate');
  const [sortDir, setSortDir] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const fetchNotifications = async () => {
    setLoading(true);
    try {
        const data = await NotificationService.getAllNotifications(
            searchTerm,
            filterStatus,
            currentPage,
            size,
            sortBy,
            sortDir
        );
        setNotifications(data.content);
        setTotalPages(data.totalPages);
    } catch (error) {
        console.error("Lỗi khi lấy thông báo:", error);
    } finally {
        setLoading(false);
    }
};

  useEffect(() => {
    fetchNotifications();
  }, [currentPage, size, sortBy, sortDir, searchTerm, filterStatus]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(0);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSortChange = (newSortBy) => {
    const newSortDir = (sortBy === newSortBy && sortDir === 'asc') ? 'desc' : 'asc';
    setSortBy(newSortBy);
    setSortDir(newSortDir);
    setCurrentPage(0); // Reset lại trang về 0 sau khi thay đổi sắp xếp
  };

  const handleStatusFilter = (event) => {
    setFilterStatus(event.target.value);
    setCurrentPage(0);
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleDetailModalOpen = (notification) => {
    setNotificationDetails(notification);
    setShowDetailModal(true);
  };

  const handleDetailModalClose = () => {
    setShowDetailModal(false);
    setNotificationDetails(null);
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
        <button onClick={handlePrevPage} className="join-item btn" disabled={currentPage === 0}>
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
        <button onClick={handleNextPage} className="join-item btn" disabled={currentPage === totalPages - 1}>
          Next
        </button>
      </div>
    );
  };

  return (
    <TitleCard title="Thông báo" topMargin="mt-2">
      <div className="flex justify-between mb-4">
        <div className="flex space-x-4">
          <label className="input input-bordered flex items-center gap-2">
            <input
              type="text"
              placeholder="Tìm kiếm thông báo"
              className=" dark:bg-base-100"
              value={searchTerm}
              onChange={handleSearch}
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

          <select
            className="select select-bordered w-full max-w-xs"
            value={filterStatus}
            onChange={handleStatusFilter}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="Gửi tất cả">Gửi tất cả</option>
            <option value="Gửi thủ công">Gửi thủ công</option>
            <option value="Gửi tự động">Gửi tự động</option>
          </select>

          <select
            className="select select-bordered w-full max-w-xs"
            onChange={(e) => handleSortChange(e.target.value)}
          >
            <option value="notificationDate">Mới nhất</option>
            <option value="notificationDate">Cũ nhất</option>
          </select>
        </div>

        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          Tạo thông báo
        </button>
      </div>

      {loading ? (
        <p>Đang tải thông báo...</p>
      ) : (
        <>
          <table className="table w-full table-xs">
            <thead>
              <tr>
                <th onClick={() => handleSortChange('title')}>Tiêu đề</th>
                <th onClick={() => handleSortChange('type')}>Loại</th>
                <th>Nội dung</th>
                <th onClick={() => handleSortChange('notificationDate')}>Thời gian</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map((notification) => (
                <tr key={notification.notificationID}>
                  <td>{notification.title}</td>
                  <td>{notification.type}</td>
                  <td>{notification.content}</td>
                  <td>
                    {new Date(notification.notificationDate).toLocaleString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </td>
                  <td>
                    <button className="btn btn-sm btn-outline btn-primary" onClick={() => handleDetailModalOpen(notification)}>
                    <EyeIcon className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {renderPagination()}
        </>
      )}

      <NotificationModal
        showModal={showModal}
        closeModal={() => setShowModal(false)}
        onNotificationSent={fetchNotifications} // Truyền hàm vào modal
      />

      <DetailModal
        showModal={showDetailModal}
        closeModal={handleDetailModalClose}
        notification={notificationDetails}
      />
    </TitleCard>
  );
}

export default Notification;
