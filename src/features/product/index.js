import { useState, useEffect } from 'react';
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';
import TitleCard from '../../components/Cards/TitleCard';
import { useDispatch } from 'react-redux';
import { showNotification } from '../common/headerSlice';
import ProductService from '../../services/ProductService';
import BrandService from '../../services/BrandService';
import CategoryService from '../../services/CategoryService';
import AddProductModal from './components/AddProductModal';
import EditProductModal from './components/EditProductModal';
import ConfirmDialog from './components/ConfirmDialog'; // Import ConfirmDialog

function ProductPage() {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [categoryID, setCategoryID] = useState('');
  const [brandID, setBrandID] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [categoryData, brandData] = await Promise.all([
          CategoryService.getCategories({ size: 50 }), // Kiểm tra API này
          BrandService.getBrands({ size: 50 }),    // Kiểm tra API này
        ]);
        console.log(categoryData);  // Kiểm tra dữ liệu trả về
        console.log(brandData);     // Kiểm tra dữ liệu trả về
        setCategories(categoryData.content); // Cập nhật vào state
        setBrands(brandData.content);       // Cập nhật vào state
      } catch (error) {
        dispatch(showNotification({ message: 'Lỗi khi lấy danh mục hoặc thương hiệu', type: 'error' }));
      }
    }
    fetchData();
  }, [dispatch]);


  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await ProductService.getProducts(
        searchKeyword,    // Từ khóa tìm kiếm
        currentPage,      // Trang hiện tại
        pageSize,         // Số lượng sản phẩm mỗi trang
        'createDate',     // Thuộc tính sắp xếp
        'asc',             // Hướng sắp xếp
        categoryID || undefined, // Truyền undefined nếu không có categoryId
        brandID || undefined    // Truyền undefined nếu không có brandId
      );
      setProducts(response.content);  // Cập nhật danh sách sản phẩm
      setTotalPages(response.totalPages);  // Cập nhật số trang tối đa
    } catch (error) {
      dispatch(showNotification({ message: 'Lấy dữ liệu sản phẩm thất bại!', type: 'error' }));
    } finally {
      setLoading(false);
    }
  };


  const handleCategoryChange = (e) => {
    setCategoryID(e.target.value);
    setCurrentPage(0);  // Reset trang khi thay đổi bộ lọc
  };

  const handleBrandChange = (e) => {
    setBrandID(e.target.value);
    setCurrentPage(0);  // Reset trang khi thay đổi bộ lọc
  };

  useEffect(() => {
    fetchProducts();  // Gọi lại fetchProducts mỗi khi các giá trị lọc thay đổi
  }, [searchKeyword, currentPage, pageSize, categoryID, brandID, dispatch]);



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
    fetchProducts();
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setCurrentProduct(null);
    fetchProducts();
  };

  const handleProductAdded = (newProduct) => {
    setProducts((prevProducts) => [newProduct, ...prevProducts]); // Thêm sản phẩm mới vào đầu danh sách
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
    <TitleCard topMargin="mt-6">
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

        {/* Danh mục và Thương hiệu */}
        <div className="flex justify-start items-center space-x-4 w-full md:w-auto mb-2 md:mb-0">
          <div className="flex items-center space-x-2">
            <label className="whitespace-nowrap font-medium">Danh mục:</label>
            <select
              className="select select-bordered select-xs w-full md:w-40 h-10 px-3"  // Điều chỉnh chiều rộng của select
              onChange={handleCategoryChange}
            >
              <option value="">Tất cả</option>
              {categories.map((category, index) => (
                <option key={`category-${category.categoryID || index}`} value={category.categoryID}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <label className="whitespace-nowrap font-medium">Thương hiệu:</label>
            <select
              className="select select-bordered select-xs w-full md:w-40 h-10 px-3"  // Điều chỉnh chiều rộng của select
              onChange={handleBrandChange}
            >
              <option value="">Tất cả</option>
              {brands.map((brand, index) => (
                <option key={`brand-${brand.brandID || index}`} value={brand.brandID}>
                  {brand.brandName}
                </option>
              ))}
            </select>
          </div>
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
                  <td>{product.description?.length > 50 ? `${product.description.slice(0, 50)}...` : product.description}</td>

                  <td className="text-center">
                    <div className="flex justify-center space-x-2">
                      <div className="flex space-x-2">
                        {/* Nút Chỉnh sửa */}
                        <button
                          className="btn btn-sm btn-outline btn-primary border-0 group relative"
                          onClick={() => handleEditProduct(product)}
                        >
                          <PencilIcon className="w-4 h-4" />
                          <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-700 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                            Chỉnh sửa sản phẩm
                          </span>
                        </button>

                        {/* Nút Xóa */}
                        <button
                          onClick={() => handleDeleteProduct(product.productID)}
                          className="btn btn-sm btn-outline btn-error border-0 group relative"
                        >
                          <TrashIcon className="w-5 h-5" />
                          <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-700 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                            Xóa sản phẩm
                          </span>
                        </button>
                      </div>

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
          onClick={handlePrevPage} className="join-item btn" disabled={currentPage === 0}> Trước  </button>
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
          onClick={handleNextPage} className="join-item btn"
          disabled={currentPage === totalPages - 1}> Tiếp </button>
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
