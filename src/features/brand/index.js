import { useState, useEffect } from 'react';
import TitleCard from '../../components/Cards/TitleCard';
import { showNotification } from '../common/headerSlice';
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';
import BrandService from '../../services/BrandService';
import { useDispatch } from 'react-redux';
import AddBrandModal from './components/AddBrandModal';
import EditBrandModal from './components/EditBrandModal';
import ConfirmDialog from './components/ConfirmDialog'; // Import ConfirmDialog

function BrandPage() {
  const [brands, setBrands] = useState([]);
  const [loading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false); // Thêm state cho ConfirmDialog
  const [editBrand, setEditBrand] = useState(null);
  const [brandToDelete, setBrandToDelete] = useState(null); // Lưu thương hiệu cần xóa

  const [currentPage, setCurrentPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState('');

  const dispatch = useDispatch();

  const loadBrands = async () => {
    setIsLoading(true);
    try {
      const response = await BrandService.getBrands({
        page: currentPage,
        size: size,
        keyword: searchKeyword,
      });
      setBrands(response.content);
      setTotalPages(response.totalPages);
    } catch (err) {
      dispatch(showNotification({ message: "Không thể tải thương hiệu", status: 0 }));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBrands();
  }, [currentPage, size, searchKeyword]);

  const handleBrandAdded = (newBrand) => {
    setBrands([...brands, newBrand]);
    loadBrands();
  };

  const handleBrandUpdated = (updatedBrand) => {
    setBrands(brands.map(b => (b.brandID === updatedBrand.brandID ? updatedBrand : b)));
    loadBrands();
  };

  const confirmDelete = (brand) => {
    setBrandToDelete(brand);
    setIsConfirmDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!brandToDelete) return;

    try {
      await BrandService.deleteBrand(brandToDelete.brandID);
      setBrands(brands.filter((brand) => brand.brandID !== brandToDelete.brandID));
      dispatch(showNotification({ message: 'Xóa thương hiệu thành công!', status: 1 }));
    } catch (error) {
      console.error('Error deleting brand:', error);
      dispatch(showNotification({ message: 'Không thể xóa thương hiệu!', status: 0 }));
    } finally {
      setIsConfirmDialogOpen(false); // Đóng ConfirmDialog
      setBrandToDelete(null); // Xóa thương hiệu khỏi state
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

  return (
    <div>
      <TitleCard title="Quản lý thương hiệu">
        <div className="flex flex-col md:flex-row justify-between items-center w-full mb-4">
          <div className="flex justify-start items-center space-x-2 mb-2 mr-2 md:mb-0">
            <input
              type="text"
              placeholder="Tìm kiếm thương hiệu..."
              onChange={(e) => {
                setSearchKeyword(e.target.value);
                setCurrentPage(0);
              }}
              className="input input-bordered w-full md:w-50 h-8"
            />
          </div>
          <button className="btn btn-outline btn-sm btn-primary" onClick={() => setIsAddModalOpen(true)}>Thêm thương hiệu</button>
        </div>

        <div className="overflow-x-auto">
          <table className="table table-xs w-full">
            <thead>
              <tr>
                <th>STT</th>
                <th className="text-center">Tên thương hiệu</th>
                <th>Logo</th>
                <th className="text-center" colSpan={2}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={10} className="text-center">Đang tải...</td>
                </tr>
              ) : brands.length > 0 ? (
                brands.map((brand, index) => (
                  <tr key={brand.brandID}>
                    <td>{currentPage * size + index + 1}</td>
                    <td className="text-center">{brand.brandName}</td>
                    <td className="text-center">
                      <img src={brand.logo} alt={brand.brandName} className="w-10 h-10" />
                    </td>
                    <td className="text-center">
                      <div className="flex justify-center space-x-2">
                        <PencilIcon onClick={() => { setEditBrand(brand); setIsEditModalOpen(true); }} className="w-5 h-5 cursor-pointer text-info" />
                        <TrashIcon onClick={() => confirmDelete(brand)} className="w-5 h-5 cursor-pointer text-error" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="text-center">Không có dữ liệu.</td>
                </tr>
              )}
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
      </TitleCard>

      {isAddModalOpen && <AddBrandModal onClose={() => setIsAddModalOpen(false)} onBrandAdded={handleBrandAdded} />}
      {isEditModalOpen && <EditBrandModal brand={editBrand} onClose={() => setIsEditModalOpen(false)} onBrandUpdated={handleBrandUpdated} />}

      {isConfirmDialogOpen && (
        <ConfirmDialog
          message="Bạn có chắc chắn muốn xóa thương hiệu này không?"
          onConfirm={handleDelete}
          onCancel={() => setIsConfirmDialogOpen(false)}
        />
      )}
    </div>
  );
}

export default BrandPage;
