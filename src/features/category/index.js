import { useState, useEffect } from 'react';
import TitleCard from '../../components/Cards/TitleCard';
import InputText from '../../components/Input/InputText';
import { useDispatch } from 'react-redux';
import { showNotification } from '../common/headerSlice';
import SearchBar from '../../components/Input/SearchBar';
import CategoryService from '../../services/CategoryService';
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';

function CategoryPage() {
  const dispatch = useDispatch();
  const [categories, setCategories] = useState([]);
  // const [category, setCategory] = useState({ id: null, name: '' });
  const [category, setCategory] = useState({ id: '', name: '', enName: '' });
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Thay đổi số lượng bản ghi hiển thị


  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await CategoryService.getCategories();
      setCategories(data);
    } catch (err) {
      setError('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategory({ ...category, [name]: value });

  };
  const saveCategory = async () => {
    try {
      if (category.id) {
        await CategoryService.updateCategory(category.id, category); // Cập nhật
        dispatch(
          showNotification({
            message: 'Category Updated Successfully!',
            status: 1, // Status 1 có thể đại diện cho thành công
          })
        );
      } else {
        await CategoryService.createCategory(category); // Thêm mới
        dispatch(
          showNotification({
            message: 'Category Created Successfully!',
            status: 1,
          })
        );
      }
      fetchCategories(); // Cập nhật danh sách
      setCategory({ id: '', name: '', enName: '' }); // Reset form
    } catch (error) {
      console.error('Error saving category:', error);
      dispatch(
        showNotification({
          message: 'Failed to Save Category!',
          status: 0, // Status 0 có thể đại diện cho lỗi
        })
      );
    }
  };

  const editCategory = (cat) => {
    setCategory({ id: cat.categoryID, name: cat.name, enName: cat.enName });
  };

  const deleteCategory = async (id) => {
    console.log("Deleting category with id:", id); // Thêm dòng này để kiểm tra id
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await CategoryService.deleteCategory(id); // Xóa
        fetchCategories(); // Cập nhật danh sách

        dispatch(
          showNotification({
            message: 'Category Deleted Successfully!',
            status: 1, // Status 1 cho thành công
          })
        );
      } catch (error) {
        console.error('Error deleting category:', error);
        dispatch(
          showNotification({
            message: 'Failed to Delete Category!',
            status: 0, // Status 0 cho lỗi
          })
        );
      }
    }
  };


  const applySearch = (value) => setSearchText(value);
  const filteredCategories = categories.filter((cat) => cat.name.toLowerCase().includes(searchText.toLowerCase()));

  const indexOfLastCategory = currentPage * itemsPerPage;
  const indexOfFirstCategory = indexOfLastCategory - itemsPerPage;
  const currentCategories = filteredCategories.slice(indexOfFirstCategory, indexOfLastCategory);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <TitleCard title="Manage Categories" topMargin="mt-6">
      <div className="mb-12 flex items-center">
        <div className=" rounded-lg flex-grow mr-2">
          <div className="relative bg-inherit">
            <input
              type="text"
              value={category.name}
              onChange={handleInputChange}
              id="name"
              placeholder=" "
              name="name"
              className="w-full peer bg-transparent h-10 rounded-lg text-black placeholder-transparent ring-2 px-2 ring-gray-200 focus:ring-sky-600 focus:outline-none focus:border-rose-600"
            />
            <label
              htmlFor="name"
              className="absolute left-0 -top-3 text-sm text-gray-500 bg-white px-1 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:-top-3 peer-focus:text-sky-600"
            >
              Category Name
            </label>
          </div>
        </div>
        <div className="flex-none">
          <button className="btn btn-primary h-10 mt-1" onClick={saveCategory}>
            {category.id ? 'Update Category' : 'Save Category'}
          </button>
        </div>
      </div>

      <SearchBar searchText={searchText} setSearchText={applySearch} styleClass="mb-4" />
      <div className="overflow-x-auto w-full">
        <table className="table w-full">
          <thead>
            <tr>
              <th>No.</th>
              <th className="text-center">Category Name</th>
              <th colSpan={2} className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentCategories.map((cat, index) => (
              <tr key={cat.categoryID}> {/* Đảm bảo rằng cat.id là duy nhất */}
                <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                <td className="text-center">{cat.name}</td>
                <td className="text-center">
                  <button
                    className="btn btn-sm btn-outline btn-info"
                    onClick={() => editCategory(cat)}>
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    className="btn btn-sm btn-outline btn-error"
                    onClick={() => deleteCategory(cat.categoryID)}> {/* Kiểm tra cat.id ở đây */}
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
      <div className="join flex justify-center mt-5">
        <button
          className="join-item btn"
          onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
          disabled={currentPage === 1}
        >
          «
        </button>
        <button className="join-item btn">Page {currentPage}</button>
        <button
          className="join-item btn"
          onClick={() =>
            setCurrentPage(
              currentPage < Math.ceil(filteredCategories.length / itemsPerPage)
                ? currentPage + 1
                : currentPage
            )
          }
          disabled={currentPage >= Math.ceil(filteredCategories.length / itemsPerPage)}
        >
          »
        </button>
      </div>
    </TitleCard>
  );
}

export default CategoryPage;
