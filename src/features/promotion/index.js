import { useState, useEffect } from 'react';
import moment from 'moment'; // Đảm bảo đã import moment.js
import TitleCard from '../../components/Cards/TitleCard';
import { showNotification } from '../common/headerSlice';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import EyeIcon from '@heroicons/react/24/outline/EyeIcon';
import PromotionService from '../../services/PromotionService';  // Sử dụng PromotionService
import { useDispatch } from 'react-redux';
import ProductDetailsModal from './components/ProductDetailsModal';  // Import ConfirmDialog
import AddPromotionModal from './components/AddPromotionModal';  // Modal thêm Promotion
import EditPromotionModal from './components/EditPromotionModal';  // Modal cập nhật Promotion

import ConfirmDialogStatus from './components/ConfirmDialogStatus';  // Import ConfirmDialog
import ConfirmDialog from './components/ConfirmDialog';  // Import ConfirmDialog

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
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [promotionToDelete, setPromotionToDelete] = useState(null);
  const [promotions, setPromotions] = useState([]);
  const [editPromotion, setEditPromotion] = useState(null);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [selectedPromotionForToggle, setSelectedPromotionForToggle] = useState(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);

  const dispatch = useDispatch();



  const openConfirmDialog = (promotion) => {
    setSelectedPromotionForToggle(promotion);
    setIsStatusDialogOpen(true);
  };

  const handleConfirmToggle = async () => {
    if (!selectedPromotionForToggle) return;

    try {
      await toggleActiveStatus(selectedPromotionForToggle.promotionID, selectedPromotionForToggle.active);
    } catch (error) {
      dispatch(showNotification({ message: "Lỗi khi cập nhật trạng thái", status: 0 }));
    } finally {
      setIsStatusDialogOpen(false);
      setSelectedPromotionForToggle(null);
    }
  };



  const loadPromotions = async () => {
    setIsLoading(true); // Hiển thị trạng thái đang tải
    try {
      // Gọi hàm getAllPromotions từ PromotionService
      const response = await PromotionService.getAllPromotions(
        { keyword: searchKeyword, }, // Bộ lọc tìm kiếm
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

  const toggleActiveStatus = async (promotionID, currentStatus) => {
    try {
      // Hiển thị thông báo đang xử lý
      dispatch(showNotification({ message: "Đang thay đổi trạng thái...", type: "info" }));

      await PromotionService.togglePromotionActive(promotionID);

      // Cập nhật lại dữ liệu sau khi BE xử lý
      loadPromotions();
      dispatch(showNotification({ message: "Thay đổi trạng thái thành công!", status: 1 }));
    } catch (error) {
      console.error("Lỗi khi thay đổi trạng thái:", error);
      dispatch(showNotification({ message: "Thay đổi trạng thái thất bại", status: 0 }));
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

  const handleDeleteClick = (promotionID) => {
    setPromotionToDelete(promotionID);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await PromotionService.deletePromotion(promotionToDelete);
      dispatch(showNotification({ message: "Xóa thành công!", status: 1 }));
      loadPromotions();
    } catch (error) {
      dispatch(showNotification({ message: "Xóa thất bại!", status: 0 }));
    } finally {
      setIsDeleteDialogOpen(false);
      setPromotionToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setPromotionToDelete(null);
  };


  return (
    <>
      {/* Tabs */}


      {/* Promotions Table */}
      {activeTab === 'promotions' && (
        <TitleCard title="Quản lý khuyến mãi">
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
                  <th className="text-center" colSpan={2}></th>
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


                        <td>
                          <div className="flex space-x-2">
                            <PencilIcon
                              onClick={() => openEditPromotionModal(promotion)}
                              className="w-4 h-4 cursor-pointer text-info"
                            />
                            <TrashIcon
                              onClick={() => handleDeleteClick(promotion.promotionID)}
                              className="w-4 h-4 cursor-pointer text-error"
                            />
                          </div>
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
                onClick={handlePrevPage}
                className="join-item btn"
                disabled={currentPage === 0}
              >
                Trước
              </button>

              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index)} // Chuyển trang khi nhấn
                  className={`join-item btn ${currentPage === index ? 'btn-primary' : ''}`} // Thêm 'btn-primary' cho trang hiện tại
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={handleNextPage}
                className="join-item btn"
                disabled={currentPage === totalPages - 1}
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


      {isModalOpen && (
        <ProductDetailsModal
          promotion={selectedPromotion}  // Đảm bảo gửi đúng promotion vào modal
          onClose={handleCloseModal}  // Hàm đóng modal
        />
      )}

      <ConfirmDialogStatus
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={handleConfirmToggle}
        message={`Bạn có chắc chắn muốn ${selectedPromotionForToggle?.active ? "tắt" : "bật"} trạng thái khuyến mãi này?`}
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        message="Bạn có chắc chắn muốn xóa khuyến mãi này?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />


    </>
  );
}

export default PromotionList;