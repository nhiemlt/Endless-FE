import React, { useEffect } from 'react';

function RatingModal({ ratingDetails, onClose }) {
  // Sử dụng useEffect để kiểm soát modal hiển thị
  useEffect(() => {
    const modal = document.getElementById("ratingModal");
    if (modal) {
      if (ratingDetails) {
        modal.showModal(); // Hiển thị modal nếu có ratingDetails
      } else {
        modal.close(); // Đóng modal nếu không có ratingDetails
      }
    }
  }, [ratingDetails]); // Chạy lại khi ratingDetails thay đổi

  return (
    <dialog id="ratingModal" className="modal">
      <div className="modal-box flex flex-col items-center">
        <h3 className="text-lg font-bold mb-4">Chi tiết đánh giá</h3>
        {/* Hiển thị ảnh khách hàng và thông tin */}
        {ratingDetails && (
          <div className="flex items-center mb-4">
            <div className="avatar">
              <div className="ring-primary ring-offset-base-100 w-16 h-16 rounded-full mr-4 ring ring-offset-2">
                <img src={ratingDetails.avatar} alt={ratingDetails.fullname} />
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm">{new Date(ratingDetails.ratingDate).toLocaleDateString()}</p>
            </div>
          </div>
        )}
        <div className="flex flex-wrap justify-start">
          {ratingDetails && ratingDetails.pictures.map((picture, index) => (
            <img key={index} src={picture} alt={`Rating picture ${index}`} className="w-16 h-16 rounded mr-2" />
          ))}
        </div>
        {/* Hiển thị đánh giá */}
        <div className="rating rating-sm mb-4">
          {ratingDetails && (
            <>
              {[...Array(ratingDetails.ratingValue)].map((_, index) => (
                <span key={index} className="text-yellow-500">★</span>
              ))}
              {[...Array(5 - ratingDetails.ratingValue)].map((_, index) => (
                <span key={index} className="text-gray-300">★</span>
              ))}
            </>
          )}
        </div>
        {/* Hiển thị nội dung đánh giá */}
        <p className="py-4 text-center">{ratingDetails ? ratingDetails.comment : ''}</p>
        {/* Nút đóng modal */}
        <div className="modal-action flex justify-end w-full">
          <button className="btn" onClick={onClose}>Đóng</button>
        </div>
      </div>
    </dialog>
  );
}

export default RatingModal;
