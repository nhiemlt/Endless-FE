import { useState, useEffect } from 'react';
import TitleCard from '../../components/Cards/TitleCard';
import InputText from '../../components/Input/InputText';
import { useDispatch } from 'react-redux';
import { showNotification } from '../common/headerSlice';
import SearchBar from '../../components/Input/SearchBar';
import axios from 'axios';

function CategoryPage() {
  const dispatch = useDispatch();

  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState({ name: '' });
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Số mục trên mỗi trang

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/categories');
        setCategories(response.data);
      } catch (err) {
        setError('Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const updateFormValue = (e) => {
    setCategory({ name: e.target.value });
  };

  const saveCategory = async () => {
    try {
      const response = await axios.post('/api/categories', { name: category.name });
      setCategories([...categories, response.data]);
      dispatch(
        showNotification({
          message: 'Category Added Successfully!',
          status: 1,
        })
      );
      setCategory({ name: '' });
    } catch (err) {
      dispatch(
        showNotification({
          message: 'Failed to add category',
          status: 0,
        })
      );
    }
  };

  const applySearch = (value) => {
    setSearchText(value);
  };

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Tính toán số trang
  const indexOfLastCategory = currentPage * itemsPerPage;
  const indexOfFirstCategory = indexOfLastCategory - itemsPerPage;
  const currentCategories = filteredCategories.slice(indexOfFirstCategory, indexOfLastCategory);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <TitleCard title="Manage Categories" topMargin="mt-6">
      <div className="mb-12 flex">
        <div className="flex-grow mr-2">
          <InputText
            labelTitle="Category Name"
            value={category.name}
            updateFormValue={updateFormValue}
          />
        </div>
        <div className="flex-none mt-9">
          <button className="btn btn-primary" onClick={saveCategory}>
            Save Category
          </button>
        </div>
      </div>
      <SearchBar searchText={searchText} setSearchText={applySearch} styleClass="mb-4" />
      <div className="overflow-x-auto w-full">
        <table className="table w-full">
          <thead>
            <tr>
              <th>No.</th> {/* Đổi tên cột thành số thứ tự */}
              <th className='text-center'>Category Name</th>
              <th colSpan={2} className='text-center'>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentCategories.map((cat, index) => (
              <tr key={cat.id}>
                <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td> {/* Tính số thứ tự */}
                <td className='text-center'>{cat.name}</td>
                <td className="text-center">
                  <button className="btn btn-sm btn-outline btn-info">
                    {/* Icon cho sửa danh mục */}
                  </button>
                  <button className="btn btn-sm btn-outline btn-error">
                    {/* Icon cho xóa danh mục */}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Phân trang */}
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
          onClick={() => setCurrentPage(currentPage < Math.ceil(filteredCategories.length / itemsPerPage) ? currentPage + 1 : currentPage)}
          disabled={currentPage >= Math.ceil(filteredCategories.length / itemsPerPage)}
        >
          »
        </button>
      </div>
    </TitleCard>
  );
}

export default CategoryPage;
