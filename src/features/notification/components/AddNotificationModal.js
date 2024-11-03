import { useState } from 'react';
import UserSelectionModal from './UserSelectionModal';
import NotificationService from '../../../services/NotificationService';
import { showNotification } from "../../common/headerSlice";
import { useDispatch } from "react-redux";

function AddNotificationModal({ showModal, closeModal, onNotificationSent }) {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showUserSelectionModal, setShowUserSelectionModal] = useState(false); // Thêm state để điều khiển UserSelectionModal

  const resetData = () => {
    setTitle('');
    setContent('');
  };

  // Hàm validate form
  const validateForm = () => {
    if (!title.trim() || !content.trim()) {
      dispatch(showNotification({ message: 'Vui lòng nhập đầy đủ tiêu đề và nội dung thông báo.', status: 0 }));
      return false;
    }
    return true;
  };

  const handleSendNotification = async () => {
    if (!validateForm()) return; // Kiểm tra form trước khi gửi
    try {
      await NotificationService.sendNotificationForAll({
        title,
        content,
        type: 'All',
      });
      dispatch(showNotification({ message: 'Thông báo đã được gửi thành công!', status: 1 }));
      onNotificationSent();
      handleCloseModal();
    } catch (error) {
      console.error("Lỗi khi gửi thông báo:", error);
      dispatch(showNotification({ message: 'Đã xảy ra lỗi khi gửi thông báo.', type: 'error' }));
    }
  };

  const handleOpenUserSelectionModal = () => {
    if (!validateForm()) return; // Kiểm tra form trước khi mở modal chọn người dùng
    setShowUserSelectionModal(true);
  };

  const handleCloseUserSelectionModal = () => {
    setShowUserSelectionModal(false);
  };

  const handleCloseModal = () => {
    resetData();
    closeModal();
  };

  return (
    <>
{showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg flex justify-between items-center">
              Tạo thông báo mới
              <button 
                className="btn btn-sm btn-circle btn-ghost" 
                onClick={handleCloseModal}
              >
                &times; {/* Dấu X */}
              </button>
            </h3>
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
                  placeholder="Nhập tiêu đề..."
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
                  placeholder="Nhập nội dung..."
                />
              </div>
              <div className="modal-action">
                <button type="button" className="btn btn-primary" onClick={handleSendNotification}>
                  Gửi tất cả
                </button>
                <button type="button" className="btn btn-success" onClick={handleOpenUserSelectionModal}>
                  Gửi riêng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showUserSelectionModal && (
        <UserSelectionModal 
          showModal={showUserSelectionModal} 
          closeModal={handleCloseUserSelectionModal} 
          title={title}
          content={content}
          close={handleCloseModal}
        />
      )}
    </>
  );
}

export default AddNotificationModal;
