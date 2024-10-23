import { useState } from 'react';
import UserSelectionModal from './UserSelectionModal'; // Nhập component modal chọn người dùng

function AddNotificationModal({ showModal, closeModal }) {
  const [isUserSpecific, setIsUserSpecific] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);

  const handleSendNotification = () => {
    if (isUserSpecific) {
      setShowUserModal(true);
    } else {
      // Gửi thông báo đến tất cả mọi người
      // Xử lý gửi thông báo
      closeModal();
    }
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
                <input type="text" className="input input-bordered" />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Nội dung</span>
                </label>
                <textarea className="textarea textarea-bordered" />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Gửi đến</span>
                </label>
                <div className="flex gap-4">
                  <button type="button" className={`btn ${!isUserSpecific ? 'btn-primary' : 'btn-outline'}`} onClick={() => setIsUserSpecific(false)}>
                    Tất cả
                  </button>
                  <button type="button" className={`btn ${isUserSpecific ? 'btn-primary' : 'btn-outline'}`} onClick={() => setIsUserSpecific(true)}>
                    Người dùng cụ thể
                  </button>
                </div>
              </div>
              <div className="modal-action">
                <button type="button" className="btn btn-primary" onClick={handleSendNotification}>Gửi</button>
                <button type="button" className="btn" onClick={closeModal}>Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showUserModal && <UserSelectionModal showModal={showUserModal} closeModal={() => setShowUserModal(false)} />}
    </>
  );
}

export default AddNotificationModal;
