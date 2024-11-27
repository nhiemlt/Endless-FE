import React from "react";

function ConfirmCancelModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-4 w-10/12 sm:w-2/3 md:w-1/3 max-w-md">
        <h2 className="text-lg font-bold mb-3">
          Xác nhận hủy đơn hàng
        </h2>
        <p className="mb-3 text-sm text-center">
          Bạn có chắc chắn muốn hủy đơn hàng này không?
        </p>
        <div className="flex justify-end gap-3">
          <button
            className="btn btn-error px-4 py-2 text-sm"
            onClick={onConfirm}
          >
            Xác nhận
          </button>
          <button className="btn px-4 py-2 text-sm" onClick={onClose}>
            Thoát
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmCancelModal;
