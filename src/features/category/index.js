import { useState, useEffect } from 'react';
import TitleCard from '../../components/Cards/TitleCard';
import { useDispatch } from 'react-redux';
import { showNotification } from '../common/headerSlice';
import SearchBar from '../../components/Input/SearchBar';
import CategoryService from '../../services/CategoryService';
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';
import AddCategoryModal from './components/AddCategoryModal';
import EditCategoryModal from './components/EditCategoryModal';
import ConfirmDialog from './components/ConfirmDialog';

function CategoryPage() {
  const dispatch = useDispatch();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, [currentPage, searchKeyword]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await CategoryService.getCategories({
        page: currentPage,
        size,
        keyword: searchKeyword,
      });
      setCategories(response.content);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError('Không thể tải danh mục');
      dispatch(showNotification({ message: "Không thể tải danh mục", status: 0 }));
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryAdded = (newCategory) => {
    setCategories([...categories, newCategory]);
    setShowAddModal(false);
    fetchCategories();
  };

  const handleCategoryUpdated = (updatedCategory) => {
    setCategories(categories.map(c => (c.categoryID === updatedCategory.categoryID ? updatedCategory : c)));
    setShowEditModal(false);
    fetchCategories();
  };

  const handleDelete = (id) => {
    setDeleteCategoryId(id);
    setShowConfirmDialog(true); // Hiển thị hộp thoại xác nhận
  };

  const confirmDelete = async () => {
    try {
      await CategoryService.deleteCategory(deleteCategoryId);
      setCategories(categories.filter((category) => category.categoryID !== deleteCategoryId));
      dispatch(showNotification({ message: 'Danh mục đã được xóa thành công!', status: 1 }));
    } catch (error) {
      console.error('Lỗi khi xóa danh mục:', error);
      dispatch(showNotification({ message: 'Xóa danh mục không thành công!', status: 0 }));
    } finally {
      setShowConfirmDialog(false);
      setDeleteCategoryId(null);
    }
  };

  const applySearch = (keyword) => {
    setSearchKeyword(keyword);
    setCurrentPage(0);
  };

  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  return (
    <TitleCard title="Quản lý danh mục" topMargin="mt-6">
      <div className="flex flex-col md:flex-row justify-between items-center w-full mb-4">
        <div className="flex justify-start items-center space-x-2 mb-2 mr-2 md:mb-0">
          <SearchBar searchText={searchKeyword} setSearchText={applySearch} styleClass="mb-4" />
        </div>
        <button className="btn btn-outline btn-sm btn-primary" onClick={() => setShowAddModal(true)}>Thêm danh mục</button>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-xs w-full">
          <thead>
            <tr>
              <th>STT</th>
              <th className="text-center">Tên Danh Mục</th>
              <th colSpan={2} className="text-center">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {
              loading ? (
                <tr>
                  <td colSpan={3} className="text-center">Đang tải...</td>
                </tr>
              ) : categories.length > 0 ? (
                categories.map((cat, index) => (
                  <tr key={cat.categoryID}>
                    <td>{index + 1 + currentPage * size}</td>
                    <td className="text-center">{cat.name}</td>
                    <td className="text-center">
                      <div className="flex justify-center space-x-2">
                        <PencilIcon
                          className="w-5 h-5 cursor-pointer text-info"
                          onClick={() => {
                            setEditCategory(cat);
                            setShowEditModal(true);
                          }}
                        />
                        <TrashIcon
                          className="w-5 h-5 cursor-pointer text-error"
                          onClick={() => handleDelete(cat.categoryID)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center">Không có dữ liệu.</td>
                </tr>
              )
            }
          </tbody>
        </table>
      </div>

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

      {showAddModal && (
        <AddCategoryModal
          onClose={() => setShowAddModal(false)}
          onCategoryAdded={handleCategoryAdded}
        />
      )}

      {showEditModal && (
        <EditCategoryModal
          onClose={() => setShowEditModal(false)}
          onCategoryUpdated={handleCategoryUpdated}
          category={editCategory}
        />
      )}

      {/* Hộp thoại xác nhận xóa */}
      {showConfirmDialog && (
        <ConfirmDialog
          message="Bạn có chắc chắn muốn xóa danh mục này không?"
          onConfirm={confirmDelete}
          onCancel={() => setShowConfirmDialog(false)}
        />
      )}
    </TitleCard>
  );
}

export default CategoryPage;
