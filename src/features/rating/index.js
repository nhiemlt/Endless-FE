import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import TitleCard from "../../components/Cards/TitleCard";
import RatingService from '../../services/ratingService';
import { showNotification } from '.././common/headerSlice';
import RatingModal from './components/ratingModel';
import EyeIcon from '@heroicons/react/24/solid/EyeIcon';
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import DeleteRatingModal from './components/DeleteRatingModal';
import PolarAreaChart from '../dashboard/components/PolarArea';
import RatingAll from './components/ratingAll';

function Rating() {
  const dispatch = useDispatch();
  const [ratings, setRatings] = useState([]);
  const [loading, setIsLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [ratingValue, setRatingValue] = useState(null);
  const [currentPage, setCurrentPage] = useState(0); // Chuyển sang index-based
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [ratingDetails, setRatingDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRatingID, setSelectedRatingID] = useState(null);
  const [month, setMonth] = useState(0);
  const [year, setYear] = useState(0);
  const [ratingsByStars, setRatingsByStars] = useState([0, 0, 0, 0, 0]); // Lượt đánh giá từ 1-5 sao



  // Hàm gọi API để lấy dữ liệu đánh giá
  const fetchRatings = async () => {
    try {
      const response = await RatingService.fetchRatings({
        keyword,
        ratingValue,
        month: month !== 0 ? month : undefined,
        year: year !== 0 ? year : undefined,
        page: currentPage,
        size,
      });

      setRatings(response.content || []);
      setTotalPages(response.totalPages);

      // Tính toán lượt đánh giá theo số sao (1-5)
      const starsCount = [0, 0, 0, 0, 0];
      response.content.forEach((rating) => {
        if (rating.ratingValue >= 1 && rating.ratingValue <= 5) {
          starsCount[rating.ratingValue - 1]++;
        }
      });
      setRatingsByStars(starsCount); // Cập nhật state
    } catch (error) {
      console.error('Error fetching ratings:', error);
    }
  };

  // useEffect để gọi fetchRatings mỗi khi month hoặc year thay đổi
  useEffect(() => {
    fetchRatings();
  }, [month, year, currentPage, size, keyword, ratingValue]);


  // Hàm xử lý tìm kiếm
  const handleSearch = (value) => {
    setKeyword(value);
    setCurrentPage(0); // Reset to first page on search
  };

  const handleRatingValueChange = (event) => {
    const newRatingValue = event.target.value === '' ? null : parseInt(event.target.value); // Nếu không chọn thì gán null
    setRatingValue(newRatingValue); // Cập nhật giá trị ratingValue trong state
    setCurrentPage(0); // Đặt lại trang về đầu khi thay đổi giá trị sắp xếp

    // Gọi lại hàm fetchRatings để lấy dữ liệu mới với ratingValue đã thay đổi
    fetchRatings(newRatingValue);
  };

  useEffect(() => {
    if (ratingValue !== null) {
      fetchRatings(); // Gọi lại fetchRatings chỉ khi ratingValue thay đổi
    }
  }, [ratingValue]);

  const handleFilter = () => {
    fetchRatings(); // Gọi lại hàm fetchRatings khi người dùng chọn tháng hoặc năm
  };

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
      <div className="flex flex-col sm:flex-row gap-6 items-start justify-between">
        {/* Biểu đồ Polar Area */}
        <div className="flex-1">
          <PolarAreaChart ratingsByStars={ratingsByStars} />
        </div>

        {/* Component Rating All */}
        <div className="flex-1 sm:mt-32">
          <RatingAll />
        </div>
      </div>

      <div>
        {/* Thanh tìm kiếm */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-center mb-4 mt-12 gap-4">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={keyword}
            onChange={(e) => handleSearch(e.target.value)}
            className="input input-bordered w-full h-10"
          />

          <select
            value={ratingValue || ''}
            onChange={handleRatingValueChange}
            className="select select-bordered h-10 w-full"
          >
            <option value="">Sắp xếp theo đánh giá</option>
            <option value="1">1 sao</option>
            <option value="2">2 sao</option>
            <option value="3">3 sao</option>
            <option value="4">4 sao</option>
            <option value="5">5 sao</option>
          </select>

          {/* Select for month */}
          <select
            value={month}
            onChange={(e) => setMonth(parseInt(e.target.value))}
            className="select select-bordered h-10 w-full"
          >
            <option value="0">Tất cả tháng</option>
            {Array.from({ length: 12 }, (_, index) => (
              <option key={index + 1} value={index + 1}>
                Tháng {index + 1}
              </option>
            ))}
          </select>

          {/* Select for year */}
          <select
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            className="select select-bordered h-10 w-full"
          >
            <option value="0">Tất cả năm</option>
            {Array.from({ length: 5 }, (_, index) => {
              const currentYear = new Date().getFullYear();
              return (
                <option key={index} value={currentYear - index}>
                  Năm {currentYear - index}
                </option>
              );
            })}
          </select>
        </div>

        {/* Bảng hiển thị danh sách đánh giá */}
        <table className="table table-xs mt-2 w-full">
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
            {ratings.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">Không có đánh giá nào.</td>
              </tr>
            ) : (
              ratings.map((rating, index) => (
                <tr key={rating.ratingID}>
                  <td>{index + 1 + currentPage * size}</td>
                  <td>{rating.fullname}</td>
                  <td>
                    <img src={rating.image} className="w-10 h-10 object-cover" />
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
                      title="Xem chi tiết"
                    />
                    <TrashIcon
                      className="w-5 cursor-pointer text-red-500"
                      onClick={() => openDeleteModal(rating.ratingID)}
                      title="Xóa"
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
