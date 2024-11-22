import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import TitleCard from "../../components/Cards/TitleCard";
import RatingService from '../../services/ratingService';
import { showNotification } from '.././common/headerSlice';
import RatingModal from './components/ratingModel';
import EyeIcon from '@heroicons/react/24/solid/EyeIcon';
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import DeleteRatingModal from './components/DeleteRatingModal';

function Rating() {
  const dispatch = useDispatch();
  const [ratings, setRatings] = useState([]);
  const [loading, setIsLoading] = useState(false);
  const [allRatings, setAllRatings] = useState([]); // To store all fetched ratings
  const [keyword, setKeyword] = useState('');
  const [ratingValue, setRatingValue] = useState(null);
  const [currentPage, setCurrentPage] = useState(0); // Chuyển sang index-based
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [ratingDetails, setRatingDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRatingID, setSelectedRatingID] = useState(null);

 // Hàm gọi API để lấy dữ liệu đánh giá
 const fetchRatings = async () => {
  try {
    const response = await RatingService.fetchRatings({
      keyword,
      ratingValue,
      page: currentPage,  // Sử dụng currentPage như index (0-based)
      size,
    });

    setAllRatings(response.data.content || []);
    setTotalPages(response.data.totalPages || 1);
  } catch (error) {
    console.error('Error fetching ratings:', error);
    dispatch(showNotification({ message: 'Không thể tải danh sách đánh giá', status: 0 }));
  }
};

// Hàm xử lý tìm kiếm
const handleSearch = (value) => {
  setKeyword(value);
  setCurrentPage(0); // Reset to first page on search
};

// Hàm xử lý lọc theo giá trị rating
const handleRatingValueChange = (e) => {
  setRatingValue(e.target.value ? parseInt(e.target.value) : null);
  setCurrentPage(0); // Reset to first page on filter change
};

// Lọc và phân trang dữ liệu
const filteredAndPaginatedRatings = () => {
  // Lọc đánh giá từ allRatings
  const filteredRatings = allRatings.filter((rating) => {
    const matchesKeyword =
      !keyword ||
      rating.fullname.toLowerCase().includes(keyword.toLowerCase()) ||
      rating.versionName.toLowerCase().includes(keyword.toLowerCase());
    const matchesRatingValue = !ratingValue || rating.ratingValue === ratingValue;
    return matchesKeyword && matchesRatingValue;
  });

  // Phân trang dữ liệu đã lọc
  return filteredRatings.slice(currentPage * size, (currentPage + 1) * size);
};

// useEffect để gọi API khi keyword, ratingValue, page hoặc size thay đổi
useEffect(() => {
  fetchRatings();
}, [keyword, ratingValue, currentPage, size]);

// Lấy dữ liệu phân trang và lọc
const paginatedRatings = filteredAndPaginatedRatings();

// Hàm xử lý chuyển trang trước
const handlePrevPage = () => {
  if (currentPage > 0) {
    setCurrentPage(currentPage - 1);
  }
};

// Hàm xử lý chuyển trang tiếp
const handleNextPage = () => {
  if (currentPage < totalPages - 1) {
    setCurrentPage(currentPage + 1);
  }
};

  // // Hàm xử lý lọc theo giá trị rating
  // const handleRatingValueChange = (e) => {
  //   setRatingValue(e.target.value ? parseInt(e.target.value) : null);
  //   setPage(1); // Reset to page 1 on filter change
  // };


  const fetchRatingDetails = async (ratingID) => {
    try {
      const response = await RatingService.getRatingById2(ratingID);
      setRatingDetails(response.data);
    } catch (error) {
      console.error("Error fetching rating details:", error);
    }
  };

  const openModal = (ratingID) => {
    fetchRatingDetails(ratingID);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setRatingDetails(null);
  };

  const openDeleteModal = (ratingID) => {
    setSelectedRatingID(ratingID);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedRatingID(null);
  };

  const handleDelete = async () => {
    if (selectedRatingID) {
      try {
        await RatingService.deleteRating(selectedRatingID);
        dispatch(showNotification({ message: "Xóa đánh giá thành công.", status: 1 }));
        fetchRatings();
      } catch (error) {
        dispatch(showNotification({ message: "Không thể xóa đánh giá.", status: 0 }));
      } finally {
        closeDeleteModal();
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <TitleCard title="Danh sách đánh giá">
      <div>
        {/* Thanh tìm kiếm */}
        <div className="flex mb-4">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={keyword}
            onChange={(e) => handleSearch(e.target.value)}
            className="input input-bordered w-80 h-10"
          />
          {/* <select
          value={ratingValue || ''}
          onChange={handleRatingValueChange}
          className="select select-bordered ml-2 h-10"
        >
          <option value="">Sắp xếp theo đánh giá</option>
          <option value="1">1 sao</option>
          <option value="2">2 sao</option>
          <option value="3">3 sao</option>
          <option value="4">4 sao</option>
          <option value="5">5 sao</option>
        </select> */}
        </div>

        {/* Bảng hiển thị danh sách đánh giá */}
        <table className="table table-xs mt-2">
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên khách hàng</th>
              <th>Hình ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Đánh giá</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRatings.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">Không có đánh giá nào.</td>
              </tr>
            ) : (
              paginatedRatings.map((rating, index) => (
                <tr key={rating.ratingID}>
                  <td>{index + 1 + currentPage * size}</td>
                  <td>{rating.fullname}</td>
                  <td>
                    <img src={rating.image} alt="Hình ảnh khách hàng" className="w-10 h-10 object-cover" />
                  </td>
                  <td>{rating.versionName}</td>
                  <td>
                    <div className="rating rating-sm">
                      {[...Array(5)].map((_, starIndex) => (
                        <input
                          key={starIndex}
                          type="radio"
                          name={`rating-${rating.ratingID}`}
                          className="mask mask-star-2 bg-orange-400"
                          defaultChecked={starIndex < rating.ratingValue}
                          disabled
                        />
                      ))}
                    </div>
                  </td>
                  <td className="flex items-center space-x-2">
                    <EyeIcon
                      className="w-5 cursor-pointer text-yellow-500"
                      onClick={() => openModal(rating.ratingID)}
                    />
                    <TrashIcon
                      className="w-5 cursor-pointer text-red-500"
                      onClick={() => openDeleteModal(rating.ratingID)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Phân trang */}
      <div className="join mt-4 flex justify-center w-full">
        <button onClick={handlePrevPage} className="join-item btn btn-sm btn-primary" disabled={currentPage === 0}>
          Trước
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index)}
            className={`join-item btn btn-sm btn-primary ${currentPage === index ? 'btn-active' : ''}`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={handleNextPage}
          className="join-item btn btn-sm btn-primary"
          disabled={currentPage >= totalPages - 1}
        >
          Tiếp
        </button>
      </div>
    </div>

      <RatingModal ratingDetails={ratingDetails} onClose={closeModal} />
      <DeleteRatingModal isModalOpen={isDeleteModalOpen} onConfirm={handleDelete} onCancel={closeDeleteModal} />
    </TitleCard>
  );
}

export default Rating;
