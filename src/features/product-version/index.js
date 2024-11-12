import { useState, useEffect } from 'react';
import TitleCard from '../../components/Cards/TitleCard';
import { useDispatch } from 'react-redux';
import { showNotification } from '../common/headerSlice';
import SearchBar from '../../components/Input/SearchBar';
import ProductVersionService from '../../services/productVersionService';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import EyeIcon from '@heroicons/react/24/outline/EyeIcon';
import AddProductVersionModal from './components/AddProductVersionModal';
import EditProductVersionModal from './components/EditProductVersionModal';
import ProductVersionAttributesModal from './components/ProductVersionAttributesModal'; // Import mới
import DetailsModal from './components/DetailsModal';
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
  // Thêm state để lưu trữ phiên bản sản phẩm đang xem chi tiết
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);



  useEffect(() => {
    const fetchProductVersions = async () => {
      setLoading(true);
      try {
        const response = await ProductVersionService.getAllProductVersions();
        console.log("Fetched Product Versions:", response);  // Log tất cả dữ liệu trả về từ API
        setProductVersions(response.content); // Giả sử content là danh sách các ProductVersionDTO
      } catch (err) {
        console.error("Error fetching product versions:", err);
        setError("Có lỗi xảy ra khi tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };


    fetchProductVersions();
  }, []);

  const handleEditProductVersion = (version) => {
    setSelectedVersion(version); // Lưu phiên bản sản phẩm cần chỉnh sửa
    setIsEditModalOpen(true); // Mở modal chỉnh sửa
  };


  const handleAddProductVersion = () => {
    setIsAddModalOpen(true);
  };



  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleViewAttributes = (version) => {
    setSelectedVersion(version); // Lưu phiên bản sản phẩm để hiển thị trong modal
    setIsAttributesModalOpen(true); // Mở modal
  };

  const handleCloseAttributesModal = () => {
    setIsAttributesModalOpen(false); // Đóng modal
  };

  // Hàm mở modal xem chi tiết
  const handleViewDetails = (version) => {
    setSelectedVersion(version);
    setIsDetailsModalOpen(true);
  };

  // Hàm đóng modal
  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
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


  // Hiển thị loading nếu đang tải dữ liệu
  if (loading) {
    return <div>Loading...</div>;
  }

  // Hiển thị thông báo lỗi nếu có
  if (error) {
    return <div>{error}</div>;
  }
  const applySearch = (value) => setSearchText(value);


  return (
    <TitleCard title="Manage Product Versions" topMargin="mt-6">
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-center w-full mb-4">
          <div className="flex justify-start items-center space-x-2 mb-2 mr-2 md:mb-0">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              onChange={(e) => {
                // setSearchKeyword(e.target.value);
                // setCurrentPage(0);
              }}
              className="input input-bordered w-full md:w-50 h-8"
            />
          </div>
          <button className="btn btn-outline btn-sm btn-primary" onClick={handleAddProductVersion} >
            Thêm phiên bản
          </button>
        </div>

        {/* <SearchBar searchText={searchText} setSearchText={applySearch} styleClass="mb-4" /> */}

        <div className="overflow-x-auto">
          <table className="table table-xs w-full">
            <thead>
              <tr>
                <th>ID</th>
                <th>Version Name</th>
                <th>Product</th>
                <th>Thuộc tính</th>
                <th>Cost Price</th>
                <th>Price</th>
                <th>Kích thước</th>
                <th>Status</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {productVersions.map((version, index) => (
                <tr key={version.productVersionID}>
                  {/* Some spacing here could be an issue */}
                  <td>{index + 1}</td>
                  <td>{version.versionName}</td>
                  <td>{version.product.name}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline btn-primary"
                      onClick={() => handleViewAttributes(version)}>
                      <EyeIcon className="h-4 w-4" />
                    </button>
                  </td>
                  <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(version.purchasePrice)}</td>
                  <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(version.price)}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline btn-primary border-0"
                      onClick={() => handleViewDetails(version)}
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                  </td>
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
                    <button key={`edit-${version.productVersionID}`} className="btn btn-sm btn-outline btn-primary border-0">
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button key={`delete-${version.productVersionID}`} className="btn btn-sm btn-outline btn-error border-0">
                      <TrashIcon className="h-4 w-4" />
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

          {/* Hiển thị DetailsModal khi nhấp vào EyeIcon */}
          {isDetailsModalOpen && (
            <DetailsModal version={selectedVersion} onClose={handleCloseDetailsModal} />
          )}

          {/* Hiển thị modal thuộc tính */}
          {isAttributesModalOpen && (
            <ProductVersionAttributesModal
              version={selectedVersion}
              onClose={handleCloseAttributesModal}
            />
          )}
          {isEditModalOpen && (
            <EditProductVersionModal
              version={selectedVersion} // Truyền phiên bản sản phẩm cần chỉnh sửa vào modal
              onClose={handleCloseEditModal} // Hàm đóng modal
            />
          )}


        </div>
      </div>
      {isAddModalOpen && (
        <AddProductVersionModal
          onClose={handleCloseAddModal}
        // onProductAdded={handleProductAdded} // Pass the new function here
        />
      )}
      {isEditModalOpen && (
        <EditProductVersionModal
          onClose={handleCloseEditModal}
        />
      )}
    </TitleCard>
  );
}

export default ProductVersionPage;