import { useEffect, useState } from 'react';
import TitleCard from "../../components/Cards/TitleCard";
import NotificationModal from './components/AddNotificationModal'; // Nhập component modal mới
import DetailModal from './components/DetailModal'; // Nhập component modal chi tiết
import NotificationService from '../../services/notificationService'; // Nhập NotificationService

function Notification() {
  // Quản lý state
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [notificationDetails, setNotificationDetails] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0); // Quản lý tổng số trang
  const [currentPage, setCurrentPage] = useState(0); // Quản lý trang hiện tại
  const [size, setSize] = useState(10); // Kích thước trang (số thông báo trên mỗi trang)
  const [sortBy, setSortBy] = useState('notificationDate'); // Sắp xếp theo cột nào
  const [sortDir, setSortDir] = useState('desc'); // Hướng sắp xếp
  const [searchTerm, setSearchTerm] = useState(''); // Quản lý từ khóa tìm kiếm
  const [filterStatus, setFilterStatus] = useState(''); // Lọc theo trạng thái

  // Hàm mở modal
  const openModal = () => {
    setShowModal(true);
  };

  // Hàm đóng modal
  const closeModal = () => {
    setShowModal(false);
  };

  // Hàm mở modal chi tiết
  const openDetailModal = (details) => {
    setNotificationDetails(details);
    setShowDetailModal(true);
  };

  // Hàm đóng modal chi tiết
  const closeDetailModal = () => {
    setShowDetailModal(false);
    setNotificationDetails(null);
  };

  // Lấy danh sách thông báo từ API
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await NotificationService.getAllNotifications(filterStatus, searchTerm, currentPage, size, sortBy, sortDir);
      console.log(data); // Thêm dòng này để kiểm tra dữ liệu trả về
      setNotifications(data.content); // Giả sử response trả về theo định dạng `content`
      setTotalPages(data.totalPages); // Lưu tổng số trang
    } catch (error) {
      console.error("Lỗi khi lấy thông báo:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(); // Gọi hàm để lấy dữ liệu khi component được render hoặc các thông số thay đổi
  }, [currentPage, size, sortBy, sortDir, searchTerm, filterStatus]);

  // Hàm xử lý tìm kiếm
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(0); // Reset lại trang về 0 sau khi tìm kiếm
  };

  // Hàm xử lý thay đổi trang
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Hàm xử lý thay đổi sắp xếp
  const handleSortChange = (newSortBy) => {
    const newSortDir = sortBy === newSortBy && sortDir === 'asc' ? 'desc' : 'asc';
    setSortBy(newSortBy);
    setSortDir(newSortDir);
  };

  // Hàm xử lý lọc trạng thái
  const handleStatusFilter = (event) => {
    setFilterStatus(event.target.value);
    setCurrentPage(0); // Reset lại trang về 0 sau khi lọc
  };

  return (
    <TitleCard title="Thông báo" topMargin="mt-2">
      {/* Nút mở modal tạo thông báo */}
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm theo tiêu đề..."
          className="input input-bordered w-full max-w-xs"
          value={searchTerm}
          onChange={handleSearch}
        />
        <select
          className="select select-bordered w-full max-w-xs"
          value={filterStatus}
          onChange={handleStatusFilter}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="READ">Đã đọc</option>
          <option value="UNREAD">Chưa đọc</option>
        </select>
        <button className="btn btn-primary" onClick={openModal}>
          Tạo thông báo
        </button>
      </div>

      {/* Hiển thị thông báo nếu đang tải */}
      {loading ? (
        <p>Đang tải thông báo...</p>
      ) : (
        <>
          {/* Bảng hiển thị danh sách thông báo */}
          <table className="table w-full">
            <thead>
              <tr>
                <th onClick={() => handleSortChange('title')}>Tiêu đề</th>
                <th onClick={() => handleSortChange('type')}>Loại</th>
                <th>Nội dung</th>
                <th onClick={() => handleSortChange('notificationDate')}>Ngày tạo</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map((notification, index) => (
                <tr key={index}>
                  <td>{notification?.title}</td>
                  <td>{notification?.type}</td>
                  <td>{notification?.content}</td>
                  <td>{notification?.notificationDate}</td>
                  <td>
                    <button 
                      className="btn btn-sm btn-outline" 
                      onClick={() => openDetailModal(notification)}
                    >
                      Chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Phân trang */}
          <div className="join flex justify-center mt-4">
            {[...Array(totalPages)].map((_, index) => (
              <input
                key={index}
                className="join-item btn btn-square"
                type="radio"
                name="options"
                aria-label={`Trang ${index + 1}`}
                checked={currentPage === index}
                onChange={() => handlePageChange(index)} // Chuyển sang trang được chọn
              />
            ))}
          </div>
        </>
      )}

      {/* Sử dụng component modal tạo thông báo */}
      <NotificationModal showModal={showModal} closeModal={closeModal} />
      
      {/* Sử dụng component modal chi tiết thông báo */}
      {showDetailModal && (
        <DetailModal 
          showModal={showDetailModal} 
          closeModal={closeDetailModal} 
          notification={notificationDetails} 
        />
      )}
    </TitleCard>
  );
}

export default Notification;
