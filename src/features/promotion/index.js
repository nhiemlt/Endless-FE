import { useState, useEffect } from 'react';
import moment from 'moment'; // Đảm bảo đã import moment.js
import TitleCard from '../../components/Cards/TitleCard';
import { showNotification } from '../common/headerSlice';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import EyeIcon from '@heroicons/react/24/outline/EyeIcon';
import PromotionService from '../../services/PromotionService';  // Sử dụng PromotionService
import { useDispatch } from 'react-redux';
// import ProductDetailsModal from './components/ProductDetailsModal';  // Import ConfirmDialog
import AddPromotionModal from './components/AddPromotionModal';  // Modal thêm Promotion
import EditPromotionModal from './components/EditPromotionModal';  // Modal cập nhật Promotion

// import ConfirmDialogStatus from './components/ConfirmDialogStatus';  // Import ConfirmDialog

function PromotionList() {
  const [isPromotionModalOpen, setIsPromotionModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('promotions');
  const [promotionDetails, setPromotionDetails] = useState([]);
  const [promotionProducts, setPromotionProducts] = useState([]);
  const [loading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const dispatch = useDispatch();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [promotionToDelete, setPromotionToDelete] = useState(null);
  // Khai báo state cho promotions và setEditPromotion
  const [promotions, setPromotions] = useState([]);
  const [editPromotion, setEditPromotion] = useState(null);

  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [selectedPromotionForToggle, setSelectedPromotionForToggle] = useState(null);
  const openConfirmDialog = (promotion) => {
    setSelectedPromotionForToggle(promotion);
    setIsConfirmDialogOpen(true);
  };
  const handleConfirmToggle = async () => {
    if (!selectedPromotionForToggle) return;

    try {
      await toggleActiveStatus(selectedPromotionForToggle.promotionID, selectedPromotionForToggle.active);
      dispatch(showNotification({ message: "Cập nhật trạng thái thành công", type: "success" }));
    } catch (error) {
      dispatch(showNotification({ message: "Lỗi khi cập nhật trạng thái", type: "error" }));
    } finally {
      setIsConfirmDialogOpen(false);
      setSelectedPromotionForToggle(null);
    }
  };


  console.log('Edit Promotion:', editPromotion); // Kiểm tra giá trị promotion khi mở modal
  // console.log("Promotion ID trong component cha:", promotionID);

  console.log(promotions);
  // Hàm tải khuyến mãi
  const loadPromotions = async () => {
    setIsLoading(true); // Hiển thị trạng thái đang tải
    try {
      // Gọi hàm getAllPromotions từ PromotionService
      const response = await PromotionService.getAllPromotions(
        { keyword: searchKeyword }, // Bộ lọc tìm kiếm
        currentPage, // Trang hiện tại
        size, // Số lượng bản ghi mỗi trang
        'createDate', // Tiêu chí sắp xếp
        'desc' // Hướng sắp xếp
      );

      // Cập nhật danh sách và tổng số trang
      setPromotions(response.content); // Nội dung khuyến mãi
      setTotalPages(response.totalPages); // Tổng số trang
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu khuyến mãi:", error);
    } finally {
      setIsLoading(false); // Tắt trạng thái đang tải
    }
  };
  useEffect(() => {
    loadPromotions(); // Tải dữ liệu mỗi khi dependency thay đổi
  }, [searchKeyword, currentPage, size]);




  const openAddPromotionModal = () => {
    setIsAddModalOpen(true);
    setIsEditModalOpen(false);
  };
  const openEditPromotionModal = (promotion) => {
    setEditPromotion(promotion);  // Lưu thông tin promotion vào state
    setIsAddModalOpen(false);     // Đảm bảo modal thêm không mở
    setIsEditModalOpen(true);     // Mở modal chỉnh sửa
  };

  const handleDeleteClick = (promotionID) => {
    setPromotionToDelete(promotionID);  // Lưu ID khuyến mãi cần xóa
    setDialogOpen(true);  // Mở dialog xác nhận
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };
  // Hàm xử lý khi lọc theo ngày
  const handleDateFilter = (endDate) => {
    if (startDate && endDate) {
      loadPromotions();  // Gọi lại loadPromotions để áp dụng bộ lọc
    }
  };
  const toggleActiveStatus = async (promotionID, currentStatus) => {
    try {
      await PromotionService.togglePromotionActive(promotionID);
      loadPromotions(); // Tải lại dữ liệu sau khi thay đổi trạng thái
    } catch (error) {
      console.error("Lỗi khi thay đổi trạng thái:", error);
      dispatch(showNotification({ message: "Thay đổi trạng thái thất bại", type: "error" }));
    }
  };


  const handleOpenModal = (promotion) => {
    setSelectedPromotion(promotion);
    setIsModalOpen(true);  // Cập nhật trạng thái mở modal
  };


  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPromotion(null);
  };


  return (
    <>
      {/* Tabs */}


      {/* Promotions Table */}
      {activeTab === 'promotions' && (
        <TitleCard title="Promotion List">
          <div className="flex flex-col md:flex-row justify-between items-center w-full mb-4">
            <div className="flex justify-start items-center space-x-2 mb-2 mr-2 md:mb-0">
              {/* Search Input */}
              <input
                type="text"
                placeholder="Tìm kiếm khuyến mãi..."
                onChange={(e) => {
                  setSearchKeyword(e.target.value);
                  setCurrentPage(0); // Đặt lại trang về đầu khi tìm kiếm
                }}
                className="input input-bordered w-full md:w-50 h-8"
              />

              {/* Date Range Filters */}
              <div className="flex space-x-2 ml-2">
                <input
                  type="date"
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setCurrentPage(0); // Đặt lại trang về đầu khi thay đổi ngày
                  }}
                  className="input input-bordered w-40 h-8"
                />
                <span className="text-gray-600">-</span>
                <input
                  type="date"
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setCurrentPage(0); // Đặt lại trang về đầu khi thay đổi ngày
                    handleDateFilter(e.target.value); // Gọi hàm lọc ngay khi thay đổi endDate
                  }}
                  className="input input-bordered w-40 h-8"
                />
              </div>
            </div>

            <button className="btn btn-outline btn-sm btn-primary" onClick={openAddPromotionModal}>
              Thêm Khuyến Mãi
            </button>

          </div>

          <div className="overflow-x-auto w-full">
            <table className="table table-xs">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên</th>
                  <th>Ngày bắt đầu</th>
                  <th>Ngày kết thúc</th>
                  <th>Phần trăm</th>
                  <th>Ảnh</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                  <th>Sản phẩm</th>
                  <th className="text-center" colSpan={2}>Action</th>
                </tr>
              </thead>
              <tbody>
                {
                  loading ? (
                    <tr>
                      <td colSpan={10} className="text-center">Đang tải...</td>
                    </tr>
                  ) : promotions.length > 0 ? (
                    promotions.map((promotion, index) => (
                      <tr key={promotion.promotionID}>
                        <td>{currentPage * size + index + 1}</td>
                        <td>{promotion.name}</td>
                        <td>{moment(promotion.startDate).format("DD/MM/YYYY HH:mm")}</td>
                        <td>{moment(promotion.endDate).format("DD/MM/YYYY HH:mm")}</td>

                        <td>{promotion.percentDiscount}%</td>
                        <td className="text-center">
                          <img src={promotion.poster} alt="Poster" className="w-30 h-10" />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            className="toggle toggle-primary"
                            checked={promotion.active}
                            onChange={() => openConfirmDialog(promotion)}
                          />

                        </td>

                        <td>{moment(promotion.createDate).format("DD/MM/YYYY")}</td>
                        <td>
                          <button
                            className="text-blue-600 hover:underline"
                            onClick={() => handleOpenModal(promotion)}
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                        </td>


                        <td className="text-center">
                          <PencilIcon
                            onClick={() => openEditPromotionModal(promotion)}
                            className="w-5 h-5 cursor-pointer text-info"
                          />
                          <TrashIcon
                            onClick={() => handleDeleteClick(promotion.promotionID)}
                            className="w-5 h-5 cursor-pointer text-error"
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={10} className="text-center">Không có dữ liệu.</td>
                    </tr>
                  )
                }
              </tbody>


            </table>

            {/* Pagination */}
            <div className="join mt-4 flex justify-center w-full">
              <button
                className="join-item btn btn-sm btn-primary"
                onClick={handlePrevPage}
                disabled={currentPage === 0}
              >
                Trước
              </button>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index)}
                  className={`join-item btn btn-sm btn-primary ${currentPage === index ? "btn-active" : ""}`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                className="join-item btn btn-sm btn-primary"
                onClick={handleNextPage}
                disabled={currentPage >= totalPages - 1}
              >
                Tiếp
              </button>
            </div>

          </div>
        </TitleCard>
      )}

      {isAddModalOpen && (
        <AddPromotionModal
          isOpen={isAddModalOpen} // Truyền prop đúng tên
          onClose={() => setIsAddModalOpen(false)} // Hàm đóng modal
          onPromotionAdded={loadPromotions} // Hàm callback để làm mới danh sách
        />
      )}
      {isEditModalOpen && (
        <EditPromotionModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)} // Hàm đóng modal
          promotion={editPromotion} // Truyền dữ liệu khuyến mãi hiện tại vào modal
          onPromotionUpdated={loadPromotions} // Callback để làm mới danh sách sau khi chỉnh sửa

        />
      )}


      {/* {isModalOpen && (
        <ProductDetailsModal
          promotion={selectedPromotion}  // Đảm bảo gửi đúng promotion vào modal
          onClose={handleCloseModal}  // Hàm đóng modal
        />
      )} */}


      {/* <ConfirmDialogStatus
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={handleConfirmToggle}
        message={`Bạn có chắc chắn muốn ${selectedPromotionForToggle?.active ? "tắt" : "bật"} trạng thái khuyến mãi này?`}
      /> */}


    </>
  );
}

export default PromotionList;