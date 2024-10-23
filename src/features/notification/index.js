import { useState } from 'react';
import TitleCard from "../../components/Cards/TitleCard";
import NotificationModal from './components/AddNotificationModal'; // Nhập component modal mới
import DetailModal from './components/DetailModal'; // Nhập component modal chi tiết

function Notification() {
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [notificationDetails, setNotificationDetails] = useState(null);

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

  const notifications = [
    {
      title: 'Thông báo 1',
      type: 'Loại 1',
      content: 'Nội dung thông báo 1',
      date: '2024-10-23',
      recipients: ['Nguyễn Văn A', 'Trần Thị B'],
    },
    {
      title: 'Thông báo 2',
      type: 'Loại 2',
      content: 'Nội dung thông báo 2',
      date: '2024-10-22',
      recipients: ['Lý Tính Nhiệm'],
    },
    // Thêm thông báo khác nếu cần...
  ];

  return (
    <TitleCard title="Thông báo" topMargin="mt-2">
      {/* Nút mở modal tạo thông báo */}
      <div className="flex justify-end mb-4">
        <button className="btn btn-primary" onClick={openModal}>
          Tạo thông báo
        </button>
      </div>

      {/* Thanh lọc - tìm kiếm - sắp xếp */}
      <div className="mb-4 p-4 bg-gray-100 rounded-lg flex gap-4">
        <input type="text" className="input input-bordered w-full" placeholder="Tìm kiếm thông báo..." />
        <select className="select select-bordered">
          <option value="latest">Mới nhất</option>
          <option value="oldest">Cũ nhất</option>
          <option value="unread">Chưa đọc</option>
        </select>
        <button className="btn btn-outline">Lọc</button>
      </div>

      {/* Bảng hiển thị danh sách thông báo */}
      <table className="table w-full">
        <thead>
          <tr>
            <th>Tiêu đề</th>
            <th>Loại</th>
            <th>Nội dung</th>
            <th>Ngày tạo</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {notifications.map((notification, index) => (
            <tr key={index}>
              <td>{notification.title}</td>
              <td>{notification.type}</td>
              <td>{notification.content}</td>
              <td>{notification.date}</td>
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
