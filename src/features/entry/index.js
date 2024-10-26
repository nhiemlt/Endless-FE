import { useState, useEffect } from 'react';
import TitleCard from '../../components/Cards/TitleCard';
import EntryService from '../../services/EntryService';

function Entry() {
  const [entries, setEntries] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const entriesPerPage = 10;
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchEntries = async (page = 0) => {
    try {
      const pageable = { page, size: entriesPerPage };
      const response = await EntryService.getAllEntryOrders(startDate, endDate, pageable);
      setEntries(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Failed to fetch entries:", error);
    }
  };

  useEffect(() => {
    fetchEntries(currentPage);
  }, [currentPage, startDate, endDate]);

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) setCurrentPage(page);
  };

  const handlePrevPage = () => handlePageChange(currentPage - 1);
  const handleNextPage = () => handlePageChange(currentPage + 1);

  return (
    <>
      <TitleCard title="Nhập hàng" topMargin="mt-2">
        <div className="flex justify-between mb-5">
          <div className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <label htmlFor="startDate" className="text-sm font-medium">Từ ngày:</label>
              <input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setCurrentPage(0); // Reset về trang đầu khi thay đổi bộ lọc
                }}
                className="input input-bordered w-full md:w-40 h-8"
              />
            </div>
            <div className="flex items-center space-x-2">
              <label htmlFor="endDate" className="text-sm font-medium">Đến ngày:</label>
              <input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setCurrentPage(0);
                }}
                className="input input-bordered w-full md:w-40 h-8"
              />
            </div>
          </div>
          <button className="btn btn-primary btn-sm btn-outline">Tạo nhập hàng</button>
        </div>

        <table className="table w-full table-xs">
          <thead>
            <tr>
              <th>Entry ID</th>
              <th>Entry Date</th>
              <th>Total Money</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {entries.length > 0 ? (
              entries.map((entry) => (
                <tr key={entry.entryID}>
                  <td>{entry.entryID}</td>
                  <td>{entry.entryDate}</td>
                  <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(entry.totalMoney)}</td>
                  <td>
                    <button className="btn btn-sm">Xem chi tiết</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">Không có dữ liệu</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="join mt-4 flex justify-center w-full">
          <button onClick={handlePrevPage} className="join-item btn" disabled={currentPage === 0}>
            Trước
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index)}
              className={`join-item btn ${currentPage === index ? 'btn-primary' : ''}`}
            >
              {index + 1}
            </button>
          ))}
          <button onClick={handleNextPage} className="join-item btn" disabled={currentPage === totalPages - 1}>
            Tiếp
          </button>
        </div>
      </TitleCard>
    </>
  );
}

export default Entry;
