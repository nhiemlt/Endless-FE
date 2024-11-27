import React from "react";

function ConfirmDialogStatus({ isOpen, onClose, onConfirm, message }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-5 rounded shadow-lg">
                <h2 className="text-lg font-bold text-center">{message}</h2>
                <div className="flex justify-end space-x-2 mt-4">
                    <button
                        className="btn btn-outline"
                        onClick={onClose}
                    >
                        Hủy
                    </button>
                    <button
                        className="btn btn-error"
                        onClick={onConfirm}
                    >
                        Xác nhận
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmDialogStatus;
