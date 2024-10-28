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
  const [loading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [ratingDetails, setRatingDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Modal xóa
  const [selectedRatingID, setSelectedRatingID] = useState(null); // Lưu ratingID cần xóa

  const loadRatings = async () => {
    setIsLoading(true);
    try {
      const params = {
        page,
        size,
        sortDir: 'asc',
      };
      const response = await RatingService.fetchRatings(params);
      setTotalPages(response.data.totalPages);
      const content = response.data.content;
      if (content && Array.isArray(content) && content.length > 0) {
        setRatings(content);
      } else {
        dispatch(showNotification({ message: "Dữ liệu không hợp lệ.", status: 0 }));
        setRatings([]);
      }
    } catch (err) {
      console.error("Error fetching ratings:", err);
      dispatch(showNotification({ message: "Không thể tải danh sách đánh giá", status: 0 }));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRatings();
  }, [page, size, dispatch]);

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
        loadRatings();
      } catch (error) {
        dispatch(showNotification({ message: "Không thể xóa đánh giá.", status: 0 }));
      } finally {
        closeDeleteModal();
      }
    }
  };

  const handlePrevPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) {
      setPage(page + 1);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <TitleCard title="Danh sách đánh giá">
      <table className="table table-xs">
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
                <td>{index + 1 + page * size}</td>
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
        <tfoot>
          <tr>
            <td colSpan="6">
              <div className="join mt-4 flex justify-center w-full">
                <button onClick={handlePrevPage} className="join-item btn btn-sm btn-primary" disabled={page === 0}>
                  Trước
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                  <button key={index} onClick={() => setPage(index)} className={`join-item btn btn-sm btn-primary${page === index ? " btn-active" : ""}`}>
                    {index + 1}
                  </button>
                ))}
                <button onClick={handleNextPage} className="join-item btn btn-sm btn-primary" disabled={page >= totalPages - 1}>
                  Tiếp
                </button>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>

      <RatingModal ratingDetails={ratingDetails} onClose={closeModal} />
      <DeleteRatingModal isModalOpen={isDeleteModalOpen} onConfirm={handleDelete} onCancel={closeDeleteModal} />
    </TitleCard>
  );
}

export default Rating;
