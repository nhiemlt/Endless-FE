import { useState, useEffect } from 'react';
import TitleCard from '../../components/Cards/TitleCard';
import { showNotification } from '../common/headerSlice';
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';
import BrandService from '../../services/BrandService';
import { useDispatch } from 'react-redux';
import AddBrandModal from './components/AddBrandModal';
import EditBrandModal from './components/EditBrandModal';

function BrandPage() {
  const [brands, setBrands] = useState([]);
  const [loading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editBrand, setEditBrand] = useState(null);

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

      setBrands(response.content); // Lưu trữ danh sách thương hiệu
      setTotalPages(response.totalPages); // Lưu trữ tổng số trang
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

  const handleDelete = async (id) => {
    try {
      await BrandService.deleteBrand(id);
      setBrands(brands.filter((brand) => brand.brandID !== id));
      dispatch(
        showNotification({
          message: 'Brand Deleted Successfully!',
          status: 1,
        })
      );
    } catch (error) {
      console.error('Error deleting brand:', error);
      dispatch(
        showNotification({
          message: 'Failed to Delete Brand!',
          status: 0,
        })
      );
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
                setSearchKeyword(e.target.value)
                setCurrentPage(0); // Đặt lại currentPage về 0 khi tìm kiếm
              }}  // Cập nhật từ khóa tìm kiếm
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
              {
                loading ? (
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
                          <TrashIcon onClick={() => handleDelete(brand.brandID)} className="w-5 h-5 cursor-pointer text-error" />
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
        </div>

        {/* Điều hướng phân trang */}
        <div className="join mt-4 flex justify-center w-full">
          <button className="join-item btn btn-sm btn-primary" onClick={handlePrevPage} disabled={currentPage === 0}>
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
          <button className="join-item btn btn-sm btn-primary" onClick={handleNextPage} disabled={currentPage >= totalPages - 1}>
            Tiếp
          </button>
        </div>
      </TitleCard>

      {/* Hiển thị modal thêm */}
      {
        isAddModalOpen && <AddBrandModal onClose={() =>
          setIsAddModalOpen(false)} onBrandAdded={handleBrandAdded} />
      }
      {/* Hiển thị modal cập nhật */}
      {
        isEditModalOpen && <EditBrandModal brand={editBrand} onClose={() =>
          setIsEditModalOpen(false)} onBrandUpdated={handleBrandUpdated} />
      }
    </div>
  );
}

export default BrandPage;
