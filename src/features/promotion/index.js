import { useState, useEffect } from 'react';
import moment from 'moment'; // Đảm bảo đã import moment.js
import TitleCard from '../../components/Cards/TitleCard';
import { showNotification } from '../common/headerSlice';
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';
import PromotionService from '../../services/PromotionService';  // Sử dụng PromotionService
import { useDispatch } from 'react-redux';
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
  };

  const handlePromotionUpdate = (updatedPromotion) => {
    setPromotions(promotions.map(p => (p.promotionID === updatedPromotion.promotionID ? updatedPromotion : p)));
    loadPromotions();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khuyến mãi này?')) {
      try {
        await PromotionService.deletePromotion(id);
        setPromotions(promotions.filter((promotion) => promotion.promotionID !== id));
        dispatch(showNotification({ message: 'Khuyến mãi đã bị xóa!', status: 1 }));
      } catch (error) {
        dispatch(showNotification({ message: 'Xóa khuyến mãi thất bại!', status: 0 }));
      }
    }
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


  // Sử dụng useEffect để tải dữ liệu khuyến mãi khi các tham số thay đổi
  useEffect(() => {
    loadPromotions();
  }, [currentPage, size, searchKeyword, startDate, endDate]);

  // Lấy danh sách chi tiết khuyến mãi
  useEffect(() => {
    const fetchPromotionDetails = async () => {
      try {
        const data = await PromotionDetailService.getPromotionDetails();
        setPromotionDetails(data);
      } catch (error) {
        console.error('Error fetching promotion details:', error);
      }
    };

    fetchPromotionDetails();
  }, [activeTab]);

  // Lấy danh sách sản phẩm khuyến mãi khi tab "products" được chọn
  useEffect(() => {
    const fetchPromotionProducts = async () => {
      if (activeTab === 'products') {
        try {
          const data = await PromotionProductService.getPromotionProducts();
          setPromotionProducts(data);
        } catch (error) {
          console.error('Error fetching promotion products:', error);
        }
      }
    };

    fetchPromotionProducts();
  }, [activeTab]);






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
          className={`tab ${activeTab === 'details' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('details')}
        >
          Promotion Details
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
                  <th>No.</th>
                  <th>Promotion Name</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Poster</th>
                  <th>Action</th>
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
                        <td className="text-center">{promotion.name}</td>
                        <td className="text-center">{promotion.startDate}</td>
                        <td className="text-center">{promotion.endDate}</td>
                        <td className="text-center">{promotion.poster}</td>
                        <td className="text-center">
                          <div className="flex justify-center space-x-2">
                            <PencilIcon
                              onClick={() => {
                                setEditPromotion(promotion);
                                setIsEditModalOpen(true);
                              }}
                              className="w-5 h-5 cursor-pointer text-info"
                            />
                            <TrashIcon
                              onClick={() => handleDelete(promotion.promotionID)}
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

      {/* Promotion Details Table */}
      {activeTab === 'details' && (
        <TitleCard title="Promotion Details"

        >
          <div className="overflow-x-auto w-full">
            <table className="table table-xs">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Promotion ID</th>
                  <th>Discount Percentage</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {promotionDetails.map((detail, index) => (
                  <tr key={detail.id}>
                    <td>{index + 1}</td>
                    <td>{detail.promotionID}</td>
                    <td>{detail.percentDiscount}%</td>
                    <td>
                      <button className="btn btn-sm btn-outline btn-primary border-0" >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button className="btn btn-sm btn-outline btn-error border-0" >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TitleCard>
      )}

      {/* Promotion Products Table */}
      {activeTab === 'products' && (
        <TitleCard title="Promotion Products">
          <div className="overflow-x-auto w-full">
            <table className="table table-xs">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Promotion Detail ID</th>
                  <th>Product Version ID</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {promotionProducts.map((product, index) => (
                  <tr key={product.id}>
                    <td>{index + 1}</td>
                    <td>{product.promotionDetailID}</td>
                    <td>{product.productVersionID}</td>
                    <td>
                      <button className="btn btn-sm btn-outline btn-primary border-0">
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button className="btn btn btn-sm btn-outline btn-error border-0" >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
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


    </>
  );
}

export default PromotionList;
