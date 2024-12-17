import { useState, useEffect } from 'react';
import TitleCard from '../../components/Cards/TitleCard';
import { useDispatch } from 'react-redux';
import { showNotification } from '../common/headerSlice';
import SearchBar from '../../components/Input/SearchBar';
import ProductVersionService from '../../services/productVersionService';
import ProductService from '../../services/ProductService';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import EyeIcon from '@heroicons/react/24/outline/EyeIcon';
import AddProductVersionModal from './components/AddProductVersionModal';
import EditProductVersionModal from './components/EditProductVersionModal';
import ProductVersionAttributesModal from './components/ProductVersionAttributesModal'; // Import mới
import ConfirmDialog from './components/ConfirmDialog'; // Import ConfirmDialog

function ProductVersionPage() {
  const dispatch = useDispatch();
  const [productVersions, setProductVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false); // State for confirmation dialog
  const [isAttributesModalOpen, setIsAttributesModalOpen] = useState(false); // State mới để mở modal thuộc tính
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10; // Số lượng items hiển thị trên mỗi trang

  const [totalPages, setTotalPages] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchProductId, setSearchProductId] = useState(''); // Khởi tạo state cho Product ID
  const [products, setProducts] = useState([]);  // State để lưu danh sách sản phẩm
  const [categoryID, setCategoryID] = useState('');
  const [brandID, setBrandID] = useState('');
  const [pageSize, setPageSize] = useState(100);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');



  const fetchProductVersions = async () => {
    setLoading(true);
    try {
      const response = await ProductVersionService.getAllProductVersions(
        currentPage,
        itemsPerPage,
        'versionName',
        'ASC',
        searchKeyword,
        searchProductId,
        minPrice,
        maxPrice
      );
      setProductVersions(response.content);
      const totalPages = Math.ceil(response.totalElements / itemsPerPage);
      setTotalPages(totalPages);
    } catch (err) {
      console.error("Error fetching product versions:", err);
      setError("Có lỗi xảy ra khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductVersions();
  }, [currentPage, searchKeyword, searchProductId, minPrice, maxPrice]); // Thêm minPrice, maxPrice vào dependencies


  // Gọi API để lấy danh sách sản phẩm
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await ProductService.getProducts(searchKeyword,    // Từ khóa tìm kiếm
          currentPage,      // Trang hiện tại
          pageSize,         // Số lượng sản phẩm mỗi trang
          'createDate',     // Thuộc tính sắp xếp
          'asc',             // Hướng sắp xếp
          categoryID || undefined, // Truyền undefined nếu không có categoryId
          brandID || undefined    // Truyền undefined nếu không có brandId
        ); // Giả sử hàm này lấy danh sách sản phẩm
        console.log("Fetched products:", response); // Log products response
        setProducts(response.content); // Cập nhật state với danh sách sản phẩm
      } catch (error) {
        console.error('Lỗi khi lấy danh sách sản phẩm:', error);
      }
    };

    fetchProducts();
  }, []);


  const handleEditProductVersion = (version) => {
    setSelectedVersion(version); // Lưu phiên bản sản phẩm cần chỉnh sửa
    setIsEditModalOpen(true); // Mở modal chỉnh sửa
  };
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleAddProductVersion = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleDeleteProductVersion = (versionID) => {
    setSelectedVersion(versionID); // Lưu ID của phiên bản sản phẩm cần xóa
    setIsConfirmDialogOpen(true); // Mở hộp thoại xác nhận
  };

  const handleConfirmDelete = async () => {
    try {
      await ProductVersionService.deleteProductVersion(selectedVersion); // Gọi API xóa
      setProductVersions((prev) =>
        prev.filter((version) => version.productVersionID !== selectedVersion)
      );
      dispatch(showNotification({ message: "Xóa thành công!", status: 1 }));
      fetchProductVersions();  // Gọi lại hàm fetchProductVersions để tải lại dữ liệu
    } catch (error) {
      dispatch(showNotification({ message: "Xóa thất bại!", status: 0 }));
    }
    setIsConfirmDialogOpen(false); // Đóng hộp thoại xác nhận
    setSelectedVersion(null); // Xóa ID phiên bản đã chọn
  };


  const handleCloseConfirmDialog = () => {
    setIsConfirmDialogOpen(false);
    setSelectedVersion(null); // Reset ID khi đóng hộp thoại
  };


  const handleViewAttributes = (version) => {
    setSelectedVersion(version); // Lưu phiên bản sản phẩm để hiển thị trong modal
    setIsAttributesModalOpen(true); // Mở modal
  };

  const handleCloseAttributesModal = () => {
    setIsAttributesModalOpen(false); // Đóng modal
  };

  // Thêm state cho xác nhận chỉnh sửa
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    versionID: null,
    newStatus: '',
  });

  // Hàm mở xác nhận
  const openConfirmDialog = (versionID, newStatus) => {
    setConfirmDialog({
      isOpen: true,
      versionID,
      newStatus,
    });
  };

  // Hàm xử lý xác nhận chỉnh sửa
  const handleConfirmChangeStatus = async () => {
    try {
      const { versionID, newStatus } = confirmDialog;
      await ProductVersionService.updateProductVersionStatus(versionID, newStatus);
      setProductVersions((prev) =>
        prev.map((version) =>
          version.productVersionID === versionID ? { ...version, status: newStatus } : version
        )
      );
      // Thông báo thành công
      dispatch(showNotification({ message: "Trạng thái đã được cập nhật!", status: 1 }));
    } catch (error) {
      dispatch(showNotification({ message: "Trạng thái cập nhật thất bại!", status: 0 }));
    }
    closeConfirmDialog();
  };

  // Đóng xác nhận
  const closeConfirmDialog = () => {
    setConfirmDialog({ isOpen: false, versionID: null, newStatus: '' });
  };

  // Toggle trạng thái và mở hộp xác nhận
  const toggleStatus = (versionID, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    openConfirmDialog(versionID, newStatus);
  };
  const handleProductUpdated = (updatedVersion) => {
    setProductVersions((prev) =>
      prev.map((version) =>
        version.productVersionID === updatedVersion.productVersionID
          ? updatedVersion
          : version
      )
    );
  };
  const handlePrevPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
  };

  // Hiển thị thông báo lỗi nếu có
  if (error) {
    return <div>{error}</div>;
  }

  const formatWeight = (weight) => {
    if (weight >= 1000) {
      return `${(weight / 1000).toFixed(1)} kg`; // Chuyển thành kg nếu >= 1000
    }
    return `${weight} g`; // Hiển thị g nếu < 1000
  };

  // Hàm thay đổi giá trị và loại bỏ dấu chấm để tránh lỗi khi nhập
  const handlePriceChange = (e, setPrice) => {
    let value = e.target.value.replace(/[^\d]/g, ''); // Loại bỏ mọi ký tự không phải là số
    setPrice(value);
  };

  // Hàm định dạng số khi hiển thị giá trị có dấu chấm
  const formatNumber = (number) => {
    if (!number) return '';
    return Number(number).toLocaleString('vi-VN'); // Định dạng theo kiểu Việt Nam với dấu chấm phân cách nghìn
  };

  return (
    <TitleCard topMargin="mt-6">
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-center w-full mb-4">
          <div className="flex justify-start items-center space-x-2 mb-2 mr-2 md:mb-0">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              onChange={(e) => {
                setSearchKeyword(e.target.value);
                setCurrentPage(0);
              }}

              className="input input-bordered w-full md:w-50 h-8"
            />

          </div>
          {/* Select lọc theo tên sản phẩm */}
          <div className="flex justify-start items-center space-x-2 mb-2 mr-2 md:mb-0">
            <label className="whitespace-nowrap text-sm">Lọc sản phẩm:</label>

            <select
              onChange={(e) => {
                setSearchProductId(e.target.value);
                setCurrentPage(0);
              }}
              className="select select-bordered select-xs w-full md:w-25 h-8 px-3"
              defaultValue=""
            >
              <option value="">Tất cả</option>
              {products.map((product) => (
                <option key={product.productID} value={product.productID}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>


          <div className="flex justify-start items-center space-x-2 mb-2 mr-2 md:mb-0">
            <label className="whitespace-nowrap text-sm">Khoảng giá:</label>

            <input
              type="text"
              placeholder="Từ"
              className="input input-bordered input-xs w-full md:w-30 h-8"
              value={formatNumber(minPrice)}  // Hiển thị theo dạng có dấu chấm
              onChange={(e) => {
                handlePriceChange(e, setMinPrice);  // Gọi hàm xử lý thay đổi giá trị
                setCurrentPage(0);  // Đặt lại trang
              }}
            />

            <span className="mx-2">-</span>

            <input
              type="text"
              placeholder="Đến"
              className="input input-bordered input-xs w-full md:w-30 h-8"
              value={formatNumber(maxPrice)}  // Hiển thị theo dạng có dấu chấm
              onChange={(e) => {
                handlePriceChange(e, setMaxPrice);  // Gọi hàm xử lý thay đổi giá trị
                setCurrentPage(0);  // Đặt lại trang
              }}
            />
          </div>

          <button className="btn btn-outline btn-sm btn-primary" onClick={handleAddProductVersion} >
            Thêm phiên bản
          </button>
        </div>


        <div className="overflow-x-auto">
          <table className="table table-xs w-full">
            <thead>
              <tr>
                <th>STT</th>
                <th>Sản phẩm</th>
                <th>Tên phiên bản</th>
                <th>Thuộc tính</th>
                <th>Giá gốc</th>
                <th>Giá bán</th>
                <th>Trọng lượng</th>
                <th>Trạng thái</th>
                <th>Hình ảnh</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {productVersions.map((version, index) => (
                <tr key={version.productVersionID}>
                  <td>{index + 1}</td>
                  <td>{version.product.name}</td>
                  <td>{version.versionName}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline btn-primary border-0"
                      onClick={() => handleViewAttributes(version)}
                      title='Xem thuộc tính'>
                      <EyeIcon className="h-4 w-4" />
                    </button>
                  </td>
                  <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(version.purchasePrice)}</td>
                  <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(version.price)}</td>
                  <td>{formatWeight(version.weight)}</td>


                  <td>
                    <label className="label cursor-pointer flex flex-col items-center space-y-1 ">
                      <span className="label-text font-semibold">
                        {version.status === "Active" ? "Active" : "Inactive"}
                      </span>
                      <input
                        type="checkbox"
                        className="toggle toggle-primary mt-1"
                        checked={version.status === "Active"}
                        onChange={() => toggleStatus(version.productVersionID, version.status)}
                      />
                    </label>
                  </td>
                  <td>
                    <img src={version.image} alt={version.versionName} className="w-10 h-10 object-cover" />
                  </td>
                  <td>
                    <button
                      key={`edit-${version.productVersionID}`}
                      className="btn btn-sm btn-outline btn-primary border-0 group relative"
                      onClick={() => handleEditProductVersion(version)} // Mở modal khi nhấn nút
                    >
                      <PencilIcon className="h-4 w-4" />
                      <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-700 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                        Chỉnh sửa phiên bản
                      </span>
                    </button>

                    <button
                      onClick={() => handleDeleteProductVersion(version.productVersionID)}
                      key={`delete-${version.productVersionID}`}
                      className="btn btn-sm btn-outline btn-error border-0 group relative"
                    >
                      <TrashIcon className="h-4 w-4" />
                      <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-700 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                        Xóa phiên bản
                      </span>
                    </button>

                  </td>

                </tr>
              ))}
            </tbody>
          </table>

          {/* Hộp thoại xác nhận */}
          {confirmDialog.isOpen && (
            <ConfirmDialog
              message="Bạn có chắc chắn muốn thay đổi trạng thái không?"
              onConfirm={handleConfirmChangeStatus}
              onCancel={closeConfirmDialog}
            />
          )}
          {isConfirmDialogOpen && (
            <ConfirmDialog
              message="Bạn có chắc chắn muốn xóa phiên bản này?"
              onConfirm={handleConfirmDelete}
              onCancel={handleCloseConfirmDialog}
            />
          )}

          {/* Hiển thị modal thuộc tính */}
          {isAttributesModalOpen && (
            <ProductVersionAttributesModal
              version={selectedVersion}
              onClose={handleCloseAttributesModal}
            />
          )}
        </div>


        {/* Điều hướng phân trang */}
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
      {isAddModalOpen && (
        <AddProductVersionModal
          onClose={handleCloseAddModal}
          // onProductAdded={handleProductAdded} // Pass the new function here
          onProductAdded={fetchProductVersions}
        />
      )}
      {isEditModalOpen && (
        <EditProductVersionModal
          productVersion={selectedVersion} // Đảm bảo `selectedVersion` không bị `null`
          onClose={handleCloseEditModal}
          onProductUpdated={handleProductUpdated} // Pass handleProductUpdated here
        />
      )}

    </TitleCard>
  );
}

export default ProductVersionPage;