import React from 'react';

function DetailModal({ showModal, closeModal, notification }) {
  if (!notification) return null;

  return (
    <>
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Chi tiết thông báo</h3>
            <div className="mb-4">
              <h4 className="font-semibold">Tiêu đề: {notification.title}</h4>
              <p><strong>Loại:</strong> {notification.type}</p>
              <p><strong>Nội dung:</strong> {notification.content}</p>
              <p><strong>Ngày tạo:</strong> {notification.date}</p>
              <h5 className="font-semibold">Danh sách người nhận:</h5>
              <ul>
                {notification.recipients.map((recipient, index) => (
                  <li key={index}>{recipient}</li>
                ))}
              </ul>
            </div>
            <div className="modal-action">
              <button className="btn" onClick={closeModal}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DetailModal;
