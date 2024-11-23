// components/ConfirmDialog.js
import React from 'react';

const ConfirmDialog = ({ message, onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-5 rounded shadow-lg">
                <h2 className="text-lg font-bold">{message}</h2>
                <div className="flex justify-end space-x-2 mt-4">
                    <button className="btn btn-outline" onClick={onCancel}>Hủy</button>
                    <button className="btn btn-error" onClick={onConfirm}>Xóa</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
