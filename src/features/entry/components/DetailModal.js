import React, { useState } from 'react';

function DetailModal({ showModal, closeModal, entry }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const recipientsPerPage = 5; // Số lượng sản phẩm trên mỗi trang
  const maxPageButtons = 5; // Giới hạn số nút phân trang hiển thị

  if (!entry) return null;

  console.log(entry)
  // Lọc sản phẩm dựa trên tìm kiếm
  const filteredDetails = entry.details.filter((detail) =>
    detail.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    detail.productVersionName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  

  // Tính toán số lượng trang
  const totalPages = Math.ceil(filteredDetails.length / recipientsPerPage);

  // Lấy dữ liệu của trang hiện tại
  const currentDetails = filteredDetails.slice(
    (currentPage - 1) * recipientsPerPage,
    currentPage * recipientsPerPage
  );

  // Tạo danh sách các trang cần hiển thị
  const getPaginationButtons = () => {
    let startPage = Math.max(currentPage - Math.floor(maxPageButtons / 2), 1);
    let endPage = Math.min(startPage + maxPageButtons - 1, totalPages);

    // Điều chỉnh lại startPage nếu endPage ở cuối danh sách
    if (endPage - startPage + 1 < maxPageButtons) {
      startPage = Math.max(endPage - maxPageButtons + 1, 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  // Chuyển trang
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-4xl mx-auto p-6"> {/* Điều chỉnh kích thước modal */}
            <h3 className="font-bold text-lg mb-4">Chi tiết đơn nhập hàng</h3>
            <div className="mb-4">
              <p><strong>Entry ID:</strong> {entry.entryID}</p>
              <p><strong>Ngày nhập:</strong> {new Date(entry.entryDate).toLocaleDateString('vi-VN')}</p>
              <p>
                <strong>Tổng tiền:</strong>
                <span className="font-normal">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(entry.totalMoney)}
                </span>
              </p>
            </div>

            <div className="flex justify-between items-center mb-4">
              <h5 className="font-semibold text-md">Danh sách sản phẩm:</h5>
              <label className="input input-bordered flex items-center gap-2 w-50 max-w-xs">
                <input
                  type="text"
                  placeholder="Tìm sản phẩm"
                  className="grow"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </label>
            </div>

            <table className="table w-full mt-2">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2">Hình ảnh</th>
                  <th className="px-4 py-2">Tên sản phẩm</th>
                  <th className="px-4 py-2">Phiên bản</th>
                  <th className="px-4 py-2">Số lượng</th>
                  <th className="px-4 py-2">Giá</th>
                  <th className="px-4 py-2">Tổng</th>
                </tr>
              </thead>
              <tbody>
                {currentDetails.map((detail) => (
                  <tr key={detail.purchaseOrderDetailID} className="hover:bg-gray-100">
                    <td className="px-4 py-2">
                      <img src={detail.productVersionImage} alt={detail.productName} className="w-16 h-16 mr-2 object-cover" /> {/* Thay đổi kích thước hình ảnh */}
                    </td>
                    <td className="px-4 py-2">{detail.productName}</td>
                    <td className="px-4 py-2">{detail.productVersionName}</td>
                    <td className="px-4 py-2">{detail.quantity}</td>
                    <td className="px-4 py-2">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(detail.price)}
                    </td>
                    <td className="px-4 py-2">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(detail.quantity * detail.price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Phân trang với điều kiện */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-4">
                <button
                  className="btn"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Trước
                </button>

                {getPaginationButtons().map((page) => (
                  <button
                    key={page}
                    className={`btn ${currentPage === page ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ))}

                <button
                  className="btn"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Tiếp
                </button>
              </div>
            )}

            <div className="modal-action mt-4">
              <button className="btn" onClick={closeModal}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DetailModal;