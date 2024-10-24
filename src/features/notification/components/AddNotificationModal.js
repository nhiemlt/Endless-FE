import { useState } from 'react';
import UserSelectionModal from './UserSelectionModal'; // Nhập component modal chọn người dùng
import NotificationService from '../../../services/notificationService'; // Nhập NotificationService
import { showNotification } from "../../common/headerSlice";
import { useDispatch } from "react-redux";

function AddNotificationModal({ showModal, closeModal, onNotificationSent }) {
  const dispatch = useDispatch();
  const [isUserSpecific, setIsUserSpecific] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  const resetData = () => {
    setIsUserSpecific(false);
    setShowUserModal(false);
    setTitle(''); // Xóa nội dung tiêu đề
    setContent(''); // Xóa nội dung thông báo
    setSelectedUserIds([]); // Reset danh sách người dùng
  };

  const handleSendNotification = async () => {
    const notificationModel = {
      title,
      content,
      userIds: isUserSpecific ? selectedUserIds : [],
    };

    try {
      if (isUserSpecific) {
        await NotificationService.sendNotification(notificationModel);
      } else {
        await NotificationService.sendNotificationForAll({
          title,
          content,
          type: 'All',
        });
      }
      dispatch(showNotification({ message: 'Thông báo đã được gửi thành công!', status: 1 }));
      onNotificationSent(); // Gọi callback để tải lại dữ liệu thông báo
      handleCloseModal(); // Đóng modal sau khi gửi thông báo
    } catch (error) {
      console.error("Lỗi khi gửi thông báo:", error);
      dispatch(showNotification({ message: 'Đã xảy ra lỗi khi gửi thông báo.', type: 'error' }));
    }
  };

  const handleUserSelection = (userIds) => {
    setSelectedUserIds(userIds); // Lưu danh sách ID người dùng được chọn
    setShowUserModal(false); // Đóng modal chọn người dùng
  };

  const handleSelectUsers = () => {
    setShowUserModal(true); // Hiển thị modal chọn người dùng
  };

  const handleCloseModal = () => {
    resetData(); // Reset dữ liệu trước khi đóng modal
    closeModal();
  };

  return (
    <>
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Tạo thông báo mới</h3>
            <form>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Tiêu đề</span>
                </label>
                <input 
                  type="text" 
                  className="input input-bordered" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="Nhập tiêu đề..." // Thêm placeholder để chỉ rõ vị trí nhập
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Nội dung</span>
                </label>
                <textarea 
                  className="textarea textarea-bordered" 
                  value={content} 
                  onChange={(e) => setContent(e.target.value)} 
                  placeholder="Nhập nội dung..." // Thêm placeholder để chỉ rõ vị trí nhập
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Gửi đến</span>
                </label>
                <div className="flex gap-4">
                  <button 
                    type="button" 
                    className={`btn ${!isUserSpecific ? 'btn-primary' : 'btn-outline'}`} 
                    onClick={() => {
                      setIsUserSpecific(false);
                      setSelectedUserIds([]); // Reset danh sách người dùng khi chọn "Tất cả"
                    }}
                  >
                    Tất cả
                  </button>
                  <button 
                    type="button" 
                    className={`btn ${isUserSpecific ? 'btn-primary' : 'btn-outline'}`} 
                    onClick={handleSelectUsers} // Hiển thị modal chọn người dùng
                  >
                    Người dùng cụ thể
                  </button>
                </div>
              </div>
              <div className="modal-action">
                <button type="button" className="btn btn-primary" onClick={handleSendNotification}>
                  Gửi
                </button>
                <button type="button" className="btn" onClick={handleCloseModal}>
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showUserModal && (
        <UserSelectionModal 
          showModal={showUserModal} 
          closeModal={() => setShowUserModal(false)} 
          onUserSelect={handleUserSelection} // Truyền hàm chọn người dùng
        />
      )}
    </>
  );
}

export default AddNotificationModal;
