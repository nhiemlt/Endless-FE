import React, { useEffect } from 'react';

function DeleteRatingModal({ isModalOpen, onConfirm, onCancel }) {
  useEffect(() => {
    const modal = document.getElementById("deleteConfirmModal");
    if (modal) {
      if (isModalOpen) {
        modal.showModal(); // Hiển thị modal nếu isOpen là true
      } else {
        modal.close(); // Đóng modal nếu isOpen là false
      }
    }
  }, [isModalOpen]); // Chạy lại khi isOpen thay đổi

  return (
    <dialog id="deleteConfirmModal" className="modal">
      <div className="modal-box flex flex-col items-center">
        <h3 className="text-lg font-bold mb-4">Xác nhận xóa</h3>
        <p className="py-4 text-center">Bạn có chắc chắn muốn xóa đánh giá này không?</p>
        <div className="modal-action flex justify-end w-full">
          <button className="btn btn-error" onClick={onConfirm}>Xóa</button>
          <button className="btn" onClick={onCancel}>Hủy</button>
        </div>
      </div>
    </dialog>
  );
}

export default DeleteRatingModal;
