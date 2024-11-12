import { useState, useEffect } from 'react';
import moment from 'moment'; // Đảm bảo đã import moment.js
import TitleCard from '../../components/Cards/TitleCard';
import { showNotification } from '../common/headerSlice';
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';
import PromotionService from '../../services/PromotionService';  // Sử dụng PromotionService
import { useDispatch } from 'react-redux';
import ConfirmDialog from './components/ConfirmDialog';  // Import ConfirmDialog
import AddPromotionModal from './components/AddPromotionModal';  // Modal thêm Promotion
import EditPromotionModal from './components/EditPromotionModal';  // Modal cập nhật Promotion
import PromotionProductService from '../../services/PromotionProductService';  // Sử dụng PromotionProductService
import PromotionDetailService from '../../services/PromotionDetailService';  // Sử dụng PromotionDetailService

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



  // Hàm tải khuyến mãi
  const loadPromotions = async () => {
    setIsLoading(true);
    try {
      const filters = {
        name: searchKeyword,
        startDate: startDate,
        endDate: endDate,
      };

      const response = await PromotionService.getAllPromotions(filters, currentPage, size);
      const fetchedPromotions = response.content;
      setTotalPages(response.totalPages);

      if (Array.isArray(fetchedPromotions)) {
        const formattedPromotions = fetchedPromotions
          .map((promotion) => ({
            ...promotion,
            startDate: moment(promotion.startDate).format("DD-MM-YYYY"),
            endDate: moment(promotion.endDate).format("DD-MM-YYYY"),
            // Tạo chuỗi percentDiscount với dấu phẩy
            percentDiscounts: promotion.promotionDetails
              .map(detail => detail.percentDiscount)
              .join(', '),  // Kết hợp các giá trị percentDiscount cách nhau dấu phẩy
          }))
          .sort((a, b) => moment(a.startDate, "DD-MM-YYYY") - moment(b.startDate, "DD-MM-YYYY"));

        setPromotions(formattedPromotions);
      } else {
        dispatch(showNotification({ message: "Không thể tải khuyến mãi.", status: 0 }));
      }
    } catch (err) {
      dispatch(showNotification({ message: "Không thể tải khuyến mãi", status: 0 }));
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    loadPromotions();
  }, [currentPage, size, searchKeyword, startDate, endDate]);
  const openAddPromotionModal = () => {
    setIsAddModalOpen(true);
    setIsEditModalOpen(false);
  };
  const openEditPromotionModal = (promotion) => {
    setEditPromotion(promotion);
    setIsAddModalOpen(false);
    setIsEditModalOpen(true);
  };
  const closeModal = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
  };
  const handlePromotionAdded = (newPromotion) => {
    setPromotions([...promotions, newPromotion]);
    loadPromotions();
    setIsAddModalOpen(false);  // Đóng modal khi thêm thành công
  };
  const handlePromotionUpdate = (updatedPromotion) => {
    setPromotions(promotions.map(p => (p.promotionID === updatedPromotion.promotionID ? updatedPromotion : p)));
    loadPromotions();
  };
  const handleDeleteClick = (promotionID) => {
    setPromotionToDelete(promotionID);  // Lưu ID khuyến mãi cần xóa
    setDialogOpen(true);  // Mở dialog xác nhận
  };
  const handleConfirmDelete = async () => {
    if (promotionToDelete) {
      try {
        await PromotionService.deletePromotion(promotionToDelete);  // Gọi hàm xóa từ service
        setPromotions(promotions.filter((promotion) => promotion.promotionID !== promotionToDelete));  // Cập nhật lại danh sách
        dispatch(showNotification({ message: 'Khuyến mãi đã bị xóa!', status: 1 }));  // Thông báo thành công
      } catch (error) {
        dispatch(showNotification({ message: 'Xóa khuyến mãi thất bại!', status: 0 }));  // Thông báo lỗi
      }
      setDialogOpen(false);  // Đóng dialog sau khi xóa
      setPromotionToDelete(null);  // Reset lại ID
    }
  };
  const handleCancelDelete = () => {
    setDialogOpen(false);  // Đóng dialog nếu hủy
    setPromotionToDelete(null);  // Reset lại ID
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


  // Hàm load dữ liệu sản phẩm khuyến mãi
  const loadPromotionProducts = async () => {
    setIsLoading(true); // Đánh dấu đang tải
    try {
      const response = await PromotionProductService.getAllPromotionProducts(
        currentPage,
        size,
        searchKeyword
      );
      setPromotionProducts(response.content); // Lưu kết quả trả về từ API vào state
    } catch (error) {
      console.error('Error fetching promotion products:', error);
    } finally {
      setIsLoading(false); // Kết thúc quá trình tải dữ liệu
    }
  };

  useEffect(() => {
    loadPromotionProducts();
  }, [currentPage, size, searchKeyword]); // Lấy lại dữ liệu khi thay đổi trang, kích thước hoặc từ khóa tìm kiếm


  console.log(promotionProducts);

  promotionProducts.forEach((promotion) => {
    promotion.productVersionIDs.forEach((version) => {
      console.log(version.productVersionID);
    });
  });

  console.log(promotionProducts.productVersionIDs?.productVersionID);
  return (
    <>
      {/* Tabs */}
      <div role="tablist" className="tabs tabs-bordered mb-6">
        <button
          className={`tab ${activeTab === 'promotions' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('promotions')}
        >
          Promotions
        </button>

        <button
          className={`tab ${activeTab === 'products' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Promotion Products
        </button>
      </div>

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
                  <th>Tên khuyến mãi</th>
                  <th>Ngày bắt đầu</th>
                  <th>Ngày kết thúc</th>
                  <th>Poster</th>
                  <th>Phần trăm khuyến mãi</th>
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
                        <td >{promotion.name}</td>
                        <td >{promotion.startDate}</td>
                        <td >{promotion.endDate}</td>

                        <td className="text-center">
                          <img src={promotion.poster} alt={promotion.poster} className="w-30 h-10 " />
                        </td>
                        <td>
                          {/* Hiển thị percentDiscounts dưới dạng chuỗi với dấu phẩy */}
                          {promotion.percentDiscounts}
                        </td>

                        {/* <td className="text-center">{promotion.poster}</td> */}
                        <td className="text-center">
                          <div className="flex justify-center space-x-2">
                            <PencilIcon
                              onClick={() => {
                                setEditPromotion(promotion);
                                setIsEditModalOpen(true);
                                console.log('Selected promotion for edit:', promotion); // Kiểm tra dữ liệu của promotion khi chỉnh sửa
                              }}
                              className="w-5 h-5 cursor-pointer text-info"
                            />
                            <TrashIcon
                              onClick={() => handleDeleteClick(promotion.promotionID)}  // Khi nhấn xóa
                              className="w-5 h-5 cursor-pointer text-error"
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

      {/* Promotion Products Table */}
      {activeTab === 'products' && (
        <TitleCard title="Promotion Products">
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
            <button className="btn btn-outline btn-sm btn-primary">
              Thêm khuyến mãi sản phẩm
            </button>
          </div>
          <div className="overflow-x-auto w-full">
            <table className="table table-xs">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Phần trăm khuyến mãi (%) </th>
                  <th>Phiên bản sản phẩm</th>
                  <th className="text-center" colSpan={2}>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center">Đang tải...</td>
                  </tr>
                ) : promotionProducts.length > 0 ? (
                  promotionProducts.map((product, index) => (
                    <tr key={product.id || index}>
                      <td>{currentPage * size + index + 1}</td>
                      <td>{product.percentDiscount}%</td>
                      <td>
                        {product.productVersionIDs?.map((version) => (
                          <div key={version.productVersionID}>{version.versionName}</div>
                        ))}
                      </td>
                      <td className="text-center">
                        <div className="flex justify-center space-x-2">
                          <PencilIcon className="w-5 h-5 cursor-pointer text-info" />
                          <TrashIcon
                            onClick={() => handleDeleteClick(product.id)}
                            className="w-5 h-5 cursor-pointer text-error"
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center">Không có dữ liệu.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </TitleCard>
      )}

      {/* Modals */}
      {/* Modal Thêm Khuyến Mãi */}
      <AddPromotionModal
        isOpen={isAddModalOpen}  // Đảm bảo sử dụng đúng trạng thái modal
        onClose={closeModal}
        onPromotionAdded={handlePromotionAdded}
      />

      <EditPromotionModal
        isOpen={isEditModalOpen}
        onClose={closeModal}
        editPromotion={editPromotion} // Truyền đối tượng promotion cần chỉnh sửa
        onPromotionUpdate={handlePromotionUpdate} // Hàm cập nhật khuyến mãi trong PromotionList
      />
      {isDialogOpen && (
        <ConfirmDialog
          message="Bạn có chắc chắn muốn xóa khuyến mãi này?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}

    </>
  );
}

export default PromotionList;
