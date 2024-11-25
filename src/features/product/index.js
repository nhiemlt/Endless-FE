import { useState, useEffect } from 'react';
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';
import TitleCard from '../../components/Cards/TitleCard';
import { useDispatch } from 'react-redux';
import { showNotification } from '../common/headerSlice';
import ProductService from '../../services/ProductService';
import AddProductModal from './components/AddProductModal';
import EditProductModal from './components/EditProductModal';
import ConfirmDialog from './components/ConfirmDialog'; // Import ConfirmDialog

function ProductPage() {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false); // State for confirmation dialog
  const [productIdToDelete, setProductIdToDelete] = useState(null); // State to store the product ID to delete

  useEffect(() => {
    async function fetchData() {
      try {
        const [categoryData, brandData] = await Promise.all([
          ProductService.getCategories(),
          ProductService.getBrands()
        ]);
        setCategories(categoryData);
        setBrands(brandData);
      } catch (error) {
        dispatch(showNotification({ message: 'Lỗi khi lấy danh mục hoặc thương hiệu', type: 'error' }));
      }
    }
    fetchData();
  }, [dispatch]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await ProductService.getProducts(searchKeyword, currentPage, pageSize);
      setProducts(response.content); // Trả về danh sách sản phẩm
      setTotalPages(response.totalPages); // Lưu số trang tối đa
    } catch (error) {
      dispatch(showNotification({ message: 'Lấy dữ liệu sản phẩm thất bại!', type: 'error' }));
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchProducts();
  }, [searchKeyword, currentPage, pageSize, dispatch]);

  const handleAddProduct = () => {
    setIsAddModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setCurrentProduct(product);
    setIsEditModalOpen(true);
  };

  const handleDeleteProduct = (productId) => {
    setProductIdToDelete(productId); // Lưu ID sản phẩm vào state
    setIsConfirmDialogOpen(true); // Hiển thị hộp thoại xác nhận
  };

  const confirmDeleteProduct = async () => {
    if (productIdToDelete) {
      try {
        await ProductService.deleteProduct(productIdToDelete);
        dispatch(showNotification({ message: 'Xóa sản phẩm thành công!', status: 1 }));
        fetchProducts();
      } catch (error) {
        dispatch(showNotification({ message: 'Xóa sản phẩm thất bại!', status: 0 }));
      } finally {
        setIsConfirmDialogOpen(false); // Đóng hộp thoại xác nhận
        setProductIdToDelete(null); // Reset ID sản phẩm
      }
    }
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    fetchProducts(); // Refresh product list after adding
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setCurrentProduct(null);
    fetchProducts(); // Refresh product list after editing
  };

  // New function to handle product addition
  const handleProductAdded = () => {
    fetchProducts(); // Refresh the product list
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

  return (
    <TitleCard title="Quản lý sản phẩm" topMargin="mt-6">
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
        <button className="btn btn-outline btn-sm btn-primary" onClick={handleAddProduct}>
          Thêm sản phẩm
        </button>
      </div>
      <div className="overflow-x-auto w-full">
        <table className="table table-xs">
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên</th>
              <th>Danh mục</th>
              <th>Thương hiệu</th>
              <th>Mô tả</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center">Đang tải...</td>
              </tr>
            ) : products.length > 0 ? (
              products.map((product, index) => (
                <tr key={product.productID}>
                  <td>{index + 1 + currentPage * pageSize}</td>
                  <td>{product.name}</td>
                  <td>{product.categoryID?.name || 'N/A'}</td>
                  <td>{product.brandID?.brandName || 'N/A'}</td>
                  <td>{product.description}</td>
                  <td className="text-center">
                    <div className="flex justify-center space-x-2">
                      <PencilIcon className="w-5 h-5 cursor-pointer text-info" onClick={() => handleEditProduct(product)} />
                      <TrashIcon className="w-5 h-5 cursor-pointer text-error" onClick={() => handleDeleteProduct(product.productID)} />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center">Không có dữ liệu.</td>
              </tr>
            )}
          </tbody>
        </table>
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
            onClick={() => setCurrentPage(index)} // Sử dụng setCurrentPage để cập nhật trang
            className={`join-item btn ${currentPage === index ? 'btn-primary' : ''}`} // Thêm class 'btn-primary' nếu đang ở trang hiện tại
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



      {isAddModalOpen && (
        <AddProductModal
          categories={categories}
          brands={brands}
          onClose={handleCloseAddModal}
          onProductAdded={handleProductAdded} // Pass the new function here
        />
      )}
      {isEditModalOpen && currentProduct && (
        <EditProductModal
          product={currentProduct}
          categories={categories}
          brands={brands}
          onClose={handleCloseEditModal}
          onProductUpdated={fetchProducts}
        />
      )}
      {isConfirmDialogOpen && (
        <ConfirmDialog
          message="Bạn có chắc chắn muốn xóa sản phẩm này?"
          onConfirm={confirmDeleteProduct}
          onCancel={() => setIsConfirmDialogOpen(false)} // Đóng hộp thoại xác nhận
        />
      )}
    </TitleCard>
  );
}

export default ProductPage;
