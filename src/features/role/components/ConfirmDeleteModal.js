// ConfirmDeleteModal.js
import React from 'react';

const ConfirmDeleteModal = ({ showModal, closeModal, onConfirm }) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-bold mb-4">Xác nhận xóa</h2>
        <p>Bạn có chắc chắn muốn xóa vai trò này?</p>
        <div className="flex justify-end mt-4">
          <button className="btn mr-2" onClick={closeModal}>
            Hủy
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
