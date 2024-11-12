// components/DetailsModal.js
import React from 'react';

const DetailsModal = ({ version, onClose }) => {
    if (!version) return null; // Nếu chưa chọn sản phẩm nào thì không hiển thị modal

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">Chi tiết sản phẩm</h2>
                <div className="space-y-3 text-gray-700">
                    <p><strong>Trọng lượng:</strong> {version.weight} kg</p>
                    <p><strong>Chiều cao:</strong> {version.height} cm</p>
                    <p><strong>Chiều dài:</strong> {version.length} cm</p>
                    <p><strong>Chiều rộng:</strong> {version.width} cm</p>
                </div>
                <div className="flex justify-end mt-6">
                    <button className="btn btn-outline btn-primary px-6 py-2" onClick={onClose}>Đóng</button>
                </div>
            </div>
        </div>
    );
};

export default DetailsModal;
